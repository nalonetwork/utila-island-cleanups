const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const langToggle = document.getElementById('lang-toggle');
const links = document.querySelectorAll('.nav-links li a');

// --- Mobile Navigation Logic ---
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- Simple Language Toggle Logic ---

// We start assuming the page is in its natural state (English)
let currentLang = localStorage.getItem('preferredLang') || 'en';

function updateContent(lang) {
    const elements = document.querySelectorAll('[data-en]');
    
    elements.forEach(el => {
        // Get the specific translation from the data attribute
        const translation = el.getAttribute(`data-${lang}`);
        if (translation) {
            el.innerText = translation;
        }
    });

    // Update the button to show the NEXT available option
    langToggle.innerText = lang === 'en' ? 'ES' : 'EN';
    document.documentElement.lang = lang;
}

// Event Listener for the Toggle Button
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = (currentLang === 'en') ? 'es' : 'en';
        localStorage.setItem('preferredLang', currentLang);
        updateContent(currentLang);
    });
}

// On Page Load: ONLY run if the user previously chose Spanish.
// If it's English, we do nothing so the hardcoded HTML shows up perfectly.
window.addEventListener('DOMContentLoaded', () => {
    if (currentLang === 'es') {
        updateContent('es');
    } else {
        langToggle.innerText = 'ES';
    }
});
// --- Gallery Slider Logic ---
let sliderStates = {};

function moveSlider(sliderId, direction) {
    // Initialize state for this specific slider if it doesn't exist
    if (!sliderStates[sliderId]) {
        sliderStates[sliderId] = 0;
    }

    const slider = document.getElementById(sliderId);
    const track = slider.querySelector('.slider-track');
    const slides = track.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Update current index
    sliderStates[sliderId] += direction;

    // Loop back logic
    if (sliderStates[sliderId] >= totalSlides) {
        sliderStates[sliderId] = 0;
    } else if (sliderStates[sliderId] < 0) {
        sliderStates[sliderId] = totalSlides - 1;
    }

    // Move the track
    const offset = sliderStates[sliderId] * -100;
    track.style.transform = `translateX(${offset}%)`;
}
// --- Live Data Fetch from Sheety (utilaislandcleanups.org) ---

async function fetchImpactData() {
    const url = 'https://api.sheety.co/32127990cba796d619a30aeb84fbf2ab/impactData/sheet1';

    try {
        const response = await fetch(url);
        const json = await response.json();
        
        // --- DEBUGGING STEP ---
        // Right-click your website, click "Inspect", then "Console" to see this!
        console.log("Sheety Data Received:", json.sheet1[0]); 
        
        const liveData = json.sheet1[0]; 

        const bottles = document.getElementById('count-bottles');
        const weightKg = document.getElementById('count-weight-kg');
        const weightLbs = document.getElementById('count-weight-lbs');
        const cleanups = document.getElementById('count-cleanups');

        // We use || 0 to ensure that even if a field is empty, the animation runs
        bottles.setAttribute('data-target', liveData.bottles || 0);
        
        // Try these common naming variations Sheety generates:
        weightKg.setAttribute('data-target', liveData.weightkg || liveData.weightKg || 0);
        weightLbs.setAttribute('data-target', liveData.weightlbs || liveData.weightLbs || 0);
        cleanups.setAttribute('data-target', liveData.cleanups || 0);

        initCounters();
    } catch (error) {
        console.error('Error connecting to Sheety:', error);
        initCounters();
    }
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100; 

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace(/,/g, ''); // Remove commas to calculate
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', fetchImpactData);
