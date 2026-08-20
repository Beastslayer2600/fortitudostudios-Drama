/* Fortitudo Studios Drama — site behaviour
   -------------------------------------------------------------------------
   1. Footer year
   2. Sticky header state
   3. Mobile navigation (the nav was previously hidden entirely under 900px)
   4. EmailJS enquiry + lead-magnet forms
   ------------------------------------------------------------------------- */

/* --- CONFIG ---------------------------------------------------------------
   These are EmailJS *public* keys — safe to ship in client-side code.
   To route drama enquiries to their own template, create a new template in
   the EmailJS dashboard and change TEMPLATE_ID below. Nothing else changes.
   -------------------------------------------------------------------------- */
const EMAILJS = {
  PUBLIC_KEY: "N7BQYsyCGc0luSO4R",
  SERVICE_ID: "service_j5nb1ym",
  TEMPLATE_ID: "template_xbx0kfk"
};

/* 1. Footer year ---------------------------------------------------------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* 2. Sticky header -------------------------------------------------------- */
const header = document.querySelector("[data-header]");

const setHeaderState = () => {
  if (!header || header.classList.contains("solid")) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

/* 3. Mobile navigation ---------------------------------------------------- */
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (navToggle && siteNav) {
  const setNav = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
  };

  navToggle.addEventListener("click", () => {
    setNav(navToggle.getAttribute("aria-expanded") !== "true");
  });

  siteNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setNav(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setNav(false);
  });
}

/* 4. Forms ---------------------------------------------------------------- */
const emailjsReady = () =>
  typeof window.emailjs !== "undefined" && typeof window.emailjs.send === "function";

if (emailjsReady()) {
  try {
    window.emailjs.init({ publicKey: EMAILJS.PUBLIC_KEY });
  } catch (err) {
    window.emailjs.init(EMAILJS.PUBLIC_KEY); // older SDK signature
  }
}

const setStatus = (el, state, text) => {
  if (!el) return;
  el.dataset.state = state;
  el.textContent = text;
};

/* Build a single readable message body so the enquiry works with any
   EmailJS template that expects name / email / phone / message.          */
const composeMessage = (data) => {
  const lines = [];
  if (data.interest) lines.push("Interested in: " + data.interest);
  if (data.learner) lines.push("Learner name: " + data.learner);
  if (data.grade) lines.push("Grade / age: " + data.grade);
  if (data.deadline) lines.push("Deadline or event: " + data.deadline);
  if (data.format) lines.push("Preferred format: " + data.format);
  if (lines.length) lines.push("");
  lines.push(data.message || "");
  lines.push("");
  lines.push("— Sent from the Fortitudo Studios Drama website");
  return lines.join("\n");
};

document.querySelectorAll("[data-emailjs-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector("button[type=submit]");
  const buttonLabel = button ? button.textContent : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Honeypot: bots fill hidden fields, humans do not.
    if (form.querySelector("[name=company]") && form.querySelector("[name=company]").value) {
      setStatus(status, "success", "Thank you — your message has been sent.");
      return;
    }

    if (!emailjsReady()) {
      setStatus(
        status,
        "error",
        "The form could not load. Please WhatsApp or call 072 243 6950 instead."
      );
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }
    setStatus(status, "sending", "Sending your enquiry…");

    const params = {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      subject: form.dataset.subject || "Fortitudo Studios Drama enquiry",
      message: composeMessage(data)
    };

    try {
      await window.emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, params);
      form.reset();
      setStatus(
        status,
        "success",
        form.dataset.successMessage ||
          "Thank you — your enquiry has been sent. You will get a reply within one working day."
      );
      // Lead-magnet forms also reveal the download immediately, so the visitor
      // is never left waiting on an email that might land in spam.
      if (form.dataset.download && status) {
        const link = document.createElement("a");
        link.href = form.dataset.download;
        link.className = "button primary";
        link.setAttribute("download", "");
        link.style.marginTop = "12px";
        link.textContent = "Download it now";
        status.appendChild(document.createElement("br"));
        status.appendChild(link);
      }
    } catch (err) {
      console.error("EmailJS error", err);
      setStatus(
        status,
        "error",
        "Something went wrong sending that. Please WhatsApp 072 243 6950 or email gertjiefourie@icloud.com."
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = buttonLabel;
      }
    }
  });
});
