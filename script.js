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
