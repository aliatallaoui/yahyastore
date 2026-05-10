window.Products = (() => {
    const catLabels = { bundle: 'أطقم موس', single: 'موس فردي', accessory: 'إكسسوار', sale: 'عروض خاصة' };
    let _observer = null;
    let _currentFilter = 'all';
    let _productsData  = [];
    let _modalInited   = false;

    function esc(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    function getBadgeClass(badge) {
        const map = { hot: 'badge-hot', new: 'badge-new', sale: 'badge-sale', limited: 'badge-sale', featured: 'badge-new' };
        return map[badge] || '';
    }

    function getBadgeLabel(badge) {
        if (!badge) return '';
        const B = window.BRAND?.badges || {};
        return B[badge] || badge;
    }

    function getDiscountPct(price, oldPrice) {
        if (!oldPrice || Number(oldPrice) <= 0 || Number(price) >= Number(oldPrice)) return 0;
        return Math.round((1 - Number(price) / Number(oldPrice)) * 100);
    }

    function starsHtml(rating) {
        const r = Math.min(5, Math.max(0, Math.round(rating || 5)));
        return `<div class="card-stars" aria-label="التقييم: ${r} من 5">` +
            Array.from({ length: 5 }, (_, i) =>
                `<i class="fas fa-star${i < r ? '' : '-o'}" style="color:${i < r ? 'var(--secondary,#c8a656)' : 'var(--border,#2e2820)'};font-size:.75rem;"></i>`
            ).join('') +
        `</div>`;
    }

    function setupIntersectionObserver() {
        _observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    _observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        return _observer;
    }

    function bindImageShimmer(root) {
        (root || document).querySelectorAll('.product-image img').forEach(img => {
            const markLoaded = () => img.closest('.product-image')?.classList.add('loaded');
            if (img.complete) markLoaded();
            else img.addEventListener('load', markLoaded);
        });
    }

    function renderGrid(grid, products, isProductsPage) {
        if (!isProductsPage) _currentFilter = 'all';
        if (!products.length) {
            grid.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted,#888);grid-column:1/-1;">لا توجد منتجات متاحة حالياً.</div>';
            return;
        }

        grid.innerHTML = products.map(p => {
            const discPct      = getDiscountPct(p.price, p.old_price);
            const badgeClass   = getBadgeClass(p.badge);
            const badgeLabel   = getBadgeLabel(p.badge);
            const badgeHtml    = badgeLabel ? `<span class="product-badge ${badgeClass}">${badgeLabel}</span>` : '';
            const discBadge    = discPct > 0 && !p.badge ? `<span class="product-badge badge-sale">${discPct}% خصم</span>` : '';
            const oldPriceHtml = p.old_price ? `<span class="product-price-old">${Number(p.old_price).toLocaleString('en-US')} DZD</span>` : '';
            const galleryImgs  = (p.images && p.images.length > 1) ? p.images : (p.image ? [p.image] : []);
            const catLabel     = p.category_label || catLabels[p.category] || p.category || '';
            const addToCartCopy = window.BRAND?.copy?.addToCart || 'أضف للسلة';

            const cardData = [
                `data-id="${p.id}"`,
                `data-name="${esc(p.name)}"`,
                `data-price="${p.price}"`,
                `data-discount="${p.discount || discPct || 0}"`,
                `data-old-price="${p.old_price || ''}"`,
                `data-img="${esc(p.image || '')}"`,
                `data-gallery="${esc(JSON.stringify(galleryImgs))}"`,
                `data-desc="${esc(p.short_description || p.description || '')}"`,
                `data-category="${p.category || ''}"`,
                `data-category-label="${esc(p.category_label || catLabels[p.category] || p.category || '')}"`,
            ].join(' ');

            if (isProductsPage) {
                return `
<div class="product-card" data-category="${p.category}" ${cardData} style="cursor:pointer;">
    <div class="product-image">
        ${badgeHtml}${discBadge}
        <img src="${p.image || ''}" alt="${esc(p.name)}" loading="lazy">
        <div class="product-frame"></div>
        <div class="product-quick-actions">
            <button class="quick-add add-to-cart" data-id="${p.id}" data-name="${esc(p.name)}" data-price="${p.price}" title="${addToCartCopy}">
                <i class="fas fa-cart-plus"></i>
            </button>
            <button class="quick-whatsapp" data-name="${esc(p.name)}" data-price="${p.price}" title="اطلب عبر واتساب">
                <i class="fab fa-whatsapp"></i>
            </button>
        </div>
    </div>
    <div class="product-info">
        <div class="product-info-top">
            <span class="product-category-tag">${catLabel}</span>
            ${starsHtml(5)}
        </div>
        <h3 class="product-title">${esc(p.name)}</h3>
        <p class="product-desc">${esc(p.short_description || p.description || '')}</p>
        <div class="card-cod-tag"><i class="fas fa-money-bill-wave"></i> الدفع عند الاستلام</div>
        <div class="product-footer">
            <div class="price-wrapper">
                <span class="product-price">${Number(p.price).toLocaleString('en-US')} DZD</span>
                ${oldPriceHtml}
            </div>
            <button class="btn btn-primary btn-ripple add-to-cart" data-id="${p.id}" data-name="${esc(p.name)}" data-price="${p.price}">${addToCartCopy}</button>
        </div>
    </div>
</div>`;
            }

            return `
<div class="product-card" data-category="${p.category}" ${cardData} style="cursor:pointer;">
    <div class="product-image">
        ${badgeHtml}${discBadge}
        <img src="${p.image || ''}" alt="${esc(p.name)}" loading="lazy">
        <div class="product-frame"></div>
        <a class="product-quick-view-hint" href="#product/${p.id}"><i class="fas fa-eye"></i> عرض التفاصيل</a>
    </div>
    <div class="product-info">
        <div class="product-info-top">
            <span class="product-category-tag">${catLabel}</span>
            ${starsHtml(5)}
        </div>
        <h3 class="product-title">${esc(p.name)}</h3>
        <p class="product-desc">${esc(p.short_description || p.description || '')}</p>
        <div class="card-cod-tag"><i class="fas fa-money-bill-wave"></i> الدفع عند الاستلام</div>
        <div class="product-footer">
            <div class="price-wrapper">
                <span class="product-price">${Number(p.price).toLocaleString('en-US')} DZD</span>
                ${oldPriceHtml}
            </div>
            <button class="btn btn-primary btn-ripple add-to-cart" data-id="${p.id}" data-name="${esc(p.name)}" data-price="${p.price}">${addToCartCopy}</button>
        </div>
    </div>
</div>`;
        }).join('');

        if (_observer) {
            grid.querySelectorAll('.product-card').forEach(el => {
                el.classList.add('fade-in');
                _observer.observe(el);
            });
        }
        applyFilterAndSort(grid);
        bindImageShimmer(grid);
    }

    function applyFilterAndSort(grid) {
        const g = grid || document.getElementById('productsGrid');
        if (!g) return;
        const sortSelect = document.getElementById('sortProducts');
        const cards = Array.from(g.querySelectorAll('.product-card'));

        cards.forEach(card => {
            const show = _currentFilter === 'all' || card.dataset.category === _currentFilter;
            card.classList.toggle('hidden', !show);
            card.style.display = show ? '' : 'none';
        });

        if (sortSelect) {
            const sortVal = sortSelect.value;
            const visible = cards.filter(c => !c.classList.contains('hidden'));
            if (sortVal === 'price-low') {
                visible.sort((a, b) => parseInt(a.dataset.price || 0) - parseInt(b.dataset.price || 0));
            } else if (sortVal === 'price-high') {
                visible.sort((a, b) => parseInt(b.dataset.price || 0) - parseInt(a.dataset.price || 0));
            } else if (sortVal === 'discount') {
                visible.sort((a, b) => parseInt(b.dataset.discount || 0) - parseInt(a.dataset.discount || 0));
            }
            visible.forEach(card => g.appendChild(card));
        }
    }

    function updateTabCounts(products) {
        const counts = { all: products.length };
        products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
        document.querySelectorAll('.filter-tab').forEach(tab => {
            const span = tab.querySelector('.tab-count');
            if (span && counts[tab.dataset.filter] !== undefined) {
                span.textContent = counts[tab.dataset.filter];
            }
        });
    }

    function initFilterTabs() {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');
                _currentFilter = tab.dataset.filter;
                applyFilterAndSort();
            });
        });

        const sortSelect = document.getElementById('sortProducts');
        if (sortSelect) sortSelect.addEventListener('change', () => applyFilterAndSort());
    }

    function initQuickViewModal() {
        if (_modalInited) return;
        _modalInited = true;

        document.body.insertAdjacentHTML('beforeend', `
            <div class="pm-overlay" id="pmOverlay"></div>
            <div class="pm" id="pmModal" role="dialog" aria-modal="true" aria-labelledby="pmName">
                <button class="pm-close" id="pmClose" aria-label="إغلاق"><i class="fas fa-times"></i></button>
                <div class="pm-body">
                    <div class="pm-img">
                        <div class="pm-main-img">
                            <img id="pmImg" src="" alt="">
                            <button class="pm-nav pm-nav-prev" id="pmNavPrev" aria-label="الصورة السابقة"><i class="fas fa-chevron-right"></i></button>
                            <button class="pm-nav pm-nav-next" id="pmNavNext" aria-label="الصورة التالية"><i class="fas fa-chevron-left"></i></button>
                            <span class="pm-counter" id="pmCounter"></span>
                        </div>
                        <div class="pm-thumbs" id="pmThumbs"></div>
                    </div>
                    <div class="pm-info">
                        <span class="pm-cat" id="pmCat"></span>
                        <h2 class="pm-name" id="pmName"></h2>
                        <p class="pm-desc" id="pmDesc"></p>
                        <div class="pm-price-row">
                            <span class="pm-price" id="pmPrice"></span>
                            <span class="pm-oldprice" id="pmOldPrice"></span>
                        </div>
                        <div class="pm-cod"><i class="fas fa-money-bill-wave"></i> الدفع عند الاستلام (COD)</div>
                        <div class="pm-actions">
                            <button class="btn btn-primary btn-ripple add-to-cart" id="pmCart" data-id="" data-name="" data-price="">
                                <i class="fas fa-cart-plus"></i> أضف للسلة
                            </button>
                            <button class="btn" id="pmWa" style="background:#25d366;color:#fff;">
                                <i class="fab fa-whatsapp"></i> اطلب مباشرة عبر واتساب
                            </button>
                            <a class="btn btn-outline" id="pmDetail" href="#" style="text-align:center;font-size:.85rem;">
                                <i class="fas fa-expand-alt"></i> عرض الصفحة الكاملة
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const overlay = document.getElementById('pmOverlay');
        const modal   = document.getElementById('pmModal');

        let _gallery = [];
        let _galleryIdx = 0;

        function updateCounter() {
            const el = document.getElementById('pmCounter');
            if (!el) return;
            if (_gallery.length > 1) {
                el.textContent = `${_galleryIdx + 1} / ${_gallery.length}`;
                el.classList.add('always');
            } else {
                el.textContent = '';
                el.classList.remove('always');
            }
        }

        function showNavButtons(show) {
            document.getElementById('pmNavPrev').style.display = show ? '' : 'none';
            document.getElementById('pmNavNext').style.display = show ? '' : 'none';
        }

        function goToImage(idx) {
            _galleryIdx = (idx + _gallery.length) % _gallery.length;
            const img = document.getElementById('pmImg');
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = _gallery[_galleryIdx] || '';
                img.style.opacity = '1';
            }, 150);
            const thumbs = document.querySelectorAll('#pmThumbs .pm-thumb');
            thumbs.forEach((t, i) => {
                t.classList.toggle('active', i === _galleryIdx);
                if (i === _galleryIdx) t.scrollIntoView({ inline: 'nearest', behavior: 'smooth' });
            });
            updateCounter();
        }

        function renderThumbs(images, name) {
            const container = document.getElementById('pmThumbs');
            if (!images || images.length <= 1) { container.innerHTML = ''; return; }
            container.innerHTML = images.map((src, i) =>
                `<div class="pm-thumb${i === 0 ? ' active' : ''}" data-index="${i}">
                    <img src="${esc(src)}" alt="${esc(name)}" loading="lazy">
                </div>`
            ).join('');
            container.querySelectorAll('.pm-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => goToImage(parseInt(thumb.dataset.index)));
            });
        }

        // Arrow buttons
        document.getElementById('pmNavPrev').addEventListener('click', () => goToImage(_galleryIdx - 1));
        document.getElementById('pmNavNext').addEventListener('click', () => goToImage(_galleryIdx + 1));

        // Touch swipe on main image
        const mainImgEl = document.querySelector('.pm-main-img');
        let _touchStartX = 0;
        mainImgEl.addEventListener('touchstart', e => { _touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        mainImgEl.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - _touchStartX;
            if (Math.abs(dx) > 40) goToImage(_galleryIdx + (dx > 0 ? -1 : 1));
        }, { passive: true });

        function openModal(d) {
            _gallery = (d.gallery && d.gallery.length) ? d.gallery : (d.img ? [d.img] : []);
            _galleryIdx = 0;
            const mainImg = document.getElementById('pmImg');
            mainImg.src = _gallery[0] || '';
            mainImg.alt = d.name || '';
            mainImg.style.opacity = '1';
            document.getElementById('pmCat').textContent   = d.categoryLabel || catLabels[d.category] || d.category || '';
            document.getElementById('pmName').textContent  = d.name || '';
            document.getElementById('pmDesc').textContent  = d.desc || '';
            document.getElementById('pmPrice').textContent = Number(d.price).toLocaleString('en-US') + ' DZD';
            const oldEl = document.getElementById('pmOldPrice');
            oldEl.textContent = d.oldPrice ? Number(d.oldPrice).toLocaleString('en-US') + ' DZD' : '';
            const cartBtn = document.getElementById('pmCart');
            cartBtn.dataset.id    = d.id;
            cartBtn.dataset.name  = d.name;
            cartBtn.dataset.price = d.price;
            document.getElementById('pmWa').dataset.name  = d.name;
            document.getElementById('pmWa').dataset.price = d.price;
            const detailLink = document.getElementById('pmDetail');
            if (detailLink) detailLink.href = `#product/${d.id}`;
            renderThumbs(_gallery, d.name);
            showNavButtons(_gallery.length > 1);
            updateCounter();
            overlay.classList.add('active');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            overlay.classList.remove('active');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        document.getElementById('pmClose').addEventListener('click', closeModal);
        document.getElementById('pmDetail').addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart, .add-to-cart-detail, #pmCart, #pmWa, .product-quick-view-hint')) return;
            const card = e.target.closest('.product-card');
            if (!card || !card.dataset.id) return;
            let gallery = [];
            try { gallery = JSON.parse(card.dataset.gallery || '[]'); } catch {}
            openModal({
                id:       card.dataset.id,
                name:     card.dataset.name,
                price:    card.dataset.price,
                oldPrice: card.dataset.oldPrice,
                img:      card.dataset.img,
                gallery,
                desc:          card.dataset.desc,
                category:      card.dataset.category,
                categoryLabel: card.dataset.categoryLabel,
            });
        });

        // WhatsApp direct from modal
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#pmWa');
            if (!btn) return;
            WA.openDirect(btn.dataset.name, btn.dataset.price);
            closeModal();
        });

        // quick-whatsapp on product card
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-whatsapp');
            if (!btn) return;
            WA.openDirect(btn.dataset.name, btn.dataset.price);
        });

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight' && _gallery.length > 1) goToImage(_galleryIdx - 1);
            if (e.key === 'ArrowLeft'  && _gallery.length > 1) goToImage(_galleryIdx + 1);
        });

        return { openModal, closeModal };
    }

    async function init(gridId, isProductsPage) {
        const grid = document.getElementById(gridId || 'productsGrid');

        // Always set up the modal (needed on all pages for search-result click → modal)
        initQuickViewModal();

        if (grid) {
            setupIntersectionObserver();
            initFilterTabs();
            grid.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted,#888);grid-column:1/-1;">جاري تحميل المنتجات...</div>';
        }

        try {
            if (!_productsData.length) {
                _productsData = await API.fetchProducts();
            }
            if (grid) {
                renderGrid(grid, _productsData, isProductsPage);
                if (isProductsPage) {
                    updateTabCounts(_productsData);
                    const pending = sessionStorage.getItem('pendingFilter');
                    if (pending) {
                        sessionStorage.removeItem('pendingFilter');
                        const tab = document.querySelector(`.filter-tab[data-filter="${pending}"]`);
                        if (tab) tab.click();
                    }
                }
            }
        } catch (err) {
            console.error('Products fetch error:', err);
            if (grid) {
                grid.innerHTML = '<div style="text-align:center;padding:60px;color:#e53e3e;grid-column:1/-1;">تعذر تحميل المنتجات. يرجى المحاولة لاحقاً.</div>';
            }
        }
    }

    return {
        init,
        getAll:      ()    => _productsData,
        applyFilterAndSort,
        updateTabCounts,
        esc,
    };
})();
