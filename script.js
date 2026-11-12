// بيانات منتجات SKIN KITCHEN
const catalog = {
    oily: {
        id: 'oily',
        name: 'سيروم الحبوب للبشرة الدهنية (30 مل)',
        price: 250
    },
    dull: {
        id: 'dull',
        name: 'سيروم النضارة فيتامين C (30 مل)',
        price: 250
    },
    sensitive: {
        id: 'sensitive',
        name: 'سيروم البشرة الحساسة بالشوفان (30 مل)',
        price: 250
    },
    refill: {
        id: 'refill',
        name: 'إعادة ملء زجاجة Refill (30 مل)',
        price: 210
    }
};

let cart = JSON.parse(localStorage.getItem('skinKitchenCart')) || [];

// 1. دالة اختبار البشرة وتوليد التركيبة المخصصة
function generateCustomSerum(event) {
    event.preventDefault();

    const skinType = document.getElementById('q-skin-type').value;
    const allergy = document.getElementById('q-allergy').value.trim();

    const resultBox = document.getElementById('quiz-result');
    const titleEl = document.getElementById('res-title');
    const ingEl = document.getElementById('res-ingredients');
    const allergyEl = document.getElementById('res-allergy-note');
    const addBtn = document.getElementById('res-add-btn');

    let selectedId = skinType;

    if (skinType === 'oily') {
        titleEl.textContent = 'تركيبتك: سيروم تنقية البشرة الدهنية وتقليل الحبوب';
        ingEl.textContent = 'المكونات الخام: زيت شجرة الشاي + نياسيناميد + جل صبار + ماء ورد + فيتامين E';
    } else if (skinType === 'dull') {
        titleEl.textContent = 'تركيبتك: سيروم الإشراقة وتوحيد اللون';
        ingEl.textContent = 'المكونات الخام: فيتامين C + هيالورونيك أسيد + ماء ورد + جلسرين + فيتامين E';
    } else {
        titleEl.textContent = 'تركيبتك: سيروم التهدئة الفائقة للبشرة الحساسة';
        ingEl.textContent = 'المكونات الخام: ماء شوفان + بابونج + بانثينول + جل صبار + فيتامين E';
    }

    if (allergy && allergy !== 'لا يوجد') {
        allergyEl.textContent = `⚠️ ملاحظة التحضير: سيتم استبعاد (${allergy}) واستبداله ببديل آمن مع عمل اختبار حساسية قبل التسليم.`;
    } else {
        allergyEl.textContent = '✅ تركيبة آمنة 100% من مكونات طبيعية خام تُركّب أمامك.';
    }

    addBtn.onclick = function() {
        addToCart(selectedId, `تركيبة مخصصة (${titleEl.textContent.replace('تركيبتك: ', '')})`);
    };

    resultBox.style.display = 'block';
}

// 2. دوال سلة التسوق
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

function addToCart(productId, customName = null) {
    const itemData = catalog[productId];
    if (!itemData) return;

    const finalName = customName || itemData.name;
    const existing = cart.find(item => item.name === finalName);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: finalName,
            price: itemData.price,
            quantity: 1
        });
    }

    saveAndRenderCart();
    document.getElementById('cart-sidebar').classList.add('open');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRenderCart();
}

function saveAndRenderCart() {
    localStorage.setItem('skinKitchenCart', JSON.stringify(cart));
    
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    countEl.textContent = totalCount;

    itemsEl.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p style="text-align:center; color:#777; margin-top:30px;">السلة فارغة حالياً 🌿</p>';
    } else {
        cart.forEach((item, index) => {
            totalPrice += item.price * item.quantity;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <strong style="font-size:0.9rem;">${item.name}</strong>
                    <div style="color:#4A6B53; font-weight:bold;">${item.quantity} × ${item.price} ج.م</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">&times;</button>
            `;
            itemsEl.appendChild(div);
        });
    }

    totalEl.textContent = totalPrice;
}

function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة! اختاري سيروم أولاً.');
        return;
    }
    alert('تم استلام طلبك بنجاح في مطبخ البشرة 🌿! سيتم التواصل معكِ لتأكيد التركيبة والتوصيل.');
    cart = [];
    saveAndRenderCart();
    toggleCart();
}

// 3. دالة إضافة التقييمات ونشرها فوراً
function handleFeedbackSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('fb-name').value;
    const rating = Number(document.getElementById('fb-rating').value);
    const comment = document.getElementById('fb-comment').value;

    const stars = '⭐'.repeat(rating);
    const reviewsGrid = document.getElementById('reviews-grid');

    const newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.innerHTML = `
        <div class="review-top">
            <strong>${name}</strong>
            <span>${stars}</span>
        </div>
        <p>"${comment}"</p>
        <span class="review-date">الآن</span>
    `;

    reviewsGrid.prepend(newCard);
    document.getElementById('feedback-modal').style.display = 'none';
    event.target.reset();
}

// تشغيل السلة عند فتح الموقع
document.addEventListener('DOMContentLoaded', saveAndRenderCart);