/* Inline order form on product detail page */
window.IOF = (() => {
    let _product = null;
    let _qty     = 1;

    const STATUS_LABELS = {
        pending:   'قيد الانتظار',
        confirmed: 'تم التأكيد',
        shipped:   'تم الشحن',
        delivered: 'تم التسليم',
        cancelled: 'ملغي',
    };

    function el(id) { return document.getElementById(id); }

    function getWilayas() {
        return (CONFIG && CONFIG.wilayas) ? CONFIG.wilayas : [];
    }

    function getShipping(code) {
        const w = getWilayas().find(w => w.code === code);
        return w ? w.home : null;
    }

    function fmt(n) { return Number(n).toLocaleString('en-US'); }

    function updateSummary() {
        if (!_product) return;
        const wilayaEl  = el('iof_wilaya');
        const shippingEl = el('iof_shipping');
        const totalEl   = el('iof_total');
        const qtyEl     = el('iof_qty_display');
        if (qtyEl) qtyEl.textContent = _qty;

        const code     = wilayaEl ? parseInt(wilayaEl.value) : 0;
        const shipping = code ? getShipping(code) : null;
        const subtotal = _product.price * _qty;

        if (shippingEl) {
            shippingEl.textContent = shipping !== null ? fmt(shipping) + ' DZD' : '—';
        }
        if (totalEl) {
            if (shipping !== null) {
                totalEl.textContent = fmt(subtotal + shipping) + ' DZD';
                totalEl.style.color = 'var(--gold, #c8a656)';
            } else {
                totalEl.textContent = fmt(subtotal) + ' DZD + الشحن';
                totalEl.style.color = '';
            }
        }

        // Subtotal row
        const subEl = el('iof_subtotal');
        if (subEl) subEl.textContent = fmt(subtotal) + ' DZD';
    }

    function setQty(n) {
        _qty = Math.max(1, Math.min(10, n));
        updateSummary();
    }

    function showMsg(html, isError) {
        const m = el('iof_msg');
        if (!m) return;
        m.innerHTML = html;
        m.style.display = 'block';
        m.style.background = isError ? 'rgba(231,76,60,.1)' : 'rgba(34,197,94,.1)';
        m.style.borderColor = isError ? 'rgba(231,76,60,.35)' : 'rgba(34,197,94,.35)';
        m.style.color = isError ? '#e74c3c' : '#22c55e';
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

        const name   = nameEl?.value.trim()   || '';
        const phone  = phoneEl?.value.trim()  || '';
        const wilayaCode = parseInt(wilayaEl?.value || '0');

        // Validate
        if (name.length < 2) {
            showMsg('<i class="fas fa-exclamation-circle"></i> الرجاء إدخال الاسم الكامل', true);
            nameEl?.focus();
            return;
        }
        if (!/^(05|06|07)\d{8}$/.test(phone)) {
            showMsg('<i class="fas fa-exclamation-circle"></i> رقم الهاتف غير صحيح (10 أرقام: 05/06/07...)', true);
            phoneEl?.focus();
            return;
        }
        if (!wilayaCode) {
            showMsg('<i class="fas fa-exclamation-circle"></i> الرجاء اختيار الولاية', true);
            wilayaEl?.focus();
            return;
        }

        const wilaya   = getWilayas().find(w => w.code === wilayaCode);
        const shipping = getShipping(wilayaCode);

        if (submitEl) {
            submitEl.disabled = true;
            submitEl.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري الإرسال...';
        }

        try {
            const body = {
                customer_name: name,
                phone:         phone,
                wilaya:        wilaya?.name || '',
                wilaya_code:   String(wilayaCode),
                shipping_price: shipping || 0,
                items: [{
                    product_id:   _product.id,
                    product_name: _product.name,
                    unit_price:   _product.price,
                    quantity:     _qty,
                }],
            };

            const res = await fetch(CONFIG.apiUrl + '/orders', {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                    'X-API-Key':    CONFIG.apiKey,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'server error');
            }

            // Analytics
            if (window.Analytics) Analytics.track('checkout_start', {
                page: '#product/' + (_product.slug || _product.id),
                product_id:   String(_product.id),
                product_name: _product.name,
            });

            // Success state
            const formEl = el('iof_form');
            if (formEl) {
                formEl.innerHTML = `
<div style="text-align:center;padding:28px 16px;">
    <div style="font-size:2.8rem;margin-bottom:12px;">✅</div>
    <h3 style="color:var(--gold,#c8a656);margin-bottom:8px;font-size:1.1rem;">تم استلام طلبك!</h3>
    <p style="color:var(--text-muted,#999);font-size:.88rem;margin-bottom:4px;">رقم الطلب: <strong style="color:var(--text,#fff);font-family:monospace;">${data.data?.order_number || ''}</strong></p>
    <p style="color:var(--text-muted,#999);font-size:.82rem;margin-bottom:20px;">سيتصل بك فريقنا لتأكيد الطلب خلال ساعات عمل</p>
    <a href="#track" style="font-size:.82rem;color:var(--gold,#c8a656);text-decoration:underline;">
        <i class="fas fa-search"></i> تتبع طلبك
    </a>
</div>`;
            }

        } catch (err) {
            if (submitEl) {
                submitEl.disabled = false;
                submitEl.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
            }
            const msg = (err.message && err.message !== 'server error')
                ? err.message
                : 'حدث خطأ، حاول مرة أخرى أو تواصل معنا عبر واتساب';
            showMsg('<i class="fas fa-exclamation-circle"></i> ' + msg, true);
        }
    }

    function init(product) {
        _product = product;
        _qty     = 1;
        clearMsg();
        updateSummary();
    }

    return { init, setQty: n => setQty(n), plus: () => setQty(_qty + 1), minus: () => setQty(_qty - 1), submit, updateSummary };
})();
