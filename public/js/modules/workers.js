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

const moduleWorker = 'worker';

const WorkerModule = {

    async init() {
        await this._generarPlantilla();
        //domir un rato
        DeleteModal.render()
        this._bindEvents();
        await this.load();
    },
    async _generarPlantilla() {
        const reemplazos = {
            name: moduleWorker,
            capName: capitalizar(moduleWorker),
        };
        document.getElementById('pageContainer').innerHTML = document.getElementById('pageContainer').innerHTML.replace(
            /@@-(.*?)-@@/g,
            (match, clave) => reemplazos[clave] || match
        );
    },

    async load() {
        const {data} = await http(`/api/${moduleWorker}`);
        //TODO el caché
        AppState.worker = data;
        this._render(data);
        updateBadges();
    },
    //model
    _render(lista) {
        setText(`total${capitalizar(moduleWorker)}Label`, `${lista.length} ${moduleWorker}(s) registrado(s)`);
        const tbody = document.getElementById(`body${capitalizar(moduleWorker)}`);
        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
                <i class="bi bi-bookmark-x"></i><p>No hay datos de ${moduleWorker} registrados/as</p>
            </div></td></tr>`;
            return;
        }
        tbody.innerHTML = lista.map((m, i) => {
            //TODO rows de la tabla
            return `
                <tr>
                    <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i + 1).padStart(2, '0')}</span></td>
                    
                    <!-- TODO data rows -->
                    <td><span>${escapeHtml(m.dni)}</span></td>
                    <td><span>${escapeHtml(m.names)}</span></td>
                    <td><span>${escapeHtml(m.role)}</span></td>
                    <td><span>${escapeHtml(m.work_area)}</span></td>
                    <td><span>${escapeHtml(m.shift)}</span></td>
                    <!-- TODO data rows -->

                    <td>
                    <!-- TODO colocar el ID de la entidad -->
                    <button class="btn-action btn-action-edit"   
                        onclick="WorkerModule.openEdit(${m.dni})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn-action btn-action-delete" 
                        onclick="WorkerModule.confirmDel(${m.dni},'${escapeHtml(m.names)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
                    </td>                    
                </tr>
            `
        }).join('')
    },

    _filter() {
        const search = document.getElementById(`search${capitalizar(moduleWorker)}`)?.value.toLowerCase() || '';
        console.log(search)
        //TODO filtro, CAMBIAR EL CACHE
        this._render(AppState.worker.filter(m =>
            // m -> valor que nos dan
            // search -> valor que buscamos
            m.names.toLowerCase().includes(search)
        ));
    },
    // obj = {model: "hola"}
    // _openModal(edit,obj}) {}
    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText(`modal${capitalizar(moduleWorker)}Title`, isEdit ? `Editar ${moduleWorker}` : `Nueva ${moduleWorker}`);
        // TODO obtener los datos por el ID del MODAL (HTML)
        document.getElementById('workerId').value = isEdit ? entidad.dni : '';
        document.getElementById('workerdni').value = isEdit ? entidad.dni : '';
        document.getElementById('workername').value = isEdit ? entidad.names : '';
        document.getElementById('workerrol').value = isEdit ? entidad.role : '';
        document.getElementById('workerarea').value = isEdit ? entidad.work_area : '';
        document.getElementById('workershift').value = isEdit ? entidad.shift : '';
        clearErrors(['workername']);
        clearErrors(['workerrol']);
        clearErrors(['workerarea']);
        clearErrors(['workerdni']);
        clearErrors(['workershift']);

        openOverlay(`modal${capitalizar(moduleWorker)}Overlay`);
    },

    openEdit(id) {
        const value = AppState.worker.find(m => m.dni === id);
        if (!value) return showToast(`${capitalizar(moduleWorker)} no encontrada`, 'error');
        this._openModal('edit', value);
    },

    confirmDel(id, name) {
        DeleteModal.open(`${moduleWorker}`, id, name, async () => {
            try {
                await http(`/api/${moduleWorker}/${id}`, 'DELETE');
                showToast(`"${name}" eliminada correctamente`, 'success');
                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });

    },

    async _save() {
        //TODO recuperar los datos del MODAL (HTML)
        const id = document.getElementById('workerId').value;
        const dni = document.getElementById('workerdni').value;
        const nombre = document.getElementById('workername').value.trim();
        const rol = document.getElementById('workerrol').value.trim();
        const area = document.getElementById('workerarea').value.trim();
        const shift = document.getElementById('workershift').value.trim();
        //TODO recuperar los datos del MODAL (HTML)

        const isEdit = !!id
        try {
            //TODO enviar los datos al servidor
            const data = {dni: dni, names: nombre, role: rol, work_area: area ,shift: shift}
            //TODO enviar los datos al servidor

            const url = isEdit ? `/api/${moduleWorker}/${id}` : `/api/${moduleWorker}`
            const method = isEdit ? 'PUT' : 'POST'
            const resp = await http(url, method, data)
            showToast(`${capitalizar(moduleWorker)} ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeOverlay(`modal${capitalizar(moduleWorker)}Overlay`);
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    _bindEvents() {
        document.getElementById(`btnNew${capitalizar(moduleWorker)}`)?.addEventListener('click', () => this._openModal('new'));
        document.getElementById(`btnSave${capitalizar(moduleWorker)}`)?.addEventListener('click', () => this._save());
        document.getElementById(`btnClose${capitalizar(moduleWorker)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleWorker)}Overlay`));
        document.getElementById(`btnCloseModal${capitalizar(moduleWorker)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleWorker)}Overlay`));

        document.getElementById(`btnRefresh${capitalizar(moduleWorker)}`)?.addEventListener('click', () => this.load());
        document.getElementById(`search${capitalizar(moduleWorker)}`)?.addEventListener('input',      () => this._filter());

    },
}