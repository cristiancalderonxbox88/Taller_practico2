// ===== LISTA DE PRODUCTOS =====
var productos = [
    { id: 1, nombre: 'Explorer', categoria: 'rojas', precio: 15, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_VkNYRwYvgM1GgZ750e-wUOkH-rvzPXIGX3NiuKUXwg&s=10' },
    { id: 2, nombre: 'Candelight', categoria: 'blancas', precio: 20, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_MYtDGeZuEnj7avMfMKjs1E8iLaiCHNEqtn0qgD1q91v86f5QrtcFC_s&s=10' },
    { id: 3, nombre: 'Vendela', categoria: 'blancas', precio: 18, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMGwkMvEkvmmTruZYWo88KD63mjzD2R2sBztfWdKDado8-QKy6CqTHTOk&s=10' },
    { id: 4, nombre: 'Tibet', categoria: 'blancas', precio: 22, imagen: 'https://rp-webpage-assets.s3.amazonaws.com/Tibet_Rose_Aerial_View_Rosaprima.jpg' },
    { id: 5, nombre: 'Pink Floyd', categoria: 'rosadas', precio: 16, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXwBx_Pcdp9x4TJal-80CQ0QxRP83HM5YZlDywB5Irog0JG_3K0oGxi4A&s=10' },
    { id: 6, nombre: 'Topaz', categoria: 'rosadas', precio: 19, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWMtU4Cu7Vh2cQnbbJGWx2tU4Nn0zaOJpfm1W4z9VPYNLoefFKpJ27Ezg&s=10' },
    { id: 7, nombre: 'Brighton', categoria: 'amarillas', precio: 17, imagen: 'https://intiroses.com/wp-content/uploads/2019/07/yellow-brighton.jpg' },
    { id: 8, nombre: 'Hummer', categoria: 'amarillas', precio: 21, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKmm0ByQKUa6aLbKWndm0ho3cpDJtOTuMYxnx4kBYDE2tuuwTUFfZQluk&s=10' }
];

var carrito = [];
var categoriaActual = 'todas';

function renderizarProductos() {
    var contenedor = document.getElementById('productos');
    var filtrados = (categoriaActual === 'todas') 
        ? productos 
        : productos.filter(p => p.categoria.toLowerCase() === categoriaActual.toLowerCase());
    //                             ^^^^^^^^^^^               ^^^^^^^^^^^   (ahora no importa mayúsculas)

    if (filtrados.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; color:white; font-size:1.2rem;">No hay rosas de este color.</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < filtrados.length; i++) {
        var p = filtrados[i];
        html += `
            <div class="producto">
                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
                <h3>${p.nombre}</h3>
                <p>$${p.precio}</p>
                <button onclick="agregarAlCarrito(${p.id})">Añadir</button>
            </div>
        `;
    }
    contenedor.innerHTML = html;
}

function filtro(categoria) {
    categoriaActual = categoria;
    renderizarProductos();
}

function agregarAlCarrito(id) {
    var producto = productos.find(p => p.id === id);
    if (!producto) return;

    var encontrado = false;
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            carrito[i].cantidad++;
            encontrado = true;
            break;
        }
    }
    if (!encontrado) {
        carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    actualizarContador();
    alert('🌹 Añadiste ' + producto.nombre + ' al carrito');
}

function actualizarContador() {
    var totalItems = 0, totalPrecio = 0;
    for (var i = 0; i < carrito.length; i++) {
        totalItems += carrito[i].cantidad;
        totalPrecio += carrito[i].precio * carrito[i].cantidad;
    }
    document.getElementById('contador').textContent = totalItems;
    document.getElementById('totalBtn').textContent = '$' + totalPrecio;

    var btn = document.querySelector('.cart-btn');
    btn.classList.remove('bounce');
    void btn.offsetWidth;
    btn.classList.add('bounce');
}

function abrirCarrito() {
    document.getElementById('modalCarrito').style.display = 'flex';
    mostrarCarrito();
}

function cerrarCarrito() {
    document.getElementById('modalCarrito').style.display = 'none';
}

function mostrarCarrito() {
    var lista = document.getElementById('listaCarrito');
    var total = 0;
    if (carrito.length === 0) {
        lista.innerHTML = '<p>No hay productos en el carrito.</p>';
        document.getElementById('totalCarrito').textContent = '0';
        return;
    }
    var html = '<ul style="list-style:none; padding:0;">';
    for (var i = 0; i < carrito.length; i++) {
        var item = carrito[i];
        var subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <li>
                <span><strong>${item.nombre}</strong> x ${item.cantidad} = $${subtotal}</span>
                <span>
                    <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <button onclick="eliminarDelCarrito(${item.id})">✕</button>
                </span>
            </li>
        `;
    }
    html += '</ul>';
    lista.innerHTML = html;
    document.getElementById('totalCarrito').textContent = total;
}

function cambiarCantidad(id, delta) {
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            carrito[i].cantidad += delta;
            if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
            break;
        }
    }
    actualizarContador();
    mostrarCarrito();
}

function eliminarDelCarrito(id) {
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            carrito.splice(i, 1);
            break;
        }
    }
    actualizarContador();
    mostrarCarrito();
}

function vaciarCarrito() {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
        carrito = [];
        actualizarContador();
        mostrarCarrito();
    }
}

function pagar() {
    if (carrito.length === 0) {
        alert('No hay productos para pagar.');
        return;
    }
    var total = 0;
    for (var i = 0; i < carrito.length; i++) total += carrito[i].precio * carrito[i].cantidad;
    alert('🌹 ¡Gracias por tu compra! Total: $' + total);
    carrito = [];
    actualizarContador();
    mostrarCarrito();
    cerrarCarrito();
}

renderizarProductos();
actualizarContador();