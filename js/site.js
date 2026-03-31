
/**
 * Utila Island Cleanups - Master Script
 */
function setLanguage(lang) {
    // 1. Set the attribute on the HTML tag (Primary)
    document.documentElement.setAttribute('lang', lang);
    
    // 2. Set a class on the Body (Backup)
    document.body.className = 'lang-' + lang;
    
    console.log("Switching to: " + lang);

    // 3. Update the buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) activeBtn.classList.add('active');

    localStorage.setItem('preferredLang', lang);
}
// Ensure it runs the moment the page is ready
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(savedLang);
});
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
