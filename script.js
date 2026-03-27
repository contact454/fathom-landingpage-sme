document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis Smooth Scroll Setup (Trái tim của trải nghiệm cuộn Awwwards)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Kích hoạt GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Sync GSAP Animation Engine với Lenis Scroll
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0, 0);

    // Xử lý đổi màu Navbar nền khi cuộn
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.style.background = 'rgba(251, 248, 244, 0.95)';
            navbar.style.borderBottom = '1px dashed var(--border-ink)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.borderBottom = 'none';
        }
    });

    // 2. Tinh Túy GSAP: SplitType Text Reveal (CHẺ CHỮ MA THUẬT)
    const splitTitles = new SplitType('.title-serif, .section-title', { types: 'words, chars' });
    
    // Khởi tạo trạng thái ẩn và lật chữ 90 độ
    gsap.set(splitTitles.chars, { opacity: 0, y: 50, rotateX: -90 });
    
    ScrollTrigger.batch('.title-serif, .section-title', {
        onEnter: batch => {
            batch.forEach(title => {
                gsap.to(title.querySelectorAll('.char'), {
                    opacity: 1, y: 0, rotateX: 0,
                    stagger: 0.02, duration: 1, ease: 'back.out(1.7)'
                });
            });
        },
        once: true
    });

    // 3. Hero Animations (Hiện text và rèm vuốt màn hình Hero Image)
    gsap.from(".gsap-hero-stagger p, .gsap-hero-stagger a, .gsap-hero-stagger .stats-badge", {
        y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.8
    });

    // Kéo rèm hiện Tranh Masterpiece (Clip-Path)
    gsap.from(".hero-art img, .hero-art video", {
        clipPath: "inset(100% 0 0 0)", // Rèm kéo từ dưới lên
        duration: 1.5,
        ease: "power4.inOut",
        delay: 0.3
    });

    // 4. Mở Rèm Phép Thuật: Clip-Path Reveal cho toàn bộ các khu vực chứa tranh nghệ thuật
    const imagesToReveal = gsap.utils.toArray('.pain-visual-center img, .pain-visual-center video, .openclaw-section img, .openclaw-section video, .philosophy-visual img, .philosophy-visual video, .agent-visual img, .agent-visual video');
    imagesToReveal.forEach(img => {
        gsap.from(img, {
            scrollTrigger: { trigger: img, start: "top 85%" },
            clipPath: "inset(0 100% 0 0)", // Kéo xé rèm từ trái sang phải
            duration: 1.5, ease: "power4.inOut"
        });
    });

    // 5. QUÁI VẬT CUỐI CÙNG: GSAP CARD STACKING CHXẾP BÀI (6 Tinh Linh)
    const agentRows = gsap.utils.toArray('.agent-row');
    
    agentRows.forEach((row, i) => {
        // Không áp dụng hiệu ứng cho phần tử cuối cùng
        if (i !== agentRows.length - 1) {
            gsap.to(row, {
                scale: 0.9, 
                opacity: 0.2, 
                ease: "none",
                scrollTrigger: {
                    trigger: row,
                    start: "top top", 
                    end: "bottom top", 
                    scrub: true
                    // Đã thay gỡ bỏ pin: true và pinSpacing: false
                    // để văn bản Sách Phép không bị che lấp khi Lướt chuột.
                    // Bây giờ Element sẽ lướt lên trên bình thường nhưng có hiệu ứng chìm dần (Fade Scale)
                }
            });
        }
    });

    // 6. Scroll Fade Up (Nhẹ nhàng tâng các khối Icon Text phụ)
    const fadeUpElements = gsap.utils.toArray('.gsap-fade-up, .story-item');
    fadeUpElements.forEach(elem => {
        // Chỉ chạy Fade nếu element này chưa bị Split Chữ chiếm dụng
        if (!elem.classList.contains('title-serif') && !elem.classList.contains('section-title') && !elem.classList.contains('agent-content')) {
            gsap.from(elem, {
                scrollTrigger: { trigger: elem, start: "top 90%", toggleActions: "play none none reverse" },
                y: 50, opacity: 0, duration: 0.8, ease: "power2.out"
            });
        }
    });

    // 7. Parallax Background & Elements (scrubbing)
    const parallaxContainers = gsap.utils.toArray('.gsap-parallax-img img, .gsap-parallax-img video, .bg-video-scrub');
    parallaxContainers.forEach(img => {
        gsap.set(img, { transformOrigin: 'center center', scale: 1.15 });
        gsap.to(img, {
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
            yPercent: -15, ease: "none"
        });
    });

    // 8. Hiệu ứng Parallax nhẹ cho 2 Quả cầu sáng rơi vãi trước cửa Hero
    gsap.to(".pet-1", { scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }, y: -100, rotation: 15 });
    gsap.to(".pet-2", { scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 }, y: -150, rotation: -25 });
});
