window.Analytics = (() => {
    const SID_KEY = 'yhy_sid';

    function sid() {
        let s = sessionStorage.getItem(SID_KEY);
        if (!s) {
            s = Math.random().toString(36).slice(2) + Date.now().toString(36);
            sessionStorage.setItem(SID_KEY, s);
        }
        return s;
    }

    function track(event, data) {
        const apiUrl = window.CONFIG?.apiUrl;
        if (!apiUrl) return;
        const payload = JSON.stringify({
            event,
            session_id:   sid(),
            page:         location.hash || '#home',
            ...data,
        });
        try {
            fetch(apiUrl + '/analytics', {
                method:    'POST',
                headers:   { 'Content-Type': 'application/json' },
                body:      payload,
                keepalive: true,
            }).catch(() => {});
        } catch (_) {}
    }

    return { track };
})();
