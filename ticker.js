/* ============================================
   KYZLO TICKER - Optimized for Performance
   ============================================ */
(function() {
    'use strict';

    const SNAPSHOTS = [
        { regime: 'bullish', confidence: 87, volatility: 0.42, momentum: 1.24, edge: 2.34 },
        { regime: 'bullish', confidence: 91, volatility: 0.38, momentum: 1.67, edge: 3.12 },
        { regime: 'bullish', confidence: 84, volatility: 0.45, momentum: 0.89, edge: 1.87 },
        { regime: 'neutral', confidence: 72, volatility: 0.52, momentum: 0.34, edge: 0.45 },
        { regime: 'neutral', confidence: 68, volatility: 0.58, momentum: -0.21, edge: -0.23 },
        { regime: 'bearish', confidence: 79, volatility: 0.67, momentum: -1.12, edge: -1.56 },
        { regime: 'bearish', confidence: 82, volatility: 0.71, momentum: -1.45, edge: -2.34 },
        { regime: 'bearish', confidence: 76, volatility: 0.64, momentum: -0.98, edge: -1.89 },
        { regime: 'neutral', confidence: 65, volatility: 0.55, momentum: 0.12, edge: 0.12 },
        { regime: 'bullish', confidence: 85, volatility: 0.41, momentum: 1.01, edge: 2.01 },
        { regime: 'bullish', confidence: 93, volatility: 0.35, momentum: 2.12, edge: 3.67 },
        { regime: 'bullish', confidence: 89, volatility: 0.37, momentum: 1.56, edge: 2.89 }
    ];

    let el = {};
    let state = {
        idx: 0,
        signals: 1247892,
        sparkData: [],
        current: SNAPSHOTS[0]
    };

    function init() {
        // Cache elements once
        el = {
            ts: document.getElementById('ticker-timestamp'),
            regime: document.getElementById('ticker-widget')?.querySelector('.regime-value'),
            confFill: document.getElementById('confidence-fill'),
            confVal: document.getElementById('ticker-widget')?.querySelector('.confidence-value'),
            vol: document.getElementById('vol-value'),
            mom: document.getElementById('momentum-value'),
            edge: document.getElementById('ticker-widget')?.querySelector('.metric-value.edge'),
            signals: document.getElementById('signal-count'),
            sparkLine: document.getElementById('sparkline-line'),
            sparkArea: document.getElementById('sparkline-area'),
            sparkDot: document.getElementById('sparkline-dot'),
            feeds: document.querySelectorAll('.ticker-feeds .feed-dot')
        };

        if (!el.ts) return;

        // Init sparkline data
        for (let i = 0; i < 20; i++) {
            state.sparkData.push(20 + Math.random() * 20);
        }

        updateTime();
        drawSparkline();

        // Fast intervals
        setInterval(updateTime, 1000);
        setInterval(tick, 1500);
    }

    function updateTime() {
        const d = new Date();
        el.ts.textContent =
            String(d.getHours()).padStart(2, '0') + ':' +
            String(d.getMinutes()).padStart(2, '0') + ':' +
            String(d.getSeconds()).padStart(2, '0');
    }

    function tick() {
        const snap = SNAPSHOTS[state.idx];
        state.idx = (state.idx + 1) % SNAPSHOTS.length;

        // Regime
        if (snap.regime !== state.current.regime && el.regime) {
            el.regime.style.opacity = '0.5';
            el.regime.style.transform = 'scale(0.95)';
            setTimeout(() => {
                el.regime.textContent = snap.regime.toUpperCase();
                el.regime.dataset.regime = snap.regime;
                el.regime.style.opacity = '1';
                el.regime.style.transform = 'scale(1)';
            }, 100);
        }

        // Direct updates (faster than animation)
        if (el.confFill) el.confFill.style.width = snap.confidence + '%';
        if (el.confVal) el.confVal.textContent = snap.confidence + '%';
        if (el.vol) el.vol.textContent = snap.volatility.toFixed(2);
        if (el.mom) el.mom.textContent = (snap.momentum >= 0 ? '+' : '') + snap.momentum.toFixed(2);
        if (el.edge) {
            el.edge.textContent = (snap.edge >= 0 ? '+' : '') + snap.edge.toFixed(2) + '%';
            el.edge.dataset.positive = snap.edge >= 0;
        }

        // Signals
        state.signals += Math.floor(Math.random() * 400) + 150;
        if (el.signals) el.signals.textContent = state.signals.toLocaleString();

        // Sparkline
        state.sparkData.shift();
        state.sparkData.push(20 + snap.confidence * 0.3 + Math.random() * 10);
        drawSparkline();

        // Feed dots
        if (el.feeds.length) {
            const dot = el.feeds[Math.floor(Math.random() * el.feeds.length)];
            dot.classList.add('processing');
            setTimeout(() => dot.classList.remove('processing'), 400);
        }

        state.current = snap;
    }

    function drawSparkline() {
        if (!el.sparkLine) return;

        const data = state.sparkData;
        const w = 200, h = 40, p = 2;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const pts = data.map((v, i) => ({
            x: (i / (data.length - 1)) * w,
            y: h - p - ((v - min) / range) * (h - p * 2)
        }));

        let line = `M ${pts[0].x} ${pts[0].y}`;
        let area = `M ${pts[0].x} ${h} L ${pts[0].x} ${pts[0].y}`;

        for (let i = 1; i < pts.length; i++) {
            const cx = (pts[i-1].x + pts[i].x) / 2;
            line += ` C ${cx} ${pts[i-1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
            area += ` C ${cx} ${pts[i-1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
        }
        area += ` L ${pts[pts.length-1].x} ${h} Z`;

        el.sparkLine.setAttribute('d', line);
        if (el.sparkArea) el.sparkArea.setAttribute('d', area);
        if (el.sparkDot) {
            el.sparkDot.setAttribute('cx', pts[pts.length-1].x);
            el.sparkDot.setAttribute('cy', pts[pts.length-1].y);
        }
    }

    // Start immediately when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
