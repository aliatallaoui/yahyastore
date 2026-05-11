document.addEventListener('DOMContentLoaded', () => {

    // ── UI (header, menu, lightbox, animations, etc.) ─────────────────────────
    UI.init();

    // ── Cart sidebar DOM refs ─────────────────────────────────────────────────
    const cartSidebar  = document.getElementById('cartSidebar');
    const cartOverlay  = document.getElementById('cartOverlay');
    const cartItemsEl  = document.getElementById('cartItems');
    const cartCountEl  = document.getElementById('cartCount');
    const cartTotalEl  = document.getElementById('cartTotal');

    function renderCartUI() {
        // Always update the badge, even on pages without the full cart sidebar
        if (cartCountEl) cartCountEl.textContent = Cart.count;
        if (!cartItemsEl) return;
        if (cartTotalEl) cartTotalEl.textContent = Cart.subtotal.toLocaleString('en-US') + ' DZD';

        if (Cart.isEmpty) {
            cartItemsEl.innerHTML = '<p class="empty-cart">سلة التسوق فارغة</p>';
        } else {
            cartItemsEl.innerHTML = Cart.items.map((item, index) => `
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
    }

    Cart.onChange(renderCartUI);
    renderCartUI();

    // Cart sidebar events
    const openCart  = () => { cartSidebar?.classList.add('active'); cartOverlay?.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeCart = () => { cartSidebar?.classList.remove('active'); cartOverlay?.classList.remove('active'); document.body.style.overflow = ''; };

    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('closeCart')?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    // Cart item actions (qty +/- and remove)
    cartItemsEl?.addEventListener('click', e => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const index = parseInt(btn.dataset.index);
        if (btn.dataset.action === 'qty')    Cart.updateQty(index, parseInt(btn.dataset.delta));
        if (btn.dataset.action === 'remove') Cart.remove(index);
    });

    // ── Add to cart — delegated, covers cards + modal + detail pages ──────────
    document.addEventListener('click', e => {
        const btn = e.target.closest('.add-to-cart, .add-to-cart-detail');
        if (!btn) return;
        const qtyEl = document.getElementById('qtyValue');
        const qty   = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
        const itemId        = btn.dataset.id;
        const itemName      = btn.dataset.name;
        const itemPrice     = parseInt(btn.dataset.price);
        const itemEngravable = btn.dataset.engravable === 'true';
        Cart.add(itemId, itemName, itemPrice, qty, itemEngravable);
        if (window.FBQ) FBQ('AddToCart', {
            content_ids:  [String(itemId)],
            content_name: itemName,
            content_type: 'product',
            value:        itemPrice,
            currency:     'DZD',
        });
        openCart();
        const origHTML  = btn.innerHTML;
        const addedCopy = window.BRAND?.copy?.added || 'تمت الإضافة ✓';
        btn.innerHTML = `<i class="fas fa-check"></i> ${addedCopy}`;
        btn.style.background = 'var(--primary-dark,#065f46)';
        btn.style.borderColor = 'var(--primary-dark,#065f46)';
        setTimeout(() => { btn.innerHTML = origHTML; btn.style.background = ''; btn.style.borderColor = ''; }, 1300);
    });

    // ── Checkout ──────────────────────────────────────────────────────────────
    Checkout.init(Cart);

    // ── Search modal ──────────────────────────────────────────────────────────
    const searchModal   = document.getElementById('searchModal');
    const searchInput   = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    function closeSearch() {
        searchModal?.classList.remove('active');
        if (searchInput)   searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
    }

    document.querySelector('.search-btn')?.addEventListener('click', () => {
        searchModal?.classList.add('active');
        setTimeout(() => searchInput?.focus(), 300);
    });

    document.getElementById('closeSearch')?.addEventListener('click', closeSearch);
    searchModal?.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });

    searchInput?.addEventListener('input', e => {
        const query = e.target.value.trim();
        if (!searchResults) return;
        if (query.length < 2) { searchResults.innerHTML = ''; return; }

        const results = Products.getAll().filter(p => p.name.includes(query));

        if (!results.length) {
            searchResults.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">لا توجد نتائج</p>';
            return;
        }

        searchResults.innerHTML = results.map(p => `
            <div class="search-result-item" data-id="${p.id}" role="button" tabindex="0">
                <span class="result-name">${p.name}</span>
                <span class="result-price">${Number(p.price).toLocaleString('en-US')} DZD</span>
            </div>
        `).join('');

        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            const trigger = () => {
                const product = Products.getAll().find(p => String(p.id) === item.dataset.id);
                if (!product) return;
                closeSearch();
                // Find the rendered product card in the DOM and click it to open the modal
                const card = document.querySelector(`.product-card[data-id="${product.id}"]`);
                if (card) {
                    card.click();
                } else {
                    location.hash = `#product/${product.id}`;
                }
            };
            item.addEventListener('click', trigger);
            item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
        });
    });

    // ── Global Escape key ─────────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        closeSearch();
        closeCart();
    });

    // ── Start router (renders first page + calls Products.init per route) ─────
    Router.init();

    // ── Admin shortcut button (only when admin cookie is set) ─────────────────
    if (document.cookie.split('; ').some(c => c === 'yh_admin=1')) {
        const ab = document.createElement('a');
        ab.href = '/admin';
        ab.id   = 'adminShortcut';
        ab.setAttribute('title', 'لوحة التحكم');
        ab.innerHTML = '<i class="fas fa-shield-alt"></i><span> لوحة التحكم</span>';
        ab.style.cssText =
            'position:fixed;bottom:24px;left:24px;z-index:9998;' +
            'background:rgba(15,15,10,.92);border:1px solid rgba(212,175,55,.45);' +
            'border-radius:10px;padding:9px 14px;display:flex;align-items:center;gap:8px;' +
            'color:#d4af37;text-decoration:none;font-size:.8rem;font-weight:700;' +
            'font-family:Cairo,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,.55);' +
            'transition:border-color .2s,background .2s;backdrop-filter:blur(6px);';
        ab.addEventListener('mouseenter', () => {
            ab.style.borderColor = 'rgba(212,175,55,.9)';
            ab.style.background  = 'rgba(26,26,16,.98)';
        });
        ab.addEventListener('mouseleave', () => {
            ab.style.borderColor = 'rgba(212,175,55,.45)';
            ab.style.background  = 'rgba(15,15,10,.92)';
        });
        document.body.appendChild(ab);
    }
});
