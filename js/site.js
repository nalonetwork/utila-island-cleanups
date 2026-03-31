
/**
 * Utila Island Cleanups - Master Script
 */

// 1. Language Switching Function (Must be global for HTML buttons to see it)
function setLanguage(lang) {
    // Update the <html> tag (This triggers the CSS hiding logic)
    document.documentElement.setAttribute('lang', lang);
    
    // Update the Toggle Buttons UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-${lang}`);
    });
    
    // Save choice for next time
    localStorage.setItem('preferredLang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initialize Language ---
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(savedLang);

    // --- Footer Year ---
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Hamburger Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
    }

    // --- Sticky Header Scroll Logic ---
    const header = document.querySelector('.site-header');
    const banner = document.querySelector('.header-banner');

    function handleScroll() {
        if (!header) return;
        // On pages with a banner, stick after 100px. On others, always stick.
        if (banner) {
            window.scrollY > 100 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
});
