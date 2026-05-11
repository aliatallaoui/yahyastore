window.UI = (() => {
    // ── Toast notifications ───────────────────────────────────────────────────
    let _toastEl = null;
    let _toastTimer = null;

    function ensureToast() {
        if (_toastEl) return;
        _toastEl = document.createElement('div');
        _toastEl.id = 'uiToast';
        _toastEl.style.cssText = `
            position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);
            background:#1a1a1a;color:#fff;padding:13px 24px;border-radius:10px;
            font-size:.9rem;font-weight:600;z-index:9999;opacity:0;
            transition:opacity .25s,transform .25s;pointer-events:none;white-space:nowrap;`;
        document.body.appendChild(_toastEl);
    }

    function toast(msg, type = 'info') {
        ensureToast();
        clearTimeout(_toastTimer);
        _toastEl.textContent = msg;
        _toastEl.style.background = type === 'error' ? '#c53030' : type === 'success' ? '#276749' : '#1a1a1a';
        _toastEl.style.opacity = '1';
        _toastEl.style.transform = 'translateX(-50%) translateY(0)';
        _toastTimer = setTimeout(() => {
            _toastEl.style.opacity = '0';
            _toastEl.style.transform = 'translateX(-50%) translateY(80px)';
        }, 3000);
    }

    // ── Mobile menu ───────────────────────────────────────────────────────────
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks  = document.getElementById('navLinks');
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ── Header scroll effect ──────────────────────────────────────────────────
    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ── Announcement bar ──────────────────────────────────────────────────────
    function initAnnouncementBar() {
        const bar   = document.getElementById('announcementBar');
        const close = document.getElementById('closeAnnouncement');
        if (!bar || !close) return;

        if (sessionStorage.getItem('ann-closed')) {
            bar.style.display = 'none';
            document.documentElement.style.setProperty('--ann-h', '0px');
            return;
        }

        const textEl = document.getElementById('announcementText');
        if (textEl && window.BRAND?.announcement) {
            textEl.textContent = window.BRAND.announcement;
        }

        close.addEventListener('click', () => {
            bar.style.transition = 'opacity .3s, max-height .3s';
            bar.style.opacity    = '0';
            bar.style.maxHeight  = '0';
            bar.style.overflow   = 'hidden';
            setTimeout(() => {
                bar.style.display = 'none';
                document.documentElement.style.setProperty('--ann-h', '0px');
            }, 320);
            sessionStorage.setItem('ann-closed', '1');
        });
    }

    // ── Active nav link — queries sections dynamically so it works after SPA navigation ──
    function initActiveNav() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('#main-content section[id]');
            if (!sections.length) return;
            const scrollY = window.pageYOffset + 200;
            sections.forEach(section => {
                const id   = section.getAttribute('id');
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (!link) return;
                if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }

    // ── Back to top ───────────────────────────────────────────────────────────
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.pageYOffset > 400);
        }, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── Scroll-fade animations ─────────────────────────────────────────────────
    function initScrollAnimations() {
        const targets = document.querySelectorAll('.feature-card, .why-card, .category-card, .testimonial-card, .contact-form, .stat-item, .cta-content, .final-cta-content, .step-card, .grc');
        if (!targets.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.1 });
        targets.forEach(el => { el.classList.add('fade-in'); obs.observe(el); });
    }

    // ── Stats counter ─────────────────────────────────────────────────────────
    function initStats() {
        const statsSection = document.getElementById('stats');
        if (!statsSection) return;
        let animated = false;
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                document.querySelectorAll('.stat-number').forEach(el => {
                    const target = parseInt(el.dataset.target);
                    const step   = target / 125;
                    let current  = 0;
                    const timer  = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(timer); }
                        el.textContent = Math.floor(current).toLocaleString('en-US');
                    }, 16);
                });
            }
        }, { threshold: 0.3 }).observe(statsSection);
    }

    // ── Testimonial slider ────────────────────────────────────────────────────
    function initTestimonials() {
        const textEl = document.getElementById('testimonialText');
        if (!textEl) return;

        const testimonials = (window.BRAND?.testimonials?.length)
            ? window.BRAND.testimonials.map(t => ({
                text:   t.text,
                name:   t.wilaya ? `${t.name} — ${t.wilaya}` : t.name,
                rating: t.rating || 5,
            }))
            : [{ text: 'منتجات رائعة وتوصيل سريع!', name: 'عميل راضٍ', rating: 5 }];

        const dots   = document.querySelectorAll('.dot');
        const nameEl = document.getElementById('testimonialName');
        const card   = document.getElementById('testimonialCard');
        let current  = 0;

        if (card) card.style.transition = 'opacity .3s ease, transform .3s ease';

        function starsFor(r) {
            return Array.from({ length: 5 }, (_, i) =>
                `<i class="fas fa-star" style="color:${i < r ? '#F59E0B' : '#e5e7eb'};font-size:.85rem;"></i>`
            ).join('');
        }

        function show(index) {
            current = index;
            const t = testimonials[index % testimonials.length];
            if (card) {
                card.style.opacity = '0'; card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    textEl.textContent = t.text;
                    if (nameEl) nameEl.textContent = t.name;
                    const starsEl = card.querySelector('.author-stars');
                    if (starsEl) starsEl.innerHTML = starsFor(t.rating);
                    card.style.opacity = '1'; card.style.transform = 'translateY(0)';
                }, 300);
            }
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        show(0);
        dots.forEach(dot => dot.addEventListener('click', () => show(parseInt(dot.dataset.index))));

        let interval = setInterval(() => show((current + 1) % testimonials.length), 5000);
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(interval));
            slider.addEventListener('mouseleave', () => {
                interval = setInterval(() => show((current + 1) % testimonials.length), 5000);
            });
        }
    }

    // ── Gallery lightbox ──────────────────────────────────────────────────────
    function initLightbox() {
        const lightboxEl = document.getElementById('lightbox');
        if (!lightboxEl) return;

        // Rebuild gallery images for the current page on every call
        let galleryImages = Array.from(
            document.querySelectorAll('.gallery-slide img, .gallery-item img, .product-gallery-thumbs .thumb img')
        ).map(img => ({ src: img.src, alt: img.alt }));
        let idx = 0;

        // Always update window functions so they reference the current page's gallery
        window.openLightbox = (item) => {
            const img = (item.tagName === 'IMG') ? item : item.querySelector('img');
            if (!img) return;
            const lb    = document.getElementById('lightboxImg');
            const found = galleryImages.findIndex(g => g.src === img.src);
            if (found < 0 && img.src) { galleryImages.push({ src: img.src, alt: img.alt }); idx = galleryImages.length - 1; }
            else idx = found >= 0 ? found : 0;
            lb.src = img.src; lb.alt = img.alt;
            lightboxEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        window.closeLightbox = () => {
            lightboxEl.classList.remove('active');
            document.body.style.overflow = '';
        };
        window.navigateLightbox = (dir) => {
            if (!galleryImages.length) return;
            idx = (idx + dir + galleryImages.length) % galleryImages.length;
            const lb = document.getElementById('lightboxImg');
            lb.style.opacity = '0';
            setTimeout(() => { lb.src = galleryImages[idx].src; lb.alt = galleryImages[idx].alt; lb.style.opacity = '1'; }, 200);
        };

        // DOM event listeners are added only once (guarded by data attribute)
        if (!lightboxEl.dataset.listenersAdded) {
            lightboxEl.dataset.listenersAdded = '1';
            lightboxEl.addEventListener('click', e => { if (e.target === e.currentTarget) window.closeLightbox(); });
            document.getElementById('lightboxClose')?.addEventListener('click', () => window.closeLightbox());
            document.getElementById('lightboxPrev')?.addEventListener('click', () => window.navigateLightbox(-1));
            document.getElementById('lightboxNext')?.addEventListener('click', () => window.navigateLightbox(1));
            document.addEventListener('keydown', e => {
                if (!lightboxEl.classList.contains('active')) return;
                if (e.key === 'Escape')     window.closeLightbox();
                if (e.key === 'ArrowRight') window.navigateLightbox(-1);
                if (e.key === 'ArrowLeft')  window.navigateLightbox(1);
            });
        }

        // Re-attach to main product image on each page (element changes on navigation)
        const mainImg = document.getElementById('mainProductImg');
        if (mainImg) {
            mainImg.style.cursor = 'zoom-in';
            mainImg.addEventListener('click', () => { if (window.openLightbox) window.openLightbox(mainImg); });
        }

        document.querySelectorAll('.gallery-slide').forEach(el => {
            el.setAttribute('tabindex', '0');
            el.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.openLightbox(el); }
            });
        });
    }

    // ── Gallery slider (arrows, dots, autoplay, swipe) ────────────────────────
    function initGallerySlider() {
        const track = document.getElementById('galleryTrack');
        const dotsEl = document.getElementById('galleryDots');
        if (!track) return;

        const slides = Array.from(track.children);
        const total  = slides.length;
        let idx = 0;
        let autoTimer;

        function slideW() { return slides[0]?.offsetWidth || 0; }
        function perView() { return Math.max(1, Math.round(track.parentElement.offsetWidth / (slideW() || 1))); }
        function maxIdx() { return Math.max(0, total - perView()); }

        function go(n) {
            idx = Math.max(0, Math.min(n, maxIdx()));
            // RTL: positive translateX moves track right, revealing left-overflowing content
            track.style.transform = `translateX(${idx * slideW()}px)`;
            dotsEl?.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
        }

        function buildDots() {
            if (!dotsEl) return;
            dotsEl.innerHTML = '';
            for (let i = 0; i < total; i++) {
                const d = document.createElement('button');
                d.className = 'gallery-dot' + (i === 0 ? ' active' : '');
                d.setAttribute('aria-label', `الصورة ${i + 1}`);
                d.addEventListener('click', () => { go(i); resetAuto(); });
                dotsEl.appendChild(d);
            }
        }

        function resetAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => go(idx >= maxIdx() ? 0 : idx + 1), 4500);
        }

        buildDots();

        document.getElementById('galleryPrev')?.addEventListener('click', () => { go(idx - 1); resetAuto(); });
        document.getElementById('galleryNext')?.addEventListener('click', () => { go(idx + 1); resetAuto(); });

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoTimer));
        track.addEventListener('mouseleave', resetAuto);

        // Touch swipe
        let _tx = 0;
        track.addEventListener('touchstart', e => { _tx = e.changedTouches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - _tx;
            if (Math.abs(dx) > 50) { go(idx + (dx < 0 ? 1 : -1)); resetAuto(); }
        }, { passive: true });

        window.addEventListener('resize', () => go(Math.min(idx, maxIdx())), { passive: true });

        resetAuto();
    }

    // ── Product detail: sticky bottom bar ─────────────────────────────────────
    function initDetailStickyBar() {
        const bar     = document.getElementById('detailStickyBar');
        const trigger = document.querySelector('.product-detail-actions');
        if (!bar || !trigger) return;
        new IntersectionObserver(([entry]) => {
            bar.style.display = entry.isIntersecting ? 'none' : 'flex';
        }, { threshold: 0 }).observe(trigger);
    }

    // ── Product detail: image gallery ─────────────────────────────────────────
    function initProductDetail() {
        window.changeMainImage = (thumb) => {
            const mainImg = document.getElementById('mainProductImg');
            const thumbImg = thumb.querySelector('img');
            if (mainImg && thumbImg) { mainImg.src = thumbImg.src; mainImg.alt = thumbImg.alt; }
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        document.querySelectorAll('.thumb').forEach(thumb => {
            thumb.setAttribute('tabindex', '0');
            thumb.setAttribute('role', 'button');
            thumb.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.changeMainImage(thumb); }
            });
        });

        const qtyValue = document.getElementById('qtyValue');
        const qtyMinus = document.getElementById('qtyMinus');
        const qtyPlus  = document.getElementById('qtyPlus');
        if (qtyMinus && qtyPlus && qtyValue) {
            qtyMinus.addEventListener('click', () => { const n = parseInt(qtyValue.textContent); if (n > 1) qtyValue.textContent = n - 1; });
            qtyPlus.addEventListener('click', () => { qtyValue.textContent = parseInt(qtyValue.textContent) + 1; });
        }
    }

    // ── Hero particles ────────────────────────────────────────────────────────
    function initParticles() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const container = document.getElementById('heroParticles');
        if (!container) return;
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.classList.add('hero-particle');
            p.style.left             = Math.random() * 100 + '%';
            p.style.animationDelay   = Math.random() * 6 + 's';
            p.style.animationDuration = (4 + Math.random() * 4) + 's';
            p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
            container.appendChild(p);
        }
    }

    // ── Contact form ──────────────────────────────────────────────────────────
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const name    = document.getElementById('contactName')?.value.trim()    || '';
            const phone   = document.getElementById('contactPhone')?.value.trim()   || '';
            const subject = document.getElementById('contactSubject')?.value.trim() || '';
            const message = document.getElementById('contactMessage')?.value.trim() || '';
            const storeName = window.BRAND?.storeName || 'ورشة يحيى';

            // Open WhatsApp
            let msg = `مرحباً ${storeName}!\n\n`;
            if (name)    msg += `الاسم: ${name}\n`;
            if (phone)   msg += `الهاتف: ${phone}\n`;
            if (subject) msg += `الموضوع: ${subject}\n\n`;
            if (message) msg += `الرسالة:\n${message}`;
            window.open(`https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(msg)}`, '_blank');

            // Save ticket to admin dashboard (silent — don't block UX on failure)
            fetch(`${CONFIG.apiUrl}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, phone, subject, message }),
            }).catch(() => {});

            const btn = form.querySelector('.btn');
            const orig = btn.textContent;
            btn.textContent = 'تم الإرسال! ✓';
            btn.style.background = '#27ae60';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 2000);
        });
    }

    // ── Newsletter form ───────────────────────────────────────────────────────
    function initNewsletter() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('.btn');
            btn.textContent = 'تم! ✓';
            setTimeout(() => { btn.textContent = 'اشترك'; form.reset(); }, 2000);
        });
    }

    function injectSharedDOM() {
        if (document.getElementById('cartOverlay')) return;

        const checkoutCopy = window.BRAND?.copy?.checkoutBtn || 'تأكيد الطلب الآن';

        document.body.insertAdjacentHTML('beforeend', `
            <div class="cart-overlay" id="cartOverlay"></div>
            <div class="cart-sidebar" id="cartSidebar" role="dialog" aria-label="سلة التسوق">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart" style="color:var(--primary);font-size:.95rem;"></i> سلة التسوق</h3>
                    <button class="close-cart" id="closeCart" aria-label="إغلاق"><i class="fas fa-times"></i></button>
                </div>
                <div class="cart-items" id="cartItems">
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <div class="empty-cart-title">${window.BRAND?.copy?.emptyCart || 'سلتك فارغة حالياً'}</div>
                        <p>${window.BRAND?.copy?.emptyCartSub || 'ابدأ بإضافة منتجك المفضل'}</p>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="cart-cod-note">
                        <i class="fas fa-money-bill-wave"></i>
                        الدفع عند الاستلام — لا دفع مسبق
                    </div>
                    <div class="cart-total">
                        <span>المجموع:</span>
                        <span class="cart-total-amount" id="cartTotal">0 DZD</span>
                    </div>
                    <button class="btn btn-primary btn-block btn-ripple" id="checkoutBtn">
                        <i class="fas fa-check-circle"></i> ${checkoutCopy}
                    </button>
                </div>
            </div>
            <div class="search-modal" id="searchModal">
                <div class="search-modal-content">
                    <button class="close-search" id="closeSearch"><i class="fas fa-times"></i></button>
                    <input type="text" placeholder="ابحث عن منتج..." class="search-input" id="searchInput">
                    <div class="search-results" id="searchResults"></div>
                </div>
            </div>
            <a href="https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent('مرحباً ' + (window.BRAND?.storeName || 'ورشة يحيى') + '، كيف يمكنني الطلب؟')}" target="_blank" class="whatsapp-float" aria-label="تواصل معنا عبر واتساب"><i class="fab fa-whatsapp"></i></a>
            <button class="back-to-top" id="backToTop" aria-label="العودة للأعلى"><i class="fas fa-arrow-up"></i></button>
            <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="عرض الصورة">
                <button class="lightbox-close" id="lightboxClose" aria-label="إغلاق"><i class="fas fa-times"></i></button>
                <button class="lightbox-prev" id="lightboxPrev" aria-label="السابقة"><i class="fas fa-chevron-right"></i></button>
                <img id="lightboxImg" src="" alt="">
                <button class="lightbox-next" id="lightboxNext" aria-label="التالية"><i class="fas fa-chevron-left"></i></button>
            </div>
        `);
    }

    // ── FAQ accordion ─────────────────────────────────────────────────────────
    function initFaq() {
        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', () => {
                const item   = q.closest('.faq-item');
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    // ── Category cards — navigate to #products and pre-select filter ──────────
    function initCategoryCards() {
        document.querySelectorAll('.category-card[data-category]').forEach(card => {
            card.addEventListener('click', e => {
                e.preventDefault();
                const cat = card.dataset.category;
                // Store chosen filter so Products.init picks it up after routing
                sessionStorage.setItem('pendingFilter', cat);
                location.hash = '#products';
            });
        });
    }

    // ── Re-run page-specific inits after each route change ────────────────────
    function reinit() {
        initScrollAnimations();
        initStats();
        initTestimonials();
        initGallerySlider();
        initLightbox();
        initProductDetail();
        initDetailStickyBar();
        initParticles();
        initContactForm();
        initFaq();
        initCategoryCards();
    }

    function initSearch() {
        const modal    = document.getElementById('searchModal');
        const input    = document.getElementById('searchInput');
        const results  = document.getElementById('searchResults');
        const closeBtn = document.getElementById('closeSearch');

        function openSearch() {
            modal?.classList.add('active');
            setTimeout(() => input?.focus(), 80);
        }
        function closeSearch() {
            modal?.classList.remove('active');
            if (input)   input.value   = '';
            if (results) results.innerHTML = '';
        }

        document.querySelectorAll('.search-btn').forEach(btn => btn.addEventListener('click', openSearch));
        closeBtn?.addEventListener('click', closeSearch);
        modal?.addEventListener('click', e => { if (e.target === modal) closeSearch(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) closeSearch();
        });

        input?.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            if (!results) return;
            if (!q) { results.innerHTML = ''; return; }

            const all = (window.Products?.getAll ? Products.getAll() : [])
                .filter(p => p.name?.toLowerCase().includes(q) || (p.short_description || p.description || '').toLowerCase().includes(q))
                .slice(0, 8);

            if (!all.length) {
                results.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:20px;">لا توجد نتائج لـ "${input.value}"</p>`;
                return;
            }

            results.innerHTML = all.map(p => `
<a href="#product/${p.slug || p.id}" class="search-result-item" onclick="document.getElementById('closeSearch').click()">
    <img src="${p.image || ''}" alt="" style="width:48px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0;">
    <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name}</div>
        <div style="font-size:.8rem;color:var(--gold);">${Number(p.price).toLocaleString('en-US')} DZD</div>
    </div>
</a>`).join('');
        });
    }

    // ── Social proof ticker ───────────────────────────────────────────────────
    function initSocialProof() {
        const names   = ['محمد','أحمد','يوسف','علي','عمر','عبد الرحمن','كريم','ناصر','مراد','بلال','وليد','رضا','فيصل','رياض','إسلام','أمين','زكريا','حسام','أنس','طارق'];
        const cities  = ['الجزائر','وهران','قسنطينة','عنابة','سطيف','باتنة','بسكرة','تيزي وزو','تلمسان','بجاية','المسيلة','سيدي بلعباس','الجلفة','مستغانم','ورقلة','برج بوعريريج','غليزان','المدية','الشلف','معسكر'];
        const deltas  = [2, 3, 5, 7, 9, 12, 15, 18, 22, 28, 35];

        let el = null;

        function inject() {
            if (el) return;
            el = document.createElement('div');
            el.id = 'sp-tick';
            el.style.cssText = [
                'position:fixed;bottom:88px;left:20px;z-index:9990;',
                'background:rgba(20,18,14,.96);border:1px solid rgba(200,166,86,.35);',
                'border-radius:14px;padding:12px 16px;max-width:270px;',
                'display:flex;align-items:flex-start;gap:10px;',
                'box-shadow:0 8px 32px rgba(0,0,0,.55);backdrop-filter:blur(8px);',
                'transform:translateY(120%);opacity:0;',
                'transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .35s;',
                'cursor:pointer;font-family:Cairo,Tajawal,sans-serif;direction:rtl;text-align:right;',
            ].join('');
            el.innerHTML = `
                <span style="font-size:1.3rem;flex-shrink:0;margin-top:1px;">🛍️</span>
                <div>
                    <div id="sp-msg" style="font-size:.83rem;font-weight:700;color:#e8e0d0;line-height:1.5;"></div>
                    <div style="font-size:.72rem;color:#c8a656;margin-top:3px;font-weight:600;">الدفع عند الاستلام ✓</div>
                </div>
            `;
            el.addEventListener('click', hide);
            document.body.appendChild(el);
        }

        function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

        function show() {
            inject();
            const products = window.Products?.getAll?.() || [];
            const prod     = products.length ? pick(products).name : 'موس بوسعادي';
            const mins     = pick(deltas);
            const timeStr  = mins < 60 ? `منذ ${mins} دقيقة` : `منذ ساعة`;
            document.getElementById('sp-msg').textContent =
                `${pick(names)} من ${pick(cities)} اشترى ${prod} ${timeStr}`;
            el.style.transform = 'translateY(0)';
            el.style.opacity   = '1';
            setTimeout(hide, 5000);
        }

        function hide() {
            if (!el) return;
            el.style.transform = 'translateY(120%)';
            el.style.opacity   = '0';
        }

        // First show after 15s, then every 40–60s
        setTimeout(show, 15000);
        setInterval(show, 45000 + Math.random() * 15000);
    }

    function init() {
        injectSharedDOM();
        initMobileMenu();
        initHeaderScroll();
        initActiveNav();
        initBackToTop();
        initNewsletter();
        initAnnouncementBar();
        initSearch();
        initSocialProof();
    }

    return { init, reinit, toast };
})();
