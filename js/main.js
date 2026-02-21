/**
 * Leaf 2 Leaf Landscapes — Main JavaScript
 * Handles: sticky nav scroll state, mobile menu, scroll reveal
 */

(function () {
  'use strict';

  const NAV = document.getElementById('nav');
  const HAMBURGER = document.getElementById('nav-hamburger');
  const OVERLAY = document.getElementById('nav-overlay');

  // ----- Sticky nav: add frosted class on scroll -----
  function updateNavOnScroll() {
    if (window.scrollY > 60) {
      NAV.classList.add('scrolled');
    } else {
      NAV.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', function () {
    updateNavOnScroll();
  }, { passive: true });
  updateNavOnScroll();

  // ----- Mobile menu -----
  function openMenu() {
    HAMBURGER.setAttribute('aria-label', 'Close menu');
    HAMBURGER.classList.add('active');
    OVERLAY.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    HAMBURGER.setAttribute('aria-label', 'Open menu');
    HAMBURGER.classList.remove('active');
    OVERLAY.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (OVERLAY.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (HAMBURGER) {
    HAMBURGER.addEventListener('click', toggleMenu);
  }

  if (OVERLAY) {
    OVERLAY.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // ----- Active nav state: highlight link matching current page -----
  (function () {
    var path = (location.pathname || '').replace(/^\/+/, '').replace(/\/$/, '') || 'index.html';
    if (path === 'index.html' || path === '') path = 'home/index.html';
    if (path === 'about' || path === 'gallery' || path === 'reviews' || path === 'services') path = path + '/index.html';
    document.querySelectorAll('.nav__links a[href]').forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/^\/+/, '').split('#')[0];
      if (href === path) link.classList.add('active');
    });
  })();

  // ----- Home page enquiry form: Preferred Date min = today -----
  var dateInputHome = document.getElementById('field-preferred-date-home');
  if (dateInputHome) {
    dateInputHome.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  // ----- Home page enquiry form: submit to n8n webhook -----
  var homeForm = document.getElementById('quote-form-home');
  if (homeForm) {
    var webhookUrl = 'https://adzoo.app.n8n.cloud/webhook/appointments';
    var submitBtnText = 'Send My Enquiry →';
    var errorAlert = 'Something went wrong. Please try again or call us directly on 01 234 5678.';

    homeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!homeForm.checkValidity()) return;

      var btn = homeForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : submitBtnText;

      function getVal(name) {
        var el = homeForm.querySelector('[name="' + name + '"]');
        return el ? (el.value || '').trim() : '';
      }

      var payload = {
        'Full name': getVal('Full Name'),
        'Gmail': getVal('Gmail'),
        'Phone': getVal('Phone'),
        'Preferred Date': getVal('Preferred Date'),
        'Preferred Time': getVal('Preferred Time'),
        'Additional Comment': getVal('Additional Comment')
      };

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }

      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          }).catch(function () {
            return { ok: false, data: null };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.status === 'success') {
            if (btn) btn.textContent = '✅ Confirmed! Check your email.';
            setTimeout(function () {
              homeForm.reset();
              if (btn) {
                btn.textContent = submitBtnText;
                btn.disabled = false;
              }
            }, 5000);
          } else {
            alert(errorAlert);
            if (btn) {
              btn.disabled = false;
              btn.textContent = submitBtnText;
            }
          }
        })
        .catch(function () {
          alert(errorAlert);
          if (btn) {
            btn.disabled = false;
            btn.textContent = submitBtnText;
          }
        });
    });
  }

  // ----- Scroll reveal (IntersectionObserver) -----
  const revealEls = document.querySelectorAll(
    '.services__title, .services__sub, .service-card, .about-strip__quote-col, .about-strip__list, ' +
    '.gallery__title, .gallery__item, .gallery__more, .testimonials__title, .testimonial-card, ' +
    '.contact__info, .contact__form-wrap'
  );

  function addRevealClass(el) {
    el.classList.add('reveal');
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05
    }
  );

  revealEls.forEach(function (el) {
    addRevealClass(el);
    observer.observe(el);
  });
})();
