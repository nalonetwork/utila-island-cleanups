import { supabase } from './supabase.js';

const form = document.getElementById('volunteer-form');
const statusEl = document.getElementById('volunteer-form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const payload = {
      full_name: document.getElementById('volunteer-name').value.trim(),
      email: document.getElementById('volunteer-email').value.trim(),
      whatsapp_number: document.getElementById('volunteer-whatsapp').value.trim() || null,
      preferred_language: document.getElementById('volunteer-language').value,
      planned_date: document.getElementById('volunteer-date').value || null,
      has_own_gloves: document.getElementById('volunteer-gloves').checked,
      notes: document.getElementById('volunteer-notes').value.trim() || null,
    };

    const { error } = await supabase.from('volunteer_signups').insert(payload);

    submitBtn.disabled = false;

    if (error) {
      statusEl.textContent = 'Something went wrong submitting your sign-up. Please try again or email us directly.';
      statusEl.classList.add('form-status-error');
      return;
    }

    statusEl.textContent = "Thanks for signing up! We'll see you at the next cleanup.";
    statusEl.classList.add('form-status-success');
    form.reset();
  });
}
