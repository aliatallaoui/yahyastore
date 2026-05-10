/* ================================================================
   Yahya Store — Brand Configuration
   Single source of truth for all brand identity settings.
   Future: replace static values with API call to /settings
   ================================================================ */
window.BRAND = {

    /* Core identity */
    storeName:   'ورشة يحيى',
    storeNameAr: 'ورشة يحيى للموس البوسعادي',
    slogan:      'صناعة يدوية 100% — الدفع عند الاستلام',
    tagline:     'موس بوسعادي أصيل، صناعة يدوية 100%، مع الدفع عند الاستلام.',
    domain:      'yahyablade.com',

    announcement: '🎉 انطلاقة الموقع الجديد — خصم 20% على كل المنتجات لمدة أسبوع! | الدفع عند الاستلام في 58 ولاية | اطلب الآن',

    /* Sale — set saleEnd to null to disable */
    saleEnd:   '2026-05-17T23:59:59',
    saleBadge: 'خصم 20%',
    saleLabel: 'انطلاقة الموقع الجديد',

    /* Contact */
    phone:     '0775108618',
    whatsapp:  '213775108618',

    /* Trust badges shown in hero / product cards */
    trust: [
        { icon: 'fas fa-money-bill-wave', label: 'الدفع عند الاستلام',  desc: 'لا حاجة لبطاقة بنكية' },
        { icon: 'fas fa-star',            label: 'جودة مضمونة',          desc: 'منتجات مختارة بعناية' },
        { icon: 'fas fa-truck',           label: 'توصيل سريع',           desc: '48–72 ساعة لكل الولايات' },
        { icon: 'fab fa-whatsapp',        label: 'دعم واتساب',           desc: 'متاح طوال اليوم' },
    ],

    /* Facebook Pixel — paste your Pixel ID here */
    facebookPixelId: '761582631747134',

    /* Social links */
    social: {
        facebook:   'https://www.facebook.com/yahya.knife.bousaada',
        instagram:  'https://www.instagram.com/yahya.knife',
        tiktok:     'https://www.tiktok.com/@yahya.knife2',
        youtube:    '',
        googlemaps: 'https://maps.app.goo.gl/ELJRVAZxDuxWPjF5A',
        viber:      'viber://chat?number=213775108618',
    },

    /* Design tokens (mirrors CSS variables — used in dynamic JS rendering) */
    colors: {
        primary:       '#c8a656',
        primaryDark:   '#a8853e',
        primaryLight:  'rgba(200,166,86,.12)',
        secondary:     '#d4b87a',
        secondaryDark: '#c8a656',
        bg:            '#0c0c0a',
        surface:       '#1c1a17',
        text:          '#e8e0d0',
        muted:         '#807860',
        danger:        '#f87171',
        success:       '#4ade80',
    },

    /* Microcopy — centralised so it's easy to A/B test */
    copy: {
        addToCart:      'أضف للسلة',
        buyNow:         'اطلب الآن',
        quickView:      'عرض سريع',
        orderViaWa:     'اطلب عبر واتساب',
        emptyCart:      'سلتك فارغة حالياً',
        emptyCartSub:   'ابدأ بإضافة منتجاتك المفضلة الآن',
        codBadge:       'الدفع عند الاستلام',
        added:          'تمت الإضافة ✓',
        checkoutBtn:    'إتمام الطلب',
        orderSuccess:   'تم تسجيل طلبك بنجاح!',
        orderSuccessSub:'سيتم التواصل معك قريباً لتأكيد الطلب',
        waOrderHint:    'سيتم فتح واتساب لإرسال تفاصيل طلبك وتأكيده.',
        noCard:         'لا تحتاج إلى بطاقة بنكية',
        confirmCall:    'نتواصل معك لتأكيد الطلب قبل الإرسال',
    },

    /* Product badge labels */
    badges: {
        new:        'جديد',
        hot:        'الأكثر طلباً',
        sale:       'عرض خاص',
        limited:    'كمية محدودة',
        cod:        'دفع عند الاستلام',
        featured:   'مميز',
    },

    /* Category display names */
    categories: {
        bundle:    'أطقم',
        single:    'منتجات',
        accessory: 'إكسسوارات',
        sale:      'عروض',
    },

    /* How it works steps */
    howItWorks: [
        { icon: 'fas fa-mouse-pointer', num: '01', title: 'اختر المنتج',     desc: 'تصفح منتجاتنا واختر ما يناسبك' },
        { icon: 'fas fa-cart-plus',     num: '02', title: 'أضف للسلة',       desc: 'أضف المنتج وحدد الكمية المطلوبة' },
        { icon: 'fas fa-file-alt',      num: '03', title: 'أكمل معلوماتك',   desc: 'أدخل اسمك ورقم هاتفك وعنوان التوصيل' },
        { icon: 'fas fa-phone-alt',     num: '04', title: 'تأكيد هاتفي',     desc: 'نتصل بك لتأكيد الطلب قبل الإرسال' },
        { icon: 'fas fa-box',           num: '05', title: 'استلم وادفع',      desc: 'تستلم طلبك وتدفع عند الاستلام فقط' },
    ],

    /* Why choose us */
    whyUs: [
        { icon: 'fas fa-money-bill-wave', title: 'الدفع عند الاستلام',    desc: 'لا بطاقة بنكية — تدفع فقط عند استلام طلبك والتأكد منه' },
        { icon: 'fas fa-star',            title: 'منتجات مختارة',          desc: 'كل منتج يمر بمراجعة دقيقة قبل أن يُعرض في متجرنا' },
        { icon: 'fas fa-truck',           title: 'توصيل لـ 58 ولاية',      desc: 'نوصل لجميع ولايات الجزائر خلال 48 إلى 72 ساعة' },
        { icon: 'fas fa-phone-alt',       title: 'تأكيد قبل الإرسال',      desc: 'نتصل بك لتأكيد الطلب — لا مفاجآت، لا ضغط' },
        { icon: 'fab fa-whatsapp',        title: 'دعم مباشر عبر واتساب',   desc: 'تواصل معنا في أي وقت للمساعدة والاستفسار' },
        { icon: 'fas fa-shield-alt',      title: 'ضمان الجودة',            desc: 'جودة مضمونة أو استرجاع خلال 7 أيام من الاستلام' },
    ],

    /* Customer review videos */
    reviewVideos: [
        { src: 'videos/IMG_4433.MP4' },
        { src: 'videos/IMG_4586.MP4' },
        { src: 'videos/IMG_4598.MP4' },
        { src: 'videos/IMG_4652.MP4' },
        { src: 'videos/IMG_4667.MP4' },
        { src: 'videos/IMG_4695.MP4' },
        { src: 'videos/IMG_4696.MP4' },
        { src: 'videos/IMG_4706.MP4' },
        { src: 'videos/IMG_4741.MP4' },
        { src: 'videos/IMG_4742.MP4' },
        { src: 'videos/IMG_4956.MP4' },
        { src: 'videos/IMG_4957.MP4' },
    ],

    /* Upsell offer shown on inline order success screen */
    upsell: {
        id:      7,
        name:    'مبرد ذكير (مضاية) ذات جودة عالية',
        price:   3920,
        slug:    'mabrad-dhakir-mdaya',
        image:   'images/p7-main.jpg',
        tagline: 'يحافظ على حدة موسك — التوصيل مجاني مع طلبك الحالي!',
    },

    /* Home page categories */
    homeCategories: [
        { icon: 'fas fa-box-open',   key: 'bundle',    title: 'الأطقم',        desc: 'مجموعات متكاملة بسعر مميز' },
        { icon: 'fas fa-tag',        key: 'single',    title: 'المنتجات',       desc: 'تشكيلة واسعة من المنتجات المختارة' },
        { icon: 'fas fa-gem',        key: 'accessory', title: 'الإكسسوارات',    desc: 'إكسسوارات وملحقات بجودة عالية' },
        { icon: 'fas fa-percentage', key: 'sale',      title: 'العروض',         desc: 'أفضل الأسعار والعروض الحصرية' },
    ],
};
