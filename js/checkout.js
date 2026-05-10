window.Checkout = (() => {
    let _cart        = null;
    let _submitting  = false;

    const el = id => document.getElementById(id);

    function getWilayaByCode(code) {
        return CONFIG.wilayas.find(w => w.code == code);
    }

    function calcShipping(wilayaCode) {
        const w = getWilayaByCode(wilayaCode);
        if (!w) return 0;
        const type = el('checkoutDeliveryType')?.value;
        return type === 'desk' ? w.desk : w.home;
    }

    function updateSummary() {
        const subtotal   = _cart.subtotal;
        const wilayaCode = el('checkoutWilaya')?.value;
        const shipping   = calcShipping(wilayaCode);
        const total      = subtotal + shipping;

        const itemsHtml = _cart.items.map(item => `
            <div class="order-item">
                <span class="order-item-name">${item.name} x${item.qty}</span>
                <span class="order-item-price">${(item.price * item.qty).toLocaleString('en-US')} DZD</span>
            </div>
        `).join('');

        const set     = (id, v) => { const e = el(id); if (e) e.textContent = v; };
        const setHtml = (id, v) => { const e = el(id); if (e) e.innerHTML = v; };

        setHtml('checkoutOrderItems', itemsHtml);
        set('checkoutSubtotal',  subtotal.toLocaleString('en-US') + ' DZD');
        set('checkoutShipping',  shipping > 0 ? shipping.toLocaleString('en-US') + ' DZD' : 'اختر الولاية');
        set('checkoutGrandTotal', total.toLocaleString('en-US') + ' DZD');

        setHtml('confirmationOrderItems', itemsHtml);
        set('confirmationSubtotal',   subtotal.toLocaleString('en-US') + ' DZD');
        set('confirmationShipping',   shipping.toLocaleString('en-US') + ' DZD');
        set('confirmationGrandTotal', total.toLocaleString('en-US') + ' DZD');

        return { subtotal, shipping, total };
    }

    function open() {
        if (_cart.isEmpty) {
            UI.toast('سلة التسوق فارغة!', 'error');
            return;
        }
        // close cart sidebar first
        document.getElementById('cartSidebar')?.classList.remove('active');
        document.getElementById('cartOverlay')?.classList.remove('active');

        el('checkoutFormScreen')?.style.setProperty('display', 'block');
        el('checkoutConfirmationScreen')?.style.setProperty('display', 'none');
        el('checkoutOverlay')?.classList.add('active');
        el('checkoutModal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateSummary();
        if (window.FBQ) FBQ('InitiateCheckout', {
            value: _cart.subtotal,
            currency: 'USD',
            num_items: _cart.count,
        });
        if (window.Analytics) Analytics.track('checkout_start');
    }

    function close() {
        el('checkoutOverlay')?.classList.remove('active');
        el('checkoutModal')?.classList.remove('active');
        document.body.style.overflow = '';
        el('checkoutForm')?.reset();
        clearErrors();
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(e => {
            e.classList.remove('show');
            e.textContent = '';
        });
        document.querySelectorAll('.checkout-form input, .checkout-form select, .checkout-form textarea').forEach(e => {
            e.classList.remove('error');
        });
    }

    function showError(fieldId, errorId, msg) {
        el(fieldId)?.classList.add('error');
        const err = el(errorId);
        if (err) { err.textContent = msg; err.classList.add('show'); }
    }

    function validate() {
        clearErrors();
        let ok = true;

        const name = el('checkoutName')?.value.trim() || '';
        if (!name)           { showError('checkoutName', 'nameError', 'الاسم الكامل مطلوب'); ok = false; }
        else if (name.length < 2) { showError('checkoutName', 'nameError', 'الاسم قصير جداً'); ok = false; }

        const phone = el('checkoutPhone')?.value.trim() || '';
        if (!phone)                               { showError('checkoutPhone', 'phoneError', 'رقم الهاتف مطلوب'); ok = false; }
        else if (!/^(05|06|07)\d{8}$/.test(phone)) { showError('checkoutPhone', 'phoneError', 'صيغة الرقم غير صحيحة (05/06/07 + 8 أرقام)'); ok = false; }

        const secondPhone = el('checkoutSecondPhone')?.value.trim() || '';
        if (secondPhone && !/^(05|06|07)\d{8}$/.test(secondPhone)) {
            showError('checkoutSecondPhone', 'secondPhoneError', 'صيغة الرقم الثاني غير صحيحة'); ok = false;
        }

        if (!el('checkoutWilaya')?.value) { showError('checkoutWilaya', 'wilayaError', 'الولاية مطلوبة'); ok = false; }

        return ok;
    }

    function buildWhatsAppMessage(orderNumber, wilayaName, totals) {
        return WA.buildOrderMessage({
            name:         el('checkoutName')?.value.trim()         || '',
            phone:        el('checkoutPhone')?.value.trim()        || '',
            secondPhone:  el('checkoutSecondPhone')?.value.trim()  || '',
            wilayaName,
            commune:      el('checkoutCommune')?.value.trim()      || '',
            address:      el('checkoutAddress')?.value.trim()      || '',
            deliveryType: el('checkoutDeliveryType')?.value        || '',
            notes:        el('checkoutNotes')?.value.trim()        || '',
            items:        _cart.items,
            subtotal:     totals.subtotal,
            shipping:     totals.shipping,
            total:        totals.total,
            orderNumber,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (_submitting || !validate()) return;
        _submitting = true;

        const submitBtn  = el('checkoutForm').querySelector('[type="submit"]');
        const origHTML   = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

        const wilayaCode = el('checkoutWilaya').value;
        const wilaya     = getWilayaByCode(wilayaCode);
        const totals     = updateSummary();

        const payload = {
            customer_name: el('checkoutName').value.trim(),
            phone:         el('checkoutPhone').value.trim(),
            second_phone:  el('checkoutSecondPhone')?.value.trim() || null,
            wilaya:        wilaya?.name || wilayaCode,
            wilaya_code:   String(wilayaCode),
            commune:       el('checkoutCommune')?.value.trim()     || null,
            address:       el('checkoutAddress').value.trim(),
            delivery_type: el('checkoutDeliveryType')?.value       || null,
            notes:         el('checkoutNotes')?.value.trim()       || null,
            shipping_price: totals.shipping,
            items:         _cart.toApiItems(),
        };

        try {
            const orderData = await API.submitOrder(payload);
            // orderData = { order_id, order_number, total, status }

            const waHref = buildWhatsAppMessage(orderData.order_number, wilaya?.name || wilayaCode, totals);
            const waBtn  = el('whatsappConfirmBtn');
            if (waBtn) waBtn.href = waHref;

            const numEl = el('confirmationOrderNumber');
            if (numEl) numEl.textContent = orderData.order_number;

            // Populate confirmation screen with order details before clearing cart
            const confItems = el('confirmationOrderItems');
            const srcItems  = el('checkoutOrderItems');
            if (confItems && srcItems) confItems.innerHTML = srcItems.innerHTML;
            const fmt = n => n.toLocaleString('ar-DZ') + ' دج';
            const cSub  = el('confirmationSubtotal');
            const cShip = el('confirmationShipping');
            const cTot  = el('confirmationGrandTotal');
            if (cSub)  cSub.textContent  = fmt(totals.subtotal);
            if (cShip) cShip.textContent = fmt(totals.shipping);
            if (cTot)  cTot.textContent  = fmt(totals.total);

            el('checkoutFormScreen').style.display   = 'none';
            el('checkoutConfirmationScreen').style.display = 'flex';

            if (window.FBQ) FBQ('Purchase', {
                value: totals.total,
                currency: 'USD',
                content_ids: _cart.items.map(i => String(i.id)),
                content_type: 'product',
                order_id: orderData.order_number,
            }, orderData.order_number);
            _cart.clear();
        } catch (err) {
            console.error('Order submit error:', err);
            UI.toast(err.message || 'فشل إرسال الطلب. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = origHTML;
            _submitting = false;
        }
    }

    function initWilayaSelect() {
        const select = el('checkoutWilaya');
        if (!select) return;
        select.innerHTML = '<option value="">اختر الولاية</option>';
        CONFIG.wilayas.forEach(w => {
            const opt      = document.createElement('option');
            opt.value      = w.code;
            opt.textContent = `${w.code} - ${w.name}`;
            select.appendChild(opt);
        });
        select.addEventListener('change', () => {
            updateSummary();
            el('wilayaError')?.classList.remove('show');
        });
        el('checkoutDeliveryType')?.addEventListener('change', updateSummary);
    }

    function injectModal() {
        if (document.getElementById('checkoutOverlay')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div class="checkout-modal-overlay" id="checkoutOverlay"></div>
            <div class="checkout-modal" id="checkoutModal">
                <div class="checkout-header">
                    <h2><i class="fas fa-shopping-bag"></i> إتمام الطلب</h2>
                    <button class="checkout-close" id="checkoutClose"><i class="fas fa-times"></i></button>
                </div>
                <div class="checkout-content">
                    <div id="checkoutFormScreen">
                        <div class="checkout-summary">
                            <h3>ملخص الطلب</h3>
                            <div class="order-items" id="checkoutOrderItems"></div>
                            <div class="summary-row"><span>المجموع الفرعي:</span><span id="checkoutSubtotal">0 DZD</span></div>
                            <div class="summary-row"><span>الشحن:</span><span id="checkoutShipping">0 DZD</span></div>
                            <div class="summary-row total"><span>الإجمالي:</span><span id="checkoutGrandTotal">0 DZD</span></div>
                        </div>
                        <form id="checkoutForm" class="checkout-form">
                            <div class="form-group">
                                <label>الاسم الكامل *</label>
                                <input type="text" id="checkoutName" placeholder="أدخل اسمك الكامل" autocomplete="name">
                                <span class="error-message" id="nameError"></span>
                            </div>
                            <div class="form-group">
                                <label>رقم الهاتف *</label>
                                <input type="tel" id="checkoutPhone" placeholder="05/06/07XXXXXXXX" inputmode="tel" autocomplete="tel">
                                <span class="error-message" id="phoneError"></span>
                            </div>
                            <div class="form-group">
                                <label>رقم هاتف ثانٍ (اختياري)</label>
                                <input type="tel" id="checkoutSecondPhone" placeholder="05/06/07XXXXXXXX" inputmode="tel" autocomplete="tel">
                                <span class="error-message" id="secondPhoneError"></span>
                            </div>
                            <div class="form-group">
                                <label>الولاية *</label>
                                <select id="checkoutWilaya"><option value="">اختر الولاية</option></select>
                                <span class="error-message" id="wilayaError"></span>
                            </div>
                            <div class="form-group">
                                <label>البلدية / المنطقة</label>
                                <input type="text" id="checkoutCommune" placeholder="اسم البلدية أو المنطقة">
                            </div>
                            <div class="form-group">
                                <label>العنوان الكامل</label>
                                <textarea id="checkoutAddress" placeholder="أدخل عنوان التوصيل بالتفصيل" rows="2" autocomplete="street-address"></textarea>
                            </div>
                            <div class="form-group">
                                <label>طريقة التسليم</label>
                                <select id="checkoutDeliveryType">
                                    <option value="">اختر طريقة التسليم</option>
                                    <option value="home">توصيل للمنزل</option>
                                    <option value="desk">مكتب البريد</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>ملاحظات إضافية</label>
                                <textarea id="checkoutNotes" placeholder="أي ملاحظات خاصة بالطلب" rows="2"></textarea>
                            </div>
                            <div class="checkout-cod-note">
                                <div class="checkout-cod-note-row"><i class="fas fa-money-bill-wave"></i><span><strong>الدفع عند الاستلام</strong> — لا حاجة لبطاقة بنكية</span></div>
                                <div class="checkout-cod-note-row"><i class="fas fa-phone-alt"></i><span>سنتصل بك لتأكيد الطلب قبل الإرسال</span></div>
                                <div class="checkout-cod-note-row"><i class="fas fa-truck"></i><span>توصيل 48–72 ساعة لجميع الولايات الـ 58</span></div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block btn-ripple" style="padding:16px;font-size:1.05rem;margin-top:4px;">
                                <i class="fas fa-check-circle"></i> تأكيد الطلب والدفع عند الاستلام
                            </button>
                        </form>
                    </div>
                    <div id="checkoutConfirmationScreen" class="checkout-confirmation-screen" style="display:none;">
                        <div class="confirmation-content">
                            <div class="confirmation-icon"><i class="fas fa-check-circle"></i></div>
                            <h2>تم تأكيد طلبك بنجاح!</h2>
                            <div class="confirmation-order-number">
                                <span>رقم الطلب:</span>
                                <strong id="confirmationOrderNumber"></strong>
                            </div>
                            <div class="confirmation-summary">
                                <h3>تفاصيل الطلب</h3>
                                <div class="order-items" id="confirmationOrderItems"></div>
                                <div class="summary-row"><span>المجموع الفرعي:</span><span id="confirmationSubtotal">0 DZD</span></div>
                                <div class="summary-row"><span>الشحن:</span><span id="confirmationShipping">0 DZD</span></div>
                                <div class="summary-row total"><span>الإجمالي:</span><span id="confirmationGrandTotal">0 DZD</span></div>
                            </div>
                            <div class="confirmation-info">
                                <p><i class="fas fa-info-circle"></i> سيتم التواصل معك قريبا لتأكيد الطلب.</p>
                            </div>
                            <a href="#" id="whatsappConfirmBtn" target="_blank" class="btn btn-primary btn-block"
                               style="background:#25d366;border-color:#25d366;display:flex;align-items:center;justify-content:center;gap:8px;">
                                <i class="fab fa-whatsapp"></i> أرسل الطلب عبر واتساب
                            </a>
                            <button type="button" class="btn btn-outline btn-block" id="backToShopBtn" style="margin-top:10px;">
                                <i class="fas fa-arrow-right"></i> العودة للتسوق
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    function init(cartRef) {
        _cart = cartRef;
        injectModal();
        initWilayaSelect();

        el('checkoutBtn')?.addEventListener('click', open);
        el('checkoutClose')?.addEventListener('click', close);
        el('checkoutOverlay')?.addEventListener('click', close);
        el('backToShopBtn')?.addEventListener('click', close);
        el('checkoutForm')?.addEventListener('submit', handleSubmit);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && el('checkoutModal')?.classList.contains('active')) close();
        });
    }

    return { init, open, close };
})();
