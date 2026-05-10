window.Router = (() => {
    const PAGE_ROUTES = new Set(['home', 'products', 'faq', 'privacy', 'shipping']);

    const PAGE_TITLES = {
        home:     'ورشة يحيى للموس البوسعادي — صناعة يدوية 100%',
        products: 'جميع الموس والأطقم | ورشة يحيى',
        faq:      'الأسئلة الشائعة | ورشة يحيى',
        privacy:  'سياسة الخصوصية | ورشة يحيى',
        shipping: 'الشحن والتوصيل | ورشة يحيى',
    };

    let _current = null;

    function setActiveNav(page) {
        document.querySelectorAll('.nav-links a').forEach(a => {
            const h = (a.getAttribute('href') || '').replace('#', '');
            a.classList.toggle('active', h === page || (page === 'home' && (h === 'home' || h === '')));
        });
    }

    function renderPage(page, scrollToId) {
        const main = document.getElementById('main-content');
        if (!main) return;

        if (_current !== page) {
            _current = page;
            main.innerHTML = Pages[page]();
            UI.reinit();
            Products.init('productsGrid', page === 'products');
            document.title = PAGE_TITLES[page] || PAGE_TITLES.home;
            setActiveNav(page);

            // Wire up category cards on homepage to filter products
            if (page === 'home') {
                document.querySelectorAll('.category-card[data-category]').forEach(card => {
                    card.addEventListener('click', e => {
                        const cat = card.dataset.category;
                        if (cat === 'sale') return; // falls through to #products
                        e.preventDefault();
                        // Navigate to products and apply filter after render
                        location.hash = '#products';
                        setTimeout(() => {
                            const tab = document.querySelector(`.filter-tab[data-filter="${cat}"]`);
                            if (tab) tab.click();
                        }, 200);
                    });
                });
            }
        }

        if (scrollToId) {
            setTimeout(() => {
                const el = document.getElementById(scrollToId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 80);
        } else {
            window.scrollTo(0, 0);
        }
    }

    async function renderProductPage(id) {
        const main = document.getElementById('main-content');
        if (!main) return;

        await Products.init(null, false);
        const product = Products.getAll().find(p => String(p.id) === String(id));

        if (!product) {
            renderPage('products');
            return;
        }

        const key = `product/${id}`;
        if (_current !== key) {
            _current = key;
            main.innerHTML = Pages.productDetail(product);
            UI.reinit();
            document.title = `${product.name} | ورشة يحيى`;
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        }
        window.scrollTo(0, 0);
    }

    function navigate() {
        const hash = location.hash.replace(/^#/, '');

        if (!hash || hash === 'home') {
            renderPage('home');
            return;
        }

        if (hash.startsWith('product/')) {
            renderProductPage(hash.split('/')[1]);
            return;
        }

        if (PAGE_ROUTES.has(hash)) {
            renderPage(hash);
            return;
        }

        // In-page section anchor on the home page
        renderPage('home', hash);
    }

    function init() {
        window.addEventListener('hashchange', navigate);
        navigate();
    }

    return { init };
})();
