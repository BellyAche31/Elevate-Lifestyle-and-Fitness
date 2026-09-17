/* ==========================================================================
   Elevate Lifestyle and Fitness — site behaviour
   Vanilla JS, no dependencies. Edit the DATA block below to update content.
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     DATA — update the weekly schedule here and the page follows.
     ---------------------------------------------------------------------- */
  var CONTACT_EMAIL = "elevatelifestyle2025@gmail.com";

  var DAYS = [
    { key: "Mon", label: "Monday" },
    { key: "Tue", label: "Tuesday" },
    { key: "Wed", label: "Wednesday" },
    { key: "Thu", label: "Thursday" },
    { key: "Fri", label: "Friday" },
    { key: "Sat", label: "Saturday" },
    { key: "Sun", label: "Sunday" }
  ];

  var CLASSES = {
    Mon: [
      { time: "8:00 AM", name: "Yoga" },
      { time: "10:00 AM", name: "Bootcamp" },
      { time: "7:00 PM", name: "Body Pump Unplugged" }
    ],
    Tue: [
      { time: "8:00 AM", name: "Circuit" },
      { time: "7:00 PM", name: "Zumba" }
    ],
    Wed: [
      { time: "8:00 AM", name: "HIIT" },
      { time: "7:00 PM", name: "TABATA" },
      { time: "8:00 PM", name: "Tae-Bo" }
    ],
    Thu: [
      { time: "7:00 PM", name: "Six-Pack Attack" },
      { time: "8:00 PM", name: "Yoga" }
    ],
    Fri: [
      { time: "4:00 PM", name: "Bootcamp" },
      { time: "7:00 PM", name: "HIIT Step" }
    ],
    Sat: [
      { time: "7:00 PM", name: "Booty Project" }
    ],
    Sun: [
      { time: "4:00 PM", name: "Circuit" },
      { time: "7:00 PM", name: "Mobility & Flexibility" }
    ]
  };

  var PILATES = [
    { day: "Wed", slots: ["12:00 PM", "1:00 PM"] },
    { day: "Fri", slots: ["11:00 AM", "12:00 PM", "1:00 PM"] },
    { day: "Sat", slots: ["3:00 PM", "4:00 PM"] }
  ];

  /* Drop real photos into assets/gallery/ using these filenames and they
     appear automatically; until then a branded placeholder tile is shown. */
  var GALLERY = [
    { file: "assets/gallery/community.jpg", caption: "FTMG '26 team games" },
    { file: "assets/gallery/gym-floor.jpg", caption: "The gym floor" },
    { file: "assets/gallery/classes.jpg", caption: "Evening group class" },
    { file: "assets/gallery/pilates.jpg", caption: "Reformer studio" },
    { file: "assets/gallery/court.jpg", caption: "Indoor court" },
    { file: "assets/gallery/billiards.jpg", caption: "Billiards lounge" }
  ];

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ----------------------------------------------------------------------
     Mobile nav
     ---------------------------------------------------------------------- */
  var toggle = $("#navToggle");
  var nav = $("#primaryNav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ----------------------------------------------------------------------
     Header shadow + active section highlighting
     ---------------------------------------------------------------------- */
  var header = $("#siteHeader");
  var navLinks = $$(".primary-nav a[href^='#']");
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);

    var pos = window.scrollY + (header ? header.offsetHeight : 0) + 40;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current && !a.classList.contains("nav-cta"));
    });
  }

  var scrollQueued = false;
  window.addEventListener("scroll", function () {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () { onScroll(); scrollQueued = false; });
  }, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     Class schedule — day tabs, "all week" default, today highlighted
     ---------------------------------------------------------------------- */
  var scheduleEl = $("#schedule");
  var tabs = $$(".day-tab");
  var todayKey = DAYS[(new Date().getDay() + 6) % 7].key; // JS: 0=Sun -> our Mon-first order

  function dayBlock(dayKey) {
    var meta = DAYS.filter(function (d) { return d.key === dayKey; })[0];
    var items = CLASSES[dayKey] || [];
    var isToday = dayKey === todayKey;

    var rows = items.length
      ? '<ul class="sched-rows">' + items.map(function (c) {
          return '<li><span class="sched-time">' + c.time + '</span>' +
                 '<span class="sched-name">' + c.name + '</span></li>';
        }).join("") + "</ul>"
      : '<p class="sched-empty">No group classes scheduled — the gym floor, court and billiards are still open.</p>';

    return '<article class="sched-day' + (isToday ? " is-today" : "") + '">' +
             '<div class="sched-day-head"><h3>' + meta.label + "</h3>" +
             (isToday ? '<span class="today-tag">Today</span>' : "") +
             "</div>" + rows +
           "</article>";
  }

  function renderSchedule(dayKey) {
    if (!scheduleEl) return;
    var keys = dayKey ? [dayKey] : DAYS.map(function (d) { return d.key; });
    scheduleEl.innerHTML = keys.map(dayBlock).join("");
    tabs.forEach(function (t) {
      t.setAttribute("aria-selected", String(t.dataset.day === dayKey));
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      // Clicking the selected day again returns to the full week view.
      var already = t.getAttribute("aria-selected") === "true";
      renderSchedule(already ? null : t.dataset.day);
    });
  });
  renderSchedule(null);

  /* ----------------------------------------------------------------------
     Pilates slots
     ---------------------------------------------------------------------- */
  var pilatesEl = $("#pilatesDays");
  if (pilatesEl) {
    pilatesEl.innerHTML = PILATES.map(function (p) {
      var meta = DAYS.filter(function (d) { return d.key === p.day; })[0];
      return '<div class="p-day"><strong>' + p.day + "</strong>" +
             '<div class="p-slots" aria-label="' + meta.label + ' slots">' +
             p.slots.map(function (s) { return "<span>" + s + "</span>"; }).join("") +
             "</div></div>";
    }).join("");
  }

  /* ----------------------------------------------------------------------
     Gallery — real photo if present, branded placeholder if not
     ---------------------------------------------------------------------- */
  var galleryEl = $("#galleryGrid");
  if (galleryEl) {
    GALLERY.forEach(function (item) {
      var fig = document.createElement("figure");
      fig.className = "gal";

      var ph = document.createElement("div");
      ph.className = "gal-ph";
      ph.innerHTML = "<span>" + item.caption + "</span>";
      fig.appendChild(ph);

      var img = document.createElement("img");
      img.alt = item.caption + " at Elevate Lifestyle and Fitness";
      img.loading = "lazy";
      img.decoding = "async";
      img.style.display = "none";
      img.addEventListener("load", function () {
        img.style.display = "";
        ph.remove();
        var cap = document.createElement("figcaption");
        cap.className = "gal-cap";
        cap.textContent = item.caption;
        fig.appendChild(cap);
      });
      img.addEventListener("error", function () { img.remove(); });
      img.src = item.file;
      fig.appendChild(img);

      galleryEl.appendChild(fig);
    });
  }

  /* ----------------------------------------------------------------------
     Trial form — validates, then hands off to the visitor's mail client.
     To switch to a hosted form service instead, replace the body of
     submit() with a fetch() POST to your endpoint.
     ---------------------------------------------------------------------- */
  var form = $("#trialForm");
  var formNote = $("#formNote");

  function setError(input, message) {
    var slot = $('[data-error-for="' + input.id + '"]', form);
    if (slot) slot.textContent = message || "";
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function validate() {
    var ok = true;
    var name = $("#f-name"), email = $("#f-email"), interest = $("#f-interest");

    if (!name.value.trim()) { setError(name, "Please tell us your name."); ok = false; }
    else setError(name, "");

    if (!email.value.trim()) { setError(email, "We need an email to reply to."); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      setError(email, "That email doesn't look right."); ok = false;
    } else setError(email, "");

    if (!interest.value) { setError(interest, "Pick what you're interested in."); ok = false; }
    else setError(interest, "");

    return ok;
  }

  if (form) {
    $$("input, select, textarea", form).forEach(function (el) {
      el.addEventListener("input", function () {
        if (el.getAttribute("aria-invalid") === "true") validate();
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstBad = $("[aria-invalid='true']", form);
        if (firstBad) firstBad.focus();
        return;
      }

      var data = {
        name: $("#f-name").value.trim(),
        email: $("#f-email").value.trim(),
        phone: $("#f-phone").value.trim(),
        interest: $("#f-interest").value,
        message: $("#f-message").value.trim()
      };

      var subject = "Website enquiry: " + data.interest + " — " + data.name;
      var body = [
        "Hi Elevate team,",
        "",
        "Name: " + data.name,
        "Email: " + data.email,
        "Mobile: " + (data.phone || "—"),
        "Interested in: " + data.interest,
        "",
        "Message:",
        data.message || "—",
        "",
        "— Sent from the Elevate website"
      ].join("\n");

      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (formNote) {
        formNote.textContent = "Your email app should be opening now. If nothing happens, email us directly at " + CONTACT_EMAIL + ".";
        formNote.classList.add("ok");
      }
    });
  }

  /* ----------------------------------------------------------------------
     Placeholder social links — keep them from navigating to "#"
     Remove this block once the real URLs are in index.html.
     ---------------------------------------------------------------------- */
  $$('.socials a[data-placeholder="true"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "mailto:" + CONTACT_EMAIL;
    });
  });

  /* ----------------------------------------------------------------------
     Count-up stats + reveal on scroll
     ---------------------------------------------------------------------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target) || reduceMotion) return;
    var start = null, dur = 900;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countUp(en.target);
        statObserver.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    $$(".stat strong[data-count]").forEach(function (el) { statObserver.observe(el); });

    if (!reduceMotion) {
      var revealTargets = $$(".section-head, .card, .plan, .pilates-card, .trial-form, .contact-details, .map-card, .plan-extras > div");
      revealTargets.forEach(function (el, i) { el.classList.add("reveal"); el.style.transitionDelay = (i % 4) * 60 + "ms"; });

      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          revealObserver.unobserve(en.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px 10%" });
      revealTargets.forEach(function (el) { revealObserver.observe(el); });

      /* Failsafe: nothing may stay invisible. If an element has not been
         revealed a few seconds in (odd viewport, print, headless capture,
         observer never firing), show it unconditionally. */
      window.setTimeout(function () {
        revealTargets.forEach(function (el) {
          el.style.transitionDelay = "0ms";
          el.classList.add("in");
        });
      }, 2500);
    }
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
