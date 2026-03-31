/**
 * Utila Island Cleanups - Site Logic
 * Combined & Organized Version
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Automatic Year Footer ---
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- 2. Language Initialization ---
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(savedLang);

    // --- 3. Hamburger Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents click from bubbling
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Close menu when clicking outside (Bonus Polish)
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        });
    }

    // --- 4. Scroll & Sticky Header Logic ---
    const header = document.querySelector('.site-header');
    const banner = document.querySelector('.header-banner');

    function handleScroll() {
        if (!header) return;

        if (banner) {
            // Home Page: Stick after scrolling past most of the banner
            const triggerPoint = banner.offsetHeight - 80; 
            if (window.scrollY > triggerPoint) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        } else {
            // Internal Pages: Always sticky
            header.classList.add('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load to set initial state
});

/**
 * Global Language Switcher
 * Can be called from HTML buttons
 */
function setLanguage(lang) {
    // Update HTML attribute
    document.documentElement.setAttribute('lang', lang);
    
    // Update UI buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-${lang}`);
    });
    
    // Save preference
    localStorage.setItem('preferredLang', lang);

    // Optional: Update input placeholders if they exist
    document.querySelectorAll('[data-en]').forEach(el => {
        el.placeholder = el.getAttribute(`data-${lang}`);
    });
}


