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

const moduleLocker = 'locker';

const ModuleLocker = {

    async init() {
        await this._generarPlantilla();
        //domir un rato
        this._bindEvents();
        await this.load();
    },
    async _generarPlantilla() {
        const reemplazos = {
            name: moduleLocker,
            capName: capitalizar(moduleLocker),
        };
        document.getElementById('pageContainer').innerHTML = document.getElementById('pageContainer').innerHTML.replace(
            /@@-(.*?)-@@/g,
            (match, clave) => reemplazos[clave] || match
        );
    },

    async load() {
        const {data} = await http(`/api/${moduleLocker}`);
        //TODO el caché
        AppState.locker = data;
        this._render(data);
        updateBadges();
    },
    //model
    _render(lista) {
        setText(`total${capitalizar(moduleLocker)}Label`, `${lista.length} ${moduleLocker}(s) registrado(s)`);
        const tbody = document.getElementById(`body${capitalizar(moduleLocker)}`);
        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
                <i class="bi bi-bookmark-x"></i><p>No hay datos de ${moduleLocker} registrados/as</p>
            </div></td></tr>`;
            return;
        }
        tbody.innerHTML = lista.map((m, i) => {
            //TODO rows de la tabla
            return `    
                <tr>
                    <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i + 1).padStart(2, '0')}</span></td>
                    
                    <!-- TODO data rows -->
                    <td><span>${escapeHtml(m.locker)}</span></td>
                    <td><span>${escapeHtml(m.storage_address)}</span></td>
                    <!-- TODO data rows -->

                    <td>
                    <!-- TODO colocar el ID de la entidad -->
                    <button class="btn-action btn-action-edit"   
                        onclick="ModuleLocker.openEdit(${m.id_locker})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn-action btn-action-delete" 
                        onclick="ModuleLocker.confirmDel(${m.id_locker},'${escapeHtml(m.locker)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
                    </td>                    
                </tr>
            `
        }).join('')
    },

    _filter() {
        const search = document.getElementById(`search${capitalizar(moduleLocker)}`)?.value.toLowerCase() || '';
        console.log(search)
        //TODO filtro, CAMBIAR EL CACHE
        this._render(AppState.locker.filter(m =>
            // m -> valor que nos dan
            // search -> valor que buscamos
            m.locker.toLowerCase().includes(search)
        ));
    },
    // obj = {model: "hola"}
    // _openModal(edit,obj}) {}
    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText(`modal${capitalizar(moduleLocker)}Title`, isEdit ? `Editar ${moduleLocker}` : `Nueva ${moduleLocker}`);
        // TODO obtener los datos por el ID del MODAL (HTML)
        document.getElementById('lockerId').value = isEdit ? entidad.id_model : '';
        document.getElementById('lockername').value = isEdit ? entidad.model : '';
        document.getElementById('lockerstorageid').value = isEdit ? entidad.model : '';
        clearErrors(['lockerId']);
        clearErrors(['lockername']);
        clearErrors(['lockerstorageid']);

        openOverlay(`modal${capitalizar(moduleLocker)}Overlay`);
    },

    openEdit(id) {
        const value = AppState.locker.find(m => m.id_storage === id);
        if (!value) return showToast(`${capitalizar(moduleLocker)} no encontrada`, 'error');
        this._openModal('edit', value);
    },

    confirmDel(id, name) {
        DeleteModal.open(`${moduleLocker}`, id, name, async () => {
            try {
                await http(`/api/${moduleLocker}/${id}`, 'DELETE');
                showToast(`"${name}" eliminada correctamente`, 'success');
                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });
    },

    async _save() {
        //TODO recuperar los datos del MODAL (HTML)
        const id = document.getElementById('lockerId').value;
        const nombre = document.getElementById('lockername').value.trim();
        const id_storage = document.getElementById('lockerstorageid').value.trim();
        //TODO recuperar los datos del MODAL (HTML)

        const isEdit = !!id
        try {
            //TODO enviar los datos al servidor
            const data = {locker:nombre, id_storage:id_storage}
            //TODO enviar los datos al servidor

            const url = isEdit ? `/api/${moduleLocker}/${id}` : `/api/${moduleLocker}`
            const method = isEdit ? 'PUT' : 'POST'
            const resp = await http(url, method, data)
            showToast(`${capitalizar(moduleLocker)} ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeOverlay(`modal${capitalizar(moduleLocker)}Overlay`);
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    _bindEvents() {
        document.getElementById(`btnNew${capitalizar(moduleLocker)}`)?.addEventListener('click', () => this._openModal('new'));
        document.getElementById(`btnSave${capitalizar(moduleLocker)}`)?.addEventListener('click', () => this._save());
        document.getElementById(`btnClose${capitalizar(moduleLocker)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleLocker)}Overlay`));
        document.getElementById(`btnCloseModal${capitalizar(moduleLocker)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleLocker)}Overlay`));

        document.getElementById(`btnRefresh${capitalizar(moduleLocker)}`)?.addEventListener('click', () => this.load());
        document.getElementById(`search${capitalizar(moduleLocker)}`)?.addEventListener('input',      () => this._filter());

    },
}