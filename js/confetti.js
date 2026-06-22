/*
    celebrate.oze.au — Drifting Confetti Animation
    File: /js/confetti.js
    Web site by: Colin Dixon BSc, DipEd, Cert IV TAE  +  Claude Opus 4.8
    Phone: 0419 415 000 · Email: col@dixon.au
    Website: https://celebrate.oze.au
    Date: 22 June 2026 · Version: 1.13 · Time AEST

    Fixed full-viewport canvas behind the page (z-index:2 so the confetti drifts
    above the glass cards — semi-transparent and pointer-events:none, so the
    background photo and text read straight through). Renders:
      - drifting / falling confetti rectangles (the birthday-hub celebration feel)
      - brand palette amber #ffc107, blue #3498db, white — each piece tumbles
        on its own axis and sways side-to-side as it falls
      - pieces recycle to the top once they fall off the bottom
    Respects prefers-reduced-motion (skips entirely), drops the piece count on
    mobile, and pauses the render loop when the tab is hidden.

    Global by default. Opt a page out with <body data-confetti="off"> (e.g. a
    calmer event folder); confetti.js stays self-contained and reads no JSON.
*/
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.body && document.body.dataset.confetti === 'off') return;

    // ── Canvas ───────────────────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    // ── Helpers ──────────────────────────────────────────────────────────────
    const mobile = () => window.innerWidth < 768;
    const rgba   = ([r, g, b], a) => `rgba(${r},${g},${b},${(+a).toFixed(3)})`;
    const rand   = (lo, hi) => lo + Math.random() * (hi - lo);

    const AMBER = [255, 193,   7];   // #ffc107
    const BLUE  = [ 52, 152, 219];   // #3498db
    const WHITE = [255, 255, 255];
    const COLORS = [AMBER, BLUE, WHITE];

    // ── State ────────────────────────────────────────────────────────────────
    let W, H, raf = null, pieces = [];

    // ── Build ────────────────────────────────────────────────────────────────
    function makePiece(fromTop) {
        return {
            x:      rand(0, W),
            y:      fromTop ? rand(-H, 0) : rand(0, H),
            w:      rand(5, 11),
            h:      rand(8, 16),
            color:  COLORS[(Math.random() * COLORS.length) | 0],
            alpha:  rand(0.45, 0.8),
            vy:     rand(0.6, 1.8),                 // fall speed
            rot:    rand(0, Math.PI * 2),
            vr:     rand(-0.06, 0.06),              // tumble speed
            swayA:  rand(8, 26),                    // horizontal sway amplitude
            swayF:  rand(0.008, 0.022),             // sway frequency
            phase:  rand(0, Math.PI * 2),
        };
    }

    function build() {
        const count = mobile() ? 40 : 90;
        pieces = Array.from({ length: count }, () => makePiece(false));
    }

    // ── Draw ─────────────────────────────────────────────────────────────────
    function draw() {
        raf = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, W, H);

        for (const p of pieces) {
            p.y    += p.vy;
            p.phase += p.swayF;
            p.x    += Math.sin(p.phase) * 0.6;       // gentle drift
            p.rot  += p.vr;

            // Recycle once fully past the bottom (or drifted far off-side)
            if (p.y - p.h > H || p.x < -40 || p.x > W + 40) {
                Object.assign(p, makePiece(true));
                continue;
            }

            const sx = p.x + Math.sin(p.phase) * p.swayA;
            ctx.save();
            ctx.translate(sx, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = rgba(p.color, p.alpha);
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        build();
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) draw();
    });

    resize();
    draw();
})();
