/**
 * Utila Island Cleanups - Unified Site Logic
 */

// 1. Language Function (Must be global so the HTML buttons can see it)
function setLanguage(lang) {
    // Force the HTML attribute (This triggers the CSS hiding logic)
    document.documentElement.setAttribute('lang', lang);
    
    // Update Button UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-${lang}`);
    });
    
    // Save to browser memory
    localStorage.setItem('preferredLang', lang);
    console.log("Language set to: " + lang);
}

// 2. All Page-Load Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initial Language Load ---
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(savedLang);

    // --- Automatic Footer Year ---
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Auto-close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
    }

    // --- Sticky Header Logic ---
    const header = document.querySelector('.site-header');
    const banner = document.querySelector('.header-banner');

    function handleScroll() {
        if (!header) return;
        // If there's a banner (Home), stick after 100px. Otherwise, always stick.
        if (banner) {
            window.scrollY > 100 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check once on load
});
