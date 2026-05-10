window.TrackPage = (() => {
    const STATUS_LABELS = {
        pending:   'قيد الانتظار',
        confirmed: 'تم التأكيد',
        shipped:   'تم الشحن',
        delivered: 'تم التسليم',
        cancelled: 'ملغي',
    };
    const STATUS_COLORS = {
        pending:   '#c8a656',
        confirmed: '#4a9eff',
        shipped:   '#a855f7',
        delivered: '#22c55e',
        cancelled: '#ef4444',
    };

    function statusBadge(status) {
        const label = STATUS_LABELS[status] || status;
        const color = STATUS_COLORS[status] || '#888';
        return `<span style="display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;
                             font-size:.78rem;font-weight:700;background:${color}20;color:${color};border:1px solid ${color}40;">
                    <span style="width:7px;height:7px;border-radius:50%;background:${color};display:inline-block;"></span>
                    ${label}
                </span>`;
    }

    function renderOrders(orders) {
        const el = document.getElementById('trackResults');
        if (!el) return;

        if (!orders.length) {
            el.innerHTML = `
<div style="text-align:center;padding:40px 20px;color:var(--text-muted,#888);">
    <i class="fas fa-inbox" style="font-size:2.5rem;opacity:.3;display:block;margin-bottom:14px;"></i>
    لا توجد طلبات مرتبطة بهذا الرقم
</div>`;
            return;
        }

        el.innerHTML = orders.map(o => `
<div style="background:var(--bg-card,#1a1a14);border:1px solid var(--border,#2a2a1e);border-radius:var(--radius,10px);
            padding:20px;margin-bottom:14px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
        <div>
            <div style="font-family:monospace;color:var(--gold,#c8a656);font-weight:700;font-size:.95rem;">${o.order_number}</div>
            <div style="color:var(--text-muted,#888);font-size:.78rem;margin-top:2px;">${o.date} &nbsp;·&nbsp; ${o.wilaya}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
            ${statusBadge(o.status)}
            <span style="font-weight:700;color:var(--gold,#c8a656);font-size:.95rem;">${o.total.toLocaleString()} DZD</span>
        </div>
    </div>
    <div style="border-top:1px solid var(--border,#2a2a1e);padding-top:12px;">
        <div style="font-size:.8rem;color:var(--text-muted,#888);margin-bottom:6px;">${o.items_count} ${o.items_count === 1 ? 'قطعة' : 'قطع'}</div>
        ${o.items.map(i => `
        <div style="display:flex;justify-content:space-between;font-size:.82rem;padding:3px 0;color:var(--text,#ddd);">
            <span>${i.name}</span>
            <span style="color:var(--text-muted,#888);">×${i.qty}</span>
        </div>`).join('')}
    </div>
</div>`).join('');
    }

    function showError(msg) {
        const el = document.getElementById('trackError');
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    }

    function hideError() {
        const el = document.getElementById('trackError');
        if (el) el.style.display = 'none';
    }

    async function search() {
        const phoneEl = document.getElementById('trackPhone');
        const resultsEl = document.getElementById('trackResults');
        if (!phoneEl) return;

        const phone = phoneEl.value.trim();
        hideError();

        if (!/^(05|06|07)\d{8}$/.test(phone)) {
            showError('أدخل رقم هاتف جزائري صحيح (10 أرقام يبدأ بـ 05/06/07)');
            return;
        }

        if (resultsEl) {
            resultsEl.innerHTML = `
<div style="text-align:center;padding:32px;color:var(--text-muted,#888);">
    <i class="fas fa-circle-notch fa-spin" style="font-size:1.5rem;color:var(--gold,#c8a656);"></i>
</div>`;
        }

        try {
            const res = await fetch(`${CONFIG.apiUrl}/orders/track?phone=${encodeURIComponent(phone)}`, {
                headers: { 'Accept': 'application/json', 'X-API-Key': CONFIG.apiKey },
            });
            if (!res.ok) throw new Error('server');
            const data = await res.json();
            renderOrders(data.orders || []);
        } catch {
            if (resultsEl) resultsEl.innerHTML = '';
            showError('حدث خطأ، حاول مرة أخرى');
        }
    }

    return { search };
})();
