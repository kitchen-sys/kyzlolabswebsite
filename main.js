/* ============================================
   KYZLO LABS - Main Application
   ============================================ */
(function() {
    'use strict';

    // Navigation
    function initNav() {
        const nav = document.getElementById('nav');
        const toggle = document.getElementById('nav-toggle');
        const links = document.getElementById('nav-links');
        if (!nav) return;

        let ticking = false;
        const updateNav = () => {
            nav.classList.toggle('scrolled', window.pageYOffset > 50);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });

        const closeNav = () => {
            links?.classList.remove('active');
            toggle?.classList.remove('active');
        };

        toggle?.addEventListener('click', () => {
            links.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!toggle?.contains(e.target) && !links?.contains(e.target)) closeNav();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNav();
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    closeNav();
                    const top = target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight - 20;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // Scroll Reveal
    function initReveal() {
        const els = document.querySelectorAll('.reveal, .stagger-children');
        if (!els.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

        els.forEach(el => obs.observe(el));
    }

    // Contact Form
    function initForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('#name')?.value.trim();
            const email = form.querySelector('#email')?.value.trim();
            const msg = form.querySelector('#message')?.value.trim();

            if (!name || !email || !msg) {
                notify('Please fill in all required fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                notify('Please enter a valid email.', 'error');
                return;
            }
            notify('Message sent! We\'ll be in touch within 24 hours.', 'success');
            form.reset();
        });
    }

    // Notifications
    function notify(msg, type = 'info') {
        document.querySelector('.notification')?.remove();

        const el = document.createElement('div');
        el.className = `notification notification-${type}`;
        el.innerHTML = `<span>${msg}</span><button class="notification-close">&times;</button>`;

        // Inject styles once
        if (!document.getElementById('notif-css')) {
            const s = document.createElement('style');
            s.id = 'notif-css';
            s.textContent = `
                .notification{position:fixed;bottom:32px;right:32px;padding:16px 24px;background:rgba(16,19,36,.95);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#f0f1f5;font-size:.95rem;display:flex;align-items:center;gap:16px;z-index:10000;backdrop-filter:blur(20px);animation:notifIn .4s cubic-bezier(.16,1,.3,1);box-shadow:0 8px 32px rgba(0,0,0,.4)}
                .notification-success{border-color:rgba(16,185,129,.4)}
                .notification-error{border-color:rgba(239,68,68,.4)}
                .notification-close{background:none;border:none;color:#a0a3b5;font-size:1.4rem;cursor:pointer;padding:0;line-height:1}
                .notification-close:hover{color:#f0f1f5}
                @keyframes notifIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
                @keyframes notifOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
            `;
            document.head.appendChild(s);
        }

        document.body.appendChild(el);

        const dismiss = () => {
            el.style.animation = 'notifOut .3s ease forwards';
            setTimeout(() => el.remove(), 300);
        };

        el.querySelector('.notification-close').addEventListener('click', dismiss);
        setTimeout(() => el.parentNode && dismiss(), 5000);
    }

    // Init
    function init() {
        // Year
        const yr = document.getElementById('year');
        if (yr) yr.textContent = new Date().getFullYear();

        initNav();
        initReveal();
        initForm();

        // Console branding
        console.log('%c KYZLO LABS ', 'background:linear-gradient(135deg,#00d4ff,#c9a227);color:#050508;font-size:24px;font-weight:bold;padding:12px 24px;border-radius:6px');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
