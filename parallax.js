class ParallaxController {
    constructor() {
        this.ticking = false;
        this.scrollY = 0;
        this.sections = [];
        this.init();
    }

    init() {
        this.header = document.querySelector('header');
        this.sections = Array.from(document.querySelectorAll('[data-parallax]'));
        this.sections.forEach((section, index) => {
            const type = section.getAttribute('data-parallax');
            section.dataset.index = index;

            this.setupParallaxLayers(section, type);
        });

        window.addEventListener('scroll', () => this.requestUpdate(), { passive: true });
        window.addEventListener('resize', () => this.requestUpdate(), { passive: true });
        window.addEventListener('load', () => this.update());

        this.update();
    }

    setupParallaxLayers(section, type) {
        const heroText = section.querySelector('.hero-text');
        const heroImage = section.querySelector('.hero-image');
        const sectionContent = section.querySelector('.section-content');
        const featureItems = section.querySelectorAll('.feature-item');

        if (heroText) heroText.dataset.parallaxLayer = 'slow';
        if (heroImage) heroImage.dataset.parallaxLayer = 'fast';
        if (sectionContent) sectionContent.dataset.parallaxLayer = 'medium';

        featureItems.forEach((item, i) => {
            item.dataset.parallaxLayer = 'stagger';
            item.dataset.staggerIndex = i;
        });
    }

    requestUpdate() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => this.update());
            this.ticking = true;
        }
    }

    update() {
        this.scrollY = window.pageYOffset;
        this.updateHeader();
        this.sections.forEach(section => this.updateSection(section));
        this.ticking = false;
    }

    updateHeader() {
        if (this.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    updateSection(section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const sectionMiddle = sectionTop + (sectionHeight / 2);
        const screenMiddle = this.scrollY + (windowHeight / 2);
        const distanceFromCenter = screenMiddle - sectionMiddle;
        const progress = distanceFromCenter / (windowHeight + sectionHeight);
        const isVisible = rect.top < windowHeight && rect.bottom > 0;

        if (!isVisible) return;
        this.applyParallaxToLayers(section, progress, rect);
        this.applySectionEffects(section, progress, rect);
    }

    applyParallaxToLayers(section, progress, rect) {
        const heroText = section.querySelector('[data-parallax-layer="slow"]');
        const heroImage = section.querySelector('[data-parallax-layer="fast"]');
        const sectionContent = section.querySelector('[data-parallax-layer="medium"]');
        const staggerItems = section.querySelectorAll('[data-parallax-layer="stagger"]');

        if (heroText) {
            const offset = progress * 50;
            const scale = 1 + Math.max(0, -progress * 0.1);
            const opacity = Math.max(0.2, 1 - Math.abs(progress) * 0.8);

            heroText.style.transform = `translateY(${offset}px) scale(${scale})`;
            heroText.style.opacity = opacity;
        }

        if (heroImage) {
            const image = heroImage.querySelector('.commercial-image');
            if (image) {
                const offset = -progress * 120;
                const scale = 1 + Math.abs(progress) * 0.15;
                const rotation = progress * 3;

                image.style.transform = `translateY(${offset}px) scale(${scale}) rotate(${rotation}deg)`;
            }
        }

        if (sectionContent) {
            const offset = progress * 80;
            const opacity = Math.max(0.05, 1 - Math.abs(progress) * 1.2);

            sectionContent.style.transform = `translateY(${offset}px)`;
            sectionContent.style.opacity = opacity;
        }

        staggerItems.forEach((item) => {
            const index = parseInt(item.dataset.staggerIndex);
            const staggerDelay = index * 0.1;
            const itemProgress = progress + staggerDelay;
            const offset = Math.max(-50, itemProgress * 60);
            const opacity = Math.max(0, Math.min(1, 1.5 - Math.abs(itemProgress) * 2));
            const scale = Math.max(0.9, 1 - Math.abs(itemProgress) * 0.15);

            item.style.transform = `translateY(${offset}px) scale(${scale})`;
            item.style.opacity = opacity;
        });
    }

    applySectionEffects(section, progress, rect) {
        const type = section.getAttribute('data-parallax');

        if (type === 'hero') {
            const hueShift = Math.abs(progress) * 10;
            section.style.filter = `hue-rotate(${hueShift}deg)`;
        }

        if (type === 'features') {
            const brightness = 1 + (Math.sin(progress * Math.PI) * 0.1);
            section.style.filter = `brightness(${brightness})`;
        }

        if (type === 'about') {
            const saturation = 1 + (Math.cos(progress * Math.PI) * 0.2);
            section.style.filter = `saturate(${saturation})`;
        }
    }
}

function initParallax() {
    new ParallaxController();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
} else {
    initParallax();
}
