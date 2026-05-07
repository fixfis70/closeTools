/**
 * TODO ver todos los TODO
 * TODO cambiar los AppState
 * Se tiene que hacer cambios en el:
 *
 * el moduleName debe coincidir a la perfeccion, no se tolera algun cambio
 *
 * como implementarlo:
 * 1ero verificar el hmtl y el modulo
 * 2do  ir a App y registar el caché
 * 4to en App buscar el delmodal y agregar este
 * 5to ir a route y registrar la ruta
 * 6to ir a  el index.html y agrregar el navBarItem y dependencias JS
 * 4to en App buscar updateBadges y agregar esto
 */

const moduleTool = 'tool';

const ModuleTool = {

    async init() {
        await this._generarPlantilla();
        //domir un rato
        this._bindEvents();
        await this.load();
    },
    async _generarPlantilla() {
        const reemplazos = {
            name: moduleTool,
            capName: capitalizar(moduleTool),
        };
        document.getElementById('pageContainer').innerHTML = document.getElementById('pageContainer').innerHTML.replace(
            /@@-(.*?)-@@/g,
            (match, clave) => reemplazos[clave] || match
        );
    },

    async load() {
        const {data} = await http(`/api/${moduleTool}`);
        //TODO el caché
        AppState.tool = data;
        this._render(data);
        updateBadges();
    },
    //model
    _render(lista) {
        setText(`total${capitalizar(moduleTool)}Label`, `${lista.length} ${moduleTool}(s) registrado(s)`);
        const tbody = document.getElementById(`body${capitalizar(moduleTool)}`);
        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
                <i class="bi bi-bookmark-x"></i><p>No hay datos de ${moduleTool} registrados/as</p>
            </div></td></tr>`;
            return;
        }
        tbody.innerHTML = lista.map((m, i) => {
            //TODO rows de la tabla
            return `
                <tr>
                    <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i + 1).padStart(2, '0')}</span></td>
                    
                    <!-- TODO data rows -->
                    <td><span>${escapeHtml(m.model)}</span></td>
                    <td><span>${escapeHtml(m.kind_of_tool)}</span></td>
                    <td><span>${escapeHtml(m.brand)}</span></td>
                    <!-- TODO data rows -->

                    <td>
                    <!-- TODO colocar el ID de la entidad -->
                    <button class="btn-action btn-action-edit"   
                        onclick="q@ModelModule.openEdit(${m.id_model})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn-action btn-action-delete" 
                        onclick="q@ModelModule.confirmDel(${m.id_model},'${escapeHtml(m.q@name)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
                    </td>                    
                </tr>
            `
        }).join('')
    },

    _filter() {
        const search = document.getElementById(`search${capitalizar(moduleTool)}`)?.value.toLowerCase() || '';
        console.log(search)
        //TODO filtro, CAMBIAR EL CACHE
        this._render(AppState.q@models.filter(m =>
            // m -> valor que nos dan
            // search -> valor que buscamos
            m.q@model.toLowerCase().includes(search)
        ));
    },
    // obj = {model: "hola"}
    // _openModal(edit,obj}) {}
    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText(`modal${capitalizar(moduleTool)}Title`, isEdit ? `Editar ${moduleTool}` : `Nueva ${moduleTool}`);
        // TODO obtener los datos por el ID del MODAL (HTML)
        document.getElementById('modelId').value = isEdit ? entidad.id_model : '';
        document.getElementById('modelname').value = isEdit ? entidad.model : '';
        document.getElementById('modelkind').value = isEdit ? entidad.kind_of_tool : '';
        document.getElementById('modelbrandnid').value = isEdit ? entidad.id_brand : '';
        clearErrors(['modelname']);
        clearErrors(['modelkind']);
        clearErrors(['modelbrandnid']);

        openOverlay(`modal${capitalizar(moduleTool)}Overlay`);
    },

    openEdit(id) {
        const value = AppState.q@models.find(m => m.q@id_model === id);
        if (!value) return showToast(`${capitalizar(moduleTool)} no encontrada`, 'error');
        this._openModal('edit', value);
    },

    confirmDel(id, name) {
        DeleteModal.open(`${moduleTool}`, id, name, async () => {
            try {
                await http(`/api/${moduleTool}/${id}`, 'DELETE');
                showToast(`"${name}" eliminada correctamente`, 'success');
                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });

    },

    async _save() {
        //TODO recuperar los datos del MODAL (HTML)
        const id = document.getElementById('modelId').value;
        const nombre = document.getElementById('modelname').value.trim();
        const marca = document.getElementById('modelbrandnid').value.trim();
        const tipo = document.getElementById('modelkind').value.trim();
        //TODO recuperar los datos del MODAL (HTML)

        const isEdit = !!id
        try {
            //TODO enviar los datos al servidor
            const data = {model: nombre, kind_of_tool: tipo, id_brand: marca}
            //TODO enviar los datos al servidor

            const url = isEdit ? `/api/${moduleTool}/${id}` : `/api/${moduleTool}`
            const method = isEdit ? 'PUT' : 'POST'
            const resp = await http(url, method, data)
            showToast(`${capitalizar(moduleTool)} ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeOverlay(`modal${capitalizar(moduleTool)}Overlay`);
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    _bindEvents() {
        document.getElementById(`btnNew${capitalizar(moduleTool)}`)?.addEventListener('click', () => this._openModal('new'));
        document.getElementById(`btnSave${capitalizar(moduleTool)}`)?.addEventListener('click', () => this._save());
        document.getElementById(`btnClose${capitalizar(moduleTool)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleTool)}Overlay`));
        document.getElementById(`btnCloseModal${capitalizar(moduleTool)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleTool)}Overlay`));

        document.getElementById(`btnRefresh${capitalizar(moduleTool)}`)?.addEventListener('click', () => this.load());
        document.getElementById(`search${capitalizar(moduleTool)}`)?.addEventListener('input',      () => this._filter());

    },
}