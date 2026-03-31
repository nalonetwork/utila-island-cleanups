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

  const banner = document.querySelector('.header-banner');



  if (banner) {

    // Determine the height of your photo/banner

    const bannerHeight = banner.offsetHeight;

    

    // If we have scrolled further than the banner, add the sticky class

    if (window.scrollY > bannerHeight) { 

      header.classList.add('scrolled');

    } else {

      header.classList.remove('scrolled');

    }

  } else {

    // If there is no banner (internal pages), ensure it's always sticky

    header.classList.add('scrolled');

  }

});



document.addEventListener('DOMContentLoaded', function() {

  const menuToggle = document.getElementById('menu-toggle');

  const navLinks = document.getElementById('nav-links');



  if (menuToggle && navLinks) {

    menuToggle.addEventListener('click', function(e) {

      // Prevents the click from bubbling up

      e.stopPropagation(); 

      

      // Toggle the 'active' class on the menu

      navLinks.classList.toggle('active');

      

      // Optional: Toggle 'open' on the button for the X animation

      menuToggle.classList.toggle('open');

      

      console.log("Menu toggled!"); // Check your browser console (F12) to see if this prints

    });

  }

});



document.addEventListener('DOMContentLoaded', function() {

    const toggle = document.getElementById('menu-toggle');

    const nav = document.getElementById('nav-links');



    if (toggle && nav) {

        toggle.addEventListener('click', function() {

            nav.classList.toggle('active');

            toggle.classList.toggle('open');

        });

    }

});



document.addEventListener('DOMContentLoaded', function() {

  const header = document.querySelector('.site-header');

  const banner = document.querySelector('.header-banner');



  function handleScroll() {

    if (banner) {

      // Home Page Logic: Stick only after scrolling past the photo

      if (window.scrollY > (banner.offsetHeight - 50)) {

        header.classList.add('scrolled');

      } else {

        header.classList.remove('scrolled');

      }

    } else {

      // Internal Page Logic: Always keep it sticky

      header.classList.add('scrolled');

    }

  }



  // Run on scroll

  window.addEventListener('scroll', handleScroll);

  // Run once on load to catch internal pages

  handleScroll();

});
