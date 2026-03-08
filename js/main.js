/* =========================================
   LOKESH MUNI WEBSITE — MAIN JAVASCRIPT
   ========================================= */

(function () {
  'use strict';

  /* =========================================
     1. STICKY HEADER (scroll class)
     ========================================= */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =========================================
     2. HAMBURGER / MOBILE NAV
     ========================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* =========================================
     3. SCROLL REVEAL
     ========================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children if inside a grid/list
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 0.06, 0.4)}s`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* =========================================
     4. HERO PARALLAX (desktop only)
     ========================================= */
  const heroBg = document.querySelector('.hero .hero-bg');
  if (heroBg && window.matchMedia('(min-width: 769px)').matches) {
    document.querySelector('.hero').classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1.04) translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
  } else if (document.querySelector('.hero')) {
    setTimeout(() => document.querySelector('.hero').classList.add('loaded'), 100);
  }

  /* =========================================
     5. COUNTER ANIMATION
     ========================================= */
  const counters = document.querySelectorAll('.impact-number[data-target]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * target);
      el.textContent = current >= 1000000
        ? (current / 1000000).toFixed(1) + 'M'
        : current.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target >= 1000000
        ? (target / 1000000).toFixed(1) + 'M'
        : target.toLocaleString();
    };
    requestAnimationFrame(tick);
  }

  /* =========================================
     6. ACCORDION (Events page)
     ========================================= */
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const body = btn.nextElementSibling;

      // Close all others in same group
      const group = btn.closest('#past-events') || btn.closest('.past-events-accordion');
      if (group) {
        group.querySelectorAll('.accordion-header').forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            const otherBody = otherBtn.nextElementSibling;
            if (otherBody) otherBody.classList.remove('open');
          }
        });
      }

      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (body) body.classList.toggle('open', !isExpanded);
    });
  });

  /* =========================================
     7. SMOOTH SCROLL (anchor links)
     ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 76;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =========================================
     8. ACTIVE NAV HIGHLIGHT (current page)
     ========================================= */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

})();
