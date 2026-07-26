// ============================================================
//  BASE DE DATOS DE PRODUCTOS (simulada)
// ============================================================
const products = [
    { id: 1, name: 'Laptop Pro', category: 'electronicos', price: 1200, image: 'https://picsum.photos/seed/laptop/400/300' },
    { id: 2, name: 'Auriculares Bluetooth', category: 'electronicos', price: 80, image: 'https://picsum.photos/seed/headphones/400/300' },
    { id: 3, name: 'Smartphone X', category: 'electronicos', price: 900, image: 'https://picsum.photos/seed/phone/400/300' },
    { id: 4, name: 'Camiseta Algodón', category: 'ropa', price: 25, image: 'https://picsum.photos/seed/tshirt/400/300' },
    { id: 5, name: 'Jeans Clásicos', category: 'ropa', price: 55, image: 'https://picsum.photos/seed/jeans/400/300' },
    { id: 6, name: 'Chaqueta Deportiva', category: 'ropa', price: 85, image: 'https://picsum.photos/seed/jacket/400/300' },
    { id: 7, name: 'Lámpara de Mesa', category: 'hogar', price: 45, image: 'https://picsum.photos/seed/lamp/400/300' },
    { id: 8, name: 'Juego de Sábanas', category: 'hogar', price: 65, image: 'https://picsum.photos/seed/sheets/400/300' },
    { id: 9, name: 'Maceta Decorativa', category: 'hogar', price: 30, image: 'https://picsum.photos/seed/pot/400/300' },
];

// ============================================================
//  ESTADO DEL CARRITO
// ============================================================
let cart = []; // cada item: { productId, quantity }

// ============================================================
//  REFERENCIAS DOM
// ============================================================
const productGrid = document.getElementById('productGrid');
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Botones de categoría
const categoryBtns = document.querySelectorAll('.nav__btn');

// ============================================================
//  FUNCIONES DE RENDERIZADO
// ============================================================

// Renderiza los productos según la categoría seleccionada
function renderProducts(category = 'all') {
    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    if (filtered.length === 0) {
        productGrid.innerHTML = `<p class="no-products">No hay productos en esta categoría.</p>`;
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

    // Asignar eventos a los botones "Agregar" de cada producto
    document.querySelectorAll('.product-card__add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

// Renderiza el contenido del carrito en el sidebar
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="cart-empty">No hay productos en el carrito.</p>`;
        cartTotalSpan.textContent = '$0.00';
        cartCountSpan.textContent = '0';
        return;
    }

    // Construir HTML de cada item
    let html = '';
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        const subtotal = product.price * item.quantity;
        total += subtotal;
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

    // Asignar eventos a los botones del carrito
    document.querySelectorAll('.cart-item__btn.increment').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });

    document.querySelectorAll('.cart-item__btn.decrement').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });

    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removeItemCompletely(id);
        });
    });
}

// ============================================================
//  FUNCIONES DEL CARRITO (lógica)
// ============================================================

// Agrega un producto (o incrementa cantidad)
function addToCart(productId) {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    updateCart();
}

// Disminuye la cantidad de un producto (lo elimina si llega a 0)
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index === -1) return;
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

// Elimina completamente un producto del carrito
function removeItemCompletely(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCart();
}

// Vacía el carrito (usado en checkout)
function clearCart() {
    cart = [];
    updateCart();
}

// Actualiza la interfaz (renderiza productos y carrito)
function updateCart() {
    renderCart();
    // También actualizamos el badge del header (ya lo hace renderCart)
    // Pero renderCart actualiza cartCountSpan, así que está bien.
}

// ============================================================
//  NAVEGACIÓN POR CATEGORÍAS
// ============================================================
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Actualizar clase activa
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        renderProducts(category);
    });
});

// ============================================================
//  ABRIR / CERRAR SIDEBAR DEL CARRITO
// ============================================================
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

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
        closeCart();
    }
});

// ============================================================
//  CHECKOUT (simulación)
// ============================================================
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    alert('¡Gracias por tu compra! (Simulación)');
    clearCart();
    closeCart();
    renderProducts(document.querySelector('.nav__btn.active')?.dataset.category || 'all');
});

// ============================================================
//  INICIALIZACIÓN
// ============================================================
// Cargar todos los productos al inicio
renderProducts('all');
// Asegurar que el botón "Todos" esté activo
document.querySelector('.nav__btn[data-category="all"]').classList.add('active');