/* ============================================================
   site-common.js — Shared navbar + footer + helpers.
   You should NOT need to edit this file.
   Change wording in the Settings/ folder instead.
   ============================================================ */
(() => {
  /* --- Page reveal: body stays hidden until content is ready --- */
  let _loadFired = false, _contentReady = false;
  window.addEventListener('load', () => { _loadFired = true; _tryReveal(); });
  function _tryReveal() { if (_loadFired && _contentReady) requestAnimationFrame(() => document.body.classList.add('loaded')); }
  window.pageReady = () => { _contentReady = true; _tryReveal(); };
  setTimeout(() => { _contentReady = true; _tryReveal(); }, 4000);

  /* --- Font Awesome icons (injected) --- */
  const fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  fa.crossOrigin = 'anonymous';
  fa.referrerPolicy = 'no-referrer';
  document.head.appendChild(fa);

  /* ---------- Helpers (global) ---------- */
  window.parseSettings = (text) => {
    const d = {};
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t || t.charCodeAt(0) === 35 /* # */ || t.charCodeAt(0) === 61 /* = */) continue;
      const i = t.indexOf(':');
      if (i === -1) continue;
      const k = t.substring(0, i).trim().toUpperCase(), v = t.substring(i + 1).trim();
      if (k) d[k] = v;
    }
    return d;
  };
  const _cb = () => '?cb=' + Date.now();
  window.fetchSettings = (path) =>
    fetch(path + _cb()).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }).then(parseSettings);
  window.fetchText = (path) =>
    fetch(path + _cb()).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); });

  /** Parse "record" files: blocks separated by a blank line, each a set of KEY: VALUE lines. */
  window.parseRecords = (text) => {
    const records = []; let cur = null;
    for (const rawLine of text.split('\n')) {
      const t = rawLine.trim();
      if (!t || t.charCodeAt(0) === 35 || t.charCodeAt(0) === 61) {
        if (t === '' && cur && Object.keys(cur).length) { records.push(cur); cur = null; }
        continue;
      }
      const i = t.indexOf(':'); if (i === -1) continue;
      const k = t.substring(0, i).trim().toUpperCase(), v = t.substring(i + 1).trim();
      if (!k) continue;
      if (!cur) cur = {};
      if (cur[k] !== undefined) { if (!Array.isArray(cur[k])) cur[k] = [cur[k]]; cur[k].push(v); }
      else cur[k] = v;
    }
    if (cur && Object.keys(cur).length) records.push(cur);
    return records;
  };
  window.asArray = (v) => v === undefined ? [] : (Array.isArray(v) ? v : [v]);
  window.esc = (s) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* --- Scroll reveal --- */
  window.initReveal = () => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  };

  /* ============================================================
     NAVBAR (single page — links are in-page anchors)
     ============================================================ */
  const nav = document.createElement('nav');
  nav.className = 'navbar'; nav.id = 'navbar';
  nav.innerHTML =
    '<a href="#top" class="navbar__logo">' +
      '<img class="navbar__logo-img" id="navLogo" src="Logos/Logo_Clear.png" alt="Baeza\'s Total Solution Services" />' +
      '<span class="navbar__name" id="navName">Baeza\'s Total Solution Services</span>' +
    '</a>' +
    '<ul class="navbar__links" id="navLinks">' +
      '<li><a href="#services">Services</a></li>' +
      '<li><a href="#why-us">Why Us</a></li>' +
      '<li><a href="#contact" class="navbar__cta">Free Estimate</a></li>' +
    '</ul>' +
    '<button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>';
  document.body.prepend(nav);

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', e => {
    if (e.target.tagName === 'A') { hamburger.classList.remove('open'); navLinks.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
  });

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return; scrollTicking = true;
    requestAnimationFrame(() => { nav.classList.toggle('scrolled', window.scrollY > 40); scrollTicking = false; });
  }, { passive: true });

  /* ============================================================
     FOOTER
     ============================================================ */
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML =
    '<div class="footer__inner">' +
      '<div class="footer__brand">' +
        '<div class="footer__logo-wrap"><img class="footer__logo-img" src="Logos/Logo_Clear.png" alt="" /><img class="footer__logo-img" id="footLogo" src="Logos/Name_Logo_Clear.png" alt="Baeza\'s Total Solution Services" /></div>' +
        '<p class="footer__tagline" id="footerTagline">One Company. Total Solutions.</p>' +
      '</div>' +
      '<div class="footer__cols">' +
        '<div class="footer__col">' +
          '<h4>Explore</h4>' +
          '<a href="#top">Home</a>' +
          '<a href="#services">Services</a>' +
          '<a href="#why-us">Why Us</a>' +
          '<a href="#contact">Free Estimate</a>' +
        '</div>' +
        '<div class="footer__col footer__col--contact">' +
          '<h4>Contact</h4>' +
          '<a href="#" data-contact="call">Call Us</a>' +
          '<a href="#" data-contact="text">Text Us</a>' +
          '<a href="#" data-contact="email">Email Us</a>' +
          '<p id="footerArea"></p>' +
          '<div class="footer__icons" id="footerIcons" style="display:none">' +
            '<a href="#" aria-label="Facebook" data-social="FACEBOOK"><i class="fa-brands fa-facebook-f"></i></a>' +
            '<a href="#" aria-label="Instagram" data-social="INSTAGRAM"><i class="fa-brands fa-instagram"></i></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="footer__bar"><p class="footer__text" id="footerText">© 2026 Baeza\'s Total Solution Services — All Rights Reserved.</p></div>';
  document.body.appendChild(footer);

  /**
   * Wires up every element with data-contact="call|text|email" (anywhere on
   * the page — hero, contact section, footer, etc.) to the real phone/email
   * from Settings/site.txt. Buttons keep their existing label unless they
   * have data-contact-label, in which case the number/email is shown too.
   */
  window.wireContactLinks = (d) => {
    const phoneRaw = d['PHONE'];
    const email = d['EMAIL'];
    const phoneClean = phoneRaw ? phoneRaw.replace(/[^0-9+]/g, '') : '';

    document.querySelectorAll('[data-contact="call"]').forEach(el => {
      if (!phoneRaw || phoneRaw === '#') { el.remove(); return; }
      el.href = 'tel:' + phoneClean;
      if (el.hasAttribute('data-contact-label')) el.textContent = 'Call ' + phoneRaw;
    });
    document.querySelectorAll('[data-contact="text"]').forEach(el => {
      if (!phoneRaw || phoneRaw === '#') { el.remove(); return; }
      el.href = 'sms:' + phoneClean;
      if (el.hasAttribute('data-contact-label')) el.textContent = 'Text ' + phoneRaw;
    });
    document.querySelectorAll('[data-contact="email"]').forEach(el => {
      if (!email || email === '#') { el.remove(); return; }
      el.href = 'mailto:' + email;
      if (el.hasAttribute('data-contact-label')) el.textContent = email;
    });
    document.querySelectorAll('[data-contact-value="phone"]').forEach(el => { if (phoneRaw) el.textContent = phoneRaw; });
    document.querySelectorAll('[data-contact-value="email"]').forEach(el => { if (email) el.textContent = email; });
  };

  /* Load brand + contact + social from Settings/site.txt */
  fetchSettings('Settings/site.txt')
    .then(d => {
      const setText = (id, v) => { const el = document.getElementById(id); if (el && v) el.textContent = v; };
      if (d['SITE NAME']) { setText('navName', d['SITE NAME']); const nl = document.getElementById('navLogo'); const fl = document.getElementById('footLogo'); if (nl) nl.alt = d['SITE NAME']; if (fl) fl.alt = d['SITE NAME']; }
      if (d['TAGLINE']) setText('footerTagline', d['TAGLINE']);
      if (d['FOOTER']) setText('footerText', d['FOOTER']);
      if (d['SERVICE AREA']) setText('footerArea', 'Serving ' + d['SERVICE AREA']);

      wireContactLinks(d);

      const icons = document.getElementById('footerIcons');
      icons.querySelectorAll('[data-social]').forEach(el => {
        const val = d[el.getAttribute('data-social')];
        (val && val !== '#') ? el.href = val : el.remove();
      });
      icons.style.display = '';
    })
    .catch(() => { const ic = document.getElementById('footerIcons'); if (ic) ic.style.display = ''; });

  if (document.readyState !== 'loading') initReveal();
  else document.addEventListener('DOMContentLoaded', initReveal);
})();
