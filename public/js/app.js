/**
 * app.js — Punto de arranque de la SPA
 *
 * Responsabilidades (mínimas, a propósito):
 *  1. Estado compartido entre módulos (productos, marcas)
 *  2. Modal de confirmación de eliminación (usado por varios módulos)
 *  3. Inicializar el router y navegar a la página inicial
 */

'use strict';

/* ════════════════════════════════════════════
   ESTADO GLOBAL COMPARTIDO
   Los módulos leen/escriben aquí para compartir
   datos sin repetir peticiones al servidor.
════════════════════════════════════════════ */
const AppState = {
    loan_tool: [],
    loan:[],
    tool: [],
    locker: [],
    receipt: [],
    credentials: [],
    worker: [],
    role:[],
    productos: [],
    marcas: [],
    models: [],
    clientes: [],
    proveedors: [],
    storages: [],
    brands: [],
    deleteTarget: {type: null, id: null, name: null, onConfirm: null},
};

/* ════════════════════════════════════════════
   MODAL DE ELIMINACIÓN (compartido)
════════════════════════════════════════════ */
const DeleteModal = {

    /** Inyecta el HTML del modal en #modalsContainer */
    render() {
        document.getElementById('modalsContainer').innerHTML = `
      <div class="modal-overlay" id="modalDeleteOverlay">
        <div class="modal-panel modal-sm">
          <div class="modal-header-custom">
            <div class="modal-title-custom text-danger">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar Eliminación
            </div>
            <button class="btn-modal-close" id="btnCloseDelete"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body-custom">
            <p class="text-muted mb-0" id="deleteMessage">
              ¿Estás seguro de que deseas eliminar este registro?
            </p>
          </div>
          <div class="modal-footer-custom">
            <button class="btn-cancel"        id="btnCancelDelete">Cancelar</button>
            <button class="btn-danger-action" id="btnConfirmDelete">
              <i class="bi bi-trash3-fill me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>`;

        document.getElementById('btnConfirmDelete').addEventListener('click', () => this._execute());
        document.getElementById('btnCancelDelete').addEventListener('click', () => closeOverlay('modalDeleteOverlay'));
        document.getElementById('btnCloseDelete').addEventListener('click', () => closeOverlay('modalDeleteOverlay'));
        document.getElementById('modalDeleteOverlay').addEventListener('click', e => {
            if (e.target.id === 'modalDeleteOverlay') closeOverlay('modalDeleteOverlay');
        });
    },

    /**
     * Abre el modal de confirmación.
     * @param {string}   type      - 'producto' | 'marca'
     * @param {number}   id
     * @param {string}   name
     * @param {Function} onConfirm - callback ejecutado al confirmar
     */
    open(type, id, name, onConfirm) {
        AppState.deleteTarget = {type, id, name, onConfirm};
        const msgs = {
            tool: `¿Eliminar la herramienta "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            locker: `¿Eliminar el locker "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            receipt: `¿Eliminar el recibo del "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            credentials: `¿Eliminar la credencial "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            worker: `¿Eliminar el trabajador "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            producto: `¿Eliminar el producto "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            role: `¿Eliminar el Rol "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            brand: `¿Eliminar la marca "<strong>${escapeHtml(name)}</strong>"? Solo se puede si no tiene productos asociados.`,
            model: `¿Eliminar el modelo "<strong>${escapeHtml(name)}</strong>"? Solo se puede si no tiene productos asociados.`,
            proveedor: `¿Eliminar el proveedor "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
            storage: `¿Eliminar el storage "<strong>${escapeHtml(name)}</strong>"? Esta acción no se puede deshacer.`,
        };
        document.getElementById('deleteMessage').innerHTML = msgs[type] || '¿Confirmar eliminación?';
        openOverlay('modalDeleteOverlay');
    },

    async _execute() {
        const {onConfirm} = AppState.deleteTarget;
        closeOverlay('modalDeleteOverlay');
        if (typeof onConfirm === 'function') await onConfirm();
    },
};

/* ════════════════════════════════════════════
   BADGES DE SIDEBAR
════════════════════════════════════════════ */
function updateBadges() {
    setText('badge-tool', AppState.locker.length);
    setText('badge-locker', AppState.locker.length);
    setText('badge-receipt', AppState.receipt.length);
    setText('badge-credentials', AppState.credentials.length);
    setText('badge-worker', AppState.worker.length);
    setText('badge-productos', AppState.productos.length);
    setText('badge-marcas', AppState.marcas.length);
    setText('badge-brands', AppState.brands.length);
    setText('badge-role', AppState.role.length);
    setText('badge-storages', AppState.storages.length);
    setText('badge-proveedores', AppState.proveedors.length);
    setText('badge-models',AppState.models.length)
}

/* ════════════════════════════════════════════
   ARRANQUE
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    DeleteModal.render();
    Router.init();
    Router.navigateTo('loan');
});