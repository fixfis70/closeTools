'use strict';

const ModelModule = {

    async init() {
        this._bindEvents();
        await this.load();
    },

    async load() {

    },

    _render(lista) {
    },

    _filter() {
    },

    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText('modalMarcaTitle', isEdit ? 'Editar Marca' : 'Nueva Marca');
        document.getElementById('modelId').value = isEdit ? entidad.id_brand : '';
        document.getElementById('mNombre').value = isEdit ? entidad.brand : '';
        clearErrors(['mNombre']);
        openOverlay('modalModelsOverlay');
    },

    openEdit(id) {
    },

    confirmDel(id, name) {
    },

    async _save() {
    },

    _bindEvents() {
        document.getElementById('btnNuevoModelo')?.addEventListener('click',    () => this._openModal('new'));
    },
};