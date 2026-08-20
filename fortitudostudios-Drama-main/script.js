const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  if (!header) return;
  if (!header.classList.contains("solid")) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
const EMAILJS = {
  PUBLIC_KEY: "N7BQYsyCGc0luSO4R",
  SERVICE_ID: "service_j5nb1ym",
  TEMPLATE_ID: "template_xbx0kfk"   // ← replace with the drama template ID
};
