/**
 * MyLaurance Landing Page — Animazioni e Interazioni
 */
(function () {
    'use strict';

    /* ---- IntersectionObserver per le rivelazioni allo scroll ---- */
    function initReveal() {
        const els = document.querySelectorAll('.ml-reveal, .ml-reveal-left, .ml-reveal-right');
        if (!els.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('ml-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        els.forEach((el) => observer.observe(el));
    }

    /* ---- Navbar allo scroll ---- */
    function initNavbar() {
        const nav = document.querySelector('.ml-navbar');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            nav.classList.toggle('ml-scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ---- Menu mobile toggle ---- */
    function initMobileMenu() {
        const toggle = document.querySelector('.ml-menu-toggle');
        const links = document.querySelector('.ml-nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('ml-active');
            links.classList.toggle('ml-open');
        });

        // Chiudi al click su un link
        links.querySelectorAll('a').forEach((a) =>
            a.addEventListener('click', () => {
                toggle.classList.remove('ml-active');
                links.classList.remove('ml-open');
            })
        );
    }

    /* ---- Scroll fluido ---- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href');
                if (id === '#') return;
                const el = document.querySelector(id);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* ---- Effetto parallasse sui bagliori dell'hero ---- */
    function initParallax() {
        const hero = document.querySelector('.ml-hero');
        if (!hero) return;

        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            hero.style.setProperty('--parallax-x', x + 'px');
            hero.style.setProperty('--parallax-y', y + 'px');

            // Movimento sottile sulle borse flottanti
            const bags = hero.querySelectorAll('.ml-floating-bag');
            bags.forEach((bag, i) => {
                const factor = (i + 1) * 0.4;
                bag.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        }, { passive: true });
    }

    /* ---- Slider Testimonianze ---- */
    function initTestimonials() {
        const slider = document.querySelector('.ml-testimonial-slider');
        const dots = document.querySelectorAll('.ml-dot');
        if (!slider || !dots.length) return;

        let current = 0;
        const total = dots.length;
        let autoTimer;

        function goTo(i) {
            current = ((i % total) + total) % total;
            slider.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, idx) => d.classList.toggle('ml-active', idx === current));
        }

        dots.forEach((d, idx) =>
            d.addEventListener('click', () => {
                goTo(idx);
                resetAuto();
            })
        );

        function resetAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 5000);
        }

        resetAuto();
    }

    /* ---- Particelle Scintillanti ---- */
    function initParticles() {
        const canvas = document.querySelector('.ml-particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.2,
            pulse: Math.random() * Math.PI * 2,
        }));

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.dx;
                p.y += p.dy;
                p.pulse += 0.02;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(178, 34, 34, ${a})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
    }

    /* ---- Rivelazione sfalsata per le card delle funzionalità ---- */
    function initStagger() {
        const cards = document.querySelectorAll('.ml-feature-card');
        cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.12}s`;
        });
    }

    /* ---- Carosello Vetrina ---- */
    function initShowcase() {
        const slider = document.querySelector('.ml-showcase-slider');
        const dots = document.querySelectorAll('.ml-showcase-dot');
        const prevBtn = document.querySelector('.ml-showcase-prev');
        const nextBtn = document.querySelector('.ml-showcase-next');
        if (!slider || !dots.length) return;

        let current = 0;
        const total = dots.length;
        let autoTimer;

        function goTo(i) {
            current = ((i % total) + total) % total;
            slider.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, idx) => d.classList.toggle('ml-active', idx === current));
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

        dots.forEach((d, idx) =>
            d.addEventListener('click', () => { goTo(idx); resetAuto(); })
        );

        function resetAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 6000);
        }

        resetAuto();
    }

    /* ---- Inizializza tutto ---- */
    document.addEventListener('DOMContentLoaded', () => {
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initReveal();
        initParallax();
        initTestimonials();
        initShowcase();
        initParticles();
        initStagger();
    });
})();
