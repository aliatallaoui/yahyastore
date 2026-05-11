class CartManager {
    constructor(storageKey = 'yahyastore_cart') {
        this.key   = storageKey;
        this.items = JSON.parse(localStorage.getItem(this.key) || '[]');
        this._listeners = [];
    }

    onChange(fn) { this._listeners.push(fn); }
    _notify()    { this._listeners.forEach(fn => fn()); }

    add(id, name, price, qty = 1) {
        const existing = this.items.find(i => i.id === id);
        if (existing) existing.qty += qty;
        else this.items.push({ id, name, price, qty });
        this._save();
        if (window.FBQ) FBQ('AddToCart', {
            content_ids: [String(id)],
            content_name: name,
            content_type: 'product',
            value: price * qty,
            currency: 'DZD',
        });
        if (window.Analytics) Analytics.track('add_to_cart', {
            product_id:   String(id),
            product_name: name,
        });
    }

    updateQty(index, delta) {
        if (!this.items[index]) return;
        this.items[index].qty += delta;
        if (this.items[index].qty <= 0) this.items.splice(index, 1);
        this._save();
    }

    remove(index) {
        this.items.splice(index, 1);
        this._save();
    }

    clear() {
        this.items = [];
        this._save();
    }

    get subtotal() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); }
    get count()    { return this.items.reduce((s, i) => s + i.qty, 0); }
    get isEmpty()  { return this.items.length === 0; }

    toApiItems() {
        return this.items.map(i => ({
            product_id:   i.id ? parseInt(i.id) : null,
            product_name: i.name,
            unit_price:   i.price,
            quantity:     i.qty,
        }));
    }

    _save() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
        this._notify();
        this._syncDebounced();
    }

    _syncDebounced() {
        clearTimeout(this._syncTimer);
        this._syncTimer = setTimeout(() => this._syncToApi(), 4000);
    }

    _syncToApi() {
        const apiUrl = window.CONFIG?.apiUrl;
        if (!apiUrl || this.isEmpty) return;
        const phone = localStorage.getItem('yhy_phone') || null;
        fetch(apiUrl + '/carts/save', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                session_id: sessionStorage.getItem('yhy_sid') || null,
                phone,
                items: this.toApiItems(),
                total: this.subtotal,
            }),
            keepalive: true,
        }).catch(() => {});
    }
}

window.Cart = new CartManager();
