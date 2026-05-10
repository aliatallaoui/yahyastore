window.WA = {
    buildOrderMessage(opts) {
        const {
            name, phone, secondPhone, wilayaName, commune,
            address, deliveryType, notes, items,
            subtotal, shipping, total, orderNumber,
        } = opts;

        const storeName    = window.BRAND?.storeName || 'ورشة يحيى';
        const deliveryLabel = deliveryType === 'desk' ? 'مكتب البريد / الشحن' : 'توصيل للمنزل';

        let msg = `السلام عليكم، أريد تأكيد طلبي من ${storeName}.\n`;
        msg += `━━━━━━━━━━━━━━━\n`;
        msg += `📋 *رقم الطلب:* ${orderNumber}\n`;
        msg += `━━━━━━━━━━━━━━━\n\n`;
        msg += `*معلومات الزبون:*\n`;
        msg += `👤 الاسم: ${name}\n`;
        msg += `📱 الهاتف: ${phone}\n`;
        if (secondPhone) msg += `📱 هاتف 2: ${secondPhone}\n`;
        msg += `\n*معلومات التوصيل:*\n`;
        msg += `📍 الولاية: ${wilayaName}\n`;
        if (commune) msg += `🏘 البلدية: ${commune}\n`;
        msg += `🏠 العنوان: ${address}\n`;
        if (deliveryType) msg += `🚚 طريقة التسليم: ${deliveryLabel}\n`;
        if (notes) msg += `📝 ملاحظات: ${notes}\n`;

        msg += `\n━━━━━━━━━━━━━━━\n`;
        msg += `*المنتجات:*\n\n`;
        items.forEach((item, i) => {
            msg += `${i + 1}. ${item.name}\n`;
            msg += `   الكمية: ${item.qty} | السعر: ${(item.price * item.qty).toLocaleString('en-US')} دج\n\n`;
        });

        msg += `━━━━━━━━━━━━━━━\n`;
        msg += `*ملخص الطلب:*\n`;
        msg += `المجموع: ${subtotal.toLocaleString('en-US')} دج\n`;
        msg += `الشحن: ${shipping.toLocaleString('en-US')} دج\n`;
        msg += `*الإجمالي: ${total.toLocaleString('en-US')} دج*\n`;
        msg += `\n*طريقة الدفع:* الدفع عند الاستلام (COD)\n`;
        msg += `━━━━━━━━━━━━━━━`;

        return `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(msg)}`;
    },

    openDirect(productName, price) {
        const storeName = window.BRAND?.storeName || 'ورشة يحيى';
        const msg = `مرحباً ${storeName}!\nأريد الطلب: ${productName}\nالسعر: ${Number(price).toLocaleString('en-US')} دج\nطريقة الدفع: الدفع عند الاستلام`;
        window.open(`https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    },
};
