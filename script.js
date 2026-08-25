/* Fortitudo Studios Drama — site behaviour
   -------------------------------------------------------------------------
   1. Footer year
   2. Sticky header state
   3. Mobile navigation
   4. EmailJS enquiry + lead-magnet forms
   5. Stage spotlight follows pointer
   6. Scroll reveal
   -------------------------------------------------------------------------
*/

const EMAILJS = {
  PUBLIC_KEY: "N7BQYsyCGc0luSO4R",
  SERVICE_ID: "service_j5nb1ym",
  TEMPLATE_ID: "template_xbx0kfk"
};

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const header = document.querySelector("[data-header]");

const setHeaderState = () => {
  if (!header || header.classList.contains("solid")) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

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

const emailjsReady = () =>
  typeof window.emailjs !== "undefined" && typeof window.emailjs.send === "function";

if (emailjsReady()) {
  try {
    window.emailjs.init({ publicKey: EMAILJS.PUBLIC_KEY });
  } catch (err) {
    window.emailjs.init(EMAILJS.PUBLIC_KEY);
  }
}

const setStatus = (el, state, text) => {
  if (!el) return;
  el.dataset.state = state;
  el.textContent = text;
};

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

/* Stage spotlight follows pointer (desktop, motion OK) */
(() => {
  const stage = document.querySelector("[data-stage]");
  if (!stage) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduce || coarse) return;

  let raf = 0;
  const apply = (x) => {
    raf = 0;
    const clamped = Math.min(72, Math.max(28, x * 100));
    stage.style.setProperty("--spot-x", clamped + "%");
  };
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    if (!raf) raf = requestAnimationFrame(() => apply(x));
  }, { passive: true });
})();

/* Scroll reveal ----------------------------------------------------------- */
(() => {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    nodes.forEach((n) => n.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  nodes.forEach((n) => io.observe(n));
})();
