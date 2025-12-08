/* ============================================
   KYZLO LABS - JavaScript
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

    if (!tickerTime) return; // Exit if ticker elements don't exist

    // Update time display every second
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        tickerTime.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Flash animation helper
    function flashElement(el) {
        el.classList.add('updating');
        setTimeout(() => el.classList.remove('updating'), 300);
    }

    // Update ticker with next snapshot
    function updateTicker() {
        const snapshot = snapshots[currentIndex];

        // Update regime
        regimeValue.textContent = snapshot.regime;
        regimeValue.className = 'metric-value ' + snapshot.regimeClass;
        flashElement(regimeValue);

        // Update volatility
        volatilityValue.textContent = snapshot.volatility.toFixed(2);
        flashElement(volatilityValue);

        // Update confidence
        confidenceValue.textContent = snapshot.confidence + '%';
        flashElement(confidenceValue);

        // Update edge with color
        const edgeStr = snapshot.edge >= 0
            ? '+' + snapshot.edge.toFixed(2) + '%'
            : snapshot.edge.toFixed(2) + '%';
        edgeValue.textContent = edgeStr;
        edgeValue.classList.remove('positive', 'negative');
        edgeValue.classList.add(snapshot.edge >= 0 ? 'positive' : 'negative');

        // Flash effect on edge
        edgeValue.classList.add('flash');
        setTimeout(() => edgeValue.classList.remove('flash'), 150);

        // Increment ticks
        ticksBase += Math.floor(Math.random() * 500) + 100;
        ticksValue.textContent = ticksBase.toLocaleString();
        flashElement(ticksValue);

        // Cycle adapter states for visual interest
        const adapters = [adapterAlpaca, adapterTimescale, adapterChroma];
        adapters.forEach((adapter, i) => {
            // Randomly toggle processing state
            if (Math.random() > 0.7) {
                adapter.classList.add('processing');
                setTimeout(() => {
                    adapter.classList.remove('processing');
                    adapter.classList.add('active');
                }, 400);
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
    // Live Model Ticker
    // ============================================
    initLiveTicker();

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
