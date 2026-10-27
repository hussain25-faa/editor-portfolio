/* ============================================================
   FRAME / CUT — EDIT YOUR PORTFOLIO HERE
   1) Videos go in assets/videos/, posters in assets/images/
   2) Add or remove reels in PROJECTS
   3) Change services in SERVICES
   4) Change prices in PRICING
   5) Change email, Instagram, WhatsApp and text in SITE
   ============================================================ */

const SITE = {
  name: "FRAME / CUT",
  email: "hello@example.com",
  instagram: "https://www.instagram.com/black_burry_dom?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==",
  whatsapp: "916383795315", // country code + number, digits only, no +
  hero: {
    eyebrow: "Warp Drive Sequence",
    title: ["MADE TO", "MAKE YOU", "LOOK."],
    subtitle: "Scroll or swipe to fly through the reels.",
  },
  about: {
    text: "I'm a video editor working with creators and brands to turn raw footage into sharp, intentional stories. I care about the tiny details: the beat before the reveal, the cut that lands perfectly, the color that makes a feeling stick.",
  },
  contact: {
    title: ["GOT FOOTAGE?", "LET'S MAKE", "IT HIT."],
    text: "Tell me what you're building. I'll bring the right cuts to the table.",
  },
};

// category must be: "reels" | "ads" | "brand"
const PROJECTS = [
  { title: "cheap @ best",      type: "Footwear Reel",      category: "reels", year: "2026", poster: "assests/images/foot.png",  video: "assests/videos/footwear.mp4" },
  { title: "suriya cafe",       type: "Lifestyle Reel",     category: "reels",   year: "2026", poster: "assests/images/tea.png", video: "assests/videos/teashop.mp4" },
  { title: "divora jewellery",  type: "Product Promotion",    category: "reels", year: "2026", poster: "assests/images/dicora.png",     video: "assests/videos/divora.mp4" },
  { title: "editing time",  type: "video editing",        category: "brand", year: "2025", poster: "assests/images/Screenshot 2026-10-27 212128.png",    video: "assests/videos/imthi.mp4" },
  { title: "personal edit",    type: "bike edit",       category: "reels", year: "2025", poster: "assests/images/Screenshot 2026-10-27 212228.png",   video: "assests/videos/bike.mp4" },
  { title: "cheap @ best",          type: "footwear",     category: "ads",   year: "2025", poster: "assests/images/Screenshot 2026-10-27 212301.png",      video: "assests/videos/foot.mp4" },
];
const BUDGETS = [
  "Under ₹5,000",
  "₹5,000 – ₹15,000",
  "₹15,000 – ₹40,000",
  "₹40,000+",
  "Not sure yet",
];
const FILTERS = [
  { id: "all",   label: "All work" },
  { id: "reels", label: "Reels" },
  { id: "ads",   label: "Promotions" },
  { id: "brand", label: "Brand films" },
];

const SERVICES = [
  { title: "Reels & Shorts",           text: "Fast-paced edits, subtitles, sound design and platform-ready vertical cuts." },
  { title: "Promotional Videos",       text: "Product launches, offers and campaign films designed to make people act." },
  { title: "YouTube & Creator Edits",  text: "Clean storytelling, pacing, motion graphics and retention-minded structure." },
  { title: "Color & Finishing",        text: "Consistent color, polished audio, tasteful transitions and final delivery." },
];

// Example starting prices in INR. Change these to your real rates.
const PRICING = [
  { type: "STARTER / ONE-OFF", name: "Reel Edit", price: "₹1,499", unit: "/ reel",
    description: "For creators and small businesses testing a new idea.",
    features: ["One vertical video up to 60 sec", "Basic color + sound polish", "Subtitles / simple text", "2 revision rounds"], featured: false },
  { type: "MOST REQUESTED", name: "Creator Pack", price: "₹5,999", unit: "/ 5 reels",
    description: "A consistent batch of short-form content.",
    features: ["5 vertical edits up to 60 sec each", "Captions + sound design", "Consistent visual style", "2 revision rounds per batch"], featured: true },
  { type: "BUSINESS / CAMPAIGN", name: "Promo Film", price: "₹7,999", unit: "/ project",
    description: "For a product, service or campaign that needs a stronger story.",
    features: ["One promo up to 90 sec", "Color grading + sound mix", "Motion titles / CTA", "Delivery in social formats"], featured: false },
];

/* ---------------- Helpers ---------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Piecewise-linear interpolation, like framer-motion's useTransform
function mapRange(v, input, output) {
  if (v <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const t = (v - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + (output[i] - output[i - 1]) * t;
    }
  }
  return output[output.length - 1];
}

function buildWhatsAppUrl(message = "Hi! I'd like to discuss a video editing project.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

// Missing images hide themselves and show a styled fallback
function handleImageError(e) {
  if (e.target.tagName !== "IMG") return;
  e.target.style.display = "none";
  e.target.parentElement?.classList.add("no-img");
}

/* ---------------- Rendering ---------------- */
function renderHero() {
  $("#heroEyebrow").textContent = SITE.hero.eyebrow;
  $("#heroTitle").innerHTML = SITE.hero.title.map((line) => `<span>${esc(line)}</span>`).join("");
  $("#heroSub").textContent = SITE.hero.subtitle;
}

function renderFilters(active = "all") {
  $("#filterRow").innerHTML = FILTERS.map((f) => {
    const count = f.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f.id).length;
    return `<button class="filter-btn${f.id === active ? " active" : ""}" data-filter="${f.id}">
      ${esc(f.label)}<span>${String(count).padStart(2, "0")}</span></button>`;
  }).join("");
}

function renderWork(filter = "all") {
  const items = PROJECTS.map((project, index) => ({ project, index }))
    .filter(({ project }) => filter === "all" || project.category === filter);

  $("#workGrid").innerHTML = items.map(({ project, index }) => `
    <button class="work-card" data-index="${index}" aria-label="Play ${esc(project.title)}">
      <div class="work-poster">
        <img src="${esc(project.poster)}" alt="${esc(project.title)}" loading="lazy">
        <span class="work-play" aria-hidden="true">▶</span>
      </div>
      <div class="work-info">
        <div>
          <h3>${esc(project.title)}</h3>
          <p>${esc(project.type.toUpperCase())}</p>
        </div>
        <span class="year">${esc(project.year)}</span>
      </div>
    </button>`).join("");
}

function renderServices() {
  $("#serviceList").innerHTML = SERVICES.map((s, i) => `
    <article class="service-item reveal">
      <span class="service-num">${String(i + 1).padStart(2, "0")}</span>
      <div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>
      <span class="service-arrow" aria-hidden="true">↗</span>
    </article>`).join("");
}

function renderPricing() {
  $("#pricingGrid").innerHTML = PRICING.map((plan) => `
    <article class="price-card reveal${plan.featured ? " featured" : ""}">
      ${plan.featured ? '<span class="price-badge">POPULAR</span>' : ""}
      <span class="price-type">${esc(plan.type)}</span>
      <h3>${esc(plan.name)}</h3>
      <div class="price-amount">${esc(plan.price)} <small>${esc(plan.unit)}</small></div>
      <p class="price-desc">${esc(plan.description)}</p>
      <ul>${plan.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <a class="price-cta" target="_blank" rel="noopener"
         href="${esc(buildWhatsAppUrl(`Hi! I'm interested in the ${plan.name} package.`))}">
        Discuss this plan <span>↗</span>
      </a>
    </article>`).join("");
}

function bindSiteInfo() {
  $("#aboutText").textContent = SITE.about.text;

  const [line1, line2, line3] = SITE.contact.title;
  $("#contactTitle").innerHTML =
    `<span>${esc(line1)}</span><span class="outline-text">${esc(line2)}</span><span class="accent-text">${esc(line3)}</span>`;
  $("#contactText").textContent = SITE.contact.text;

  $("#emailLink").href = `mailto:${SITE.email}`;
  $("#emailLink").textContent = `${SITE.email} ↗`;
  $("#instagramLink").href = SITE.instagram;
  $("#whatsappLink").href = buildWhatsAppUrl();
  $("#year").textContent = new Date().getFullYear();
}

/* ---------------- Video modal ---------------- */
function openVideo(project) {
  const modal = $("#videoModal");
  const video = $("#modalVideo");
  video.src = project.video;
  $("#modalCaption").textContent = `${project.title} — ${project.type} · preview`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  video.play().catch(() => {});
}

function closeVideo() {
  const modal = $("#videoModal");
  if (!modal.classList.contains("open")) return;
  const video = $("#modalVideo");
  video.pause();
  video.removeAttribute("src");
  video.load();
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function initModal() {
  const modal = $("#videoModal");
  $("#modalClose").addEventListener("click", closeVideo);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeVideo(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeVideo(); });
}

/* ---------------- Navigation ---------------- */
function initNav() {
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");
  const header = $("#siteHeader");

  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    toggle.classList.toggle("is-open", open);
  };

  // "click" works on Android Chrome, iOS Safari and desktop
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains("open"));
  });

  // Close when a link is tapped
  $$(".main-nav a").forEach((link) =>
    link.addEventListener("click", () => {
      setOpen(false);
      $$(".nav-link").forEach((l) => l.classList.toggle("active", l.getAttribute("href") === link.getAttribute("href")));
    })
  );

  // Close when tapping outside the menu
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && !header.contains(e.target)) setOpen(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Solid header once you scroll
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

/* ---------------- Work filters and card clicks ---------------- */
function initWork() {
  $("#filterRow").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    renderFilters(btn.dataset.filter);
    renderWork(btn.dataset.filter);
  });

  $("#workGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".work-card");
    if (card) openVideo(PROJECTS[Number(card.dataset.index)]);
  });
}

/* ---------------- Scroll reveal ---------------- */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------------- 3D tunnel hero (vanilla port of the React component) ---------------- */
const TUNNEL = {
  wheelSpeed: 0.0008,  // how fast the mouse wheel moves through the tunnel
  touchSpeed: 0.0015,  // how fast a swipe moves through the tunnel
  stagger: 0.55,       // how long each card takes to fly through
  smoothing: 0.1,      // lower = smoother, slower
};

function initTunnel() {
  const root = $("#tunnel");
  const plane = $("#tunnelPlane");
  const title = $("#tunnelTitle");
  const prompt = $("#scrollPrompt");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const total = PROJECTS.length;

  // Build one 3D card per project
  const cards = PROJECTS.map((project, i) => {
    const angle = i * 137.5 * (Math.PI / 180); // golden angle spreads cards around the tunnel
    const el = document.createElement("article");
    el.className = "tunnel-card";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Play ${project.title}`);
    el.style.zIndex = i + 1;
    el.innerHTML = `
      <img src="${esc(project.poster)}" alt="${esc(project.title)}" draggable="false" loading="lazy">
      <span class="card-label">${esc(project.title)}</span>`;

    el.addEventListener("click", () => openVideo(project));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openVideo(project);
      }
    });
    plane.appendChild(el);

    const start = (i / total) * (1 - TUNNEL.stagger);
    return {
      el,
      cos: Math.cos(angle),
      sin: Math.sin(angle),
      rx: 0.28 + (i % 3) * 0.08,
      ry: 0.26 + (i % 2) * 0.09,
      rot: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      start,
      end: start + TUNNEL.stagger,
      baseX: 0,
      baseY: 0,
    };
  });

  let stage = { mobile: false, farZ: -1700, nearZ: 500, pan: 45 };

  // Recalculate sizes on load and on resize
  function measure() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mobile = w < 768;
    stage = {
      mobile,
      farZ: mobile ? -1200 : -1700,
      nearZ: mobile ? 350 : 500,
      pan: mobile ? 20 : 45,
    };
    root.style.perspective = mobile ? "900px" : "1200px";

    const cardWidth = mobile
      ? Math.max(130, Math.min(180, w * 0.38))
      : Math.max(180, Math.min(270, w * 0.18));

    cards.forEach((c) => {
      c.el.style.width = `${cardWidth}px`;
      c.baseX = c.cos * w * c.rx;
      c.baseY = c.sin * h * c.ry;
    });
  }

  // Animation state
  let target = 0;     // where the scroll/swipe wants to be (0 to 1)
  let progress = 0;   // smoothed value that actually drives the animation
  let tx = 0, ty = 0; // pointer target
  let px = 0, py = 0; // smoothed pointer

  function render() {
    const { farZ, nearZ, pan } = stage;

    cards.forEach((c) => {
      const local = clamp((progress - c.start) / (c.end - c.start));
      const z = farZ + (nearZ - farZ) * local;
      const opacity = mapRange(local, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);
      const ox = c.baseX - px * pan;
      const oy = c.baseY - py * pan;

      c.el.style.opacity = opacity;
      c.el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      c.el.style.transform =
        `translate3d(calc(-50% + ${ox}px), calc(-50% + ${oy}px), ${z}px) rotateZ(${c.rot}deg)`;
    });

    title.style.transform = `scale(${mapRange(progress, [0, 0.5, 1], [0.7, 1, 1.35])})`;
    title.style.opacity = mapRange(progress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
    prompt.style.opacity = mapRange(progress, [0, 0.12], [1, 0]);
  }

  function frame() {
    const ease = reduceMotion ? 1 : TUNNEL.smoothing;
    progress += (target - progress) * ease;
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    render();
    requestAnimationFrame(frame);
  }

  // The tunnel only takes over scrolling while the page is at the top
  // and the tunnel hasn't reached its end. Otherwise the page scrolls normally.
  const atTop = () => window.scrollY <= 2;
  const atEdge = (dy) => (dy > 0 && target >= 1) || (dy < 0 && target <= 0);

  root.addEventListener("wheel", (e) => {
    if (!atTop() || atEdge(e.deltaY)) return;
    e.preventDefault();
    target = clamp(target + e.deltaY * TUNNEL.wheelSpeed);
  }, { passive: false });

  let lastTouchY = 0;
  root.addEventListener("touchstart", (e) => {
    lastTouchY = e.touches[0].clientY;
  }, { passive: true });

  root.addEventListener("touchmove", (e) => {
    const y = e.touches[0].clientY;
    const dy = lastTouchY - y;
    lastTouchY = y;
    if (!atTop() || atEdge(dy)) return;
    e.preventDefault();
    target = clamp(target + dy * TUNNEL.touchSpeed);
  }, { passive: false });

  if (!reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  measure();
  window.addEventListener("resize", measure);
  requestAnimationFrame(frame);
}

/* ---------------- Start ---------------- */
document.addEventListener("error", handleImageError, true); // must be registered before images load

document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderFilters();
  renderWork();
  renderServices();
  renderPricing();
  bindSiteInfo();

  initTunnel();
  initNav();
  initWork();
  initModal();
  initReveal(); // run after all sections are rendered
});
/* ---------------- Keep position on refresh ---------------- */
function initScrollMemory() {
  // Stop the browser from restoring scroll on its own (it causes jumps)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const KEY = "framecut-scroll-y";

  // Save position continuously (throttled), and on leave
  let saveTimer = null;
  const save = () => {
    try { sessionStorage.setItem(KEY, String(window.scrollY)); } catch (_) {}
  };
  window.addEventListener("scroll", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 120);
  }, { passive: true });
  window.addEventListener("pagehide", save);

  // Restore position after layout settles. A #hash in the URL wins.
  const restore = () => {
    if (location.hash) return; // a section link was used, let it win
    let y = 0;
    try { y = Number(sessionStorage.getItem(KEY)) || 0; } catch (_) {}
    if (y > 0) window.scrollTo({ top: y, behavior: "instant" });
  };
  window.addEventListener("load", () => requestAnimationFrame(restore));
}

/* ---------------- Start ---------------- */
document.addEventListener("error", handleImageError, true); // must be registered before images load

document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderFilters();
  renderWork();
  renderServices();
  renderPricing();
  bindSiteInfo();

  initTunnel();
  initNav();
  initWork();
  initModal();
  initReveal();
  initScrollMemory();
});
/* ---------------- Contact form ---------------- */
function renderContactForm() {
  const service = $("#cfService");
  SERVICES.forEach((s) => service.insertAdjacentHTML("beforeend", `<option value="${esc(s.title)}">${esc(s.title)}</option>`));
  service.insertAdjacentHTML("beforeend", `<option value="Other / not sure">Other / not sure</option>`);

  const budget = $("#cfBudget");
  BUDGETS.forEach((b) => budget.insertAdjacentHTML("beforeend", `<option value="${esc(b)}">${esc(b)}</option>`));

  // Today is the earliest allowed deadline
  $("#cfDeadline").min = new Date().toISOString().split("T")[0];
}

function readForm() {
  const form = $("#contactForm");
  const data = Object.fromEntries(new FormData(form));
  for (const key of Object.keys(data)) data[key] = String(data[key]).trim();
  return data;
}

function validateForm(data) {
  const errors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "Please enter a valid email.";
  if (data.phone && !/^\+?[\d\s()-]{7,20}$/.test(data.phone)) errors.phone = "Please enter a valid number.";
  if (!data.service) errors.service = "Please choose a service.";
  if (data.message.length < 10) errors.message = "Tell me a bit more about the project (10+ characters).";
  return errors;
}

function showErrors(errors) {
  $$("#contactForm .field").forEach((field) => {
    const input = field.querySelector("input, select, textarea");
    const err = field.querySelector(".err");
    const msg = errors[input.name] || "";
    err.textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  });
}

function buildInquiry(data) {
  return [
    "Hi FRAME / CUT! New project inquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    `Service: ${data.service}`,
    `Budget: ${data.budget || "Not specified"}`,
    data.deadline && `Deadline: ${data.deadline}`,
    "",
    `Project: ${data.message}`,
  ].filter(Boolean).join("\n");
}

function setStatus(text, type = "") {
  const status = $("#formStatus");
  status.textContent = text;
  status.className = `form-status full ${type}`;
}

function initContactForm() {
  renderContactForm();
  const form = $("#contactForm");

  // Clear an error as soon as the user fixes that field
  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field");
    if (!field) return;
    field.querySelector(".err").textContent = "";
    e.target.setAttribute("aria-invalid", "false");
  });

  // Send on WhatsApp (default submit)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = readForm();
    const errors = validateForm(data);
    showErrors(errors);
    if (Object.keys(errors).length) {
      setStatus("Please fix the highlighted fields.", "error");
      const first = form.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setStatus("Opening WhatsApp…", "success");
    window.open(buildWhatsAppUrl(buildInquiry(data)), "_blank", "noopener");
    form.reset();
    $("#cfDeadline").min = new Date().toISOString().split("T")[0];
  });

  // Send by email (same content, opens the user's mail app)
  $("#sendMail").addEventListener("click", () => {
    const data = readForm();
    const errors = validateForm(data);
    showErrors(errors);
    if (Object.keys(errors).length) {
      setStatus("Please fix the highlighted fields.", "error");
      return;
    }
    const subject = `Project inquiry: ${data.service} — ${data.name}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildInquiry(data))}`;
    setStatus("Opening your email app…", "success");
  });
}

/* ---------------- Start ---------------- */