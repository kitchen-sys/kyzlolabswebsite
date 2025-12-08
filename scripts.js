/* ============================================
   KYZLO LABS - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Dynamic Year in Footer
    // ============================================
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Close mobile nav if open
                closeMobileNav();

                // Calculate offset for fixed nav
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    function closeMobileNav() {
        if (navLinks && navToggle) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Close nav on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileNav();
            }
        });
    }

    // ============================================
    // Contact Form Handler
    // ============================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // In production, this would send the message to a backend
            alert('In production, this would send your message to Kyzlo Labs.\n\nThank you for reaching out!');

            // Reset form
            contactForm.reset();
        });
    }

    // ============================================
    // Navigation Background on Scroll
    // ============================================
    const nav = document.getElementById('nav');

    if (nav) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.style.background = 'rgba(10, 11, 26, 0.95)';
            } else {
                nav.style.background = 'rgba(10, 11, 26, 0.85)';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections for fade-in animation
    const animateElements = document.querySelectorAll(
        '.platform-card, .arch-layer, .sports-feature, .feature-card, .step'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // Metrics Card Animation (Hero)
    // ============================================
    const metricsValues = document.querySelectorAll('.metric-value');

    // Subtle animation on the metrics to make them feel alive
    function animateMetricValue(element) {
        const originalText = element.textContent;

        // Only animate numeric values
        if (originalText.includes('%') || !isNaN(parseFloat(originalText))) {
            element.style.transition = 'opacity 0.2s ease';

            setInterval(() => {
                element.style.opacity = '0.7';
                setTimeout(() => {
                    element.style.opacity = '1';
                }, 100);
            }, 5000 + Math.random() * 3000);
        }
    }

    metricsValues.forEach(animateMetricValue);

    // ============================================
    // Console Easter Egg
    // ============================================
    console.log('%c KYZLO LABS ',
        'background: linear-gradient(135deg, #00d4ff, #d4a855); color: #0a0b1a; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 4px;'
    );
    console.log('%cQuantitative Research Lab for Finance & Sports',
        'color: #9a9cb5; font-size: 14px; padding: 5px 0;'
    );
    console.log('%chttps://github.com/kitchen-sys',
        'color: #00d4ff; font-size: 12px;'
    );
});
