'use strict';

const StoragesModule = {
    async init() {
        this._bindEvents();
        await this.load();
    },

    async load() {
        const tbody = document.getElementById('bodyStorage');

        tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center py-5">
          <div class="spinner-custom"></div>
        </td>
      </tr>`;

        try {
            const { data } = await http('/api/storages');

            AppState.storages = data;
            this._render(data);
            updateBadges();
        } catch (e) {
            showToast('Error al cargar almacenes: ' + e.message, 'error');
        }
    },

    _render(lista) {
        setText('totalStorageLabel', `${lista.length} almacén(es) registrado(s)`);

        const tbody = document.getElementById('bodyStorage');

        if (!lista.length) {
            tbody.innerHTML = `
        <tr>
          <td colspan="3">
            <div class="empty-state">
              <i class="bi bi-building-x"></i>
              <p>No hay almacenes registrados</p>
            </div>
          </td>
        </tr>`;
            return;
        }

        tbody.innerHTML = lista.map((s, i) => `
      <tr>
        <td>
          <span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">
            ${String(i + 1).padStart(2, '0')}
          </span>
        </td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div style="width:32px;height:32px;background:var(--primary-light);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--primary)">
              <i class="bi bi-building-fill"></i>
            </div>
            <span class="fw-600">${escapeHtml(s.addres)}</span>
          </div>
        </td>
        <td>
          <button class="btn-action btn-action-edit" onclick="StoragesModule.openEdit(${s.id_storage})" title="Editar">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn-action btn-action-delete" onclick="StoragesModule.confirmDel(${s.id_storage}, '${escapeHtml(s.addres)}')" title="Eliminar">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </td>
      </tr>
    `).join('');
    },

    _filter() {
        const search = document.getElementById('searchStorage')?.value.toLowerCase() || '';

        const filtrados = AppState.storages.filter(s =>
            s.addres.toLowerCase().includes(search)
        );

        this._render(filtrados);
    },

    _openModal(mode, storage = null) {
        const isEdit = mode === 'edit';

        setText('modalStorageTitle', isEdit ? 'Editar Storage' : 'Nuevo Storage');

        document.getElementById('storageId').value = isEdit ? storage.id_storage : '';
        document.getElementById('sAddress').value = isEdit ? storage.addres : '';

        clearErrors(['sAddress']);

        openOverlay('modalStorageOverlay');
    },

    openEdit(id) {
        const storage = AppState.storages.find(s => s.id_storage === id);

        if (!storage) {
            return showToast('Storage no encontrado', 'error');
        }

        this._openModal('edit', storage);
    },

    confirmDel(id, name) {
        DeleteModal.open('storage', id, name, async () => {
            try {
                await http(`/api/storages/${id}`, 'DELETE');

                showToast(`"${name}" eliminado correctamente`, 'success');

                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });
    },

    async _save() {
        const id = document.getElementById('storageId').value;
        const addres = document.getElementById('sAddress').value.trim();

        clearErrors(['sAddress']);

        if (!addres) {
            setError('sAddress', 'err-sAddress', 'La dirección es requerida');
            return;
        }

        const isEdit = Boolean(id);

        setLoading('btnSaveStorage', 'btnSaveStorageText', 'btnSaveStorageSpinner', true);

        try {
            await http(
                isEdit ? `/api/storages/${id}` : '/api/storages',
                isEdit ? 'PUT' : 'POST',
                { addres }
            );

            showToast(`Storage ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');

            closeOverlay('modalStorageOverlay');

            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setLoading('btnSaveStorage', 'btnSaveStorageText', 'btnSaveStorageSpinner', false);
        }
    },

    _bindEvents() {
        document.getElementById('btnNuevoStorage')?.addEventListener('click', () => this._openModal('new'));
        document.getElementById('btnSaveStorage')?.addEventListener('click', () => this._save());
        document.getElementById('btnCancelStorage')?.addEventListener('click', () => closeOverlay('modalStorageOverlay'));
        document.getElementById('btnCloseModalStorage')?.addEventListener('click', () => closeOverlay('modalStorageOverlay'));
        document.getElementById('btnRefreshStorage')?.addEventListener('click', () => this.load());
        document.getElementById('searchStorage')?.addEventListener('input', () => this._filter());

        document.getElementById('modalStorageOverlay')?.addEventListener('click', e => {
            if (e.target.id === 'modalStorageOverlay') {
                closeOverlay('modalStorageOverlay');
            }
        });
    },
};