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

  const [wasteResult, cleanupsResult] = await Promise.all([
    supabase.from('waste_breakdown').select('category, total_weight_lbs, total_weight_kg, total_plastic_bottles_unit'),
    supabase.from('cleanups').select('id', { count: 'exact', head: true }),
  ]);

  const totals = {};

  if (wasteResult.error) {
    console.error('Error loading waste breakdown totals:', wasteResult.error.message);
  } else {
    const sums = (wasteResult.data || []).reduce((acc, row) => {
      acc.total_bottles += row.total_plastic_bottles_unit || 0;
      acc.total_weight_kg += row.total_weight_kg || 0;
      acc.total_weight_lbs += row.total_weight_lbs || 0;
      return acc;
    }, { total_bottles: 0, total_weight_kg: 0, total_weight_lbs: 0 });
    Object.assign(totals, sums);
  }

  if (cleanupsResult.error) {
    console.error('Error loading cleanups count:', cleanupsResult.error.message);
  } else {
    totals.total_events = cleanupsResult.count;
  }

  if (setCounterTargets(totals) && typeof window.initCounters === 'function') {
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

// --- Curated Instagram Feed ---

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/utila.island.cleanups/';
let instagramEmbedScriptRequested = false;

function loadInstagramEmbedScript() {
  return new Promise((resolve) => {
    if (window.instgrm) {
      resolve();
      return;
    }
    if (instagramEmbedScriptRequested) {
      resolve();
      return;
    }
    instagramEmbedScriptRequested = true;

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

function renderInstagramFallback() {
  return `
    <a class="instagram-fallback-card" href="${INSTAGRAM_PROFILE_URL}" target="_blank" rel="noopener noreferrer">
      <ion-icon name="logo-instagram"></ion-icon>
      <span data-en="Follow us on Instagram" data-es="Síguenos en Instagram" data-fr="Suivez-nous sur Instagram">Follow us on Instagram</span>
    </a>
  `;
}

function renderInstagramEmbed(url) {
  return `<blockquote class="instagram-media" data-instgrm-permalink="${escapeHtml(url)}" data-instgrm-version="14"></blockquote>`;
}

async function loadInstagramFeed() {
  const grid = document.getElementById('instagram-feed-grid');
  if (!grid) return;

  const { data, error } = await supabase
    .from('instagram_posts')
    .select('slot, post_url')
    .order('slot', { ascending: true });

  if (error) {
    console.error('Error loading Instagram posts:', error.message);
    grid.innerHTML = renderInstagramFallback().repeat(3);
    return;
  }

  const postUrlBySlot = new Map((data || []).map(row => [row.slot, row.post_url]));
  const hasAnyPost = [1, 2, 3].some(slot => postUrlBySlot.get(slot));

  grid.innerHTML = [1, 2, 3]
    .map(slot => {
      const url = postUrlBySlot.get(slot);
      return url ? renderInstagramEmbed(url) : renderInstagramFallback();
    })
    .join('');

  if (hasAnyPost) {
    await loadInstagramEmbedScript();
    if (window.instgrm) window.instgrm.Embeds.process();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadImpactTotals();
  loadAnnouncement();
  loadInstagramFeed();
});
