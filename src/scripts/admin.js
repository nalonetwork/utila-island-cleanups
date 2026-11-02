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

function formatStatNumber(value) {
  if (value == null) return '--';
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 1 });
}

const loginSection = document.getElementById('admin-login');
const dashboardSection = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const cleanupForm = document.getElementById('cleanup-form');
const cleanupFormStatus = document.getElementById('cleanup-form-status');
const cleanupsTableBody = document.getElementById('cleanups-table-body');

const signupsTableBody = document.getElementById('signups-table-body');

const attendanceCleanupSelect = document.getElementById('attendance-cleanup-select');
const rosterTableBody = document.getElementById('roster-table-body');
const walkinForm = document.getElementById('walkin-form');
const walkinFormStatus = document.getElementById('walkin-form-status');

let selectedCleanupId = null;
let currentRosterSignupIds = new Set();

const adminTabs = document.querySelectorAll('.admin-tab');
const adminPanels = document.querySelectorAll('.admin-tab-panel');

function setActiveTab(tabName) {
  adminTabs.forEach(tab => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  adminPanels.forEach(panel => {
    panel.hidden = panel.dataset.panel !== tabName;
  });
  try {
    localStorage.setItem('admin-active-tab', tabName);
  } catch {
    // ignore storage errors (e.g. private browsing)
  }
}

adminTabs.forEach(tab => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
});

function restoreActiveTab() {
  let savedTab = null;
  try {
    savedTab = localStorage.getItem('admin-active-tab');
  } catch {
    // ignore storage errors (e.g. private browsing)
  }
  if (savedTab && document.querySelector(`.admin-tab[data-tab="${savedTab}"]`)) {
    setActiveTab(savedTab);
  }
}

function showDashboard() {
  loginSection.hidden = true;
  dashboardSection.hidden = false;
  restoreActiveTab();
  loadCleanups();
  loadCleanupOptions();
  loadSignups();
  loadImpactSummary();
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

// --- Live Impact Summary ---

async function loadImpactSummary() {
  const { data, error } = await supabase.from('cleanup_totals').select('*').maybeSingle();

  if (error) {
    console.error('Error loading impact summary:', error.message);
    return;
  }
  if (!data) return;

  document.getElementById('admin-stat-bottles').textContent = formatStatNumber(data.total_bottles);
  document.getElementById('admin-stat-weight-kg').textContent = formatStatNumber(data.total_weight_kg);
  document.getElementById('admin-stat-weight-lbs').textContent = formatStatNumber(data.total_weight_lbs);
  document.getElementById('admin-stat-cleanups').textContent = formatStatNumber(data.total_events);
}

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
  loadCleanupOptions();
  loadImpactSummary();
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
      <td><span class="badge badge-date">${escapeHtml(row.event_date)}</span></td>
      <td><span class="badge badge-location">${escapeHtml(row.location_name)}</span></td>
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
  if (String(selectedCleanupId) === String(btn.dataset.id)) {
    selectedCleanupId = null;
  }
  loadCleanups();
  loadCleanupOptions();
  loadImpactSummary();
});

// --- Section C: Volunteer Attendance ---

async function loadCleanupOptions() {
  const previouslySelected = selectedCleanupId;

  const { data, error } = await supabase
    .from('cleanups')
    .select('id, event_date, location_name')
    .order('event_date', { ascending: false });

  if (error) {
    attendanceCleanupSelect.innerHTML = `<option value="">Error: ${escapeHtml(error.message)}</option>`;
    return;
  }

  if (!data || data.length === 0) {
    attendanceCleanupSelect.innerHTML = '<option value="">No cleanups logged yet</option>';
    selectedCleanupId = null;
    loadRoster();
    return;
  }

  attendanceCleanupSelect.innerHTML = `<option value="">Select a cleanup...</option>` + data.map(row => `
    <option value="${escapeHtml(row.id)}">${escapeHtml(row.event_date)} — ${escapeHtml(row.location_name)}</option>
  `).join('');

  if (previouslySelected && data.some(row => String(row.id) === String(previouslySelected))) {
    attendanceCleanupSelect.value = String(previouslySelected);
  } else {
    selectedCleanupId = null;
  }

  loadRoster();
}

attendanceCleanupSelect.addEventListener('change', () => {
  selectedCleanupId = attendanceCleanupSelect.value || null;
  loadRoster();
});

async function loadRoster() {
  if (!selectedCleanupId) {
    currentRosterSignupIds = new Set();
    rosterTableBody.innerHTML = '<tr><td colspan="4">Select a cleanup above to view its roster.</td></tr>';
    renderSignupsCheckinState();
    return;
  }

  const { data, error } = await supabase
    .from('cleanup_attendees')
    .select('*')
    .eq('cleanup_id', selectedCleanupId)
    .order('full_name', { ascending: true });

  if (error) {
    rosterTableBody.innerHTML = `<tr><td colspan="4">Error: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  currentRosterSignupIds = new Set(
    (data || []).filter(row => row.signup_id != null).map(row => String(row.signup_id))
  );
  renderSignupsCheckinState();

  if (!data || data.length === 0) {
    rosterTableBody.innerHTML = '<tr><td colspan="4">No attendees logged for this cleanup yet.</td></tr>';
    return;
  }

  rosterTableBody.innerHTML = data.map(row => `
    <tr>
      <td>${escapeHtml(row.full_name)}</td>
      <td>${escapeHtml(row.email)}${row.email && row.whatsapp_number ? ' / ' : ''}${escapeHtml(row.whatsapp_number)}</td>
      <td><input type="checkbox" class="attendance-toggle" data-id="${escapeHtml(row.id)}" ${row.attended ? 'checked' : ''}></td>
      <td>${escapeHtml(row.notes)}</td>
    </tr>
  `).join('');
}

rosterTableBody.addEventListener('change', async (e) => {
  const toggle = e.target.closest('.attendance-toggle');
  if (!toggle) return;

  const { error } = await supabase
    .from('cleanup_attendees')
    .update({ attended: toggle.checked })
    .eq('id', toggle.dataset.id);

  if (error) {
    window.alert(`Error updating attendance: ${error.message}`);
    toggle.checked = !toggle.checked;
    return;
  }

  refreshVolunteersCount(selectedCleanupId);
});

walkinForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!selectedCleanupId) {
    walkinFormStatus.textContent = 'Select a cleanup above first.';
    return;
  }

  walkinFormStatus.textContent = 'Saving...';

  const payload = {
    cleanup_id: selectedCleanupId,
    full_name: document.getElementById('walkin-name').value.trim(),
    email: document.getElementById('walkin-email').value.trim() || null,
    whatsapp_number: document.getElementById('walkin-whatsapp').value.trim() || null,
    notes: document.getElementById('walkin-notes').value.trim() || null,
    attended: true,
  };

  const { error } = await supabase.from('cleanup_attendees').insert(payload);

  if (error) {
    walkinFormStatus.textContent = `Error: ${error.message}`;
    return;
  }

  walkinFormStatus.textContent = 'Walk-in added.';
  walkinForm.reset();
  loadRoster();
  refreshVolunteersCount(selectedCleanupId);
});

async function refreshVolunteersCount(cleanupId) {
  if (!cleanupId) return;

  const { count, error: countError } = await supabase
    .from('cleanup_attendees')
    .select('id', { count: 'exact', head: true })
    .eq('cleanup_id', cleanupId)
    .eq('attended', true);

  if (countError) return;

  await supabase.from('cleanups').update({ volunteers_count: count }).eq('id', cleanupId);
  loadCleanups();
}

// --- Section D: Registered Signups ---

let latestSignups = [];

async function loadSignups() {
  const { data, error } = await supabase
    .from('volunteer_signups')
    .select('*')
    .order('id', { ascending: false })
    .limit(10);

  if (error) {
    signupsTableBody.innerHTML = `<tr><td colspan="8">Error: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  latestSignups = data || [];

  if (latestSignups.length === 0) {
    signupsTableBody.innerHTML = '<tr><td colspan="8">No signups yet.</td></tr>';
    return;
  }

  signupsTableBody.innerHTML = latestSignups.map(row => `
    <tr>
      <td>${escapeHtml(row.full_name)}</td>
      <td>${escapeHtml(row.email)}</td>
      <td>${escapeHtml(row.whatsapp_number)}</td>
      <td>${escapeHtml(row.preferred_language)}</td>
      <td><span class="badge badge-date">${escapeHtml(row.planned_date)}</span></td>
      <td>${row.has_own_gloves ? 'Has gloves' : 'Needs gloves'}</td>
      <td>${escapeHtml(row.notes)}</td>
      <td><button class="btn-checkin" type="button" data-signup-id="${escapeHtml(row.id)}">Check In to Selected Cleanup</button></td>
    </tr>
  `).join('');

  renderSignupsCheckinState();
}

function renderSignupsCheckinState() {
  signupsTableBody.querySelectorAll('.btn-checkin').forEach(btn => {
    const alreadyIn = currentRosterSignupIds.has(String(btn.dataset.signupId));
    btn.disabled = !selectedCleanupId || alreadyIn;
    btn.textContent = alreadyIn ? 'Checked In' : 'Check In to Selected Cleanup';
  });
}

signupsTableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-checkin');
  if (!btn) return;

  if (!selectedCleanupId) {
    window.alert('Select a cleanup in the Volunteer Attendance tab first.');
    return;
  }

  const signup = latestSignups.find(row => String(row.id) === String(btn.dataset.signupId));
  if (!signup) return;

  btn.disabled = true;

  const { error } = await supabase.from('cleanup_attendees').insert({
    cleanup_id: selectedCleanupId,
    signup_id: signup.id,
    full_name: signup.full_name,
    email: signup.email,
    whatsapp_number: signup.whatsapp_number,
    attended: true,
  });

  if (error) {
    window.alert(`Error checking in: ${error.message}`);
    btn.disabled = false;
    return;
  }

  loadRoster();
  refreshVolunteersCount(selectedCleanupId);
});

checkSession();
