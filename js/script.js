// Placeholder for LIVE data connection
// Replace with Google Sheets API later

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("bottles").innerText = "1,250";
  document.getElementById("weight").innerText = "320 kg / 705 lbs";
});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});
