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

  /* Curated from the club's own photo library in assets/img/. */
  var GALLERY = [
    { file: "assets/img/gym-besties.jpg",    caption: "Gym besties" },
    { file: "assets/img/dumbbells.jpg",      caption: "The dumbbell rack" },
    { file: "assets/img/cardio.jpg",         caption: "Cardio zone" },
    { file: "assets/img/pilates-studio.jpg", caption: "Reformer studio" },
    { file: "assets/img/yoga-group.jpg",     caption: "Yoga class" },
    { file: "assets/img/spinning-group.jpg", caption: "Spinning class" },
    { file: "assets/img/zumba-group.jpg",    caption: "Zumba night" },
    { file: "assets/img/taekwondo.jpg",      caption: "Taekwondo" },
    { file: "assets/img/pilates-group.jpg",  caption: "Pilates group" },
    { file: "assets/img/lockers.jpg",        caption: "Lockers & dressing room" },
    { file: "assets/img/sauna.jpg",          caption: "Sauna" },
    { file: "assets/img/exterior.jpg",       caption: "143 Susano Road" }
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

      /* The photo paints straight away and simply covers the placeholder;
         hiding it until a load event only produces a visible pop-in. */
      var img = document.createElement("img");
      img.alt = item.caption + " at Elevate Lifestyle and Fitness";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("load", function () { ph.remove(); });
      img.addEventListener("error", function () { img.remove(); });
      img.src = item.file;
      fig.appendChild(img);

      var cap = document.createElement("figcaption");
      cap.className = "gal-cap";
      cap.textContent = item.caption;
      fig.appendChild(cap);

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
  /* ----------------------------------------------------------------------
     Team profile lightbox.
     Each coach's poster carries their printed expertise and certifications,
     so tapping a card opens that poster full size.
     ---------------------------------------------------------------------- */
  var PROFILES = [
    { img: "assets/img/coach-natalia-full.jpg",  name: "Coach Natalia",  role: "Coach \u2014 sports science, women's fitness, athletic performance" },
    { img: "assets/img/coach-leo-full.jpg",      name: "Coach Leo",      role: "Coach \u2014 strength & conditioning, boxing & Muay Thai" },
    { img: "assets/img/coach-jonathan-full.jpg", name: "Coach Jonathan", role: "Coach \u2014 hypertrophy, contest prep, powerlifting, MMA" },
    { img: "assets/img/coach-derick-full.jpg",   name: "Coach Derick",   role: "Coach \u2014 body recomposition, bodybuilding, mobility" },
    { img: "assets/img/staff-felipe-full.jpg",   name: "Felipe",         role: "Operations Manager" },
    { img: "assets/img/staff-ash-full.jpg",      name: "Ash",            role: "Membership Sales Representative" },
    { img: "assets/img/staff-kirstein-full.jpg", name: "Kirstein",       role: "Membership Sales Representative" }
  ];

  /* 1x1 transparent placeholder, so the dialog never holds a src-less <img> */
  var LB_BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  var lb = $("#lightbox");
  var lbImg = $("#lbImage");
  var lbCap = $("#lbCaption");
  var lbIndex = 0;
  var lbLastFocus = null;

  function lbShow(i) {
    lbIndex = (i + PROFILES.length) % PROFILES.length;
    var pr = PROFILES[lbIndex];
    lbImg.src = pr.img;
    lbImg.alt = pr.name + " \u2014 " + pr.role;
    lbCap.innerHTML = "<strong>" + pr.name + "</strong>" + pr.role;
  }

  function lbOpen(i) {
    if (!lb) return;
    lbLastFocus = document.activeElement;
    lbShow(i);
    lb.hidden = false;
    document.body.classList.add("lb-open");
    var close = $(".lb-close", lb);
    if (close) close.focus();
  }

  function lbClose() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    document.body.classList.remove("lb-open");
    lbImg.src = LB_BLANK;
    if (lbLastFocus && lbLastFocus.focus) lbLastFocus.focus();
  }

  if (lb) {
    $$(".coach-tap[data-profile]").forEach(function (btn) {
      var i = parseInt(btn.dataset.profile, 10);
      var pr = PROFILES[i];
      /* the coaches' posters carry an expertise list; the staff cards are
         just a photo, so the label should not promise a profile */
      if (pr) btn.setAttribute("aria-label",
        "Open " + pr.name + (pr.img.indexOf("coach-") > -1 ? "'s full profile" : "'s photo"));
      btn.addEventListener("click", function () { lbOpen(i); });
    });

    $$("[data-lb-close]", lb).forEach(function (el) { el.addEventListener("click", lbClose); });
    var prevBtn = $("[data-lb-prev]", lb), nextBtn = $("[data-lb-next]", lb);
    if (prevBtn) prevBtn.addEventListener("click", function () { lbShow(lbIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { lbShow(lbIndex + 1); });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") { lbClose(); return; }
      if (e.key === "ArrowLeft") { lbShow(lbIndex - 1); return; }
      if (e.key === "ArrowRight") { lbShow(lbIndex + 1); return; }
      if (e.key === "Tab") {
        /* keep focus inside the dialog while it is open */
        var f = $$("button", lb).filter(function (b) { return b.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* swipe between profiles on touch */
    var tx = 0;
    lb.addEventListener("touchstart", function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 60) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Opening hours - open daily 6:00 AM to 12:00 AM (midnight).
     Manila is UTC+8 and never observes DST, so the club's local time is
     derived from UTC rather than from the visitor's own clock.
     ---------------------------------------------------------------------- */
  var OPEN_HOUR = 6;
  var CLOSE_HOUR = 24;

  function manilaNow() {
    var now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
  }

  function openState() {
    var h = manilaNow().getHours();
    var open = h >= OPEN_HOUR && h < CLOSE_HOUR;
    if (open) return { open: true, text: "Open right now" };
    var hoursUntil = OPEN_HOUR - h;
    if (hoursUntil < 0) hoursUntil += 24;
    return {
      open: false,
      text: hoursUntil <= 1 ? "Closed - opens within the hour"
                            : "Closed now - opens at 6:00 AM"
    };
  }

  function paintOpenState() {
    var st = openState();

    var badge = $("#heroOpen");
    if (badge) badge.classList.toggle("is-shut", !st.open);

    var line = $("#openState");
    if (line) {
      line.textContent = st.text;
      line.classList.toggle("now-open", st.open);
      line.classList.toggle("now-shut", !st.open);
    }
  }
  paintOpenState();
  window.setInterval(paintOpenState, 60000);

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
