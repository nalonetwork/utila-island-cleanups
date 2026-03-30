document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

function setLanguage(lang) {
  // Update the HTML tag
  document.documentElement.setAttribute('lang', lang);
  
  // Update button UI
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-${lang}`);
  if(activeBtn) activeBtn.classList.add('active');
  
  // Save to browser memory
  localStorage.setItem('preferredLang', lang);
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLang') || 'en';
  setLanguage(savedLang);
  
  // Bonus: Automatic Year Footer
  const yearSpan = document.getElementById('year');
  if(yearSpan) yearSpan.textContent = new Date().getFullYear();
});

window.addEventListener('scroll', function() {
  const header = document.querySelector('.site-header');
  const bannerHeight = document.querySelector('.header-banner').offsetHeight;

  // Add the 'scrolled' class once we pass the banner height
  if (window.scrollY > (bannerHeight - 80)) { 
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
