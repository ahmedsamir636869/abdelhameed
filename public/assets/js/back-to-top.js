(() => {
  'use strict';

  function initBackToTop() {
    const cleanups = [];

    function listen(target, type, handler) {
      target.addEventListener(type, handler);
      cleanups.push(() => target.removeEventListener(type, handler));
    }

    const eventControls = [
      { selector: '.home-back-to-top', eventName: 'homebacktotop' },
      { selector: '.about-back-to-top', eventName: 'aboutbacktotop' },
      { selector: '.manufacturing-back-to-top', eventName: 'manufacturingbacktotop' },
      { selector: '.products-back-to-top', eventName: null },
      { selector: '.contact-back-to-top', eventName: null },
      { selector: '.quote-back-to-top', eventName: null },
    ];

    eventControls.forEach((control) => {
      const button = document.querySelector(control.selector);
      if (!button) {
        return;
      }

      listen(button, 'click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (control.eventName) {
          window.dispatchEvent(new Event(control.eventName));
        }
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }

  window.__abdelhamidEffects = window.__abdelhamidEffects || {};
  window.__abdelhamidEffects['/assets/js/back-to-top.js'] = initBackToTop;
})();
