/**
 * modules/marcas.js
 * Solo conoce el DOM de views/marcas.html
 */

'use strict';

const BrandModule = {

  async init() {
    this._bindEvents();
    await this.load();
  },

  async load() {
    document.getElementById('bodyMarcas').innerHTML =
      `<tr><td colspan="4" class="text-center py-5"><div class="spinner-custom"></div></td></tr>`;

    try {
      const { data } = await http('/api/brand');
      AppState.marcas = data;
      this._render(data);
      updateBadges();
    } catch (e) {
      showToast('Error al cargar marcas: ' + e.message, 'error');
    }
  },

  _render(lista) {
    setText('totalMarcasLabel', `${lista.length} marca(s) registrada(s)`);
    const tbody = document.getElementById('bodyMarcas');

    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
        <i class="bi bi-bookmark-x"></i><p>No hay marcas registradas</p>
      </div></td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((m, i) => {
      
      const total = AppState.productos.filter(p => p.id_brand == m.id_brand).length;
      return `
        <tr>
          <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i+1).padStart(2,'0')}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div style="width:32px;height:32px;background:var(--primary-light);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--primary)">
                <i class="bi bi-bookmark-star-fill"></i>
              </div>
              <span class="fw-600">${escapeHtml(m.brand)}</span>
            </div>
          </td>
          <td><span class="badge-garantia">${total} producto${total !== 1 ? 's' : ''}</span></td>
          <td>
            <button class="btn-action btn-action-edit"   onclick="BrandModule.openEdit(${m.id_brand})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn-action btn-action-delete" onclick="BrandModule.confirmDel(${m.id_brand},'${escapeHtml(m.brand)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
          </td>
        </tr>`;
    }).join('');
  },

  _filter() {
    const search = document.getElementById('searchMarca')?.value.toLowerCase() || '';
    this._render(AppState.marcas.filter(m =>
      m.brand.toLowerCase().includes(search)
    ));
  },

  /* ── Modal ───────────────────────────── */
  _openModal(mode, marca = null) {
    const isEdit = mode === 'edit';
    setText('modalMarcaTitle', isEdit ? 'Editar Marca' : 'Nueva Marca');
    document.getElementById('marcaId').value = isEdit ? marca.id_brand : '';
    document.getElementById('mNombre').value = isEdit ? marca.brand : '';
    clearErrors(['mNombre']);
    openOverlay('modalMarcaOverlay');
  },

  openEdit(id) {
    const marca = AppState.marcas.find(m => m.id_brand === id);
    if (!marca) return showToast('Marca no encontrada', 'error');
    this._openModal('edit', marca);
  },

  confirmDel(id, name) {
    DeleteModal.open('marca', id, name, async () => {
      try {
        await http(`/api/brand/${id}`, 'DELETE');
        showToast(`"${name}" eliminada correctamente`, 'success');
        await this.load();
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
  },

  async _save() {
    const id     = document.getElementById('marcaId').value;
    const nombre = document.getElementById('mNombre').value.trim();
    clearErrors(['mNombre']);

    if (!nombre) {
      setError('mNombre','err-mNombre','El nombre de la marca es requerido');
      return;
    }

    const isEdit = !!id;
    setLoading('btnSaveMarca','btnSaveMarcaText','btnSaveMarcaSpinner', true);
    try {
      await http(isEdit ? `/api/brand/${id}` : '/api/brand', isEdit ? 'PUT' : 'POST', { brand: nombre });
      showToast(`Marca ${isEdit ? 'actualizada' : 'creada'} correctamente`, 'success');
      closeOverlay('modalMarcaOverlay');
      await this.load();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading('btnSaveMarca','btnSaveMarcaText','btnSaveMarcaSpinner', false);
    }
  },

  _bindEvents() {
    document.getElementById('btnNuevaMarca')?.addEventListener('click',    () => this._openModal('new'));
    document.getElementById('btnSaveMarca')?.addEventListener('click',     () => this._save());
    document.getElementById('btnCancelMarca')?.addEventListener('click',   () => closeOverlay('modalMarcaOverlay'));
    document.getElementById('btnCloseModalMarca')?.addEventListener('click', () => closeOverlay('modalMarcaOverlay'));
    document.getElementById('btnRefreshMarcas')?.addEventListener('click', () => this.load());
    document.getElementById('searchMarca')?.addEventListener('input',      () => this._filter());
    document.getElementById('modalMarcaOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'modalMarcaOverlay') closeOverlay('modalMarcaOverlay');
    });
  },
};