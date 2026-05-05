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
    // obj = {model: "hola"}
    // _openModal(edit,obj}) {}
    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText('modalMarcaTitle', isEdit ? 'Editar Marca' : 'Nueva Marca');
        document.getElementById('modelId').value = isEdit ? entidad.id_model : '';
        document.getElementById('modelname').value = isEdit ? entidad.model : '';
        document.getElementById('modelkind').value = isEdit ? entidad.kind_of_tool : '';
        document.getElementById('modelbrandnid').value = isEdit ? entidad.id_brand : '';
        clearErrors(['modelname']);
        clearErrors(['modelkind']);
        clearErrors(['modelbrandnid']);
        openOverlay('modalModelsOverlay');
    },

    openEdit(id) {
    },

    confirmDel(id, name) {
    },

    async _save() {
        const id     = document.getElementById('modelId').value;
        const nombre = document.getElementById('modelname').value.trim();
        const marca  = document.getElementById('modelbrandnid').value.trim();
        const tipo   = document.getElementById('modelkind').value.trim();

        try {
            const  isEdit = !!id
            const  data   = { model: nombre, kind_of_tool: tipo, id_brand: marca }
            const  url    = isEdit ? `/api/model/${id}` : '/api/model'
            const  method = isEdit ? 'PUT' : 'POST'
            const  resp   = await http(url, method, data)
            showToast(`Modelo ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeOverlay('modalModelsOverlay');
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    _bindEvents() {
        document.getElementById('btnNuevoModelo')?.addEventListener('click',    () => this._openModal('new'));
        document.getElementById('btnmodel_save')?.addEventListener('click',    () => this._save());
        document.getElementById('btnmodel_close')?.addEventListener('click',    () => closeOverlay('modalModelsOverlay'));
    },
};