// Isaac Karicho portfolio interactions

// ---------- Theme (dark / light) ----------
// The inline script in <head> sets the first theme before the page paints.
// This code handles the toggle button and remembers the visitor's choice.
const THEME_KEY = "theme";
const THEME_COLORS = { dark: "#0a0d0b", light: "#f6f8f4" }; // browser UI colour on mobile
const themeToggle = document.querySelector(".theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const systemLightQuery = window.matchMedia("(prefers-color-scheme: light)");

function getSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null; // storage can be blocked (private mode, strict settings)
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Not fatal: the theme still switches, it just won't be remembered.
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeColorMeta) themeColorMeta.setAttribute("content", THEME_COLORS[theme]);
  const next = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
  themeToggle.setAttribute("title", `Switch to ${next} theme`);
}

applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  saveTheme(next);
});

// If the visitor never picked a theme, follow their device setting live.
if (systemLightQuery.addEventListener) {
  systemLightQuery.addEventListener("change", (event) => {
    if (!getSavedTheme()) applyTheme(event.matches ? "light" : "dark");
  });
}

// ---------- Navigation ----------
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  document.body.classList.toggle("menu-open", isOpen);
});

navItems.forEach((item) => item.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    closeMenu();
    menuToggle.focus();
  }
});

// Tapping the empty area of the open menu also closes it.
navLinks.addEventListener("click", (event) => {
  if (event.target === navLinks) closeMenu();
});

document.querySelector("#year").textContent = new Date().getFullYear();

// Reveal content as it enters the viewport; respect reduced-motion settings.
const revealTargets = document.querySelectorAll(
  ".section-heading, .about-grid, .skills-layout, .project-card, .process-item, .contact-panel"
);
revealTargets.forEach((element) => element.classList.add("reveal"));

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("visible"));
}

// Copy email address with a fallback for browsers that block clipboard access.
const toast = document.querySelector(".toast");
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

document.querySelector(".copy-email").addEventListener("click", async (event) => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email address copied.");
  } catch {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = email;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "absolute";
    temporaryInput.style.left = "-9999px";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand("copy");
    temporaryInput.remove();
    showToast(copied ? "Email address copied." : `Email: ${email}`);
  }
});

// Keep the menu usable if the viewport changes from mobile to desktop.
window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeMenu();
});

// ---------- Contact form ----------
// Messages are delivered through Formspree (formspree.io). Submissions appear in your
// Formspree dashboard and are emailed to the address on your Formspree account.
// Set this to "" to fall back to opening the visitor's own email app instead.
const FORM_ENDPOINT = "https://formspree.io/f/mwlllbag";
const CONTACT_EMAIL = "isaackaricho@gmail.com";

const contactForm = document.querySelector("#contact-form");
const formStatus = contactForm.querySelector(".form-status");
const submitButton = contactForm.querySelector('button[type="submit"]');
const submitLabel = submitButton.innerHTML;
const messageCount = document.querySelector("#cf-message-count");

const MESSAGE_MAX = 1000;
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// One validator per field. Each returns an error message, or "" when the value is fine.
const validators = {
  name(value) {
    if (!value) return "Please enter your name.";
    if (value.length < 2) return "Your name should be at least 2 characters.";
    if (value.length > 80) return "Your name is too long (80 characters max).";
    if (!/\p{L}/u.test(value)) return "Please enter a valid name.";
    return "";
  },
  email(value) {
    if (!value) return "Please enter your email address.";
    if (value.length > 254 || !EMAIL_PATTERN.test(value)) {
      return "Please enter a valid email address, like name@example.com.";
    }
    return "";
  },
  subject(value) {
    if (!value) return "Please add a subject.";
    if (value.length < 3) return "The subject should be at least 3 characters.";
    if (value.length > 100) return "The subject is too long (100 characters max).";
    return "";
  },
  message(value) {
    if (!value) return "Please write a message.";
    if (value.length < 10) return "Your message is a bit short. Please write at least 10 characters.";
    if (value.length > MESSAGE_MAX) return `Your message is too long (${MESSAGE_MAX} characters max).`;
    return "";
  },
};
const fieldNames = Object.keys(validators);

function setFieldError(name, message) {
  const field = contactForm.elements[name];
  document.getElementById(`cf-${name}-error`).textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(name) {
  const message = validators[name](contactForm.elements[name].value.trim());
  setFieldError(name, message);
  return message === "";
}

function setFormStatus(message, state = "") {
  formStatus.textContent = message;
  if (state) formStatus.dataset.state = state;
  else delete formStatus.dataset.state;
}

function updateMessageCount() {
  messageCount.textContent = `${contactForm.elements.message.value.length} / ${MESSAGE_MAX}`;
}

fieldNames.forEach((name) => {
  const field = contactForm.elements[name];
  // Check a field when the visitor leaves it...
  field.addEventListener("blur", () => validateField(name));
  // ...and re-check while typing, but only once it has already shown an error.
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(name);
  });
});
contactForm.elements.message.addEventListener("input", updateMessageCount);

function sendWithEmailApp({ name, email, subject, message }) {
  const body = `${message}\n\n-- \n${name}\n${email}`;
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function sendWithEndpoint(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...data,
      _subject: `Portfolio message: ${data.subject}`, // subject line of the email you receive
    }),
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  // Formspree answers { ok: true } on success, or { errors: [...] } when it rejects a message.
  const result = await response.json().catch(() => ({}));
  if (result.ok === false || (Array.isArray(result.errors) && result.errors.length)) {
    throw new Error("The form service rejected the message.");
  }
}

function resetForm() {
  contactForm.reset();
  fieldNames.forEach((name) => setFieldError(name, ""));
  updateMessageCount();
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormStatus("");

  const results = fieldNames.map((name) => [name, validateField(name)]);
  const firstInvalid = results.find(([, isValid]) => !isValid);
  if (firstInvalid) {
    contactForm.elements[firstInvalid[0]].focus();
    setFormStatus("Please fix the highlighted fields and try again.", "error");
    return;
  }

  const data = {
    name: contactForm.elements.name.value.trim(),
    email: contactForm.elements.email.value.trim(),
    subject: contactForm.elements.subject.value.trim(),
    message: contactForm.elements.message.value.trim(),
  };
  const firstName = data.name.split(/\s+/)[0];

  // Hidden spam-trap field filled in => a bot. Pretend it worked, send nothing.
  if (contactForm.elements._gotcha.value) {
    resetForm();
    setFormStatus(`Thanks, ${firstName}! Your message was sent.`, "success");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";

  try {
    if (FORM_ENDPOINT) {
      await sendWithEndpoint(data);
      resetForm();
      setFormStatus(`Thanks, ${firstName}! Your message was sent. I'll get back to you soon.`, "success");
      showToast("Message sent.");
    } else {
      sendWithEmailApp(data);
      setFormStatus("Your email app should open with the message ready to send.", "success");
    }
  } catch {
    setFormStatus(`Sorry, that didn't go through. Please email me directly at ${CONTACT_EMAIL}.`, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = submitLabel;
  }
});

// ---------- WhatsApp ----------
// Put your number in international format (country code first, digits only).
// Kenya example: 254712345678. A number starting with 0 (0712345678) also works.
// Until a valid number is set, the WhatsApp buttons stay hidden.
const WHATSAPP_NUMBER = "0740845513";
const WHATSAPP_MESSAGE = "Hi Isaac, I found your portfolio and I'd like to talk.";

function buildWhatsAppLink(rawNumber, message) {
  let digits = String(rawNumber).replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `254${digits.slice(1)}`; // local Kenyan format
  if (digits.length < 11 || digits.length > 15) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const whatsappLink = buildWhatsAppLink(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
if (whatsappLink) document.body.classList.add("has-whatsapp"); // gives the footer room
document.querySelectorAll("[data-whatsapp]").forEach((element) => {
  if (whatsappLink) {
    element.href = whatsappLink;
    element.hidden = false;
  }
});
