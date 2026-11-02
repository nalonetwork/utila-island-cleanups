import { supabase } from './supabase.js';

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setCounterTargets(totals) {
  const fields = {
    'count-bottles': totals.total_bottles,
    'count-weight-kg': totals.total_weight_kg,
    'count-weight-lbs': totals.total_weight_lbs,
    'count-cleanups': totals.total_events,
  };

  let updated = false;
  for (const [id, value] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el && value != null) {
      el.setAttribute('data-target', value);
      updated = true;
    }
  }
  return updated;
}

async function loadImpactTotals() {
  if (!document.querySelector('.counter')) return;

  const { data, error } = await supabase.from('cleanup_totals').select('*').maybeSingle();
  if (error) {
    console.error('Error loading impact totals:', error.message);
    return;
  }
  if (data && setCounterTargets(data) && typeof window.initCounters === 'function') {
    window.initCounters();
  }
}

function renderAnnouncement(announcement) {
  const banner = document.getElementById('announcement-banner');
  if (!banner) return;

  const lang = document.documentElement.lang || 'en';
  const title = announcement[`title_${lang}`] || announcement.title_en || '';
  const details = announcement[`details_${lang}`] || announcement.details_en || '';

  const metaParts = [];
  if (announcement.meetup_time) {
    metaParts.push(`<span class="announcement-meta">Meetup: ${escapeHtml(announcement.meetup_time)}</span>`);
  }
  if (announcement.meeting_point) {
    metaParts.push(`<span class="announcement-meta">Location: ${escapeHtml(announcement.meeting_point)}</span>`);
  }

  banner.innerHTML = `
    <div class="announcement-text">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(details)}</span>
    </div>
    <div class="announcement-meta-row">${metaParts.join('')}</div>
  `;
  banner.hidden = false;
}

async function loadAnnouncement() {
  const banner = document.getElementById('announcement-banner');
  if (!banner) return;

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error loading announcement:', error.message);
    return;
  }
  if (data) renderAnnouncement(data);
}

document.addEventListener('DOMContentLoaded', () => {
  loadImpactTotals();
  loadAnnouncement();
});
