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

function numberOrNull(id) {
  const val = document.getElementById(id).value;
  return val === '' ? null : Number(val);
}

const loginSection = document.getElementById('admin-login');
const dashboardSection = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const cleanupForm = document.getElementById('cleanup-form');
const cleanupFormStatus = document.getElementById('cleanup-form-status');
const cleanupsTableBody = document.getElementById('cleanups-table-body');

const announcementForm = document.getElementById('announcement-form');
const announcementStatus = document.getElementById('announcement-status');

const signupsTableBody = document.getElementById('signups-table-body');

function showDashboard() {
  loginSection.hidden = true;
  dashboardSection.hidden = false;
  loadCleanups();
  loadAnnouncement();
  loadSignups();
}

function showLogin() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
}

async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    showDashboard();
  } else {
    showLogin();
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = error.message;
    return;
  }
  loginForm.reset();
  showDashboard();
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  showLogin();
});

// --- Section A: Log New Cleanup ---

cleanupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  cleanupFormStatus.textContent = 'Saving...';

  const payload = {
    event_date: document.getElementById('cleanup-date').value,
    location_name: document.getElementById('cleanup-location').value,
    bags_collected: numberOrNull('cleanup-bags'),
    bottles_recycled: numberOrNull('cleanup-bottles'),
    weight_kg: numberOrNull('cleanup-weight'),
    volunteers_count: numberOrNull('cleanup-volunteers'),
    notes: document.getElementById('cleanup-notes').value.trim() || null,
    lead_organizer: document.getElementById('cleanup-organizer').value.trim() || null,
  };

  const { error } = await supabase.from('cleanups').insert(payload);

  if (error) {
    cleanupFormStatus.textContent = `Error: ${error.message}`;
    return;
  }

  cleanupFormStatus.textContent = 'Cleanup logged.';
  cleanupForm.reset();
  loadCleanups();
});

// --- Section B: Past Cleanups ---

async function loadCleanups() {
  const { data, error } = await supabase
    .from('cleanups')
    .select('*')
    .order('event_date', { ascending: false })
    .limit(10);

  if (error) {
    cleanupsTableBody.innerHTML = `<tr><td colspan="7">Error: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    cleanupsTableBody.innerHTML = '<tr><td colspan="7">No cleanups logged yet.</td></tr>';
    return;
  }

  cleanupsTableBody.innerHTML = data.map(row => `
    <tr>
      <td>${escapeHtml(row.event_date)}</td>
      <td>${escapeHtml(row.location_name)}</td>
      <td>${escapeHtml(row.bags_collected)}</td>
      <td>${escapeHtml(row.bottles_recycled)}</td>
      <td>${escapeHtml(row.weight_kg)}</td>
      <td>${escapeHtml(row.volunteers_count)}</td>
      <td><button class="btn-delete" type="button" data-id="${escapeHtml(row.id)}">Delete</button></td>
    </tr>
  `).join('');
}

cleanupsTableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  if (!window.confirm('Delete this cleanup record?')) return;

  const { error } = await supabase.from('cleanups').delete().eq('id', btn.dataset.id);
  if (error) {
    window.alert(`Error deleting: ${error.message}`);
    return;
  }
  loadCleanups();
});

// --- Section C: Update Announcement ---

async function loadAnnouncement() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return;

  document.getElementById('announcement-id').value = data.id;
  document.getElementById('announcement-active').checked = !!data.is_active;
  document.getElementById('announcement-title-en').value = data.title_en || '';
  document.getElementById('announcement-title-es').value = data.title_es || '';
  document.getElementById('announcement-title-fr').value = data.title_fr || '';
  document.getElementById('announcement-details-en').value = data.details_en || '';
  document.getElementById('announcement-details-es').value = data.details_es || '';
  document.getElementById('announcement-details-fr').value = data.details_fr || '';
  document.getElementById('announcement-meetup-time').value = data.meetup_time || '';
  document.getElementById('announcement-meeting-point').value = data.meeting_point || '';
}

announcementForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  announcementStatus.textContent = 'Saving...';

  const id = document.getElementById('announcement-id').value;
  const payload = {
    is_active: document.getElementById('announcement-active').checked,
    title_en: document.getElementById('announcement-title-en').value.trim(),
    title_es: document.getElementById('announcement-title-es').value.trim(),
    title_fr: document.getElementById('announcement-title-fr').value.trim(),
    details_en: document.getElementById('announcement-details-en').value.trim(),
    details_es: document.getElementById('announcement-details-es').value.trim(),
    details_fr: document.getElementById('announcement-details-fr').value.trim(),
    meetup_time: document.getElementById('announcement-meetup-time').value.trim() || null,
    meeting_point: document.getElementById('announcement-meeting-point').value.trim() || null,
  };

  const { error } = id
    ? await supabase.from('announcements').update(payload).eq('id', id)
    : await supabase.from('announcements').insert(payload);

  if (error) {
    announcementStatus.textContent = `Error: ${error.message}`;
    return;
  }

  announcementStatus.textContent = 'Announcement saved.';
  loadAnnouncement();
});

// --- Section D: Recent Volunteer Signups ---

async function loadSignups() {
  const { data, error } = await supabase
    .from('volunteer_signups')
    .select('*')
    .order('id', { ascending: false })
    .limit(10);

  if (error) {
    signupsTableBody.innerHTML = `<tr><td colspan="6">Error: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    signupsTableBody.innerHTML = '<tr><td colspan="6">No signups yet.</td></tr>';
    return;
  }

  signupsTableBody.innerHTML = data.map(row => `
    <tr>
      <td>${escapeHtml(row.full_name)}</td>
      <td>${escapeHtml(row.email)}</td>
      <td>${escapeHtml(row.whatsapp_number)}</td>
      <td>${escapeHtml(row.preferred_language)}</td>
      <td>${escapeHtml(row.planned_date)}</td>
      <td>${row.has_own_gloves ? 'Yes' : 'No'}</td>
    </tr>
  `).join('');
}

checkSession();
