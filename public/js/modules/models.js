'use strict';

const ModelModule = {

    async init() {
        this._bindEvents();
        await this.load();
    },

    async load() {
        const {data} = await http('/api/model');
        AppState.models = data;
        this._render(data);
        updateBadges();
    },

    _render(lista) {
        setText('totalModelLabel', `${lista.length} modelo(s) registrado(s)`);
        const tbody = document.getElementById('bodyModels');
        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
                <i class="bi bi-bookmark-x"></i><p>No hay modelos registradas</p>
            </div></td></tr>`;
            return;
        }
        tbody.innerHTML = lista.map((m, i) => {
            return `
                <tr>
                    <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i + 1).padStart(2, '0')}</span></td>
                    <td><span>${escapeHtml(m.model)}</span></td>
                    <td><span>${escapeHtml(m.kind_of_tool)}</span></td>
                    <td><span>${escapeHtml(m.brand)}</span></td>
                    <td>
                    <button class="btn-action btn-action-edit"   onclick="ModelModule.openEdit(${m.id_model})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn-action btn-action-delete" onclick="ModelModule.confirmDel(${m.id_model},'${escapeHtml(m.model)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
                    </td>                    
                </tr>
            `
        }).join('')
    },

    _filter() {
        const search = document.getElementById('searchModel')?.value.toLowerCase() || '';
        console.log(search)
        //TODO filtro
        this._render(AppState.models.filter(m =>
            // m -> valor que nos dan
            // search -> valor que buscamos
            m.model.toLowerCase().includes(search)
        ));
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
        const model = AppState.models.find(m => m.id_model === id);
        if (!model) return showToast('Modelo no encontrada', 'error');
        this._openModal('edit', model);
    },

    confirmDel(id, name) {
        DeleteModal.open('modelo', id, name, async () => {
            try {
                await http(`/api/model/${id}`, 'DELETE');
                showToast(`"${name}" eliminada correctamente`, 'success');
                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });

    },

    async _save() {
        const id     = document.getElementById('modelId').value;
        const nombre = document.getElementById('modelname').value.trim();
        const marca  = document.getElementById('modelbrandnid').value.trim();
        const tipo   = document.getElementById('modelkind').value.trim();

        const  isEdit = !!id
        try {
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

        document.getElementById('btnRefreshModel')?.addEventListener('click', () => this.load());
        document.getElementById('searchModel')?.addEventListener('input',      () => this._filter());

    },
};