// Placeholder for LIVE data connection
// Replace with Google Sheets API later

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("bottles").innerText = "1,250";
  document.getElementById("weight").innerText = "320 kg / 705 lbs";
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  // Accessibility improvement
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !expanded);
});
