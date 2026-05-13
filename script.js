/**
 * UIC WEBSITE CORE JAVASCRIPT
 * Optimized for: Navigation, Language Toggle (Text & Images), Live Data, and Gallery
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE NAVIGATION LOGIC ---
    const hamburger = document.getElementById('hamburger') || document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('is-active'); 
        });

        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('is-active');
            });
        });
    }

    // --- 2. LANGUAGE TOGGLE LOGIC ---
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('preferredLang') || 'en';

    // This is the SINGLE master function for changing language
    window.updateContent = function(lang) {
        // A. Update all text elements
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                el.innerText = translation;
            }
        });

        // B. Update the Impact Summary Image (The fix you needed!)
        const impactImg = document.getElementById('impact-summary-img');
        if (impactImg) {
            const newSrc = impactImg.getAttribute(`data-img-${lang}`);
            if (newSrc) {
                impactImg.src = newSrc;
                console.log("Swapped impact image to:", newSrc);
            }
        }

        // C. Update the button text (Shows the opposite language)
        if (langToggle) {
            langToggle.innerText = lang === 'en' ? 'ES' : 'EN';
        }
        document.documentElement.lang = lang;
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = (currentLang === 'en') ? 'es' : 'en';
            localStorage.setItem('preferredLang', currentLang);
            window.updateContent(currentLang);
        });
    }

    // Run language check on load
    window.updateContent(currentLang);

    // --- 3. LIVE DATA FETCH TRIGGER ---
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

function runCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // Animation smoothness

    counters.forEach(counter => {
        const updateCount = () => {
            // Since you switched to whole numbers, we use Math.ceil for clean steps
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const count = parseInt(counter.innerText.replace(/,/g, '')) || 0;
            const increment = target / speed;

            if (count < target) {
                const nextVal = Math.ceil(count + increment);
                // .toLocaleString() adds the commas (e.g. 13,318)
                counter.innerText = nextVal.toLocaleString();
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };

        // Reset display to 0 before starting animation
        counter.innerText = "0";
        updateCount();
    });
}

// --- 4. GALLERY SLIDER LOGIC ---
let sliderStates = {};
function moveSlider(sliderId, direction) {
    if (!sliderStates[sliderId]) sliderStates[sliderId] = 0;
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const track = slider.querySelector('.slider-track');
    const slides = track.querySelectorAll('.slide');
    sliderStates[sliderId] += direction;
    if (sliderStates[sliderId] >= slides.length) sliderStates[sliderId] = 0;
    else if (sliderStates[sliderId] < 0) sliderStates[sliderId] = slides.length - 1;
    track.style.transform = `translateX(${sliderStates[sliderId] * -100}%)`;
}
