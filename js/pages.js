/* ================================================================
   Yahya Store — Page Templates
   All page HTML is generated here and injected by the Router.
   ================================================================ */
window.Pages = (() => {

    const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

    const trustBarHTML = () => `
<div class="trust-bar">
    <div class="trust-bar-grid container">
        ${(BRAND.trust || []).map(t => `
        <div class="trust-bar-item">
            <div class="trust-bar-icon"><i class="${esc(t.icon)}"></i></div>
            <div>
                <div class="trust-bar-label">${esc(t.label)}</div>
                <div class="trust-bar-desc">${esc(t.desc)}</div>
            </div>
        </div>`).join('')}
    </div>
</div>`;

    /* ── HOME ─────────────────────────────────────────────────── */
    function home() {
        const wa           = CONFIG.waNumber || BRAND.whatsapp;
        const testimonials = BRAND.testimonials || [];
        const howItWorks   = BRAND.howItWorks   || [];
        const whyUs        = BRAND.whyUs        || [];
        const cats         = BRAND.homeCategories || [];

        const waContactUrl = `https://wa.me/${wa}?text=${encodeURIComponent('مرحباً ' + BRAND.storeName + '، كيف يمكنني الطلب؟')}`;

        return `
<!-- ══ HERO ══════════════════════════════════════════════════ -->
<section class="hero" id="home" aria-label="الصفحة الرئيسية">
    <div class="container hero-content">
        <div class="hero-text">
            <div class="hero-badge">
                <i class="fas fa-store"></i>
                ${esc(BRAND.storeName)} — ${esc(BRAND.slogan || 'تسوّق بثقة والدفع عند الاستلام')}
            </div>
            <h1 class="hero-title">
                ${esc(BRAND.storeNameAr || BRAND.storeName)}<br>
                <em>اطلب بسهولة… وادفع عند الاستلام</em>
            </h1>
            <p class="hero-subtitle">
                ${esc(BRAND.tagline || 'منتجات مختارة بعناية، طلب سريع، ودفع عند الاستلام.')}
                اختر المنتج، أضفه للسلة، وادفع فقط عند الاستلام.
            </p>
            <div class="hero-actions">
                <a href="#collections" class="btn btn-secondary btn-lg btn-ripple">
                    <i class="fas fa-shopping-bag"></i> تسوّق الآن
                </a>
                <a href="${waContactUrl}" target="_blank" class="btn btn-outline-white btn-lg btn-ripple">
                    <i class="fab fa-whatsapp"></i> تواصل عبر واتساب
                </a>
            </div>
            <div class="hero-trust">
                <div class="hero-trust-item"><i class="fas fa-ban"></i> لا تحتاج بطاقة بنكية</div>
                <div class="hero-trust-item"><i class="fas fa-phone-alt"></i> تأكيد الطلب قبل الشحن</div>
                <div class="hero-trust-item"><i class="fab fa-whatsapp"></i> دعم سريع واتساب</div>
                <div class="hero-trust-item"><i class="fas fa-truck"></i> توصيل حسب الولاية</div>
            </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
            <div class="hero-image-wrap">
                <img src="images/p1-main.jpg" alt="${esc(BRAND.storeName)} — تسوق بثقة" loading="eager"
                     onerror="this.parentElement.classList.add('hero-placeholder')">
            </div>
            <div class="hero-float-card">
                <div class="hero-float-icon"><i class="fas fa-check"></i></div>
                <div class="hero-float-text">
                    <strong>الدفع عند الاستلام</strong>
                    <span>لا تدفع قبل الاستلام</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ══ TRUST BAR ════════════════════════════════════════════ -->
${trustBarHTML()}

<!-- ══ CATEGORIES ═══════════════════════════════════════════ -->
<section class="categories-section section" id="categories">
    <div class="container">
        <div class="section-header text-center">
            <h2 class="section-title">تسوّق حسب الفئة</h2>
            <p class="section-subtitle">اختر الفئة التي تناسبك وتصفح أفضل المنتجات المتاحة</p>
        </div>
        <div class="categories-grid">
            ${cats.map(c => `
            <a href="#products" class="category-card fade-in" data-category="${esc(c.key)}">
                <div class="category-icon"><i class="${esc(c.icon)}"></i></div>
                <h3>${esc(c.title)}</h3>
                <p>${esc(c.desc)}</p>
                <span class="category-link">تصفح <i class="fas fa-arrow-left"></i></span>
            </a>`).join('')}
        </div>
    </div>
</section>

<!-- ══ FEATURED PRODUCTS ════════════════════════════════════ -->
<section class="section-alt" id="collections">
    <div class="container">
        <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:32px;">
            <div>
                <h2 class="section-title">منتجات مختارة لك</h2>
                <p class="section-subtitle" style="margin-bottom:0;">أفضل المنتجات المتوفرة حالياً في ${esc(BRAND.storeName)}</p>
            </div>
            <div class="filter-tabs" id="filterTabs" role="group" aria-label="تصفية المنتجات">
                <button class="filter-tab active" data-filter="all"       aria-pressed="true">الكل</button>
                <button class="filter-tab"         data-filter="bundle"    aria-pressed="false">${esc((BRAND.categories||{}).bundle    || 'أطقم')}</button>
                <button class="filter-tab"         data-filter="single"    aria-pressed="false">${esc((BRAND.categories||{}).single    || 'منتجات')}</button>
                <button class="filter-tab"         data-filter="accessory" aria-pressed="false">${esc((BRAND.categories||{}).accessory || 'إكسسوارات')}</button>
                <button class="filter-tab"         data-filter="sale"      aria-pressed="false">${esc((BRAND.categories||{}).sale      || 'عروض')}</button>
            </div>
        </div>
        <div class="products-grid" id="productsGrid"></div>
        <div style="text-align:center;margin-top:36px;">
            <a href="#products" class="btn btn-outline btn-ripple">
                <i class="fas fa-th-large"></i> عرض جميع المنتجات
            </a>
        </div>
    </div>
</section>

<!-- ══ HOW IT WORKS ══════════════════════════════════════════ -->
<section class="how-it-works section" id="how-it-works">
    <div class="container">
        <div class="section-header text-center" style="margin-bottom:48px;">
            <h2 class="section-title">كيف تطلب من ${esc(BRAND.storeName)}؟</h2>
            <p class="section-subtitle">5 خطوات بسيطة وطلبك في طريقه إليك</p>
        </div>
        <div class="steps-grid">
            ${howItWorks.map(s => `
            <div class="step-card fade-in">
                <div class="step-num">${esc(s.num)}</div>
                <div class="step-icon"><i class="${esc(s.icon)}"></i></div>
                <div class="step-title">${esc(s.title)}</div>
                <div class="step-desc">${esc(s.desc)}</div>
            </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:40px;">
            <div class="cod-guarantee-badge">
                <i class="fas fa-lock"></i>
                عملية الطلب بسيطة ولن تدفع أي شيء الآن — الدفع فقط عند استلام الطلب
            </div>
        </div>
    </div>
</section>

<!-- ══ WHY YAHYA STORE ══════════════════════════════════════ -->
<section class="why-us-section section-alt" id="why-us">
    <div class="container">
        <div class="section-header text-center">
            <h2 class="section-title">لماذا تختار ${esc(BRAND.storeName)}؟</h2>
            <p class="section-subtitle">نلتزم بتقديم أفضل تجربة تسوق جزائرية مع الدفع عند الاستلام</p>
        </div>
        <div class="why-grid">
            ${whyUs.map(w => `
            <div class="why-card fade-in">
                <div class="why-icon"><i class="${esc(w.icon)}"></i></div>
                <h3>${esc(w.title)}</h3>
                <p>${esc(w.desc)}</p>
            </div>`).join('')}
        </div>
    </div>
</section>

<!-- ══ TESTIMONIALS ══════════════════════════════════════════ -->
<section class="testimonials section" id="testimonials">
    <div class="container">
        <div class="section-header text-center" style="margin-bottom:24px;">
            <h2 class="section-title">ماذا يقول زبائننا؟</h2>
            <p class="section-subtitle">آراء حقيقية من زبائن حقيقيين في جميع أنحاء الجزائر</p>
        </div>
        <div class="google-rating-bar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <div class="grb-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <div class="grb-label">&#x645;&#x64F;&#x642;&#x64E;&#x64A;&#x64E;&#x645;&#x648;&#x646; &#x639;&#x644;&#x649; <strong>Google Maps</strong></div>
        </div>
        <div class="google-review-cards">
            ${testimonials.slice(0,3).map((t, i) => `
            <article class="grc fade-in">
                <div class="grc-head">
                    <div class="grc-avatar" style="background:${['#4285F4','#34A853','#EA4335','#8E24AA','#0288D1'][i%5]}">
                        ${t.name.charAt(0)}
                    </div>
                    <div class="grc-meta">
                        <div class="grc-name">${t.name}</div>
                        <div class="grc-location"><i class="fas fa-map-marker-alt"></i> ${t.wilaya || ''}</div>
                    </div>
                    <div class="grc-logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="flex-shrink:0;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></div>
                </div>
                <div class="grc-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p class="grc-text">&ldquo;${t.text}&rdquo;</p>
            </article>`).join('')}
        </div>
        ${(BRAND.social && BRAND.social.googlemaps) ? `
        <div style="text-align:center;margin-top:32px;">
            <a href="${esc(BRAND.social.googlemaps)}"
               target="_blank" rel="noopener" class="btn-google-maps btn-ripple">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="flex-shrink:0;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                اقرأ جميع التقييمات على Google
            </a>
        </div>` : ''}
    </div>
</section>

<!-- ══ SHIPPING INFO ════════════════════════════════════════ -->
<section class="shipping-strip section-alt" id="shipping-info">
    <div class="container">
        <div class="shipping-strip-inner">
            <div class="shipping-strip-text">
                <h2 class="section-title">معلومات الشحن والتوصيل</h2>
                <p>سعر الشحن يتم حسابه حسب الولاية والمنطقة. عند اختيار ولايتك في صفحة الطلب يظهر لك سعر الشحن مباشرة قبل تأكيد الطلب.</p>
                <div class="shipping-strip-badges">
                    <div class="ship-badge"><i class="fas fa-map-marker-alt"></i> شحن حسب الولاية</div>
                    <div class="ship-badge"><i class="fas fa-phone-alt"></i> تأكيد قبل الإرسال</div>
                    <div class="ship-badge"><i class="fas fa-money-bill-wave"></i> دفع عند الاستلام</div>
                </div>
                <a href="#shipping" class="btn btn-outline btn-ripple" style="margin-top:8px;">
                    <i class="fas fa-truck"></i> تفاصيل الشحن
                </a>
            </div>
            <div class="shipping-strip-visual">
                <div class="shipping-steps-mini">
                    <div class="ssm-item"><div class="ssm-num">1</div><span>اختر المنتج</span></div>
                    <div class="ssm-arrow"><i class="fas fa-arrow-left"></i></div>
                    <div class="ssm-item"><div class="ssm-num">2</div><span>اختر ولايتك</span></div>
                    <div class="ssm-arrow"><i class="fas fa-arrow-left"></i></div>
                    <div class="ssm-item"><div class="ssm-num">3</div><span>ادفع عند الاستلام</span></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ══ CONTACT ══════════════════════════════════════════════ -->
<section class="contact section" id="contact">
    <div class="container">
        <div class="section-header text-center" style="margin-bottom:40px;">
            <h2 class="section-title">تواصل معنا</h2>
            <p class="section-subtitle">نحن هنا للمساعدة — راسلنا في أي وقت</p>
        </div>
        <div style="display:flex;justify-content:center;">
            <form class="contact-form fade-in" id="contactForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="contactName">الاسم الكامل</label>
                        <input type="text" id="contactName" name="name" placeholder="أدخل اسمك الكامل" required>
                    </div>
                    <div class="form-group">
                        <label for="contactPhone">رقم الهاتف</label>
                        <input type="tel" id="contactPhone" name="phone" placeholder="05XXXXXXXX">
                    </div>
                </div>
                <div class="form-group">
                    <label for="contactSubject">الموضوع</label>
                    <input type="text" id="contactSubject" name="subject" placeholder="استفسار عن منتج / حالة طلب / أخرى">
                </div>
                <div class="form-group">
                    <label for="contactMessage">رسالتك</label>
                    <textarea id="contactMessage" name="message" placeholder="اكتب رسالتك هنا..." rows="4" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-ripple">
                    <i class="fab fa-whatsapp"></i> إرسال عبر واتساب
                </button>
                <p style="text-align:center;font-size:.78rem;color:var(--text-muted);margin-top:12px;">
                    <i class="fas fa-lock"></i> معلوماتك تُستخدم فقط للرد على رسالتك
                </p>
            </form>
        </div>
    </div>
</section>

<!-- ══ FINAL CTA ═════════════════════════════════════════════ -->
<section class="final-cta-section" id="final-cta">
    <div class="container">
        <div class="final-cta-content fade-in">
            <div class="final-cta-badge"><i class="fas fa-bolt"></i> جاهز للطلب؟</div>
            <h2>اطلب بسهولة… وادفع عند الاستلام</h2>
            <p>اختر المنتج المناسب، أضفه للسلة، وأكمل الطلب في أقل من دقيقة. لا بطاقة بنكية مطلوبة.</p>
            <div class="final-cta-actions">
                <a href="#collections" class="btn btn-secondary btn-lg btn-ripple">
                    <i class="fas fa-shopping-bag"></i> تصفح المنتجات
                </a>
                <a href="${waContactUrl}" target="_blank" class="btn btn-outline-white btn-lg btn-ripple">
                    <i class="fab fa-whatsapp"></i> تواصل معنا
                </a>
            </div>
        </div>
    </div>
</section>`;
    }

    /* ── PRODUCTS PAGE ────────────────────────────────────────── */
    function products() {
        const wa = CONFIG.waNumber || BRAND.whatsapp;
        return `
<section class="page-hero page-hero-sm">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <nav class="breadcrumb">
            <a href="#home">الرئيسية</a>
            <i class="fas fa-chevron-left"></i>
            <span>جميع المنتجات</span>
        </nav>
        <h1 class="page-hero-title">جميع المنتجات</h1>
        <p class="page-hero-desc">اكتشف تشكيلة ${esc(BRAND.storeNameAr || BRAND.storeName)} — ${esc(BRAND.tagline || BRAND.slogan)}</p>
    </div>
</section>

<section class="products products-page" id="collections">
    <div class="container">
        <div class="products-toolbar">
            <div class="filter-tabs" id="filterTabs" role="group" aria-label="تصفية المنتجات">
                <button class="filter-tab active" data-filter="all"       aria-pressed="true">الكل <span class="tab-count">0</span></button>
                <button class="filter-tab"         data-filter="bundle"    aria-pressed="false">${esc((BRAND.categories||{}).bundle    || 'أطقم')}       <span class="tab-count">0</span></button>
                <button class="filter-tab"         data-filter="single"    aria-pressed="false">${esc((BRAND.categories||{}).single    || 'منتجات')}     <span class="tab-count">0</span></button>
                <button class="filter-tab"         data-filter="accessory" aria-pressed="false">${esc((BRAND.categories||{}).accessory || 'إكسسوارات')} <span class="tab-count">0</span></button>
                <button class="filter-tab"         data-filter="sale"      aria-pressed="false">${esc((BRAND.categories||{}).sale      || 'عروض')}       <span class="tab-count">0</span></button>
            </div>
            <div class="products-sort">
                <select id="sortProducts">
                    <option value="default">الترتيب الافتراضي</option>
                    <option value="price-low">السعر: من الأقل للأعلى</option>
                    <option value="price-high">السعر: من الأعلى للأقل</option>
                    <option value="discount">الأكثر تخفيضاً</option>
                </select>
            </div>
        </div>
        <div class="products-grid" id="productsGrid"></div>
    </div>
</section>

<section class="products-cta">
    <div class="container">
        <div class="cta-content fade-in">
            <h2>لم تجد ما تبحث عنه؟</h2>
            <p>تواصل معنا عبر واتساب وسنساعدك في اختيار المنتج المناسب</p>
            <a href="https://wa.me/${wa}?text=${encodeURIComponent('مرحباً ' + BRAND.storeName + '، أريد الاستفسار عن منتجاتكم')}"
               target="_blank" class="btn btn-primary btn-ripple">
                <i class="fab fa-whatsapp"></i> تواصل معنا عبر واتساب
            </a>
        </div>
    </div>
</section>`;
    }

    /* ── FAQ PAGE ─────────────────────────────────────────────── */
    function faq() {
        const wa = CONFIG.waNumber || BRAND.whatsapp;
        return `
<section class="page-hero page-hero-sm">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <nav class="breadcrumb">
            <a href="#home">الرئيسية</a>
            <i class="fas fa-chevron-left"></i>
            <span>الأسئلة الشائعة</span>
        </nav>
    </div>
</section>

<section class="info-page">
    <div class="container">
        <div class="info-page-header">
            <h1><i class="fas fa-question-circle"></i> الأسئلة الشائعة</h1>
            <p>إجابات واضحة على أكثر الأسئلة التي يطرحها زبائننا</p>
        </div>

        <div class="faq-category">
            <h2 class="faq-category-title"><i class="fas fa-shopping-cart"></i> الطلب والشراء</h2>
            <div class="faq-item">
                <button class="faq-question" type="button">كيف أطلب من ${esc(BRAND.storeName)}؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>اختر المنتج → أضفه للسلة → أكمل معلوماتك (الاسم، الهاتف، الولاية، العنوان) → اضغط "تأكيد الطلب". سنتصل بك لتأكيد الطلب قبل الشحن.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">هل الدفع عند الاستلام متوفر؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>نعم، الدفع عند الاستلام (COD) هو طريقة الدفع الوحيدة المتاحة. لن تدفع أي شيء قبل استلام طلبك والتأكد منه. لا بطاقة بنكية ولا دفع مسبق.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">هل أحتاج إلى بطاقة بنكية؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>لا، لا تحتاج إلى أي بطاقة بنكية. الدفع يكون نقداً عند استلام الطلب.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">كيف يتم تأكيد الطلب؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>بعد تسجيل الطلب، يمكن تأكيده عبر الهاتف أو واتساب. نتواصل معك في غضون ساعات قليلة خلال أوقات العمل.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">هل يمكنني الطلب عبر واتساب مباشرة؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>نعم، يمكنك التواصل معنا مباشرة عبر واتساب لإتمام الطلب أو الاستفسار عن أي منتج.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">هل يمكنني تغيير أو إلغاء طلبي؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>نعم، يمكنك تغيير أو إلغاء الطلب قبل شحنه بالتواصل معنا عبر واتساب. بعد الشحن يمكنك رفض الاستلام.</p></div>
            </div>
        </div>

        <div class="faq-category">
            <h2 class="faq-category-title"><i class="fas fa-truck"></i> الشحن والتوصيل</h2>
            <div class="faq-item">
                <button class="faq-question" type="button">هل التوصيل متاح لجميع الولايات؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>نعم، نوصل لجميع ولايات الجزائر الـ 58 دون استثناء. يمكنك التوصيل للمنزل أو مكتب الشحن.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">كم مدة التوصيل؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>24 – 48 ساعة للمدن الكبرى، 2 – 5 أيام لباقي الولايات، و5 – 7 أيام للمناطق النائية. المدة تُحتسب من تاريخ تأكيد الطلب.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">هل سعر الشحن يشمل المنتج؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>سعر الشحن منفصل عن سعر المنتج. يتم عرض سعر الشحن الدقيق عند اختيار ولايتك في صفحة الطلب قبل التأكيد.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">ماذا يحدث بعد تأكيد الطلب؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>بعد تأكيد الطلب هاتفياً، يتم تجهيزه وإرساله عبر شركة الشحن. ستصلك رسالة واتساب برقم التتبع بعد الشحن.</p></div>
            </div>
        </div>

        <div class="faq-category">
            <h2 class="faq-category-title"><i class="fas fa-box-open"></i> المنتجات والجودة</h2>
            <div class="faq-item">
                <button class="faq-question" type="button">هل المنتجات كما في الصور؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>نعم، جميع الصور حقيقية للمنتجات. نلتزم بالشفافية الكاملة في عرض منتجاتنا.</p></div>
            </div>
            <div class="faq-item">
                <button class="faq-question" type="button">هل المنتجات متوفرة دائماً؟<i class="fas fa-chevron-down"></i></button>
                <div class="faq-answer"><p>تواصل معنا إن نفد مخزون منتج معين وسنُعلمك بموعد توفره أو نقترح بديلاً مناسباً.</p></div>
            </div>
        </div>

        <div class="faq-cta">
            <h2>لم تجد إجابة سؤالك؟</h2>
            <p>تواصل معنا مباشرة وسنرد عليك في أقرب وقت</p>
            <a href="https://wa.me/${wa}?text=${encodeURIComponent('مرحباً ' + BRAND.storeName + '، لدي سؤال...')}"
               target="_blank" class="btn btn-primary btn-ripple">
                <i class="fab fa-whatsapp"></i> اسألنا عبر واتساب
            </a>
        </div>
    </div>
</section>`;
    }

    /* ── PRIVACY PAGE ─────────────────────────────────────────── */
    function privacy() {
        const wa = CONFIG.waNumber || BRAND.whatsapp;
        return `
<section class="page-hero page-hero-sm">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <nav class="breadcrumb">
            <a href="#home">الرئيسية</a><i class="fas fa-chevron-left"></i>
            <span>سياسة الخصوصية</span>
        </nav>
    </div>
</section>
<section class="info-page">
    <div class="container">
        <div class="info-page-header">
            <h1><i class="fas fa-shield-alt"></i> سياسة الخصوصية</h1>
            <p>نحن في ${esc(BRAND.storeName)} نحترم خصوصية زبائننا ونلتزم بحماية بياناتهم الشخصية</p>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-database"></i> البيانات التي نجمعها</h2>
            <p>نقوم بجمع المعلومات الضرورية فقط لمعالجة الطلبات والتواصل مع الزبون:</p>
            <ul>
                <li>الاسم الكامل</li>
                <li>رقم الهاتف</li>
                <li>الولاية والبلدية</li>
                <li>العنوان الكامل</li>
                <li>تفاصيل الطلب (المنتجات، الكميات، المبالغ)</li>
            </ul>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-cogs"></i> كيف نستخدم بياناتك</h2>
            <p>تُستخدم بياناتك حصراً للأغراض التالية:</p>
            <ul>
                <li>تأكيد الطلب عبر الهاتف أو واتساب</li>
                <li>تجهيز الطلب وإرساله</li>
                <li>التواصل مع الزبون قبل وبعد التسليم</li>
                <li>تتبع حالة الطلب</li>
            </ul>
            <div class="info-highlight">
                <i class="fas fa-ban"></i>
                <span>لا نجمع أي بيانات بنكية أو معلومات دفع إلكتروني، لأن الدفع يكون نقداً عند الاستلام فقط.</span>
            </div>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-share-alt"></i> مشاركة البيانات</h2>
            <p>لا نشارك بياناتك الشخصية مع أي طرف ثالث باستثناء شركة الشحن المسؤولة عن توصيل طلبك.</p>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-lock"></i> أمان البيانات</h2>
            <p>نلتزم بالحفاظ على سرية معلوماتك وعدم استخدامها لأي غرض آخر غير معالجة طلبك.</p>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-phone-alt"></i> تواصل معنا بخصوص بياناتك</h2>
            <p>إذا كان لديك أي استفسار حول خصوصيتك أو تريد حذف بياناتك، تواصل معنا عبر واتساب.</p>
        </div>

        <div style="text-align:center;margin-top:40px;">
            <a href="https://wa.me/${wa}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن سياسة الخصوصية')}"
               target="_blank" class="btn btn-primary btn-ripple">
                <i class="fab fa-whatsapp"></i> تواصل معنا
            </a>
        </div>
    </div>
</section>`;
    }

    /* ── SHIPPING PAGE ────────────────────────────────────────── */
    function shipping() {
        const wa = CONFIG.waNumber || BRAND.whatsapp;
        return `
<section class="page-hero page-hero-sm">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <nav class="breadcrumb">
            <a href="#home">الرئيسية</a><i class="fas fa-chevron-left"></i>
            <span>الشحن والتوصيل</span>
        </nav>
    </div>
</section>
<section class="info-page">
    <div class="container">
        <div class="info-page-header">
            <h1><i class="fas fa-truck"></i> سياسة الشحن والتوصيل</h1>
            <p>نوفر خدمة التوصيل لجميع ولايات الجزائر — الدفع عند الاستلام فقط</p>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-map-marker-alt"></i> التغطية الجغرافية</h2>
            <p>نوفر خدمة التوصيل لجميع ولايات الجزائر الـ 58 دون استثناء عبر شركات الشحن المعتمدة.</p>
            <div class="info-highlight"><i class="fas fa-home"></i> التوصيل إلى المنزل أو مكتب الشحن — حسب اختيارك.</div>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-money-bill-wave"></i> أسعار الشحن</h2>
            <p>سعر الشحن يتم حسابه حسب الولاية والمنطقة:</p>
            <ul>
                <li>التوصيل إلى المنزل: <strong>600 – 800 DZD</strong> حسب الولاية</li>
                <li>التوصيل إلى مكتب الشحن: <strong>400 – 500 DZD</strong> حسب الولاية</li>
            </ul>
            <div class="info-highlight">
                <i class="fas fa-info-circle"></i>
                سعر الشحن الدقيق يظهر عند اختيار ولايتك في صفحة الطلب — قبل التأكيد النهائي.
            </div>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-clock"></i> مدة التوصيل</h2>
            <ul>
                <li><strong>الجزائر العاصمة والمدن الكبرى:</strong> 24 إلى 48 ساعة</li>
                <li><strong>باقي الولايات:</strong> 2 إلى 5 أيام عمل</li>
                <li><strong>المناطق النائية:</strong> 5 إلى 7 أيام عمل</li>
            </ul>
            <p style="margin-top:10px;font-size:.88rem;color:var(--text-muted);">المدة تُحتسب من تاريخ تأكيد الطلب هاتفياً.</p>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-list-ol"></i> مراحل الطلب والتوصيل</h2>
            <div class="shipping-steps">
                <div class="shipping-step">
                    <div class="step-num">1</div>
                    <div class="step-body"><h4>أضف للسلة وأكمل معلوماتك</h4><p>اختر منتجاتك واملأ بيانات التواصل والتوصيل</p></div>
                </div>
                <div class="shipping-step">
                    <div class="step-num">2</div>
                    <div class="step-body"><h4>تأكيد هاتفي</h4><p>سنتصل بك لتأكيد الطلب قبل الشحن — لا مفاجآت</p></div>
                </div>
                <div class="shipping-step">
                    <div class="step-num">3</div>
                    <div class="step-body"><h4>الشحن والمتابعة</h4><p>يُشحن طلبك وتصلك رسالة واتساب برقم التتبع</p></div>
                </div>
                <div class="shipping-step">
                    <div class="step-num">4</div>
                    <div class="step-body"><h4>الاستلام والدفع</h4><p>تستلم طلبك وتدفع فقط عند الاستلام</p></div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h2><i class="fas fa-search-location"></i> تتبع طلبك</h2>
            <p>بعد شحن طلبك ستصلك رسالة واتساب برقم التتبع وشركة الشحن.</p>
            <div style="text-align:center;margin-top:16px;">
                <a href="https://wa.me/${wa}?text=${encodeURIComponent('مرحباً ' + BRAND.storeName + '، أريد الاستفسار عن طلبي')}"
                   target="_blank" class="btn btn-primary btn-ripple">
                    <i class="fab fa-whatsapp"></i> تتبع طلبي عبر واتساب
                </a>
            </div>
        </div>
    </div>
</section>`;
    }

    /* ── PRODUCT DETAIL PAGE ──────────────────────────────────── */
    function productDetail(product) {
        const imgs = (product.images && product.images.length > 1)
            ? product.images
            : (product.image ? [product.image] : []);
        const catLabels = { bundle: 'أطقم موس', single: 'موس فردي', accessory: 'إكسسوار', sale: 'عروض خاصة' };
        const catLabel  = product.category_label || catLabels[product.category] || product.category || '';
        const discPct   = product.old_price
            ? Math.round((1 - product.price / product.old_price) * 100) : 0;
        const oldPriceHTML  = product.old_price
            ? `<span class="detail-price-old">${Number(product.old_price).toLocaleString('en-US')} DZD</span>` : '';
        const discountHTML  = discPct
            ? `<span class="detail-discount">خصم ${discPct}%</span>` : '';
        const badgeClassMap = { hot: 'badge-hot', new: 'badge-new', sale: 'badge-sale', limited: 'badge-sale', featured: 'badge-new' };
        const badgeCls   = badgeClassMap[product.badge] || 'badge-sale';
        const badgeLabel = window.BRAND?.badges?.[product.badge] || product.badge || '';
        const badgeHTML  = badgeLabel
            ? `<span class="product-badge product-badge-lg ${badgeCls}">${esc(badgeLabel)}</span>` : '';
        const thumbsHTML = imgs.length > 1
            ? imgs.map((src, i) => `
            <div class="thumb${i === 0 ? ' active' : ''}" onclick="changeMainImage(this)" role="button" tabindex="0">
                <img src="${esc(src)}" alt="${esc(product.name)}" loading="lazy">
            </div>`).join('') : '';
        const featuresHTML = (product.features || []).map(f =>
            `<li><i class="fas fa-check-circle"></i> ${esc(f)}</li>`
        ).join('');
        const wa = CONFIG.waNumber || BRAND.whatsapp;
        const waProductUrl = `https://wa.me/${wa}?text=${encodeURIComponent('مرحباً ' + (window.BRAND?.storeName || 'ورشة يحيى') + '، أريد الاستفسار عن: ' + product.name + ' (' + Number(product.price).toLocaleString('en-US') + ' DZD)')}`;

        const related = Products.getAll()
            .filter(p => p.category === product.category && String(p.id) !== String(product.id))
            .slice(0, 4);
        const relatedSection = related.length ? `
<section class="related-products">
    <div class="container">
        <h2 class="section-title" style="margin-bottom:32px;">منتجات مشابهة</h2>
        <div class="products-grid">
            ${related.map(p => `
            <div class="product-card" style="cursor:pointer;">
                <div class="product-image">
                    ${p.badge ? `<span class="product-badge">${esc(String(p.badge))}</span>` : ''}
                    <img src="${esc(p.image||'')}" alt="${esc(p.name)}" loading="lazy">
                    <a class="product-quick-view-hint" href="#product/${p.id}"><i class="fas fa-eye"></i> عرض التفاصيل</a>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${esc(p.name)}</h3>
                    <div class="product-footer">
                        <span class="product-price">${Number(p.price).toLocaleString('en-US')} DZD</span>
                        <a href="#product/${p.id}" class="btn btn-primary btn-sm btn-ripple">عرض</a>
                    </div>
                </div>
            </div>`).join('')}
        </div>
    </div>
</section>` : '';

        return `
<section class="page-hero page-hero-sm">
    <div class="page-hero-overlay"></div>
    <div class="container">
        <nav class="breadcrumb">
            <a href="#home">الرئيسية</a>
            <i class="fas fa-chevron-left"></i>
            <a href="#products">المنتجات</a>
            <i class="fas fa-chevron-left"></i>
            <span>${esc(product.name)}</span>
        </nav>
    </div>
</section>

<section class="product-detail">
    <div class="container">
        <div class="product-detail-grid">
            <div class="product-gallery">
                <div class="product-gallery-main">
                    ${badgeHTML}
                    <img src="${esc(imgs[0] || '')}" alt="${esc(product.name)}" id="mainProductImg">
                </div>
                ${thumbsHTML ? `<div class="product-gallery-thumbs">${thumbsHTML}</div>` : ''}
            </div>
            <div class="product-detail-info">
                <span class="product-category-tag">${esc(catLabel)}</span>
                <h1 class="product-detail-title">${esc(product.name)}</h1>
                <div class="product-rating">
                    <span class="stars">★★★★★</span>
                    <span>(تقييمات العملاء)</span>
                </div>
                <div class="product-detail-price">
                    <span class="detail-price">${Number(product.price).toLocaleString('en-US')} DZD</span>
                    ${oldPriceHTML}${discountHTML}
                </div>
                <div class="cod-trust-box">
                    <i class="fas fa-check-circle"></i>
                    الدفع عند الاستلام — لن تدفع أي شيء الآن
                </div>
                <div class="product-detail-desc">
                    <p>${esc(product.description || product.short_description || '')}</p>
                </div>
                ${featuresHTML ? `
                <div class="product-detail-features">
                    <h3>لماذا تختار هذا المنتج؟</h3>
                    <ul>${featuresHTML}</ul>
                </div>` : ''}
                <div class="product-detail-meta">
                    <div class="meta-item"><i class="fas fa-money-bill-wave"></i><span>الدفع عند الاستلام — لا بطاقة بنكية</span></div>
                    <div class="meta-item"><i class="fas fa-truck"></i><span>توصيل حسب الولاية — سريع وآمن</span></div>
                    <div class="meta-item"><i class="fas fa-phone-alt"></i><span>تأكيد هاتفي قبل الشحن</span></div>
                    <div class="meta-item"><i class="fas fa-shield-alt"></i><span>منتج مختار بعناية — جودة مضمونة</span></div>
                </div>
                <div class="product-detail-actions">
                    <div class="qty-selector" role="group" aria-label="الكمية">
                        <button class="qty-btn" id="qtyMinus" aria-label="إنقاص">−</button>
                        <span class="qty-value" id="qtyValue">1</span>
                        <button class="qty-btn" id="qtyPlus"  aria-label="زيادة">+</button>
                    </div>
                    <button class="btn btn-primary btn-ripple btn-lg add-to-cart-detail"
                            data-id="${product.id}" data-name="${esc(product.name)}" data-price="${product.price}">
                        <i class="fas fa-cart-plus"></i> أضف للسلة
                    </button>
                </div>
                <a href="${waProductUrl}" target="_blank" class="btn btn-whatsapp btn-block btn-ripple">
                    <i class="fab fa-whatsapp"></i> اطلب مباشرة عبر واتساب
                </a>
                <p style="text-align:center;font-size:.78rem;color:var(--text-muted);margin-top:8px;">
                    <i class="fas fa-lock"></i> دفع آمن عند الاستلام — لا حاجة لبطاقة بنكية
                </p>
            </div>
        </div>
    </div>
</section>

${relatedSection}

<div class="detail-sticky-bar" id="detailStickyBar">
    <span class="detail-sticky-price">${Number(product.price).toLocaleString('en-US')} DZD</span>
    <button class="btn btn-primary btn-ripple add-to-cart-detail"
            data-id="${product.id}" data-name="${esc(product.name)}" data-price="${product.price}"
            style="flex:1;">
        <i class="fas fa-cart-plus"></i> أضف للسلة
    </button>
    <a href="${waProductUrl}" target="_blank" class="btn btn-whatsapp"
       style="width:48px;padding:0;aspect-ratio:1;flex-shrink:0;" aria-label="واتساب">
        <i class="fab fa-whatsapp"></i>
    </a>
</div>`;
    }

    return { home, products, faq, privacy, shipping, productDetail };
})();
