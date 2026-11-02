/**
 * UIC WEBSITE CORE JAVASCRIPT
 * Organized for: Navigation, Language, Live Data, and Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE NAVIGATION LOGIC ---
    // This handles both the "hamburger" and "menu-toggle" classes to ensure it works on all pages
    const hamburger = document.getElementById('hamburger') || document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('is-active'); // Triggers the 'X' animation
        });

        // Close menu automatically when any link inside is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('is-active');
            });
        });
    }

    // --- 2. LANGUAGE TOGGLE LOGIC ---
    const SUPPORTED_LANGS = ['en', 'es', 'fr'];
    const langOptions = document.querySelectorAll('.lang-option');
    let currentLang = localStorage.getItem('preferredLang') || 'en';
    if (!SUPPORTED_LANGS.includes(currentLang)) {
        currentLang = 'en';
    }

    function updateContent(lang) {
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                el.innerText = translation;
            }
        });

        langOptions.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        document.documentElement.lang = lang;
    }

    langOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) return;
            currentLang = lang;
            localStorage.setItem('preferredLang', currentLang);
            updateContent(currentLang);
        });
    });

    // Apply the saved/detected language on load
    updateContent(currentLang);

    // --- 3. LIVE DATA FETCH (SHEETY) ---
    // Only runs if counter elements exist on the current page
    if (document.querySelector('.counter')) {
        fetchImpactData();
    }
});

// --- LIVE DATA FUNCTIONS ---

async function fetchImpactData() {
    const url = 'https://api.sheety.co/32127990cba796d619a30aeb84fbf2ab/impactData/sheet1';

    try {
        const response = await fetch(url);
        const json = await response.json();
        const liveData = json.sheet1[0]; 
        
        console.log("Sheety Data Received:", liveData); 

        const bottles = document.getElementById('count-bottles');
        const weightKg = document.getElementById('count-weight-kg');
        const weightLbs = document.getElementById('count-weight-lbs');
        const cleanups = document.getElementById('count-cleanups');

        // Update data-target attributes for the animation
        if (bottles) bottles.setAttribute('data-target', liveData.bottles || 0);
        if (weightKg) weightKg.setAttribute('data-target', liveData.weightkg || liveData.weightKg || 0);
        if (weightLbs) weightLbs.setAttribute('data-target', liveData.weightlbs || liveData.weightLbs || 0);
        if (cleanups) cleanups.setAttribute('data-target', liveData.cleanups || 0);

        initCounters();
    } catch (error) {
        console.error('Error connecting to Sheety:', error);
        initCounters(); // Run anyway to show 0s instead of blank
    }
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100; 

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target') || 0;
            const count = +counter.innerText.replace(/,/g, ''); 
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc).toLocaleString();
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });
}

// --- 4. GALLERY SLIDER LOGIC ---
// Kept outside DOMContentLoaded so HTML buttons can find the function
let sliderStates = {};

function moveSlider(sliderId, direction) {
    if (!sliderStates[sliderId]) {
        sliderStates[sliderId] = 0;
    }

    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const track = slider.querySelector('.slider-track');
    const slides = track.querySelectorAll('.slide');
    const totalSlides = slides.length;

    sliderStates[sliderId] += direction;

    if (sliderStates[sliderId] >= totalSlides) {
        sliderStates[sliderId] = 0;
    } else if (sliderStates[sliderId] < 0) {
        sliderStates[sliderId] = totalSlides - 1;
    }

    const offset = sliderStates[sliderId] * -100;
    track.style.transform = `translateX(${offset}%)`;
}
