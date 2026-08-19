(() => {
  'use strict';

  const ROOT_ID = 'motion-root';
  const HERO_CONTENT_SELECTOR = [
    '.hero-content',
    '.products-hero-content',
    '.manufacturing-hero-content',
    '.contact-intro',
    '.quote-hero-content',
    '.about-opening .about-content',
  ].join(', ');
  const REVEAL_SELECTOR = [
    '.about-section',
    '.capabilities-section',
    '.about-facilities .facility-row',
    '.product-category-nav',
    '.showroom-category',
    '.manufacturing-systems-intro',
    '.manufacturing-certificates-showcase',
    '.manufacturing-machinery-sidebar',
    '.manufacturing-machine-grid',
    '.contact-content .contact-card',
    '.quote-card',
  ].join(', ');
  const TACTILE_SELECTOR = [
    '.capability-card',
    '.facility-image-frame',
    '.product-category-nav-card',
    '.manufacturing-machine-card',
    '.contact-card',
    '.quote-card',
  ].join(', ');
  const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function selectElements(root, selector, limit) {
    return Array.from(root.querySelectorAll(selector)).slice(0, limit || 48);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function canHover() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function animate(element, keyframes, options) {
    if (!element || typeof element.animate !== 'function') {
      return;
    }

    element.animate(keyframes, {
      duration: options.duration || 400,
      delay: options.delay || 0,
      easing: options.easing || EASE_OUT,
      fill: 'forwards',
    });
  }

  function installGlassFilter() {
    if (document.getElementById('abdelhamid-glass-svg')) {
      return;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'abdelhamid-glass-svg';
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';
    svg.innerHTML = `
      <filter id="abdelhamid-glass-distortion" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="17" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="softMap" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="28" xChannelSelector="R" yChannelSelector="G" result="distorted" />
        <feComposite in="distorted" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.15" k4="0" />
      </filter>
    `;
    document.body.prepend(svg);
  }

  function bindNavigation(root) {
    const navbar = root.querySelector('.navbar');
    const navigation = root.querySelector('.navigation');
    const toggle = root.querySelector('.mobile-toggle');
    const cleanups = [];

    if (!navbar || !navigation || !toggle) {
      return () => {};
    }

    const listen = (target, type, handler) => {
      target.addEventListener(type, handler);
      cleanups.push(() => target.removeEventListener(type, handler));
    };

    const closeNavigation = () => {
      navigation.classList.remove('is-open');
      navbar.classList.remove('menu-open');
      document.body.classList.remove('mobile-navigation-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    };

    const toggleNavigation = () => {
      const isOpen = navigation.classList.toggle('is-open');
      navbar.classList.toggle('menu-open', isOpen);
      document.body.classList.toggle('mobile-navigation-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    listen(toggle, 'click', toggleNavigation);
    root.querySelectorAll('.navigation a').forEach((link) => {
      listen(link, 'click', closeNavigation);
    });
    listen(document, 'click', (event) => {
      if (navigation.classList.contains('is-open') && !navbar.contains(event.target)) {
        closeNavigation();
      }
    });
    listen(document, 'keydown', (event) => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        closeNavigation();
        toggle.focus();
      }
    });
    listen(window, 'resize', () => {
      if (window.innerWidth > 950) {
        closeNavigation();
      }
    });

    const navLinks = navigation.querySelector('.nav-links');
    const navItems = navLinks ? Array.from(navLinks.querySelectorAll('li > a')) : [];

    if (!navLinks || !canHover()) {
      return () => {
        closeNavigation();
        cleanups.forEach((fn) => fn());
      };
    }

    const bubble = document.createElement('div');
    bubble.className = 'nav-glass-hover';
    navLinks.prepend(bubble);

    const moveBubble = (link) => {
      const container = navLinks.getBoundingClientRect();
      const target = link.getBoundingClientRect();
      animate(
        bubble,
        {
          opacity: 1,
          transform: `translate(${target.left - container.left}px, ${target.top - container.top}px)`,
          width: `${target.width}px`,
          height: `${target.height}px`,
        },
        { duration: 340, easing: EASE_OUT },
      );
    };

    navItems.forEach((item) => {
      listen(item, 'pointerenter', () => moveBubble(item));
    });
    listen(navLinks, 'pointerleave', () => {
      animate(bubble, { opacity: 0 }, { duration: 160 });
    });

    return () => {
      closeNavigation();
      bubble.remove();
      cleanups.forEach((fn) => fn());
    };
  }

  function bindMotion(root) {
    const cleanups = [];

    if (prefersReducedMotion() || !canHover()) {
      return () => {};
    }

    selectElements(root, TACTILE_SELECTOR, 40).forEach((target) => {
      const enter = () => {
        animate(
          target,
          { transform: 'translateY(-5px) scale(1.008)' },
          { duration: 280, easing: EASE_OUT },
        );
      };
      const leave = () => {
        animate(
          target,
          { transform: 'translateY(0) scale(1)' },
          { duration: 280, easing: EASE_OUT },
        );
      };

      target.addEventListener('pointerenter', enter);
      target.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        target.removeEventListener('pointerenter', enter);
        target.removeEventListener('pointerleave', leave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }

  let navBound = false;

  function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root) {
      return () => {};
    }

    installGlassFilter();

    if (!navBound) {
      navBound = true;
      bindNavigation(root);
    }

    return bindMotion(root);
  }

  window.__abdelhamidEffects = window.__abdelhamidEffects || {};
  window.__abdelhamidEffects['/assets/js/motion-experience.js'] = init;
})();
