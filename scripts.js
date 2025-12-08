/* ============================================
   KYZLO LABS - Premium JavaScript
   Business-Focused Interactions
   ============================================ */

// ============================================
// Scroll Reveal Animation
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const staggerContainers = document.querySelectorAll('.stagger-children');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    staggerContainers.forEach(container => {
        revealObserver.observe(container);
    });
}

// ============================================
// Navigation Scroll Behavior
// ============================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!nav) return;

    // Scroll state
    let ticking = false;

    function updateNav() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    // Mobile toggle
    function closeMobileNav() {
        if (navLinks && navToggle) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileNav();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileNav();
            }
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMobileNav();

                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Contact Form Handler
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show success message
        showNotification('Message sent! We\'ll be in touch within 24 hours.', 'success');
        contactForm.reset();
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles if not present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 32px;
                right: 32px;
                padding: 16px 24px;
                background: rgba(16, 19, 36, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: #f0f1f5;
                font-size: 0.95rem;
                display: flex;
                align-items: center;
                gap: 16px;
                z-index: 10000;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            }
            .notification-success { border-color: rgba(16, 185, 129, 0.4); }
            .notification-error { border-color: rgba(239, 68, 68, 0.4); }
            .notification-close {
                background: none;
                border: none;
                color: #a0a3b5;
                font-size: 1.4rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                transition: color 0.2s ease;
            }
            .notification-close:hover { color: #f0f1f5; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto dismiss
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// Dynamic Year
// ============================================
function initDynamicYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// Console Branding
// ============================================
function initConsoleBranding() {
    console.log(
        '%c KYZLO LABS ',
        'background: linear-gradient(135deg, #00d4ff, #c9a227); color: #050508; font-size: 28px; font-weight: bold; padding: 12px 24px; border-radius: 6px;'
    );
    console.log(
        '%cAI-Driven Quant Intelligence',
        'color: #a0a3b5; font-size: 14px; padding: 8px 0;'
    );
    console.log(
        '%cFor Finance & Business',
        'color: #5c5f73; font-size: 12px;'
    );
}

// ============================================
// Initialize All
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initDynamicYear();
    initNavigation();
    initScrollReveal();
    initContactForm();
    initConsoleBranding();
});
