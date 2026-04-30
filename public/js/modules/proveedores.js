'use strict';

const ProveedoresModule = {
    async init() {
        this._bindEvents();
        await this.load();
    },

    async load() {
        const tbody = document.getElementById('bodyProvider');

        tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-5">
          <div class="spinner-custom"></div>
        </td>
      </tr>`;

        try {
            const { data } = await http('/api/provieder');

            AppState.proveedors = data;
            this._render(data);
            updateBadges();
        } catch (e) {
            showToast('Error al cargar proveedores: ' + e.message, 'error');
        }
    },

    _render(lista) {
        setText('totalProviderLabel', `${lista.length} proveedor(es) registrado(s)`);

        const tbody = document.getElementById('bodyProvider');

        if (!lista.length) {
            tbody.innerHTML = `
        <tr>
          <td colspan="4">
            <div class="empty-state">
              <i class="bi bi-person-x"></i>
              <p>No hay proveedores registrados</p>
            </div>
          </td>
        </tr>`;
            return;
        }

        tbody.innerHTML = lista.map((p, i) => `
      <tr>
        <td>
          <span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">
            ${String(i + 1).padStart(2, '0')}
          </span>
        </td>
        <td>${escapeHtml(p.provaider)}</td>
        <td>${escapeHtml(p.addres)}</td>
        <td>
          <button class="btn-action btn-action-edit" onclick="ProveedoresModule.openEdit(${p.id_provider})" title="Editar">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn-action btn-action-delete" onclick="ProveedoresModule.confirmDel(${p.id_provider}, '${escapeHtml(p.provaider)}')" title="Eliminar">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </td>
      </tr>
    `).join('');
    },

    _filter() {
        const search = document.getElementById('searchProvider')?.value.toLowerCase() || '';

        const filtrados = AppState.proveedors.filter(p =>
            p.provaider.toLowerCase().includes(search) ||
            p.addres.toLowerCase().includes(search)
        );

        this._render(filtrados);
    },

    _openModal(mode, proveedor = null) {
        const isEdit = mode === 'edit';

        setText('modalProviderTitle', isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor');

        document.getElementById('providerId').value = isEdit ? proveedor.id_provider : '';
        document.getElementById('pNombre').value = isEdit ? proveedor.provaider : '';
        document.getElementById('pAddress').value = isEdit ? proveedor.addres : '';

        clearErrors(['pNombre', 'pAddress']);

        openOverlay('modalProviderOverlay');
    },

    openEdit(id) {
        const proveedor = AppState.proveedors.find(p => p.id_provider === id);

        if (!proveedor) {
            return showToast('Proveedor no encontrado', 'error');
        }

        this._openModal('edit', proveedor);
    },

    confirmDel(id, name) {
        DeleteModal.open('proveedor', id, name, async () => {
            try {
                await http(`/api/provieder/${id}`, 'DELETE');

                showToast(`"${name}" eliminado correctamente`, 'success');

                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });
    },

    async _save() {
        const id = document.getElementById('providerId').value;
        const provaider = document.getElementById('pNombre').value.trim();
        const addres = document.getElementById('pAddress').value.trim();

        clearErrors(['pNombre', 'pAddress']);

        let hasError = false;

        if (!provaider) {
            setError('pNombre', 'err-pNombre', 'El proveedor es requerido');
            hasError = true;
        }

        if (!addres) {
            setError('pAddress', 'err-pAddress', 'La dirección es requerida');
            hasError = true;
        }

        if (hasError) return;

        const isEdit = Boolean(id);

        setLoading('btnSaveProvider', 'btnSaveProviderText', 'btnSaveProviderSpinner', true);

        try {
            await http(
                isEdit ? `/api/provieder/${id}` : '/api/provieder',
                isEdit ? 'PUT' : 'POST',
                { provaider, addres }
            );

            showToast(`Proveedor ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');

            closeOverlay('modalProviderOverlay');

            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setLoading('btnSaveProvider', 'btnSaveProviderText', 'btnSaveProviderSpinner', false);
        }
    },

    _bindEvents() {
        document.getElementById('btnNuevoProvider')?.addEventListener('click', () => this._openModal('new'));
        document.getElementById('btnSaveProvider')?.addEventListener('click', () => this._save());
        document.getElementById('btnCancelProvider')?.addEventListener('click', () => closeOverlay('modalProviderOverlay'));
        document.getElementById('btnCloseModalProvider')?.addEventListener('click', () => closeOverlay('modalProviderOverlay'));
        document.getElementById('btnRefreshProvider')?.addEventListener('click', () => this.load());
        document.getElementById('searchProvider')?.addEventListener('input', () => this._filter());

        document.getElementById('modalProviderOverlay')?.addEventListener('click', e => {
            if (e.target.id === 'modalProviderOverlay') {
                closeOverlay('modalProviderOverlay');
            }
        });
    },
};