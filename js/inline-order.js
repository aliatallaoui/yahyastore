/* Inline order form on product detail page */
window.IOF = (() => {
    let _product      = null;
    let _qty          = 1;
    let _promo        = null; // { code, type, value, discount, label }
    let _deliveryType = 'home'; // 'home' | 'desk'

    function el(id) { return document.getElementById(id); }
    function fmt(n) { return Number(n).toLocaleString('en-US'); }

    function getWilayas() { return (CONFIG && CONFIG.wilayas) ? CONFIG.wilayas : []; }
    function getShipping(code) {
        const w = getWilayas().find(w => w.code === code);
        return w ? (w[_deliveryType] ?? w.home) : null;
    }

    function setDeliveryType(type) {
        _deliveryType = type;
        el('iof_dt_home')?.classList.toggle('active', type === 'home');
        el('iof_dt_desk')?.classList.toggle('active', type === 'desk');
        updateSummary();
    }

    function updateSummary() {
        if (!_product) return;
        const wilayaEl = el('iof_wilaya');
        const code     = wilayaEl ? parseInt(wilayaEl.value) : 0;
        const shipping = code ? getShipping(code) : null;
        const subtotal = _product.price * _qty;
        const discount = _promo ? _promo.discount : 0;

        if (el('iof_qty_display')) el('iof_qty_display').textContent = _qty;
        if (el('iof_subtotal'))    el('iof_subtotal').textContent    = fmt(subtotal) + ' DZD';

        // Discount row
        const discRow = el('iof_discount_row');
        if (discRow) {
            if (_promo && discount > 0) {
                discRow.style.display = 'flex';
                if (el('iof_promo_label')) el('iof_promo_label').textContent = _promo.label;
                if (el('iof_discount_val')) el('iof_discount_val').textContent = '−' + fmt(discount) + ' DZD';
            } else {
                discRow.style.display = 'none';
            }
        }

        if (el('iof_shipping')) {
            el('iof_shipping').textContent = shipping !== null ? fmt(shipping) + ' DZD' : '—';
        }

        if (el('iof_total')) {
            if (shipping !== null) {
                const total = Math.max(0, subtotal - discount) + shipping;
                el('iof_total').textContent = fmt(total) + ' DZD';
                el('iof_total').style.color = 'var(--gold, #c8a656)';
            } else {
                el('iof_total').textContent = fmt(Math.max(0, subtotal - discount)) + ' DZD + الشحن';
                el('iof_total').style.color = '';
            }
        }
    }

    function setQty(n) {
        _qty = Math.max(1, Math.min(10, n));
        // Revalidate promo with new subtotal
        if (_promo) {
            const subtotal = _product.price * _qty;
            _promo.discount = _promo.type === 'percent'
                ? Math.min(Math.round(subtotal * _promo.value / 100), subtotal)
                : Math.min(_promo.value, subtotal);
        }
        updateSummary();
    }

    async function applyPromo() {
        const promoEl  = el('iof_promo');
        const msgEl    = el('iof_promo_msg');
        if (!promoEl || !_product) return;

        const code = promoEl.value.trim().toUpperCase();
        if (!code) return;

        if (msgEl) {
            msgEl.style.display = 'block';
            msgEl.textContent   = '...';
            msgEl.style.background   = 'transparent';
            msgEl.style.borderColor  = 'var(--border, #333)';
            msgEl.style.color        = 'var(--text-muted, #888)';
        }

        try {
            const subtotal = _product.price * _qty;
            const res = await fetch(CONFIG.apiUrl + '/promo/check', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-API-Key': CONFIG.apiKey },
                body:    JSON.stringify({ code, order_total: subtotal }),
            });
            const data = await res.json();

            if (data.valid) {
                _promo = { code, type: data.type, value: data.value, discount: data.discount, label: data.label };
                if (msgEl) {
                    msgEl.textContent  = '✓ ' + data.label + ' — تم تطبيق الكود';
                    msgEl.style.background   = 'rgba(34,197,94,.1)';
                    msgEl.style.borderColor  = 'rgba(34,197,94,.35)';
                    msgEl.style.color        = '#22c55e';
                }
            } else {
                _promo = null;
                if (msgEl) {
                    msgEl.textContent  = '✗ ' + (data.message || 'كود غير صالح');
                    msgEl.style.background   = 'rgba(231,76,60,.08)';
                    msgEl.style.borderColor  = 'rgba(231,76,60,.3)';
                    msgEl.style.color        = '#e74c3c';
                }
            }
            updateSummary();
        } catch {
            if (msgEl) {
                msgEl.textContent = 'تعذر التحقق من الكود';
                msgEl.style.color = '#e74c3c';
            }
        }
    }

    function showMsg(html, isError) {
        const m = el('iof_msg');
        if (!m) return;
        m.innerHTML = html;
        m.style.display    = 'block';
        m.style.background = isError ? 'rgba(231,76,60,.1)' : 'rgba(34,197,94,.1)';
        m.style.borderColor= isError ? 'rgba(231,76,60,.35)' : 'rgba(34,197,94,.35)';
        m.style.color      = isError ? '#e74c3c' : '#22c55e';
    }

    function clearMsg() {
        const m = el('iof_msg');
        if (m) { m.innerHTML = ''; m.style.display = 'none'; }
    }

    async function submit() {
        if (!_product) return;
        clearMsg();

        const nameEl   = el('iof_name');
        const phoneEl  = el('iof_phone');
        const wilayaEl = el('iof_wilaya');
        const submitEl = el('iof_submit');

        const name       = nameEl?.value.trim()   || '';
        const phone      = phoneEl?.value.trim()  || '';
        const wilayaCode = parseInt(wilayaEl?.value || '0');

        if (name.length < 2) {
            showMsg('<i class="fas fa-exclamation-circle"></i> الرجاء إدخال الاسم الكامل', true);
            nameEl?.focus(); return;
        }
        if (!/^(05|06|07)\d{8}$/.test(phone)) {
            showMsg('<i class="fas fa-exclamation-circle"></i> رقم الهاتف غير صحيح (10 أرقام: 05/06/07...)', true);
            phoneEl?.focus(); return;
        }
        if (!wilayaCode) {
            showMsg('<i class="fas fa-exclamation-circle"></i> الرجاء اختيار الولاية', true);
            wilayaEl?.focus(); return;
        }

        const wilaya   = getWilayas().find(w => w.code === wilayaCode);
        const shipping = getShipping(wilayaCode) || 0;

        if (submitEl) {
            submitEl.disabled   = true;
            submitEl.innerHTML  = '<i class="fas fa-circle-notch fa-spin"></i> جاري الإرسال...';
        }

        try {
            const body = {
                customer_name: name,
                phone,
                wilaya:        wilaya?.name || '',
                wilaya_code:   String(wilayaCode),
                delivery_type: _deliveryType,
                shipping_price: shipping,
                promo_code:    _promo ? _promo.code : null,
                items: [{
                    product_id:   _product.id,
                    product_name: _product.name,
                    unit_price:   _product.price,
                    quantity:     _qty,
                }],
            };

            const res  = await fetch(CONFIG.apiUrl + '/orders', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-API-Key': CONFIG.apiKey },
                body:    JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || 'server');

            if (window.Analytics) Analytics.track('checkout_start', {
                page:         '#product/' + (_product.slug || _product.id),
                product_id:   String(_product.id),
                product_name: _product.name,
            });

            const formEl = el('iof_form');
            if (formEl) {
                formEl.innerHTML = `
<div style="text-align:center;padding:32px 16px;">
    <div style="font-size:3rem;margin-bottom:12px;">✅</div>
    <h3 style="color:var(--gold,#c8a656);margin-bottom:8px;font-size:1.1rem;">تم استلام طلبك!</h3>
    <p style="color:var(--text-muted,#999);font-size:.88rem;margin-bottom:4px;">
        رقم الطلب: <strong style="color:var(--text,#fff);font-family:monospace;">${data.data?.order_number || ''}</strong>
    </p>
    <p style="color:var(--text-muted,#999);font-size:.82rem;margin-bottom:20px;">سيتصل بك فريقنا لتأكيد طلبك قريباً</p>
    <a href="#track" style="font-size:.83rem;color:var(--gold,#c8a656);text-decoration:underline;">
        <i class="fas fa-search"></i> تتبع طلبك
    </a>
</div>`;
            }
        } catch (err) {
            if (submitEl) {
                submitEl.disabled  = false;
                submitEl.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
            }
            showMsg('<i class="fas fa-exclamation-circle"></i> ' +
                (err.message !== 'server' && err.message ? err.message : 'حدث خطأ، حاول مرة أخرى أو تواصل معنا'), true);
        }
    }

    function init(product) {
        _product      = product;
        _qty          = 1;
        _promo        = null;
        _deliveryType = 'home';
        clearMsg();
        updateSummary();
    }

    return { init, plus: () => setQty(_qty + 1), minus: () => setQty(_qty - 1), updateSummary, applyPromo, submit, setDeliveryType };
})();
