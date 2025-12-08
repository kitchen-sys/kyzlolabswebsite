/* ============================================
   KYZLO LABS - Premium JavaScript
   Institutional-Grade Interactions
   ============================================ */

// ============================================
// Live Ticker Demo - Cycles through 20 preset snapshots
// ============================================
function initLiveTicker() {
    // 20 preset model output snapshots
    const snapshots = [
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.42, confidence: 87, edge: +2.34 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.38, confidence: 91, edge: +3.12 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.45, confidence: 84, edge: +1.87 },
        { regime: 'NEUTRAL', regimeClass: 'regime-neutral', volatility: 0.52, confidence: 72, edge: +0.45 },
        { regime: 'NEUTRAL', regimeClass: 'regime-neutral', volatility: 0.58, confidence: 68, edge: -0.23 },
        { regime: 'BEARISH', regimeClass: 'regime-bearish', volatility: 0.67, confidence: 79, edge: -1.56 },
        { regime: 'BEARISH', regimeClass: 'regime-bearish', volatility: 0.71, confidence: 82, edge: -2.34 },
        { regime: 'BEARISH', regimeClass: 'regime-bearish', volatility: 0.64, confidence: 76, edge: -1.89 },
        { regime: 'NEUTRAL', regimeClass: 'regime-neutral', volatility: 0.55, confidence: 65, edge: +0.12 },
        { regime: 'NEUTRAL', regimeClass: 'regime-neutral', volatility: 0.48, confidence: 71, edge: +0.78 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.41, confidence: 85, edge: +2.01 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.35, confidence: 93, edge: +3.67 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.33, confidence: 95, edge: +4.21 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.37, confidence: 89, edge: +2.89 },
        { regime: 'NEUTRAL', regimeClass: 'regime-neutral', volatility: 0.49, confidence: 74, edge: +0.34 },
        { regime: 'BEARISH', regimeClass: 'regime-bearish', volatility: 0.62, confidence: 81, edge: -1.23 },
        { regime: 'BEARISH', regimeClass: 'regime-bearish', volatility: 0.69, confidence: 77, edge: -2.67 },
        { regime: 'NEUTRAL', regimeClass: 'regime-neutral', volatility: 0.54, confidence: 69, edge: -0.45 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.44, confidence: 83, edge: +1.56 },
        { regime: 'BULLISH', regimeClass: 'regime-bullish', volatility: 0.39, confidence: 88, edge: +2.78 }
    ];

    let currentIndex = 0;
    let ticksBase = 1247892;

    // DOM elements
    const tickerTime = document.getElementById('ticker-time');
    const regimeValue = document.getElementById('regime-value');
    const volatilityValue = document.getElementById('volatility-value');
    const confidenceValue = document.getElementById('confidence-value');
    const edgeValue = document.getElementById('edge-value');
    const ticksValue = document.getElementById('ticks-value');
    const adapterAlpaca = document.getElementById('adapter-alpaca');
    const adapterTimescale = document.getElementById('adapter-timescale');
    const adapterChroma = document.getElementById('adapter-chroma');

    if (!tickerTime) return;

    // Update time display
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        tickerTime.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Flash animation helper
    function flashElement(el) {
        if (!el) return;
        el.classList.add('updating');
        setTimeout(() => el.classList.remove('updating'), 400);
    }

    // Update ticker with next snapshot
    function updateTicker() {
        const snapshot = snapshots[currentIndex];

        // Update regime
        if (regimeValue) {
            regimeValue.textContent = snapshot.regime;
            regimeValue.className = 'metric-value ' + snapshot.regimeClass;
            flashElement(regimeValue);
        }

        // Update volatility
        if (volatilityValue) {
            volatilityValue.textContent = snapshot.volatility.toFixed(2);
            flashElement(volatilityValue);
        }

        // Update confidence
        if (confidenceValue) {
            confidenceValue.textContent = snapshot.confidence + '%';
            flashElement(confidenceValue);
        }

        // Update edge with color
        if (edgeValue) {
            const edgeStr = snapshot.edge >= 0
                ? '+' + snapshot.edge.toFixed(2) + '%'
                : snapshot.edge.toFixed(2) + '%';
            edgeValue.textContent = edgeStr;
            edgeValue.classList.remove('positive', 'negative');
            edgeValue.classList.add(snapshot.edge >= 0 ? 'positive' : 'negative');

            // Flash effect on edge
            edgeValue.classList.add('flash');
            setTimeout(() => edgeValue.classList.remove('flash'), 200);
        }

        // Increment ticks
        if (ticksValue) {
            ticksBase += Math.floor(Math.random() * 800) + 200;
            ticksValue.textContent = ticksBase.toLocaleString();
            flashElement(ticksValue);
        }

        // Cycle adapter states
        const adapters = [adapterAlpaca, adapterTimescale, adapterChroma];
        adapters.forEach((adapter) => {
            if (!adapter) return;
            if (Math.random() > 0.6) {
                adapter.classList.add('processing');
                setTimeout(() => {
                    adapter.classList.remove('processing');
                    adapter.classList.add('active');
                }, 500);
            }
        });

        // Move to next snapshot
        currentIndex = (currentIndex + 1) % snapshots.length;
    }

    // Initialize
    updateTime();
    updateTicker();

    // Update time every second
    setInterval(updateTime, 1000);

    // Update ticker every 2.5 seconds
    setInterval(updateTicker, 2500);
}

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
    let lastScroll = 0;
    let ticking = false;

    function updateNav() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
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
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show success message
        showNotification('Message sent! We\'ll be in touch soon.', 'success');
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
        '%cInstitutional-Grade Quantitative Research',
        'color: #a0a3b5; font-size: 14px; padding: 8px 0;'
    );
    console.log(
        '%cFinance & Sports Analytics Platform',
        'color: #5c5f73; font-size: 12px;'
    );
    console.log(
        '%chttps://github.com/kitchen-sys',
        'color: #00d4ff; font-size: 12px; padding-top: 4px;'
    );
}

// ============================================
// Initialize All
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initDynamicYear();
    initNavigation();
    initScrollReveal();
    initLiveTicker();
    initContactForm();
    initConsoleBranding();
});
