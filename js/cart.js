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
            currency: 'USD',
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
    }
}

window.Cart = new CartManager();
