// ========================================
// ورشة يحيى للموس البوسعادي - Main JavaScript
// ========================================

// To enable order logging to Google Sheets, uncomment and set your Apps Script URL:
// window.GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Orders API (Laravel backend)
window.ORDERS_API_URL = 'http://localhost:8001/api/orders';
window.ORDERS_API_KEY = 'f99c4435c23a220b7789680ff0a65a723059ab082920c6e66e8ef49335b4deee';

// ========================================
// WILAYA DATA WITH SHIPPING ZONES
// ========================================
const wilayaData = [
    { code: 28, name: "المسيلة", zone: 1, shipping: 400 },
    { code: 17, name: "الجلفة", zone: 1, shipping: 400 },
    { code: 5, name: "باتنة", zone: 1, shipping: 400 },
    { code: 7, name: "بسكرة", zone: 1, shipping: 400 },
    { code: 34, name: "برج بوعريريج", zone: 1, shipping: 400 },
    { code: 3, name: "الأغواط", zone: 1, shipping: 400 },
    { code: 51, name: "أولاد جلال", zone: 1, shipping: 400 },
    { code: 16, name: "الجزائر", zone: 2, shipping: 600 },
    { code: 9, name: "البليدة", zone: 2, shipping: 600 },
    { code: 19, name: "سطيف", zone: 2, shipping: 600 },
    { code: 25, name: "قسنطينة", zone: 2, shipping: 600 },
    { code: 6, name: "بجاية", zone: 2, shipping: 600 },
    { code: 15, name: "تيزي وزو", zone: 2, shipping: 600 },
    { code: 26, name: "المدية", zone: 2, shipping: 600 },
    { code: 35, name: "بومرداس", zone: 2, shipping: 600 },
    { code: 10, name: "البويرة", zone: 2, shipping: 600 },
    { code: 43, name: "ميلة", zone: 2, shipping: 600 },
    { code: 4, name: "أم البواقي", zone: 2, shipping: 600 },
    { code: 40, name: "خنشلة", zone: 2, shipping: 600 },
    { code: 12, name: "تبسة", zone: 2, shipping: 600 },
    { code: 18, name: "جيجل", zone: 2, shipping: 600 },
    { code: 36, name: "الطارف", zone: 2, shipping: 600 },
    { code: 21, name: "سكيكدة", zone: 2, shipping: 600 },
    { code: 44, name: "عين الدفلة", zone: 2, shipping: 600 },
    { code: 42, name: "تيبازة", zone: 2, shipping: 600 },
    { code: 2, name: "الشلف", zone: 2, shipping: 600 },
    { code: 27, name: "مستغانم", zone: 2, shipping: 600 },
    { code: 38, name: "تيسمسيلت", zone: 2, shipping: 600 },
    { code: 14, name: "تيارت", zone: 2, shipping: 600 },
    { code: 20, name: "سعيدة", zone: 2, shipping: 600 },
    { code: 29, name: "معسكر", zone: 2, shipping: 600 },
    { code: 47, name: "غرداية", zone: 2, shipping: 600 },
    { code: 39, name: "الوادي", zone: 2, shipping: 600 },
    { code: 30, name: "ورقلة", zone: 2, shipping: 600 },
    { code: 55, name: "توقرت", zone: 2, shipping: 600 },
    { code: 57, name: "المغير", zone: 2, shipping: 600 },
    { code: 58, name: "المنيعة", zone: 2, shipping: 600 },
    { code: 31, name: "وهران", zone: 3, shipping: 800 },
    { code: 13, name: "تلمسان", zone: 3, shipping: 800 },
    { code: 22, name: "سيدي بلعباس", zone: 3, shipping: 800 },
    { code: 46, name: "عين تموشنت", zone: 3, shipping: 800 },
    { code: 48, name: "غليزان", zone: 3, shipping: 800 },
    { code: 41, name: "سوق أهراس", zone: 3, shipping: 800 },
    { code: 23, name: "عنابة", zone: 3, shipping: 800 },
    { code: 24, name: "قالمة", zone: 3, shipping: 800 },
    { code: 32, name: "البيض", zone: 3, shipping: 800 },
    { code: 45, name: "النعامة", zone: 3, shipping: 800 },
    { code: 8, name: "بشار", zone: 3, shipping: 800 },
    { code: 1, name: "أدرار", zone: 3, shipping: 800 },
    { code: 37, name: "تندوف", zone: 3, shipping: 800 },
    { code: 11, name: "تمنراست", zone: 3, shipping: 800 },
    { code: 33, name: "إليزي", zone: 3, shipping: 800 },
    { code: 49, name: "تيميمون", zone: 3, shipping: 800 },
    { code: 50, name: "برج باجي مختار", zone: 3, shipping: 800 },
    { code: 52, name: "بني عباس", zone: 3, shipping: 800 },
    { code: 53, name: "عين صالح", zone: 3, shipping: 800 },
    { code: 54, name: "عين قزام", zone: 3, shipping: 800 },
    { code: 56, name: "جانت", zone: 3, shipping: 800 }
];

// Product data for search — also drives navigation from search results
const productsData = [
    { id: '1', name: 'الباقة الكاملة المتكاملة', price: 39000, page: 'product-1.html' },
    { id: '2', name: 'الموس البوسعادي (قطعتين ذبيحة وسليخة)', price: 15000, page: 'product-2.html' },
    { id: '3', name: 'باك الموس البوسعادي (قطعتين)', price: 28000, page: 'product-3.html' },
    { id: '4', name: 'الموس البوسعادي الأصيل (زوج)', price: 18000, page: 'product-4.html' },
    { id: '5', name: 'الموس البوسعادي الأصيل من الشريمة', price: 17000, page: 'product-5.html' },
    { id: '6', name: 'باك العائلة البوسعادي', price: 13900, page: 'product-6.html' },
    { id: '7', name: 'القصعة المصنوعة يدويا - خشب البيقنون 40سم', price: 5900, page: 'product-7.html' },
    { id: '8', name: 'مبرد ذكير (مضاية)', price: 4900, page: 'product-8.html' }
];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('bousaadi_cart') || '[]');

    // --- DOM Elements ---
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const searchBtn = document.querySelector('.search-btn');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const header = document.getElementById('header');

    // Checkout elements
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutClose = document.getElementById('checkoutClose');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutWilayaSelect = document.getElementById('checkoutWilaya');
    const checkoutFormScreen = document.getElementById('checkoutFormScreen');
    const checkoutConfirmationScreen = document.getElementById('checkoutConfirmationScreen');
    const backToShopBtn = document.getElementById('backToShopBtn');

    // ========================================
    // MOBILE MENU
    // ========================================
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            if (navLinks) navLinks.classList.toggle('active');
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger) hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.background = window.pageYOffset > 100
                ? 'rgba(17, 17, 8, 0.98)'
                : 'rgba(17, 17, 8, 0.95)';
        });
    }

    // ========================================
    // ACTIVE NAV LINK (index page only)
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset + 200;
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (link) {
                    if (scrollY >= top && scrollY < top + height) {
                        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        });
    }

    // ========================================
    // CART FUNCTIONS
    // ========================================
    function updateCartUI() {
        if (!cartItems) return;
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        if (cartCount) cartCount.textContent = totalItems;
        if (cartTotal) cartTotal.textContent = totalPrice.toLocaleString('en-US') + ' DZD';

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">سلة التسوق فارغة</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${(item.price * item.qty).toLocaleString('en-US')} DZD</div>
                        <div class="cart-item-qty">
                            <button data-action="qty" data-index="${index}" data-delta="-1" aria-label="إنقاص الكمية">-</button>
                            <span>${item.qty}</span>
                            <button data-action="qty" data-index="${index}" data-delta="1" aria-label="زيادة الكمية">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-action="remove" data-index="${index}" aria-label="حذف ${item.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        localStorage.setItem('bousaadi_cart', JSON.stringify(cart));
    }

    // Event delegation replaces window.updateQty / window.removeItem globals
    if (cartItems) {
        cartItems.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const index = parseInt(btn.dataset.index);
            if (action === 'qty') {
                cart[index].qty += parseInt(btn.dataset.delta);
                if (cart[index].qty <= 0) cart.splice(index, 1);
                updateCartUI();
            } else if (action === 'remove') {
                cart.splice(index, 1);
                updateCartUI();
            }
        });
    }

    function addToCart(id, name, price, qty = 1) {
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ id, name, price, qty });
        }
        updateCartUI();
        openCart();
    }

    function openCart() {
        if (cartSidebar) cartSidebar.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartFn() {
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartFn);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartFn);

    // Covers both grid cards (.add-to-cart) and the detail page button (.add-to-cart-detail)
    document.querySelectorAll('.add-to-cart, .add-to-cart-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            const qtyEl = document.getElementById('qtyValue');
            const qty = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
            addToCart(btn.dataset.id, btn.dataset.name, parseInt(btn.dataset.price), qty);
            const origHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
            btn.style.background = '#27ae60';
            btn.style.borderColor = '#27ae60';
            setTimeout(() => {
                btn.innerHTML = origHTML;
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 1200);
        });
    });

    updateCartUI();

    // ========================================
    // PRODUCT DETAIL: QUANTITY SELECTOR
    // ========================================
    const qtyValue = document.getElementById('qtyValue');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    if (qtyMinus && qtyPlus && qtyValue) {
        qtyMinus.addEventListener('click', () => {
            const n = parseInt(qtyValue.textContent);
            if (n > 1) qtyValue.textContent = n - 1;
        });
        qtyPlus.addEventListener('click', () => {
            qtyValue.textContent = parseInt(qtyValue.textContent) + 1;
        });
    }

    // ========================================
    // PRODUCT DETAIL: IMAGE GALLERY
    // ========================================
    window.changeMainImage = (thumb) => {
        const mainImg = document.getElementById('mainProductImg');
        const thumbImg = thumb.querySelector('img');
        if (mainImg && thumbImg) {
            mainImg.src = thumbImg.src;
            mainImg.alt = thumbImg.alt;
        }
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    };

    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('role', 'button');
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.changeMainImage(thumb);
            }
        });
    });

    // ========================================
    // PRODUCT FILTERING & SORTING
    // ========================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');
    const sortSelect = document.getElementById('sortProducts');
    const productsGrid = document.getElementById('productsGrid');
    let currentFilter = 'all';

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            currentFilter = tab.dataset.filter;
            applyFilterAndSort();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilterAndSort);
    }

    function applyFilterAndSort() {
        const cards = Array.from(productCards);

        cards.forEach(card => {
            if (currentFilter === 'all' || card.dataset.category === currentFilter) {
                card.classList.remove('hidden');
                card.style.display = '';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        if (sortSelect && productsGrid) {
            const sortVal = sortSelect.value;
            const visible = cards.filter(c => !c.classList.contains('hidden'));

            if (sortVal === 'price-low') {
                visible.sort((a, b) => parseInt(a.dataset.price || 0) - parseInt(b.dataset.price || 0));
            } else if (sortVal === 'price-high') {
                visible.sort((a, b) => parseInt(b.dataset.price || 0) - parseInt(a.dataset.price || 0));
            } else if (sortVal === 'discount') {
                visible.sort((a, b) => parseInt(b.dataset.discount || 0) - parseInt(a.dataset.discount || 0));
            }

            visible.forEach(card => {
                productsGrid.appendChild(card);
                card.style.animation = 'fadeInUp 0.4s ease forwards';
            });
        }
    }

    // ========================================
    // SEARCH — navigates to product page instead of silently adding to cart
    // ========================================
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchModal) searchModal.classList.add('active');
            setTimeout(() => { if (searchInput) searchInput.focus(); }, 300);
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            if (searchModal) searchModal.classList.remove('active');
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
        });
    }

    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                if (searchInput) searchInput.value = '';
                if (searchResults) searchResults.innerHTML = '';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (!searchResults) return;
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            const results = productsData.filter(p => p.name.includes(query));

            if (results.length === 0) {
                searchResults.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">لا توجد نتائج</p>';
                return;
            }

            searchResults.innerHTML = results.map(p => `
                <div class="search-result-item" data-id="${p.id}" role="button" tabindex="0">
                    <span class="result-name">${p.name}</span>
                    <span class="result-price">${p.price.toLocaleString('en-US')} DZD</span>
                </div>
            `).join('');

            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                const navigate = () => {
                    const product = productsData.find(p => p.id === item.dataset.id);
                    if (product) {
                        if (searchModal) searchModal.classList.remove('active');
                        window.location.href = product.page;
                    }
                };
                item.addEventListener('click', navigate);
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); }
                });
            });
        });
    }

    // ========================================
    // WILAYA DROPDOWN INIT
    // ========================================
    if (checkoutWilayaSelect) {
        checkoutWilayaSelect.innerHTML = '<option value="">اختر الولاية</option>';
        wilayaData.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w.code;
            opt.textContent = `${w.code} - ${w.name}`;
            opt.dataset.shipping = w.shipping;
            checkoutWilayaSelect.appendChild(opt);
        });

        checkoutWilayaSelect.addEventListener('change', () => {
            updateCheckoutSummary();
            const err = document.getElementById('wilayaError');
            if (err) err.classList.remove('show');
        });
    }

    // ========================================
    // CHECKOUT FUNCTIONS
    // ========================================
    function updateCheckoutSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const wilayaCode = checkoutWilayaSelect ? checkoutWilayaSelect.value : '';
        const selectedWilaya = wilayaData.find(w => w.code == wilayaCode);
        const shipping = selectedWilaya ? selectedWilaya.shipping : 0;
        const total = subtotal + shipping;

        const itemsHtml = cart.map(item => `
            <div class="order-item">
                <span class="order-item-name">${item.name} x${item.qty}</span>
                <span class="order-item-price">${(item.price * item.qty).toLocaleString('en-US')} DZD</span>
            </div>
        `).join('');

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

        setHtml('checkoutOrderItems', itemsHtml);
        set('checkoutSubtotal', subtotal.toLocaleString('en-US') + ' DZD');
        set('checkoutShipping', shipping > 0 ? shipping.toLocaleString('en-US') + ' DZD' : 'اختر الولاية');
        set('checkoutGrandTotal', total.toLocaleString('en-US') + ' DZD');

        setHtml('confirmationOrderItems', itemsHtml);
        set('confirmationSubtotal', subtotal.toLocaleString('en-US') + ' DZD');
        set('confirmationShipping', shipping.toLocaleString('en-US') + ' DZD');
        set('confirmationGrandTotal', total.toLocaleString('en-US') + ' DZD');

        return { subtotal, shipping, total };
    }

    function openCheckout() {
        if (cart.length === 0) {
            alert('سلة التسوق فارغة!');
            return;
        }
        closeCartFn();
        updateCheckoutSummary();
        if (checkoutFormScreen) checkoutFormScreen.style.display = 'block';
        if (checkoutConfirmationScreen) checkoutConfirmationScreen.style.display = 'none';
        if (checkoutOverlay) checkoutOverlay.classList.add('active');
        if (checkoutModal) checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        if (checkoutOverlay) checkoutOverlay.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
        if (checkoutForm) checkoutForm.reset();
        clearFormErrors();
    }

    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
        document.querySelectorAll('.checkout-form input, .checkout-form select, .checkout-form textarea').forEach(el => {
            el.classList.remove('error');
        });
    }

    function showError(fieldId, errorId, msg) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (field) field.classList.add('error');
        if (error) { error.textContent = msg; error.classList.add('show'); }
    }

    function validateForm() {
        clearFormErrors();
        let valid = true;

        const name = document.getElementById('checkoutName').value.trim();
        if (!name) { showError('checkoutName', 'nameError', 'الاسم الكامل مطلوب'); valid = false; }
        else if (name.length < 3) { showError('checkoutName', 'nameError', 'الاسم يجب أن يكون 3 أحرف على الأقل'); valid = false; }

        const phone = document.getElementById('checkoutPhone').value.trim();
        if (!phone) { showError('checkoutPhone', 'phoneError', 'رقم الهاتف مطلوب'); valid = false; }
        else if (!/^(05|06|07)\d{8}$/.test(phone)) { showError('checkoutPhone', 'phoneError', 'صيغة الرقم غير صحيحة (05/06/07 + 8 أرقام)'); valid = false; }

        if (!checkoutWilayaSelect || !checkoutWilayaSelect.value) { showError('checkoutWilaya', 'wilayaError', 'الولاية مطلوبة'); valid = false; }

        const address = document.getElementById('checkoutAddress').value.trim();
        if (!address) { showError('checkoutAddress', 'addressError', 'العنوان مطلوب'); valid = false; }

        return valid;
    }

    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);
    if (backToShopBtn) backToShopBtn.addEventListener('click', closeCheckout);

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            const submitBtn = checkoutForm.querySelector('[type="submit"]');
            const origBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

            const name = document.getElementById('checkoutName').value.trim();
            const phone = document.getElementById('checkoutPhone').value.trim();
            const wilayaCode = checkoutWilayaSelect.value;
            const address = document.getElementById('checkoutAddress').value.trim();
            const notes = document.getElementById('checkoutNotes').value.trim();

            const selectedWilaya = wilayaData.find(w => w.code == wilayaCode);
            const wilayaName = selectedWilaya ? selectedWilaya.name : wilayaCode;
            const orderNumber = 'YHY-' + Date.now();
            const totals = updateCheckoutSummary();

            let msg = `🔪 *طلب جديد - ورشة يحيى* 🔪\n`;
            msg += `━━━━━━━━━━━━━━━\n`;
            msg += `📋 *رقم الطلب:* ${orderNumber}\n`;
            msg += `━━━━━━━━━━━━━━━\n\n`;
            msg += `👤 *الاسم:* ${name}\n`;
            msg += `📱 *الهاتف:* ${phone}\n`;
            msg += `📍 *الولاية:* ${wilayaName}\n`;
            msg += `🏠 *العنوان:* ${address}\n`;
            if (notes) msg += `📝 *ملاحظات:* ${notes}\n`;
            msg += `\n━━━━━━━━━━━━━━━\n`;
            msg += `🛒 *المنتجات:*\n\n`;
            cart.forEach(item => {
                msg += `▸ ${item.name}\n`;
                msg += `  العدد: ${item.qty} | السعر: ${(item.price * item.qty).toLocaleString('en-US')} DZD\n\n`;
            });
            msg += `━━━━━━━━━━━━━━━\n`;
            msg += `💰 *المجموع الفرعي:* ${totals.subtotal.toLocaleString('en-US')} DZD\n`;
            msg += `🚚 *التوصيل:* ${totals.shipping.toLocaleString('en-US')} DZD\n`;
            msg += `✅ *المجموع الكلي:* ${totals.total.toLocaleString('en-US')} DZD\n`;
            msg += `💳 *طريقة الدفع:* الدفع عند الاستلام\n`;
            msg += `━━━━━━━━━━━━━━━`;

            const whatsappUrl = `https://wa.me/213775108618?text=${encodeURIComponent(msg)}`;

            if (window.GOOGLE_SHEETS_URL) {
                fetch(window.GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderNumber, timestamp: new Date().toLocaleString('ar-DZ'),
                        name, phone, wilaya: wilayaName, address, notes,
                        items: cart.map(i => `${i.name} ×${i.qty}`).join(' | '),
                        subtotal: totals.subtotal, shipping: totals.shipping, total: totals.total,
                        paymentMethod: 'الدفع عند الاستلام'
                    })
                }).catch(() => {});
            }

            if (window.ORDERS_API_URL && window.ORDERS_API_KEY) {
                fetch(window.ORDERS_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': window.ORDERS_API_KEY,
                    },
                    body: JSON.stringify({
                        order_number: orderNumber,
                        customer_name: name,
                        customer_phone: phone,
                        wilaya: wilayaName,
                        address,
                        notes: notes || null,
                        subtotal: totals.subtotal,
                        shipping: totals.shipping,
                        total: totals.total,
                        payment_method: 'COD',
                        items: cart.map(i => ({
                            product_id: String(i.id),
                            product_name: i.name,
                            price: i.price,
                            quantity: i.qty,
                        })),
                    }),
                }).catch(() => {});
            }

            const whatsappBtn = document.getElementById('whatsappConfirmBtn');
            if (whatsappBtn) whatsappBtn.href = whatsappUrl;
            const confNum = document.getElementById('confirmationOrderNumber');
            if (confNum) confNum.textContent = orderNumber;

            if (checkoutFormScreen) checkoutFormScreen.style.display = 'none';
            if (checkoutConfirmationScreen) checkoutConfirmationScreen.style.display = 'flex';

            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHTML;

            cart = [];
            updateCartUI();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchModal) searchModal.classList.remove('active');
            closeCartFn();
            closeCheckout();
        }
    });

    // ========================================
    // TESTIMONIAL SLIDER (index page only)
    // ========================================
    const testimonialText = document.getElementById('testimonialText');
    if (testimonialText) {
        const testimonials = [
            { text: 'طلبت الباقة الكاملة المتكاملة وكانت الجودة فوق التوقعات. صناعة يدوية حقيقية والنقوش رائعة. الموس يدوم معاك للأبد. شكرا ورشة يحيى!', name: 'عبد الرحمان - تيزي وزو', avatar: 'images/avatar-1.jpg' },
            { text: 'اشتريت قطعتين ذبيحة وسليخة وكانت النتيجة مبهرة. التوصيل سريع والتغليف فاخر. أنصح بيها بشدة لكل من يقدر الصناعة التقليدية الجزائرية.', name: 'أحمد - وهران', avatar: 'images/avatar-2.jpg' },
            { text: 'خذيت باك العائلة كهدية للوالد وفرح بيها بزاف. جودة الفولاذ ممتازة والمقبض متين. ورشة يحيى ناس محترمين في التعامل.', name: 'محمد - العاصمة', avatar: 'images/avatar-3.jpg' },
            { text: 'طلبت موس بنقش الاسم وكان العمل احترافي بزاف. من أفضل المنتجات التقليدية الجزائرية. المقبض السلكي والنقوش يخلوه تحفة فنية فريدة.', name: 'يوسف - قسنطينة', avatar: 'images/avatar-4.jpg' }
        ];

        const dots = document.querySelectorAll('.dot');
        const testimonialName = document.getElementById('testimonialName');
        const testimonialAvatar = document.getElementById('testimonialAvatar');
        const testimonialCard = document.getElementById('testimonialCard');
        let currentTestimonial = 0;

        if (testimonialCard) testimonialCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        function showTestimonial(index) {
            currentTestimonial = index;
            const t = testimonials[index];
            if (testimonialCard) {
                testimonialCard.style.opacity = '0';
                testimonialCard.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    testimonialText.textContent = t.text;
                    if (testimonialName) testimonialName.textContent = t.name;
                    if (testimonialAvatar) testimonialAvatar.src = t.avatar;
                    testimonialCard.style.opacity = '1';
                    testimonialCard.style.transform = 'translateY(0)';
                }, 300);
            }
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        showTestimonial(0);

        dots.forEach(dot => {
            dot.addEventListener('click', () => showTestimonial(parseInt(dot.dataset.index)));
        });

        let testimonialInterval = setInterval(() => {
            showTestimonial((currentTestimonial + 1) % testimonials.length);
        }, 5000);

        // Pause auto-rotation on hover (WCAG 2.2.2 compliance)
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
            testimonialSlider.addEventListener('mouseleave', () => {
                testimonialInterval = setInterval(() => {
                    showTestimonial((currentTestimonial + 1) % testimonials.length);
                }, 5000);
            });
        }
    }

    // ========================================
    // STATS COUNTER (index page only)
    // ========================================
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        let statsAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    document.querySelectorAll('.stat-number').forEach(el => {
                        const target = parseInt(el.dataset.target);
                        const step = target / 125;
                        let current = 0;
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) { current = target; clearInterval(timer); }
                            el.textContent = Math.floor(current).toLocaleString('en-US');
                        }, 16);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const fadeElements = document.querySelectorAll('.product-card, .feature-card, .story-grid, .testimonial-card, .customize-content, .contact-form, .stat-item, .cta-content');
    fadeElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // ========================================
    // CONTACT FORM — wired to WhatsApp
    // ========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value.trim() || '';
            const phone = document.getElementById('contactPhone')?.value.trim() || '';
            const subject = document.getElementById('contactSubject')?.value.trim() || '';
            const message = document.getElementById('contactMessage')?.value.trim() || '';

            let msg = `مرحبا ورشة يحيى!\n\n`;
            if (name) msg += `الاسم: ${name}\n`;
            if (phone) msg += `الهاتف: ${phone}\n`;
            if (subject) msg += `الموضوع: ${subject}\n\n`;
            if (message) msg += `الرسالة:\n${message}`;

            window.open(`https://wa.me/213775108618?text=${encodeURIComponent(msg)}`, '_blank');

            const btn = contactForm.querySelector('.btn');
            const origText = btn.textContent;
            btn.textContent = 'تم الإرسال! ✓';
            btn.style.background = '#27ae60';
            btn.style.borderColor = '#27ae60';
            setTimeout(() => {
                btn.textContent = origText;
                btn.style.background = '';
                btn.style.borderColor = '';
                contactForm.reset();
            }, 2000);
        });
    }

    // ========================================
    // NEWSLETTER FORM
    // ========================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('.btn');
            btn.textContent = 'تم! ✓';
            setTimeout(() => {
                btn.textContent = 'اشترك';
                newsletterForm.reset();
            }, 2000);
        });
    }

    // ========================================
    // GALLERY LIGHTBOX (index page only)
    // ========================================
    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
        const galleryItems = document.querySelectorAll('.gallery-item img');
        const galleryImages = Array.from(galleryItems).map(img => img.src);
        let currentLightboxIndex = 0;

        window.openLightbox = (item) => {
            const img = item.querySelector('img');
            const lightboxImg = document.getElementById('lightboxImg');
            currentLightboxIndex = galleryImages.indexOf(img.src);
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        window.closeLightbox = () => {
            lightboxEl.classList.remove('active');
            document.body.style.overflow = '';
        };

        window.navigateLightbox = (dir) => {
            currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
            const lightboxImg = document.getElementById('lightboxImg');
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = galleryImages[currentLightboxIndex];
                lightboxImg.style.opacity = '1';
            }, 200);
        };

        lightboxEl.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) window.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightboxEl.classList.contains('active')) return;
            if (e.key === 'ArrowRight') window.navigateLightbox(-1);
            if (e.key === 'ArrowLeft') window.navigateLightbox(1);
        });

        const galleryElements = document.querySelectorAll('.gallery-item');
        galleryElements.forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 0.05}s`;
            el.setAttribute('tabindex', '0');
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.openLightbox(el);
                }
            });
        });
        galleryElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // HERO PARTICLES (index page only, respects prefers-reduced-motion)
    // ========================================
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const particlesContainer = document.getElementById('heroParticles');
        if (particlesContainer) {
            for (let i = 0; i < 30; i++) {
                const p = document.createElement('div');
                p.classList.add('hero-particle');
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 6 + 's';
                p.style.animationDuration = (4 + Math.random() * 4) + 's';
                p.style.width = (2 + Math.random() * 3) + 'px';
                p.style.height = p.style.width;
                particlesContainer.appendChild(p);
            }
        }
    }

    // ========================================
    // BACK TO TOP
    // ========================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // STOP SHIMMER AFTER IMAGE LOAD
    // ========================================
    document.querySelectorAll('.product-image img').forEach(img => {
        const markLoaded = () => img.closest('.product-image')?.classList.add('loaded');
        if (img.complete) markLoaded();
        else img.addEventListener('load', markLoaded);
    });
});
