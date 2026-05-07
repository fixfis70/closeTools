/**
 * router.js — Router SPA
 *
 * Responsabilidades:
 *  1. Mantener el registro de rutas (página → archivo HTML + módulo JS)
 *  2. Cargar el HTML de cada vista de forma dinámica (fetch de /views/*.html)
 *  3. Inyectarlo en #pageContainer
 *  4. Llamar al init() del módulo correspondiente
 *  5. Gestionar el estado activo del sidebar
 *
 * Para agregar una nueva página basta con:
 *  a) Crear  public/views/nueva-pagina.html
 *  b) Crear  public/js/modules/nueva-pagina.js  con un init()
 *  c) Registrarla aquí en ROUTES
 *  d) Agregar el <a data-page="nueva-pagina"> en el sidebar del index.html
 */

'use strict';

/* ════════════════════════════════════════════
   REGISTRO DE RUTAS
   Agregar aquí cada nueva vista.
════════════════════════════════════════════ */
const ROUTES = {
  tool: {
    title: "Herramientas",
    view: "views/tool.html",
    module: () => ModuleTool
  },
  locker: {
    title: "Lockers",
    view: "views/locker.html",
    module: () => ModuleLocker
  },
  receipt: {
    title: "Recibo",
    view: "/views/receipts.html",
    module: () => ModuleReceipt,
  },
  credentials: {
    title: "Credenciales",
    view : "/views/credentials.html",
    module : () => CredentialModule,
  },
  worker : {
    title: 'Trabajadores',
    view: '/views/workers.html',
    module: () => WorkerModule,
  },
  role : {
    title: 'Role',
    view: '/views/role.html',
    module: () => RoleModule,
  },
  dashboard: {
    title:  'Dashboard',
    view:   '/views/dashboard.html',   // HTML de la vista
    module: () => DashboardModule,     // Módulo JS que la controla
  },
  proveedores: {
    title: 'Proveedores',
    view: '/views/proveedores.html',
    module: () => ProveedoresModule,
  },
  models: {
    title: 'Models',
    view: '/views/models.html',
    module: () => ModelModule,
  },
  storages: {
    titulo: 'storages',
    view: '/views/storages.html',
    module: () => StoragesModule,
  },
  brands: {
    title: 'Brands',
    view: '/views/brands.html',
    module: ()=> BrandModule
  }
  // ── Ejemplo de cómo agregar una ruta nueva en el futuro ──
  // clientes: {
  //   title:  'Clientes',
  //   view:   '/views/clientes.html',
  //   module: () => ClientesModule,
  // },
};

/* ════════════════════════════════════════════
   CACHÉ DE VISTAS
   Guarda el HTML ya descargado para no volver
   a hacer fetch si el usuario regresa a la página.
════════════════════════════════════════════ */
const viewCache = {};

/* ════════════════════════════════════════════
   ROUTER
════════════════════════════════════════════ */
const Router = {

  currentPage: null,

  /**
   * Navega a una página registrada en ROUTES.
   * @param {string} page  - clave de ROUTES (ej: 'productos')
   */
  async navigateTo(page) {
    const route = ROUTES[page];

    if (!route) {
      console.warn(`Router: ruta "${page}" no registrada.`);
      return;
    }

    // 1. Actualizar sidebar
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

    // 2. Actualizar título del topbar
    setText('topbarTitle', route.title);

    // 3. Mostrar spinner mientras carga
    const container = document.getElementById('pageContainer');
    container.innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="height:60vh">
        <div class="spinner-custom"></div>
      </div>`;

    // 4. Obtener HTML (desde caché o fetch)
    try {
      if (!viewCache[page]) {
        const res = await fetch(route.view);
        if (!res.ok) throw new Error(`No se pudo cargar la vista: ${route.view}`);
        viewCache[page] = await res.text();
      }

      // 5. Inyectar el HTML en el contenedor
      container.innerHTML = viewCache[page];

      // 6. Inicializar el módulo de la página
      const mod = route.module();
      if (mod && typeof mod.init === 'function') {
        await mod.init();
      }

      this.currentPage = page;

      // 7. Cerrar sidebar en móvil
      this._closeSidebarMobile();

    } catch (err) {
      container.innerHTML = `
        <div class="empty-state" style="padding:80px 20px">
          <i class="bi bi-exclamation-triangle" style="font-size:48px;color:var(--danger);opacity:.5"></i>
          <p class="mt-3">Error al cargar la vista <strong>${page}</strong></p>
          <p style="font-size:12px;color:var(--text-muted)">${err.message}</p>
        </div>`;
      console.error('Router error:', err);
    }
  },

  /**
   * Registra los listeners del sidebar y del teclado.
   * Se llama una sola vez al arrancar la app.
   */
  init() {
    // Clicks del sidebar
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        Router.navigateTo(item.dataset.page);
      });
    });

    // Toggle sidebar móvil
    document.getElementById('btnToggleSidebar')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('sidebarOverlay').classList.toggle('open');
    });

    document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
      this._closeSidebarMobile();
    });

    // Cerrar modales con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          m.classList.remove('open');
        });
      }
    });
  },

  _closeSidebarMobile() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('open');
  },
};