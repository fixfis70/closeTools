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

const moduleReceipt = 'receipt';

const ModuleReceipt = {

    async init() {
        await this._generarPlantilla();
        //domir un rato
        this._bindEvents();
        await this.load();
    },
    async _generarPlantilla() {
        const reemplazos = {
            name: moduleReceipt,
            capName: capitalizar(moduleReceipt),
        };
        document.getElementById('pageContainer').innerHTML = document.getElementById('pageContainer').innerHTML.replace(
            /@@-(.*?)-@@/g,
            (match, clave) => reemplazos[clave] || match
        );
    },

    async load() {
        const {data} = await http(`/api/${moduleReceipt}`);
        //TODO el caché
        AppState.receipt = data;
        this._render(data);
        updateBadges();
    },
    //model
    _render(lista) {
        setText(`total${capitalizar(moduleReceipt)}Label`, `${lista.length} ${moduleReceipt}(s) registrado(s)`);
        const tbody = document.getElementById(`body${capitalizar(moduleReceipt)}`);
        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
                <i class="bi bi-bookmark-x"></i><p>No hay datos de ${moduleReceipt} registrados/as</p>
            </div></td></tr>`;
            return;
        }
        tbody.innerHTML = lista.map((m, i) => {
            //TODO rows de la tabla
            return `
                <tr>
                    <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">${String(i + 1).padStart(2, '0')}</span></td>
                    
                    <!-- TODO data rows -->
                    <td><span>${escapeHtml(m.receipt_date)}</span></td>
                    <td><span>${escapeHtml(m.receipt_img_url)}</span></td>
                    <td><span>${escapeHtml(m.provaider)}</span></td>
                    <!-- TODO data rows -->

                    <td>
                    <!-- TODO colocar el ID de la entidad -->
                    <button class="btn-action btn-action-edit"   
                        onclick="ModuleReceipt.openEdit(${m.id_receipt})"   title="Editar"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn-action btn-action-delete" 
                        onclick="ModuleReceipt.confirmDel(${m.id_receipt},'${escapeHtml(m.provaider)}')" title="Eliminar"><i class="bi bi-trash3-fill"></i></button>
                    </td>                    
                </tr>
            `
        }).join('')
    },

    _filter() {
        const search = document.getElementById(`search${capitalizar(moduleReceipt)}`)?.value.toLowerCase() || '';
        console.log(search)
        //TODO filtro, CAMBIAR EL CACHE
        this._render(AppState.receipt.filter(m =>
            // m -> valor que nos dan
            // search -> valor que buscamos
            m.provaider.toLowerCase().includes(search)
        ));
    },
    // obj = {model: "hola"}
    // _openModal(edit,obj}) {}
    /* ── Modal ───────────────────────────── */
    _openModal(mode, entidad = null) {
        const isEdit = mode === 'edit';
        setText(`modal${capitalizar(moduleReceipt)}Title`, isEdit ? `Editar ${moduleReceipt}` : `Nueva ${moduleReceipt}`);
        // TODO obtener los datos por el ID del MODAL (HTML)
        document.getElementById('receiptId').value = isEdit ? entidad.id_receipt : '';
        document.getElementById('receiptimg').value = isEdit ? entidad.receipt_img_url : '';
        document.getElementById('receiptidprovaider').value = isEdit ? entidad.id_provider : '';
        clearErrors(['receiptimg']);
        clearErrors(['receiptidprovaider']);

        openOverlay(`modal${capitalizar(moduleReceipt)}Overlay`);
    },

    openEdit(id) {
        const value = AppState.receipt.find(m => m.id_receipt === id);
        if (!value) return showToast(`${capitalizar(moduleReceipt)} no encontrada`, 'error');
        this._openModal('edit', value);
    },

    confirmDel(id, name) {
        DeleteModal.open(`${moduleReceipt}`, id, name, async () => {
            try {
                await http(`/api/${moduleReceipt}/${id}`, 'DELETE');
                showToast(`"${name}" eliminada correctamente`, 'success');
                await this.load();
            } catch (e) {
                showToast(e.message, 'error');
            }
        });

    },

    async _save() {
        //TODO recuperar los datos del MODAL (HTML)
        const id = document.getElementById('receiptId').value;
        const img = document.getElementById('receiptimg').value.trim();
        const pro = document.getElementById('receiptidprovaider').value.trim();
        //TODO recuperar los datos del MODAL (HTML)

        const isEdit = !!id
        try {
            //TODO enviar los datos al servidor
            const data = {receipt_img_url: img, id_provider: pro}
            //TODO enviar los datos al servidor

            const url = isEdit ? `/api/${moduleReceipt}/${id}` : `/api/${moduleReceipt}`
            const method = isEdit ? 'PUT' : 'POST'
            const resp = await http(url, method, data)
            showToast(`${capitalizar(moduleReceipt)} ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeOverlay(`modal${capitalizar(moduleReceipt)}Overlay`);
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    _bindEvents() {
        document.getElementById(`btnNew${capitalizar(moduleReceipt)}`)?.addEventListener('click', () => this._openModal('new'));
        document.getElementById(`btnSave${capitalizar(moduleReceipt)}`)?.addEventListener('click', () => this._save());
        document.getElementById(`btnClose${capitalizar(moduleReceipt)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleReceipt)}Overlay`));
        document.getElementById(`btnCloseModal${capitalizar(moduleReceipt)}`)?.addEventListener('click', () => closeOverlay(`modal${capitalizar(moduleReceipt)}Overlay`));

        document.getElementById(`btnRefresh${capitalizar(moduleReceipt)}`)?.addEventListener('click', () => this.load());
        document.getElementById(`search${capitalizar(moduleReceipt)}`)?.addEventListener('input',      () => this._filter());

    },
}