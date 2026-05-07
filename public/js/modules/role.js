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
 * 3rp en App buscar updateBadges y agregar esto
 * 4to en App buscar el delmodal y agregar este
 * 5to ir a route y registrar la ruta
 * 6to ir a  el index.html y agrregar el navBarItem y dependencias JS
 */

const moduleName = 'role';

const RoleModule = {

    async init() {
        await this._generarPlantilla();
        //domir un rato
        DeleteModal.render()
        this._bindEvents();
        await this.load();
    },
    async _generarPlantilla() {
        const reemplazos = {
            name: moduleName,
            capName: capitalizar(moduleName),
        };
        document.getElementById('pageContainer').innerHTML = document.getElementById('pageContainer').innerHTML.replace(
            /@@-(.*?)-@@/g,
            (match, clave) => reemplazos[clave] || match
        );
    },

    async load() {
        const {data} = await http(`/api/${moduleName}`);
        //TODO el caché
        AppState.role = data;
        this._render(data);
        updateBadges();
    },

    _render(lista) {
        setText(`total${capitalizar(moduleName)}Label`, `${lista.length} ${moduleName}(s) registrado(s)`);
        const tbody = document.getElementById(`body${capitalizar(moduleName)}`);
        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
                <i class="bi bi-bookmark-x"></i><p>No hay datos de ${moduleName} registrados/as</p>
            </div></td></tr>`;
            return;
        }
        tbody.innerHTML = lista.map((m, i) => {
            //TODO rows de la tabla
            return `
                <tr>
                    <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i + 1).padStart(2, '0')}</span></td>
                    
                    <!-- TODO data rows -->
                    <td><span>${escapeHtml(m.role)}</span></td>
                    <!-- TODO data rows -->

                    <td>
                    <!-- TODO colocar el ID de la entidad -->
                    <button class="btn-action btn-action-edit"   
                        onclick="RoleModule.openEdit(${m.id_roles})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn-action btn-action-delete" 
                        onclick="RoleModule.confirmDel(${m.id_roles},'${escapeHtml(m.role)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
                    </td>                    
                </tr>
            `
        }).join('')
    },

    _filter() {
        const search = document.getElementById(`search${capitalizar(moduleName)}`)?.value.toLowerCase() || '';
        console.log(search)
        //TODO filtro, CAMBIAR EL CACHE
        this._render(AppState.role.filter(m =>
            // m -> valor que nos dan
            // search -> valor que buscamos
            m.role.toLowerCase().includes(search)
        ));
    },
    // obj = {model: "hola"}
    // _openModal(edit,obj}) {}
    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText(`modal${capitalizar(moduleName)}Title`, isEdit ? `Editar ${moduleName}` : `Nueva ${moduleName}`);
        // TODO obtener los datos por el ID del MODAL (HTML)
        document.getElementById('roleId').value = isEdit ? entidad.id_roles : '';
        document.getElementById('rolename').value = isEdit ? entidad.role : '';
        clearErrors(['roleId']);
        clearErrors(['rolename']);

        openOverlay(`modal${capitalizar(moduleName)}Overlay`);
    },

    openEdit(id) {
        const model = AppState.role.find(m => m.id_roles === id);
        if (!model) return showToast(`${capitalizar(moduleName)} no encontrada`, 'error');
        this._openModal('edit', model);
    },

    confirmDel(id, name) {
        DeleteModal.open(`${moduleName}`, id, name, async () => {
            try {
                await http(`/api/${moduleName}/${id}`, 'DELETE');
                showToast(`"${name}" eliminada correctamente`, 'success');
                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });
    },

    async _save() {
        //TODO recuperar los datos del MODAL (HTML)
        const id = document.getElementById('roleId').value;
        const nombre = document.getElementById('rolename').value.trim();

        const isEdit = !!id
        try {
            //TODO enviar los datos al servidor
            const data = {role: nombre}

            const url = isEdit ? `/api/${moduleName}/${id}` : `/api/${moduleName}`
            const method = isEdit ? 'PUT' : 'POST'
            const resp = await http(url, method, data)
            showToast(`${capitalizar(moduleName)} ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeOverlay(`modal${capitalizar(moduleName)}Overlay`);
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    _bindEvents() {
        document.getElementById(`btnNew${capitalizar(moduleName)}`)?.addEventListener('click', () => this._openModal('new'));
        document.getElementById(`btnSave${capitalizar(moduleName)}`)?.addEventListener('click', () => this._save());
        document.getElementById(`btnClose${capitalizar(moduleName)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleName)}Overlay`));
        document.getElementById(`btnCloseModal${capitalizar(moduleName)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleName)}Overlay`));

        document.getElementById(`btnRefresh${capitalizar(moduleName)}`)?.addEventListener('click', () => this.load());
        document.getElementById(`search${capitalizar(moduleName)}`)?.addEventListener('input', () => this._filter());

    },
}