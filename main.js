/**
 * Rhode Island Kung Fu Club - Main JavaScript
 * Pure vanilla JS - no dependencies
 */

(function () {
  'use strict';

  // ==========================================================================
  // DOM Elements (cached for performance)
  // ==========================================================================

  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  /**
   * Throttle function to limit how often a function can fire
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // ==========================================================================
  // Mobile Menu Toggle
  // ==========================================================================

  function toggleMobileMenu() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', !isOpen);
    navMenu.classList.toggle('open', !isOpen);
    document.body.classList.toggle('no-scroll', !isOpen);

    if (isOpen) {
      navbar.classList.remove('no-blur-navbar');
    } else {
      navbar.classList.add('no-blur-navbar');
    }
  }

  function closeMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
    navbar.classList.remove('no-blur-navbar');
  }

  // ==========================================================================
  // Navbar Styling Based on Section
  // ==========================================================================

  function updateNavbarStyle(style) {
    navbar.classList.remove('bg-dark', 'bg-light', 'bg-transparent', 'blur-navbar');

    switch (style) {
      case 'dark':
        navbar.classList.add('bg-dark');
        break;
      case 'light':
        navbar.classList.add('bg-light');
        break;
      case 'transparent-blur':
        navbar.classList.add('bg-transparent', 'blur-navbar');
        break;
      default:
        navbar.classList.add('bg-transparent');
    }
  }

  // ==========================================================================
  // Scroll Spy - Highlight Active Nav Link & Update Navbar Style
  // ==========================================================================

  function handleScroll() {
    const scrollY = window.scrollY;
    const navbarHeight = navbar.offsetHeight;
    let currentSection = null;

    // Find the current section in view
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbarHeight - 50;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentSection = section;
      }
    });

    // Update navbar style based on current section
    if (currentSection) {
      const style = currentSection.dataset.navbar;
      updateNavbarStyle(style);

      // Update active nav link
      const currentId = currentSection.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    } else {
      // Default to transparent when at the very top
      updateNavbarStyle('transparent-blur');
      navLinks.forEach((link) => link.classList.remove('active'));
    }
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  // Mobile menu toggle
  navToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Throttled scroll handler (fires at most every 16ms ~60fps)
  window.addEventListener('scroll', throttle(handleScroll, 16));

  // Handle escape key to close mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileMenu();
      navToggle.focus();
    }
  });

  // ==========================================================================
  // Initialize
  // ==========================================================================

  // Run scroll handler on page load to set initial state
  handleScroll();
})();
