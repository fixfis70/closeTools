/**
 * utils.js — Funciones utilitarias compartidas por todos los módulos
 * No tiene dependencias. Se carga primero.
 */

'use strict';

/* ════════════════════════════════════════════
   HTTP HELPER
════════════════════════════════════════════ */
async function http(url, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res  = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

/* ════════════════════════════════════════════
   TOASTS
════════════════════════════════════════════ */
function showToast(msg, type = 'success') {
  const map = {
    success: { icon: 'bi-check-circle-fill', cls: 'toast-success', icoCls: 'toast-icon-success' },
    error:   { icon: 'bi-x-circle-fill',     cls: 'toast-error',   icoCls: 'toast-icon-error'   },
    info:    { icon: 'bi-info-circle-fill',   cls: 'toast-info',    icoCls: 'toast-icon-info'    },
  };
  const t  = map[type] || map.info;
  const el = document.createElement('div');
  el.className = `toast-item ${t.cls}`;
  el.innerHTML = `<i class="bi ${t.icon} toast-icon ${t.icoCls}"></i><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ════════════════════════════════════════════
   FORMULARIOS / UI
════════════════════════════════════════════ */
function setError(inputId, errId, msg) {
  document.getElementById(inputId)?.classList.add('is-invalid');
  const err = document.getElementById(errId);
  if (err) err.textContent = msg;
}

function clearErrors(inputIds) {
  inputIds.forEach(id => {
    document.getElementById(id)?.classList.remove('is-invalid');
    const err = document.getElementById('err-' + id);
    if (err) err.textContent = '';
  });
}

function setLoading(btnId, textId, spinnerId, loading) {
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = loading;
  document.getElementById(textId)?.[loading ? 'classList' : 'classList'][loading ? 'add' : 'remove']('d-none');
  document.getElementById(spinnerId)?.[loading ? 'classList' : 'classList'][loading ? 'remove' : 'add']('d-none');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function openOverlay(id)  { document.getElementById(id)?.classList.add('open'); }
function closeOverlay(id) { document.getElementById(id)?.classList.remove('open'); }

/* ════════════════════════════════════════════
   FORMATTERS
════════════════════════════════════════════ */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatPrecio(val) {
  return parseFloat(val || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}

function formatFecha(fechaStr) {
  if (!fechaStr) return '—';
  const [y, m, d] = fechaStr.split('-');
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d} ${meses[parseInt(m, 10) - 1]} ${y}`;
}