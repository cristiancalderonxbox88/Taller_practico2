const products = [
    { id: 1, name: 'Rosa Roja Clásica', category: 'rojas', price: 15, image: 'https://picsum.photos/seed/redrose/400/300' },
    { id: 2, name: 'Rosa Roja Corazón', category: 'rojas', price: 20, image: 'https://picsum.photos/seed/redrose2/400/300' },
    { id: 3, name: 'Rosa Blanca Pura', category: 'blancas', price: 18, image: 'https://picsum.photos/seed/whiterose/400/300' },
    { id: 4, name: 'Rosa Blanca Nieve', category: 'blancas', price: 22, image: 'https://picsum.photos/seed/whiterose2/400/300' },
    { id: 5, name: 'Rosa Rosada Dulce', category: 'rosadas', price: 16, image: 'https://picsum.photos/seed/pinkrose/400/300' },
    { id: 6, name: 'Rosa Rosada Encanto', category: 'rosadas', price: 19, image: 'https://picsum.photos/seed/pinkrose2/400/300' },
    { id: 7, name: 'Rosa Amarilla Sol', category: 'amarillas', price: 17, image: 'https://picsum.photos/seed/yellowrose/400/300' },
    { id: 8, name: 'Rosa Naranja Fuego', category: 'naranjas', price: 21, image: 'https://picsum.photos/seed/orangerose/400/300' },
    { id: 9, name: 'Rosa Vintage', category: 'rosadas', price: 25, image: 'https://picsum.photos/seed/vintagerose/400/300' },
];

let cart = [];

const productGrid = document.getElementById('productGrid');
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const categoryBtns = document.querySelectorAll('.nav__btn');

function renderProducts(category = 'all') {
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    if (filtered.length === 0) {
        productGrid.innerHTML = `<p class="no-products">No hay rosas de este color.</p>`;
        return;
    }
    productGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy" />
            <div class="product-card__body">
                <h3 class="product-card__name">${product.name}</h3>
                <span class="product-card__category">${product.category}</span>
                <span class="product-card__price">$${product.price.toFixed(2)}</span>
                <button class="product-card__add" data-id="${product.id}">Agregar al carrito</button>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.product-card__add').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="cart-empty">No hay rosas en el carrito.</p>`;
        cartTotalSpan.textContent = '$0.00';
        cartCountSpan.textContent = '0';
        return;
    }
    let html = '';
    let total = 0;
    let totalItems = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        total += product.price * item.quantity;
        totalItems += item.quantity;
        html += `
            <div class="cart-item" data-id="${item.productId}">
                <img class="cart-item__image" src="${product.image}" alt="${product.name}" />
                <div class="cart-item__info">
                    <div class="cart-item__name">${product.name}</div>
                    <div class="cart-item__price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="cart-item__actions">
                    <button class="cart-item__btn decrement" data-id="${item.productId}">−</button>
                    <span class="cart-item__quantity">${item.quantity}</span>
                    <button class="cart-item__btn increment" data-id="${item.productId}">+</button>
                    <button class="cart-item__remove" data-id="${item.productId}">✕</button>
                </div>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = html;
    cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    cartCountSpan.textContent = totalItems;

    document.querySelectorAll('.cart-item__btn.increment').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.cart-item__btn.decrement').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => removeItemCompletely(parseInt(btn.dataset.id)));
    });
}

function addToCart(productId) {
    const existing = cart.find(item => item.productId === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ productId, quantity: 1 });
    updateCart();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index === -1) return;
    if (cart[index].quantity > 1) cart[index].quantity -= 1;
    else cart.splice(index, 1);
    updateCart();
}

function removeItemCompletely(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function updateCart() {
    renderCart();
}

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.category);
    });
});

function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) closeCart();
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('No has elegido ninguna rosa.');
        return;
    }
    alert('🌹 ¡Gracias por tu compra! Tus rosas serán entregadas con amor. 🌹');
    clearCart();
    closeCart();
    renderProducts(document.querySelector('.nav__btn.active')?.dataset.category || 'all');
});

renderProducts('all');
document.querySelector('.nav__btn[data-category="all"]').classList.add('active');