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
  const contactForm = document.getElementById('contact-form');

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

      // At the very top of the page, use transparent (no blur)
      // Once user scrolls a bit, apply the section's style
      if (scrollY < 50) {
        updateNavbarStyle('transparent');
      } else {
        updateNavbarStyle(style);
      }

      // Update active nav link
      const currentId = currentSection.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    } else {
      // Default to transparent when at the very top
      updateNavbarStyle('transparent');
      navLinks.forEach((link) => link.classList.remove('active'));
    }
  }

  // ==========================================================================
  // Contact Form Handling
  // ==========================================================================

  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // For now, show a message since there's no backend
    // In production, you'd send this to a backend or service like Formspree
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Message Sent!';
    submitBtn.disabled = true;

    // Create mailto link as fallback
    const subject = encodeURIComponent(`RIKFC Website: ${data.subject}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
    );

    // Open email client
    window.location.href = `mailto:shaoluyi@gmail.com?subject=${subject}&body=${body}`;

    // Reset form after delay
    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links (with offset for fixed navbar)
  // ==========================================================================

  function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute('href');

    if (href.startsWith('#')) {
      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      }
    }
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  // Mobile menu toggle
  navToggle.addEventListener('click', toggleMobileMenu);

  // Nav link clicks - smooth scroll and close mobile menu
  navLinks.forEach((link) => {
    link.addEventListener('click', handleAnchorClick);
  });

  // All anchor links with hash
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (!anchor.classList.contains('nav-link')) {
      anchor.addEventListener('click', handleAnchorClick);
    }
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

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  // Run scroll handler on page load to set initial state
  handleScroll();

  // Add loaded class for any CSS transitions that should only run after load
  document.body.classList.add('loaded');
})();
