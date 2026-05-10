window.API = {
    async fetchProducts() {
        const res = await fetch(CONFIG.apiUrl + '/products');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        // Supports both legacy plain array and new { success, data } format
        return Array.isArray(json) ? json : (json.data || []);
    },

    async submitOrder(payload) {
        const res = await fetch(CONFIG.apiUrl + '/orders', {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json',
                'X-API-Key':    CONFIG.apiKey,
            },
            body: JSON.stringify(payload),
        });

        let json;
        try { json = await res.json(); } catch { json = {}; }

        if (!res.ok || json.success === false) {
            const err = new Error(json.message || 'فشل إرسال الطلب. حاول مرة أخرى.');
            err.errors = json.errors || {};
            throw err;
        }

        return json.data; // { order_id, order_number, total, status }
    },
};
