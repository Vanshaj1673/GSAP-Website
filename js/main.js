document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    const preloader = document.querySelector('.preloader');
    const preloaderSpinner = document.querySelector('.preloader__spinner');

    if (preloader) {
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (hasVisited) {

            gsap.set(preloader, { display: 'none', opacity: 0 });
            gsap.from('body', { opacity: 0, duration: 0.6, ease: 'power2.out' });
            ScrollTrigger.refresh();
        } else {
            gsap.set('body', { overflow: 'hidden' });
            sessionStorage.setItem('hasVisited', 'true');

            const dismissPreloader = () => {
                const preloaderTl = gsap.timeline({
                    delay: 3,
                    onComplete: () => {
                        gsap.set(preloader, { display: 'none' });
                        gsap.set('body', { overflowY: 'auto' });
                        ScrollTrigger.refresh();
                    }
                });

                preloaderTl.to(preloaderSpinner, {
                    scale: 30,
                    duration: 1,
                    ease: 'power2.in'
                });

                preloaderTl.to(preloader, {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                }, '-=0.3');
            };

            if (document.readyState === 'complete') {
                dismissPreloader();
            } else {
                window.addEventListener('load', dismissPreloader);
            }
        }
    } else {

        gsap.from('body', { opacity: 0, duration: 0.6, ease: 'power2.out' });
    }


    gsap.from('.sidebar__home', {
        duration: 1.5,
        y: -50,
        opacity: 0,
        ease: 'power3.out',
        delay: 1.5
    });

    gsap.to('.circular-menu', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        rotation: 1080,
        ease: 'none'
    });


    const marqueeInner = document.querySelector('.marquee__inner');
    if (marqueeInner) {
        const originalSpan = marqueeInner.querySelector('.marquee__item');
        if (originalSpan) {
            const cloneCount = 15;
            for (let i = 0; i < cloneCount; i++) {
                marqueeInner.appendChild(originalSpan.cloneNode(true));
            }
        }

        const items = gsap.utils.toArray('.marquee__item');

        const itemHeight = items[0].offsetHeight;
        const totalHeight = itemHeight * items.length;


        marqueeInner.style.height = totalHeight + 'px';
        gsap.set(items, {
            y: (i) => i * itemHeight
        });

        const wrapY = gsap.utils.wrap(-itemHeight, totalHeight - itemHeight);

        gsap.to(items, {
            y: `+=${totalHeight * 0.5}`,
            ease: 'none',
            modifiers: {
                y: gsap.utils.unitize(y => wrapY(parseFloat(y)))
            },
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });
    }

    gsap.from('.hero__img', {
        scale: 1.2,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.5
    });

    const mm = gsap.matchMedia();

    mm.add({
        isDesktop: "(min-width: 993px)",
        isTabletLandscape: "(min-width: 769px) and (max-width: 992px)",
        isTabletPortrait: "(min-width: 481px) and (max-width: 768px)",
        isMobile: "(max-width: 480px)"
    }, (context) => {
        let { isDesktop, isTabletLandscape, isTabletPortrait, isMobile } = context.conditions;
        let leftOffset = '250px';
        if (isTabletLandscape) leftOffset = '80px';
        if (isTabletPortrait) leftOffset = '40px';
        if (isMobile) leftOffset = '30px';

        let heroTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '+=100%',
                scrub: 1,
                pin: true,
                immediateRender: true
            }
        });

        heroTimeline.fromTo('.hero__image',
            {
                width: '100%',
                left: '0',
                top: '20vh',
                height: '80vh'
            },
            {
                width: 'auto',
                left: leftOffset,
                right: 0,
                top: '25vh',
                height: '75vh',
                duration: 1,
                ease: 'power2.inOut'
            }, 0);

        heroTimeline.to('.marquee', {
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0.3);

        heroTimeline.to('.content', {
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0.5);
    });

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');


    window.addEventListener('mousemove', (e) => {
        gsap.to([cursorDot, cursorCircle], { opacity: 1, duration: 0.2, overwrite: 'auto' });
    }, { once: true });

    const xToDot = gsap.quickTo(cursorDot, "x", { duration: 0.05, ease: "power3" });
    const yToDot = gsap.quickTo(cursorDot, "y", { duration: 0.05, ease: "power3" });
    const xToCircle = gsap.quickTo(cursorCircle, "x", { duration: 0.5, ease: "power3" });
    const yToCircle = gsap.quickTo(cursorCircle, "y", { duration: 0.5, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
        xToDot(e.clientX);
        yToDot(e.clientY);
        xToCircle(e.clientX);
        yToCircle(e.clientY);
    });

    const hoverTargets = document.querySelectorAll('.circular-menu, .sidebar__home, .scroll-next-section');

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorCircle.classList.add('cursor-circle--active', 'cursor--hovering');
            cursorDot.classList.add('cursor--hovering');
        });
        target.addEventListener('mouseleave', () => {
            cursorCircle.classList.remove('cursor-circle--active', 'cursor--hovering');
            cursorDot.classList.remove('cursor--hovering');
        });
    });

    const scrollNextSpacer = document.querySelector('.scroll-next-spacer');
    const nextPage = document.body.dataset.nextPage;
    const sidebar = document.querySelector('.sidebar');
    const marqueeEl = document.querySelector('.marquee');
    const circularMenu = document.querySelector('.circular-menu');

    if (scrollNextSpacer && nextPage) {
        let hasNavigated = false;

        const fixedEls = [sidebar, marqueeEl, circularMenu].filter(Boolean);
        setTimeout(() => {
            if (fixedEls.length) {
                gsap.to(fixedEls, {
                    autoAlpha: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: scrollNextSpacer,
                        start: 'top bottom',
                        end: 'top center',
                        scrub: true
                    }
                });
            }

            gsap.fromTo('.scroll-next-section__arrow',
                { y: -100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: scrollNextSpacer,
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: true
                    }
                }
            );

            ScrollTrigger.refresh();
        }, 800);

        ScrollTrigger.create({
            trigger: scrollNextSpacer,
            start: 'bottom-=50 bottom',
            onEnter: () => {
                if (hasNavigated) return;
                hasNavigated = true;

                gsap.to('body', {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        window.location.href = nextPage;
                    }
                });
            }
        });
    }
});
