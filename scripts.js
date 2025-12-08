/* ============================================
   KYZLO LABS - Premium JavaScript
   Professional Real-Time Data Visualization
   ============================================ */

// ============================================
// Live Ticker - Professional Implementation
// ============================================
class KyzloTicker {
    constructor() {
        this.elements = {};
        this.state = {
            regime: 'bullish',
            confidence: 87,
            volatility: 0.42,
            momentum: 1.24,
            edge: 2.34,
            signals: 1247892,
            sparklineData: []
        };
        this.snapshots = this.generateSnapshots();
        this.currentIndex = 0;
        this.animationFrame = null;

        this.init();
    }

    generateSnapshots() {
        return [
            { regime: 'bullish', confidence: 87, volatility: 0.42, momentum: 1.24, edge: 2.34 },
            { regime: 'bullish', confidence: 91, volatility: 0.38, momentum: 1.67, edge: 3.12 },
            { regime: 'bullish', confidence: 84, volatility: 0.45, momentum: 0.89, edge: 1.87 },
            { regime: 'neutral', confidence: 72, volatility: 0.52, momentum: 0.34, edge: 0.45 },
            { regime: 'neutral', confidence: 68, volatility: 0.58, momentum: -0.21, edge: -0.23 },
            { regime: 'bearish', confidence: 79, volatility: 0.67, momentum: -1.12, edge: -1.56 },
            { regime: 'bearish', confidence: 82, volatility: 0.71, momentum: -1.45, edge: -2.34 },
            { regime: 'bearish', confidence: 76, volatility: 0.64, momentum: -0.98, edge: -1.89 },
            { regime: 'neutral', confidence: 65, volatility: 0.55, momentum: 0.12, edge: 0.12 },
            { regime: 'neutral', confidence: 71, volatility: 0.48, momentum: 0.45, edge: 0.78 },
            { regime: 'bullish', confidence: 85, volatility: 0.41, momentum: 1.01, edge: 2.01 },
            { regime: 'bullish', confidence: 93, volatility: 0.35, momentum: 2.12, edge: 3.67 },
            { regime: 'bullish', confidence: 95, volatility: 0.33, momentum: 2.45, edge: 4.21 },
            { regime: 'bullish', confidence: 89, volatility: 0.37, momentum: 1.56, edge: 2.89 },
            { regime: 'neutral', confidence: 74, volatility: 0.49, momentum: 0.23, edge: 0.34 },
            { regime: 'bearish', confidence: 81, volatility: 0.62, momentum: -0.87, edge: -1.23 },
            { regime: 'bearish', confidence: 77, volatility: 0.69, momentum: -1.34, edge: -2.67 },
            { regime: 'neutral', confidence: 69, volatility: 0.54, momentum: -0.34, edge: -0.45 },
            { regime: 'bullish', confidence: 83, volatility: 0.44, momentum: 0.78, edge: 1.56 },
            { regime: 'bullish', confidence: 88, volatility: 0.39, momentum: 1.34, edge: 2.78 }
        ];
    }

    init() {
        // Cache DOM elements
        this.elements = {
            timestamp: document.getElementById('ticker-timestamp'),
            regimeValue: document.getElementById('regime-value'),
            confidenceFill: document.getElementById('confidence-fill'),
            confidenceValue: document.getElementById('confidence-value'),
            volValue: document.getElementById('vol-value'),
            momentumValue: document.getElementById('momentum-value'),
            edgeValue: document.getElementById('edge-value'),
            signalCount: document.getElementById('signal-count'),
            sparklineLine: document.getElementById('sparkline-line'),
            sparklineArea: document.getElementById('sparkline-area'),
            sparklineDot: document.getElementById('sparkline-dot'),
            feedDots: document.querySelectorAll('.feed-dot')
        };

        if (!this.elements.timestamp) return;

        // Initialize sparkline data
        for (let i = 0; i < 20; i++) {
            this.state.sparklineData.push(20 + Math.random() * 20);
        }

        // Start updates
        this.updateTimestamp();
        this.updateSparkline();

        setInterval(() => this.updateTimestamp(), 1000);
        setInterval(() => this.tick(), 2000);
    }

    // Smooth number animation
    animateValue(element, start, end, duration, formatter) {
        const startTime = performance.now();
        const diff = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-expo)
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = start + diff * eased;

            element.textContent = formatter(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateTimestamp() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        this.elements.timestamp.textContent = `${h}:${m}:${s}`;
    }

    tick() {
        const snapshot = this.snapshots[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.snapshots.length;

        // Update regime with transition
        if (snapshot.regime !== this.state.regime) {
            this.updateRegime(snapshot.regime);
        }

        // Animate confidence
        this.animateValue(
            this.elements.confidenceValue,
            this.state.confidence,
            snapshot.confidence,
            400,
            (v) => Math.round(v) + '%'
        );
        this.elements.confidenceFill.style.width = snapshot.confidence + '%';

        // Animate volatility
        this.animateValue(
            this.elements.volValue,
            this.state.volatility,
            snapshot.volatility,
            400,
            (v) => v.toFixed(2)
        );
        this.flashElement(this.elements.volValue);

        // Animate momentum
        this.animateValue(
            this.elements.momentumValue,
            this.state.momentum,
            snapshot.momentum,
            400,
            (v) => (v >= 0 ? '+' : '') + v.toFixed(2)
        );
        this.flashElement(this.elements.momentumValue);

        // Animate edge
        this.animateValue(
            this.elements.edgeValue,
            this.state.edge,
            snapshot.edge,
            400,
            (v) => (v >= 0 ? '+' : '') + v.toFixed(2) + '%'
        );
        this.elements.edgeValue.dataset.positive = snapshot.edge >= 0;
        this.flashElement(this.elements.edgeValue);

        // Update signals count
        const signalIncrease = Math.floor(Math.random() * 500) + 200;
        this.state.signals += signalIncrease;
        this.animateValue(
            this.elements.signalCount,
            this.state.signals - signalIncrease,
            this.state.signals,
            600,
            (v) => Math.floor(v).toLocaleString()
        );

        // Update sparkline
        this.state.sparklineData.shift();
        this.state.sparklineData.push(20 + snapshot.confidence * 0.3 + Math.random() * 10);
        this.updateSparkline();

        // Update feed dots animation
        this.animateFeedDots();

        // Update state
        Object.assign(this.state, snapshot);
    }

    updateRegime(regime) {
        const el = this.elements.regimeValue;
        el.style.transform = 'scale(0.95)';
        el.style.opacity = '0.5';

        setTimeout(() => {
            el.textContent = regime.toUpperCase();
            el.dataset.regime = regime;
            el.style.transform = 'scale(1)';
            el.style.opacity = '1';
        }, 150);
    }

    flashElement(element) {
        element.classList.add('changing');
        setTimeout(() => element.classList.remove('changing'), 300);
    }

    updateSparkline() {
        const data = this.state.sparklineData;
        const width = 200;
        const height = 40;
        const padding = 2;

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - padding - ((val - min) / range) * (height - padding * 2);
            return { x, y };
        });

        // Generate smooth curve using cubic bezier
        let linePath = `M ${points[0].x} ${points[0].y}`;
        let areaPath = `M ${points[0].x} ${height} L ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const p0 = points[i - 1];
            const p1 = points[i];
            const cpx = (p0.x + p1.x) / 2;
            linePath += ` C ${cpx} ${p0.y}, ${cpx} ${p1.y}, ${p1.x} ${p1.y}`;
            areaPath += ` C ${cpx} ${p0.y}, ${cpx} ${p1.y}, ${p1.x} ${p1.y}`;
        }

        areaPath += ` L ${points[points.length - 1].x} ${height} Z`;

        this.elements.sparklineLine.setAttribute('d', linePath);
        this.elements.sparklineArea.setAttribute('d', areaPath);

        // Update dot position
        const lastPoint = points[points.length - 1];
        this.elements.sparklineDot.setAttribute('cx', lastPoint.x);
        this.elements.sparklineDot.setAttribute('cy', lastPoint.y);
    }

    animateFeedDots() {
        const dots = this.elements.feedDots;
        const randomDot = dots[Math.floor(Math.random() * dots.length)];

        randomDot.classList.add('processing');
        setTimeout(() => {
            randomDot.classList.remove('processing');
        }, 500);
    }
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

    revealElements.forEach(el => revealObserver.observe(el));
    staggerContainers.forEach(container => revealObserver.observe(container));
}

// ============================================
// Navigation Scroll Behavior
// ============================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!nav) return;

    let ticking = false;

    function updateNav() {
        nav.classList.toggle('scrolled', window.pageYOffset > 50);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    function closeMobileNav() {
        navLinks?.classList.remove('active');
        navToggle?.classList.remove('active');
    }

    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!navToggle?.contains(e.target) && !navLinks?.contains(e.target)) {
            closeMobileNav();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMobileNav();

                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// Contact Form Handler
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        showNotification('Message sent! We\'ll be in touch within 24 hours.', 'success');
        form.reset();
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

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
                animation: notifIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
            }
            .notification-close:hover { color: #f0f1f5; }
            @keyframes notifIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes notifOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    const dismiss = () => {
        notification.style.animation = 'notifOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    };

    notification.querySelector('.notification-close').addEventListener('click', dismiss);
    setTimeout(() => notification.parentNode && dismiss(), 5000);
}

// ============================================
// Dynamic Year
// ============================================
function initDynamicYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

// ============================================
// Console Branding
// ============================================
function initConsoleBranding() {
    console.log(
        '%c KYZLO LABS ',
        'background: linear-gradient(135deg, #00d4ff, #c9a227); color: #050508; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px;'
    );
    console.log('%cAI-Driven Quant Intelligence', 'color: #a0a3b5; font-size: 13px;');
    console.log('%cFor Finance & Business', 'color: #5c5f73; font-size: 11px;');
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initDynamicYear();
    initNavigation();
    initScrollReveal();
    initContactForm();
    initConsoleBranding();

    // Initialize ticker
    new KyzloTicker();
});
