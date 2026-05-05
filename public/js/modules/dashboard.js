/**
 * modules/dashboard.js
 * Solo conoce el DOM de views/dashboard.html
 */

'use strict';

const DashboardModule = {

  async init() {
    // El enlace "Ver todos" del dashboard navega a productos
    document.querySelector('[data-page="productos"].btn-link')
      ?.addEventListener('click', e => {
        e.preventDefault();
        Router.navigateTo('productos');
      });

    await this.load();
  },

  async load() {
    try {
      const [resP,resM] = await Promise.all([
        http('/api/model'),
        http('/api/brand'),
      ]);

      AppState.productos = resP.data;
      AppState.brands    = resM.data;
      updateBadges();

      this._renderStats();
      this._renderRecientes(AppState.productos.slice(0, 5));
      this._renderChart();
    } catch (e) {
      showToast('Error al cargar dashboard: ' + e.message, 'error');
    }
  },

  _renderStats() {
    const ps    = AppState.productos;
    const suma  = ps.reduce((a, b) => a + parseFloat(b.precio), 0);
    const prom  = ps.length ? suma / ps.length : 0;

    setText('stat-total-productos', ps.length);
    setText('stat-total-marcas',    AppState.brands.length);
    setText('stat-valor-total',     'S/. ' + formatPrecio(suma));
    setText('stat-precio-promedio', 'S/. ' + formatPrecio(prom));
  },

  _renderRecientes(lista) {
    const el = document.getElementById('tabla-recientes');
    if (!lista.length) {
      el.innerHTML = `<div class="empty-state" style="padding:30px"><i class="bi bi-inbox"></i><p>Sin datos</p></div>`;
      return;
    }
    el.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${lista.map(p => `
            <tr style="border-bottom:1px solid var(--border)">
              <td style="padding:12px 20px;width:36px">
                <div style="width:32px;height:32px;background:var(--primary-light);border-radius:8px;display:flex;align-items:center;justify-content:center">
                  <i class="bi bi-box-seam" style="color:var(--primary);font-size:14px"></i>
                </div>
              </td>
              <td style="padding:12px 8px">
                <div class="fw-600" style="font-size:13px">${escapeHtml(p.nombre)}</div>
                <div style="font-size:11px;color:var(--text-muted)">${escapeHtml(p.brand)}</div>
              </td>
              <td style="padding:12px 20px;text-align:right">
                <span class="cell-precio" style="font-size:13px">S/. ${formatPrecio(p.precio)}</span>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  },

  _renderChart() {
    const el = document.getElementById('chart-marcas');
    const counts = {};
    AppState.productos.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const max = sorted[0]?.[1] || 1;

    if (!sorted.length) {
      el.innerHTML = `<div class="empty-state" style="padding:30px"><i class="bi bi-bar-chart"></i><p>Sin datos</p></div>`;
      return;
    }
    el.innerHTML = sorted.map(([marca, cant]) => `
      <div style="padding:8px 20px">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
          <span>${escapeHtml(marca)}</span>
          <span class="fw-600">${cant}</span>
        </div>
        <div style="height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${(cant/max)*100}%;background:var(--primary);border-radius:3px;transition:width .6s ease"></div>
        </div>
      </div>`).join('');
  },
};