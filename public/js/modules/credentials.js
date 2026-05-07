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

const modulecredentials = 'credentials';

const CredentialModule = {

    async init() {
        await this._generarPlantilla();
        //domir un rato
        this._bindEvents();
        await this.load();
    },
    async _generarPlantilla() {
        const reemplazos = {
            name: modulecredentials,
            capName: capitalizar(modulecredentials),
        };
        document.getElementById('pageContainer').innerHTML = document.getElementById('pageContainer').innerHTML.replace(
            /@@-(.*?)-@@/g,
            (match, clave) => reemplazos[clave] || match
        );
    },

    async load() {
        const {data} = await http(`/api/${modulecredentials}`);
        //TODO el caché
        AppState.credentials = data;
        this._render(data);
        updateBadges();
    },
    //model
    _render(lista) {
        setText(`total${capitalizar(modulecredentials)}Label`, `${lista.length} ${modulecredentials}(s) registrado(s)`);
        const tbody = document.getElementById(`body${capitalizar(modulecredentials)}`);
        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
                <i class="bi bi-bookmark-x"></i><p>No hay datos de ${modulecredentials} registrados/as</p>
            </div></td></tr>`;
            return;
        }
        tbody.innerHTML = lista.map((m, i) => {
            //TODO rows de la tabla
            return `
                <tr>
                    <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i + 1).padStart(2, '0')}</span></td>
                    
                    <!-- TODO data rows -->
                    <td><span>${escapeHtml(m.user)}</span></td>
                    <td><span>${escapeHtml(m.pass)}</span></td>
                    <td><span>${escapeHtml(m.enable)}</span></td>
                    <td><span>${escapeHtml(m.creation_date)}</span></td>
                    <td><span>${escapeHtml(m.id_worker)}</span></td>
                    <!-- TODO data rows -->

                    <td>
                    <!-- TODO colocar el ID de la entidad -->
                    <button class="btn-action btn-action-edit"   
                        onclick="CredentialModule.openEdit(${m.id_user})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn-action btn-action-delete" 
                        onclick="CredentialModule.confirmDel(${m.id_user},'${escapeHtml(m.user)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
                    </td>                    
                </tr>
            `
        }).join('')
    },

    _filter() {
        const search = document.getElementById(`search${capitalizar(modulecredentials)}`)?.value.toLowerCase() || '';
        console.log(search)
        //TODO filtro, CAMBIAR EL CACHE
        this._render(AppState.credentials.filter(m =>
            // m -> valor que nos dan
            // search -> valor que buscamos
            m.user.toLowerCase().includes(search)
        ));
    },
    // obj = {model: "hola"}
    // _openModal(edit,obj}) {}
    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText(`modal${capitalizar(modulecredentials)}Title`, isEdit ? `Editar ${modulecredentials}` : `Nueva ${modulecredentials}`);
        // TODO obtener los datos por el ID del MODAL (HTML)
        document.getElementById('credentialId').value = isEdit ? entidad.id_user : '';
        document.getElementById('credentialuser').value = isEdit ? entidad.user : '';
        document.getElementById('credentialpass').value = isEdit ? entidad.pass : '';
        document.getElementById('credentialactive').value = isEdit ? entidad.enable : '';
        document.getElementById('credentialdni').value = isEdit ? entidad.id_worker : '';
        clearErrors(['credentialuser']);
        clearErrors(['credentialpass']);
        clearErrors(['credentialactive']);
        clearErrors(['credentialdni']);

        openOverlay(`modal${capitalizar(modulecredentials)}Overlay`);
    },

    openEdit(id) {
        const value = AppState.credentials.find(m => m.id_user === id);
        if (!value) return showToast(`${capitalizar(modulecredentials)} no encontrada`, 'error');
        this._openModal('edit', value);
    },

    confirmDel(id, name) {
        DeleteModal.open(`${modulecredentials}`, id, name, async () => {
            try {
                await http(`/api/${modulecredentials}/${id}`, 'DELETE');
                showToast(`"${name}" eliminada correctamente`, 'success');
                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });

    },

    async _save() {
        //TODO recuperar los datos del MODAL (HTML)
        const id = document.getElementById('credentialId').value;
        const user = document.getElementById('credentialuser').value.trim();
        const pass = document.getElementById('credentialpass').value.trim();
        const active = document.getElementById('credentialactive').value.trim();
        const dni = document.getElementById('credentialdni').value.trim();
        //TODO recuperar los datos del MODAL (HTML)

        const isEdit = !!id
        try {
            //TODO enviar los datos al servidor
            const data = {user: user, pass : pass, enable: active, id_worker:dni}
            //TODO enviar los datos al servidor

            const url = isEdit ? `/api/${modulecredentials}/${id}` : `/api/${modulecredentials}`
            const method = isEdit ? 'PUT' : 'POST'
            const resp = await http(url, method, data)
            showToast(`${capitalizar(modulecredentials)} ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeOverlay(`modal${capitalizar(modulecredentials)}Overlay`);
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    _bindEvents() {
        document.getElementById(`btnNew${capitalizar(modulecredentials)}`)?.addEventListener('click', () => this._openModal('new'));
        document.getElementById(`btnSave${capitalizar(modulecredentials)}`)?.addEventListener('click', () => this._save());
        document.getElementById(`btnClose${capitalizar(modulecredentials)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(modulecredentials)}Overlay`));
        document.getElementById(`btnCloseModal${capitalizar(modulecredentials)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(modulecredentials)}Overlay`));

        document.getElementById(`btnRefresh${capitalizar(modulecredentials)}`)?.addEventListener('click', () => this.load());
        document.getElementById(`search${capitalizar(modulecredentials)}`)?.addEventListener('input',      () => this._filter());

    },
}