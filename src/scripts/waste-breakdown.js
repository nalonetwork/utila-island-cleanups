import { supabase } from './supabase.js';

const EXCLUDED_CATEGORIES = ['Utensils', 'Styrofoam'];

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatWeight(value) {
  if (value == null) return '—';
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderRows(rows) {
  const tbody = document.getElementById('waste-breakdown-body');
  if (!tbody) return;

  tbody.innerHTML = rows.map(row => `
    <tr data-category="${escapeHtml(row.category)}">
      <td>${escapeHtml(row.category)}</td>
      <td class="num">${formatWeight(row.total_weight_lbs)}</td>
      <td class="num">${formatWeight(row.total_weight_kg)}</td>
    </tr>
  `).join('');
}

function computeTotals() {
  const tbody = document.getElementById('waste-breakdown-body');
  if (!tbody) return;

  let totalLbs = 0, totalKg = 0;
  let exclLbs = 0, exclKg = 0;

  tbody.querySelectorAll('tr').forEach(row => {
    const cells = row.querySelectorAll('td');
    const lbs = parseFloat((cells[1]?.textContent || '').replace(/,/g, '')) || 0;
    const kg = parseFloat((cells[2]?.textContent || '').replace(/,/g, '')) || 0;

    totalLbs += lbs;
    totalKg += kg;

    if (!EXCLUDED_CATEGORIES.includes(row.dataset.category)) {
      exclLbs += lbs;
      exclKg += kg;
    }
  });

  setText('waste-total-lbs', formatWeight(totalLbs));
  setText('waste-total-kg', formatWeight(totalKg));
  setText('waste-total-excl-lbs', formatWeight(exclLbs));
  setText('waste-total-excl-kg', formatWeight(exclKg));
}

async function loadWasteBreakdown() {
  const tbody = document.getElementById('waste-breakdown-body');
  if (!tbody) return;

  // Fallback SSR rows are already in the DOM, so totals are correct even before the fetch resolves.
  computeTotals();

  const { data, error } = await supabase
    .from('waste_breakdown')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error loading waste breakdown:', error.message);
    return;
  }

  if (data && data.length > 0) {
    renderRows(data);
    computeTotals();
  }
}

document.addEventListener('DOMContentLoaded', loadWasteBreakdown);
