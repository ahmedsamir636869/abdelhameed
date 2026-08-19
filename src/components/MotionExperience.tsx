'use client';

import { MotionConfig, useAnimate, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

type MotionExperienceProps = {
  markup: string;
};

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

function selectElements(root: HTMLElement, selector: string, limit = 48) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).slice(0, limit);
}

/**
 * Adds a consistent Framer Motion layer around the preserved static page markup.
 * Content remains server-rendered; motion is progressively enhanced after hydration.
 */
export function MotionExperience({ markup }: MotionExperienceProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const root = scope.current;
    const navbar = root?.querySelector<HTMLElement>('.navbar');
    const navigation = root?.querySelector<HTMLElement>('.navigation');
    const toggle = root?.querySelector<HTMLButtonElement>('.mobile-toggle');

    if (!root || !navbar || !navigation || !toggle) {
      return;
    }

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

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navigation.classList.contains('is-open') && !navbar.contains(event.target as Node)) {
        closeNavigation();
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        closeNavigation();
        toggle.focus();
      }
    };

    const closeAboveMobile = () => {
      if (window.innerWidth > 950) {
        closeNavigation();
      }
    };

    toggle.addEventListener('click', toggleNavigation);
    root.querySelectorAll('.navigation a').forEach((link) => link.addEventListener('click', closeNavigation));
    document.addEventListener('click', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeAboveMobile);

    const navLinks = navigation.querySelector<HTMLElement>('.nav-links');
    const navItems = navLinks ? Array.from(navLinks.querySelectorAll<HTMLAnchorElement>('li > a')) : [];
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const bubbleCleanupCallbacks: Array<() => void> = [];
    let bubble: HTMLDivElement | null = null;

    const moveBubble = (link: HTMLAnchorElement) => {
      if (!navLinks || !bubble) {
        return;
      }

      const container = navLinks.getBoundingClientRect();
      const target = link.getBoundingClientRect();
      void animate(
        bubble,
        {
          opacity: 1,
          x: target.left - container.left,
          y: target.top - container.top,
          width: target.width,
          height: target.height,
        },
        { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
      );
    };

    const hideBubble = () => {
      if (bubble) {
        void animate(bubble, { opacity: 0 }, { duration: 0.16 });
      }
    };

    if (navLinks && canHover) {
      bubble = document.createElement('div');
      bubble.className = 'nav-glass-hover';
      navLinks.prepend(bubble);
      navItems.forEach((item) => {
        const handleEnter = () => moveBubble(item);
        item.addEventListener('pointerenter', handleEnter);
        bubbleCleanupCallbacks.push(() => item.removeEventListener('pointerenter', handleEnter));
      });
      navLinks.addEventListener('pointerleave', hideBubble);
      bubbleCleanupCallbacks.push(() => navLinks.removeEventListener('pointerleave', hideBubble));
    }

    return () => {
      closeNavigation();
      toggle.removeEventListener('click', toggleNavigation);
      root.querySelectorAll('.navigation a').forEach((link) => link.removeEventListener('click', closeNavigation));
      document.removeEventListener('click', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeAboveMobile);
      bubbleCleanupCallbacks.forEach((cleanup) => cleanup());
      bubble?.remove();
    };
  }, [animate]);

  useEffect(() => {
    const root = scope.current;

    if (!root || shouldReduceMotion) {
      return;
    }

    root.dataset.motionReady = 'true';

    const heroContent = root.querySelector<HTMLElement>(HERO_CONTENT_SELECTOR);
    if (heroContent) {
      void animate(
        heroContent,
        { opacity: [0, 1], y: [22, 0], filter: ['blur(8px)', 'blur(0px)'] },
        { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
      );
    }

    selectElements(root, '.hero-stat').forEach((stat, index) => {
      void animate(
        stat,
        { opacity: [0, 1], y: [18, 0], scale: [0.96, 1] },
        { delay: 0.22 + index * 0.07, duration: 0.48, ease: [0.22, 1, 0.36, 1] },
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          observer.unobserve(target);
          target.dataset.motionRevealed = 'true';

          void animate(
            target,
            { opacity: [0, 1], y: [28, 0], scale: [0.985, 1], filter: ['blur(8px)', 'blur(0px)'] },
            { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
          );
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    const revealTargets = selectElements(root, REVEAL_SELECTOR, 24);
    revealTargets.forEach((target) => {
      target.dataset.motionReveal = 'true';
      observer.observe(target);
    });

    const cleanupCallbacks: Array<() => void> = [];
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (canHover) {
      selectElements(root, TACTILE_SELECTOR, 40).forEach((target) => {
        const enter = () => {
          void animate(target, { y: -5, scale: 1.008 }, { type: 'spring', stiffness: 340, damping: 24 });
        };
        const leave = () => {
          void animate(target, { y: 0, scale: 1 }, { type: 'spring', stiffness: 340, damping: 28 });
        };

        target.addEventListener('pointerenter', enter);
        target.addEventListener('pointerleave', leave);
        cleanupCallbacks.push(() => {
          target.removeEventListener('pointerenter', enter);
          target.removeEventListener('pointerleave', leave);
        });
      });
    }

    return () => {
      observer.disconnect();
      cleanupCallbacks.forEach((cleanup) => cleanup());
      delete root.dataset.motionReady;
    };
  }, [animate, shouldReduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={scope}
        className="motion-page relative isolate min-h-screen overflow-x-clip"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </MotionConfig>
  );
}
