/* =========================================================
   LINAJE DE REYES
   SISTEMA PRINCIPAL + CARRITO + CUPONES + TEMA + PWA
   ========================================================= */

let carrito = [];

const whatsapp = "51920898321";
const STORAGE_KEY = "linaje_de_reyes_carrito";
const THEME_KEY = "linaje_de_reyes_theme";
const CUPON_KEY = "linaje_de_reyes_cupon";
const PEDIDO_MINIMO = 10;

/* =========================================================
   SISTEMA DE FAVORITOS
   ========================================================= */

const FAVORITOS_KEY = "linaje_de_reyes_favoritos";

let favoritos = [];


/* Cargar favoritos al inicio */
function cargarFavoritos() {
    try {
        const guardado = localStorage.getItem(FAVORITOS_KEY);
        if (!guardado) {
            favoritos = [];
            return;
        }
        const datos = JSON.parse(guardado);
        favoritos = Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.warn("Error cargando favoritos:", error);
        favoritos = [];
    }
}


/* Guardar favoritos */
function guardarFavoritos() {
    try {
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    } catch (error) {
        console.warn("Error guardando favoritos:", error);
    }
}


/* Verificar si un producto es favorito */
function esFavorito(nombreProducto) {
    return favoritos.includes(nombreProducto);
}


/* Alternar favorito (agregar/quitar) */
function toggleFavorito(nombreProducto, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const index = favoritos.indexOf(nombreProducto);

    if (index === -1) {
        favoritos.push(nombreProducto);
        mostrarToast(`❤️ ${nombreProducto} agregado a favoritos`);
    } else {
        favoritos.splice(index, 1);
        mostrarToast(`${nombreProducto} eliminado de favoritos`);
    }

    guardarFavoritos();
    actualizarBotonesFavoritos();

    /* Si estamos en modo "ver solo favoritos", actualizar filtro.
       Usamos typeof para evitar error en index.html donde
       filtrarCatalogo() no existe. */
    const filtroActivo = document.querySelector(".catalog-filter.active");
    if (
        filtroActivo &&
        filtroActivo.dataset.category === "favoritos" &&
        typeof filtrarCatalogo === "function"
    ) {
        filtrarCatalogo();
    }
}


/* Actualizar todos los botones de favoritos en la página */
function actualizarBotonesFavoritos() {
    document.querySelectorAll("[data-favorito]").forEach(btn => {
        const nombre = btn.dataset.favorito;
        const esFav = esFavorito(nombre);

        btn.classList.toggle("active", esFav);
        btn.setAttribute(
            "aria-label",
            esFav
                ? `Quitar ${nombre} de favoritos`
                : `Agregar ${nombre} a favoritos`
        );
        btn.setAttribute("aria-pressed", esFav);
    });
}

/* =========================================================
   BASE DE DATOS DE PRODUCTOS
   ========================================================= */

const PRODUCTOS_DB = {
    /* PANADERÍA */
    panfrances: {
        id: "panfrances",
        nombre: "Pan Francés",
        precio: 0.50,
        categoria: "panaderia",
        categoriaNombre: "Panadería",
        emoji: "🥖",
        descripcion: "Clásico, fresco y perfecto para acompañar cualquier momento del día.",
        badge: "Favorito"
    },
    croissant: {
        id: "croissant",
        nombre: "Croissant",
        precio: 3.50,
        categoria: "panaderia",
        categoriaNombre: "Panadería",
        emoji: "🥐",
        descripcion: "Delicado, dorado y de textura ligera. Ideal para comenzar el día."
    },
    panchalla: {
        id: "panchalla",
        nombre: "Pan Challa",
        precio: 1.00,
        categoria: "panaderia",
        categoriaNombre: "Panadería",
        emoji: "🍞",
        descripcion: "Pan tradicional peruano, ideal para desayunos y reuniones familiares."
    },
    pandecoco: {
        id: "pandecoco",
        nombre: "Pan de Coco",
        precio: 0.90,
        categoria: "panaderia",
        categoriaNombre: "Panadería",
        emoji: "🥥",
        descripcion: "Dulce y delicioso, perfecto para acompañar el café de la tarde."
    },
    empanada: {
        id: "empanada",
        nombre: "Empanada",
        precio: 3.00,
        categoria: "panaderia",
        categoriaNombre: "Panadería",
        emoji: "🥟",
        descripcion: "Empanadas de pollo, carne o queso, horneadas al momento.",
        badge: "Nuevo"
    },
    panartesanal: {
        id: "panartesanal",
        nombre: "Pan Artesanal",
        precio: 8.00,
        categoria: "panaderia",
        categoriaNombre: "Panadería",
        emoji: "🥯",
        descripcion: "Pan de masa madre, multigrano o con avena. Hecho con dedicación."
    },

    /* PASTELERÍA */
    porciontorta: {
        id: "porciontorta",
        nombre: "Porción de Torta",
        precio: 7.00,
        categoria: "pasteleria",
        categoriaNombre: "Pastelería",
        emoji: "🍰",
        descripcion: "Una porción especial para darte ese gusto que mereces.",
        badge: "Popular"
    },
    galletas: {
        id: "galletas",
        nombre: "Galletas",
        precio: 2.50,
        categoria: "pasteleria",
        categoriaNombre: "Pastelería",
        emoji: "🍪",
        descripcion: "Dulces, sencillas y perfectas para acompañar tu café."
    },
    piedelimon: {
        id: "piedelimon",
        nombre: "Pie de Limón",
        precio: 9.00,
        categoria: "pasteleria",
        categoriaNombre: "Pastelería",
        emoji: "🍋",
        descripcion: "Refrescante y cremoso, el equilibrio perfecto entre ácido y dulce."
    },

    /* POSTRES */
    postres: {
        id: "postres",
        nombre: "Postres Variados",
        precio: 5.00,
        categoria: "postres",
        categoriaNombre: "Postres",
        emoji: "🍮",
        descripcion: "Pequeños momentos dulces para disfrutar y compartir."
    },
    cheesecake: {
        id: "cheesecake",
        nombre: "Cheesecake",
        precio: 13.00,
        categoria: "postres",
        categoriaNombre: "Postres",
        emoji: "🧁",
        descripcion: "De maracuyá, fresa o frutos rojos. Cremoso y delicioso.",
        badge: "Popular"
    },
    quesillo: {
        id: "quesillo",
        nombre: "Quesillo",
        precio: 10.50,
        categoria: "postres",
        categoriaNombre: "Postres",
        emoji: "🍯",
        descripcion: "Postre tradicional con textura suave y sabor inconfundible."
    },

    /* TORTAS */
    tortapersonalizada: {
        id: "tortapersonalizada",
        nombre: "Torta Personalizada",
        precio: 50.00,
        categoria: "tortas",
        categoriaNombre: "Tortas",
        emoji: "🎂",
        descripcion: "Diseñamos tortas para celebraciones y momentos especiales.",
        badge: "Especial",
        precioTexto: "Desde S/ 50"
    },
    tortachocolate: {
        id: "tortachocolate",
        nombre: "Torta de Chocolate",
        precio: 11.00,
        categoria: "tortas",
        categoriaNombre: "Tortas",
        emoji: "🍫",
        descripcion: "Húmeda, intensa y con el mejor sabor a chocolate.",
        precioTexto: "Porción"
    },
    tresleches: {
        id: "tresleches",
        nombre: "Torta Tres Leches",
        precio: 10.00,
        categoria: "tortas",
        categoriaNombre: "Tortas",
        emoji: "🥛",
        descripcion: "Suave, húmeda y con el equilibrio perfecto de sabores.",
        precioTexto: "Porción"
    },

    /* BEBIDAS */
    cafe: {
        id: "cafe",
        nombre: "Café",
        precio: 4.00,
        categoria: "bebidas",
        categoriaNombre: "Bebidas",
        emoji: "☕",
        descripcion: "Café pasado o americano, perfecto para acompañar tus panes."
    },
    chocolatecaliente: {
        id: "chocolatecaliente",
        nombre: "Chocolate Caliente",
        precio: 5.00,
        categoria: "bebidas",
        categoriaNombre: "Bebidas",
        emoji: "🍫",
        descripcion: "Chocolate caliente cremoso, perfecto para los días fríos."
    },
    infusiones: {
        id: "infusiones",
        nombre: "Infusiones",
        precio: 3.00,
        categoria: "bebidas",
        categoriaNombre: "Bebidas",
        emoji: "🍵",
        descripcion: "Manzanilla, anís, hierba luisa y más. Aromáticas y reconfortantes."
    }
};


/* =========================================================
   CUPONES VÁLIDOS
   ========================================================= */

const CUPONES_VALIDOS = {
    "BIENVENIDO10": {
        tipo: "porcentaje",
        valor: 10,
        descripcion: "10% de descuento",
        minimo: 20,
        activo: true
    },
    "PAN5": {
        tipo: "monto",
        valor: 5,
        descripcion: "S/ 5 de descuento",
        minimo: 30,
        activo: true
    },
    "REYES15": {
        tipo: "porcentaje",
        valor: 15,
        descripcion: "15% de descuento",
        minimo: 50,
        activo: true
    },
    "FAMILIA20": {
        tipo: "porcentaje",
        valor: 20,
        descripcion: "20% de descuento",
        minimo: 80,
        activo: true
    }
};

let cuponAplicado = null;


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* Favoritos primero (para que catalogo.js los use) */
    cargarFavoritos();

    /* Menú principal */
    iniciarMenuPrincipal();

    /* Carrito */
    cargarCarrito();
    cargarCupon();          /* NUEVO: restaurar cupón guardado */
    crearCarritoFlotante();
    actualizarCarrito();

    /* Productos destacados en homepage */
    cargarProductosDestacados();

    /* Botón volver arriba */
    crearScrollTop();

    /* Cupones */
    iniciarCupones();
    restaurarCuponAplicado(); /* NUEVO */

    /* Tema */
    initTheme();

    /* Horario */
    verificarHorario();
    setInterval(verificarHorario, 60000);

    /* PWA */
    registrarServiceWorker();
});


/* =========================================================
   MENÚ PRINCIPAL
   ========================================================= */

function iniciarMenuPrincipal() {
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    if (!menuBtn || !nav) return;

    menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    const abierto = nav.classList.contains("active");
    menuBtn.textContent = abierto ? "✕" : "☰";
    menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    menuBtn.setAttribute("aria-expanded", abierto);
    });

    nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-label", "Abrir menú");
        menuBtn.setAttribute("aria-expanded", "false");
    });
    });
}


/* =========================================================
   CARGAR PRODUCTOS DESTACADOS (Homepage)
   ========================================================= */

function cargarProductosDestacados() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const destacados = ["panfrances", "croissant", "porciontorta", "cheesecake", "galletas", "tortapersonalizada"];

    grid.innerHTML = destacados.map(id => {
        const p = PRODUCTOS_DB[id];
        if (!p) return "";

        return `
            <article class="product-card" data-category="${p.categoria}">
                <div class="product-image ${getProductBgClass(p.categoria)}">
                    <span>${p.emoji}</span>
                    ${p.badge ? `<div class="product-tag">${p.badge}</div>` : ""}
                    <button
                        class="favorite-btn"
                        data-favorito="${escapeHTML(p.nombre)}"
                        onclick="toggleFavorito('${p.nombre.replace(/'/g, "\\'")}', event)"
                        aria-label="Agregar a favoritos"
                        aria-pressed="false"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <div class="product-info">
                    <span class="product-category">${p.categoriaNombre.toUpperCase()}</span>
                    <h3>${escapeHTML(p.nombre)}</h3>
                    <p>${escapeHTML(p.descripcion)}</p>
                    <div class="product-bottom">
                        <strong>${p.precioTexto || `S/ ${p.precio.toFixed(2)}`}</strong>
                        <button class="add-btn" onclick="agregarAlCarrito('${p.nombre.replace(/'/g, "\\'")}', ${p.precio})" aria-label="Agregar ${p.nombre}">+</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    /* Actualizar botones de favoritos tras render */
    if (typeof actualizarBotonesFavoritos === "function") {
        actualizarBotonesFavoritos();
    }
}

/* =========================================================
   CLASE DE FONDO SEGÚN CATEGORÍA
   Devuelve las clases definidas en style.css (homepage).
   catalogo.js usa su propia función para catalogo.css.
   ========================================================= */

function getProductBgClass(categoria) {
    const clases = {
        panaderia: "bread-bg",
        pasteleria: "cake-bg",
        postres: "dessert-bg",
        tortas: "custom-bg",
        bebidas: "cookie-bg"
    };
    return clases[categoria] || "bread-bg";
}


/* =========================================================
   AGREGAR PRODUCTO
   ========================================================= */

function agregarAlCarrito(nombre, precio) {
    precio = Number(precio);

    if (!nombre || typeof nombre !== "string" || Number.isNaN(precio) || precio < 0) {
        console.warn("Producto inválido:", nombre, precio);
        return;
    }

    const productoExistente = carrito.find(p => p.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    actualizarCarrito();
    guardarCarrito();
    mostrarToast(`${nombre} agregado al carrito`);
}


/* =========================================================
   ACTUALIZAR CARRITO
   ========================================================= */

function actualizarCarrito() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const floatingCount = document.getElementById("floatingCartCount");
    const drawerItems = document.getElementById("drawerCartItems");
    const drawerTotal = document.getElementById("drawerCartTotal");

    const cantidadTotal = carrito.reduce((t, p) => t + p.cantidad, 0);
    const subtotal = carrito.reduce((t, p) => t + p.precio * p.cantidad, 0);
    const descuento = calcularDescuento(subtotal);
    const cuponDesactivado = cuponAplicado && subtotal < cuponAplicado.minimo;
    const total = subtotal - descuento;

    /* Contadores */
    if (cartCount) {
        cartCount.textContent = cantidadTotal === 1 ? "1 producto" : `${cantidadTotal} productos`;
    }

    if (floatingCount) {
        floatingCount.textContent = cantidadTotal;
        floatingCount.style.display = cantidadTotal > 0 ? "flex" : "none";
    }

    /* Total homepage */
    if (cartTotal) {
        if (descuento > 0) {
            cartTotal.innerHTML = `
                <span style="text-decoration: line-through; opacity: 0.5; font-size: 0.65em; margin-right: 6px;">S/ ${subtotal.toFixed(2)}</span>
                S/ ${total.toFixed(2)}
            `;
        } else {
            cartTotal.textContent = `S/ ${total.toFixed(2)}`;
        }
    }
    if (cuponDesactivado && cartCount) {
    const mensaje = document.getElementById("couponMessage");
    if (mensaje) {
        mensaje.textContent = `Cupón desactivado — mínimo S/ ${cuponAplicado.minimo.toFixed(2)}`;
        mensaje.className = "coupon-message error";
    }
    }

    /* Items homepage */
    if (cartItems) {
        if (carrito.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <span>🛍️</span>
                    <h4>Tu carrito está vacío</h4>
                    <p>Agrega productos para comenzar tu pedido.</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = generarProductosCarrito(false) +
                (descuento > 0 ? generarLineaDescuento(subtotal, descuento, total) : "");
        }
    }

    /* Items drawer */
    if (drawerItems) {
        if (carrito.length === 0) {
            drawerItems.innerHTML = `
                <div class="drawer-empty">
                    <div class="drawer-empty-icon">🛍️</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Explora nuestro catálogo y agrega tus favoritos.</p>
                </div>
            `;
        } else {
            drawerItems.innerHTML = generarProductosCarrito(true) +
                (descuento > 0 ? generarLineaDescuento(subtotal, descuento, total) : "");
        }
    }

    /* Total drawer */
    if (drawerTotal) {
        if (descuento > 0) {
            drawerTotal.innerHTML = `
                <span style="text-decoration: line-through; opacity: 0.5; font-size: 0.65em; margin-right: 6px;">S/ ${subtotal.toFixed(2)}</span>
                S/ ${total.toFixed(2)}
            `;
        } else {
            drawerTotal.textContent = `S/ ${total.toFixed(2)}`;
        }
    }
}


/* =========================================================
   GENERAR PRODUCTOS DEL CARRITO
   ========================================================= */

function generarProductosCarrito(drawer = false) {
    return carrito.map((producto, indice) => {
        const subtotal = producto.precio * producto.cantidad;
        return `
            <div class="${drawer ? "drawer-cart-item" : "cart-item"}">
                <div class="cart-item-info">
                    <span class="cart-item-name">${escapeHTML(producto.nombre)}</span>
                    <span class="cart-item-price">
                        S/ ${producto.precio.toFixed(2)} × ${producto.cantidad} = S/ ${subtotal.toFixed(2)}
                    </span>
                </div>
                <div class="cart-controls">
                    <button type="button" class="cart-btn" onclick="cambiarCantidad(${indice}, -1)" aria-label="Disminuir cantidad">−</button>
                    <span class="cart-quantity">${producto.cantidad}</span>
                    <button type="button" class="cart-btn" onclick="cambiarCantidad(${indice}, 1)" aria-label="Aumentar cantidad">+</button>
                    <button type="button" class="cart-btn cart-delete" onclick="eliminarProducto(${indice})" aria-label="Eliminar producto" title="Eliminar">×</button>
                </div>
            </div>
        `;
    }).join("");
}


function generarLineaDescuento(subtotal, descuento, total) {
    return `
        <div class="cart-discount-line">
            <div>
                <span class="discount-label">🎟️ Cupón: ${cuponAplicado.codigo}</span>
                <span class="discount-detail">${cuponAplicado.descripcion}</span>
            </div>
            <strong class="discount-amount">- S/ ${descuento.toFixed(2)}</strong>
        </div>
        <div class="cart-subtotal-line">
            <span>Subtotal:</span>
            <span>S/ ${subtotal.toFixed(2)}</span>
        </div>
        <div class="cart-final-line">
            <span>Total:</span>
            <strong>S/ ${total.toFixed(2)}</strong>
        </div>
    `;
}


/* =========================================================
   CAMBIAR CANTIDAD / ELIMINAR
   ========================================================= */

function cambiarCantidad(indice, cambio) {
    if (!carrito[indice]) return;

    const nuevaCantidad = carrito[indice].cantidad + cambio;

    /* Tope superior coherente con producto.js */
    if (nuevaCantidad > 99) {
        mostrarToast("Máximo 99 unidades por producto");
        return;
    }

    carrito[indice].cantidad = nuevaCantidad;

    if (carrito[indice].cantidad <= 0) {
        const nombre = carrito[indice].nombre;
        carrito.splice(indice, 1);
        mostrarToast(`${nombre} eliminado del carrito`);
    }

    actualizarCarrito();
    guardarCarrito();
}

function eliminarProducto(indice) {
    if (!carrito[indice]) return;

    const producto = carrito[indice];
    carrito.splice(indice, 1);

    actualizarCarrito();
    guardarCarrito();
    mostrarToast(`${producto.nombre} eliminado`);
}

function limpiarCarrito() {
    if (carrito.length === 0) return;

    if (confirm("¿Estás seguro de vaciar tu carrito?")) {
        carrito = [];
        cuponAplicado = null;
        localStorage.removeItem(CUPON_KEY);
        actualizarCarrito();
        guardarCarrito();
        mostrarToast("Carrito vaciado");
    }
}


/* =========================================================
   CARRITO FLOTANTE
   ========================================================= */

function crearCarritoFlotante() {
    if (document.getElementById("floatingCart")) return;

    const carritoHTML = `
        <button id="floatingCart" class="floating-cart" type="button" aria-label="Abrir carrito">
            <span class="floating-cart-icon">🛍️</span>
            <span id="floatingCartCount" class="floating-cart-count">0</span>
        </button>

        <div id="cartDrawer" class="cart-drawer" aria-hidden="true">
            <div class="cart-drawer-overlay" id="cartDrawerOverlay"></div>
            <div class="cart-drawer-panel" role="dialog" aria-modal="true" aria-label="Carrito de compras">
    <div class="cart-drawer-header">
        <div>
            <span class="drawer-eyebrow">LINAJE DE REYES</span>
            <h2>Tu pedido</h2>
        </div>
        <button type="button" class="cart-drawer-close" id="cartDrawerClose" aria-label="Cerrar carrito">×</button>
    </div>
    <div id="drawerCartItems" class="cart-drawer-items"></div>
    <div class="cart-drawer-footer">
        <div class="drawer-total-row">
            <span>Total</span>
            <strong id="drawerCartTotal">S/ 0.00</strong>
        </div>
        <button type="button" class="drawer-order-btn" id="drawerOrderBtn">Continuar con mi pedido</button>
        <button type="button" class="drawer-catalog-btn" id="drawerCatalogBtn">Seguir comprando</button>
        <button type="button" class="drawer-clear-btn" onclick="limpiarCarrito()">Vaciar carrito</button>
    </div>
</div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", carritoHTML);

    document.getElementById("floatingCart").addEventListener("click", abrirCarrito);
    document.getElementById("cartDrawerClose").addEventListener("click", cerrarCarrito);
    document.getElementById("cartDrawerOverlay").addEventListener("click", cerrarCarrito);

    document.getElementById("drawerOrderBtn").addEventListener("click", () => {
        cerrarCarrito();
        const cartSection = document.getElementById("pedido");
        if (cartSection) {
            cartSection.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.location.href = "index.html#pedido";
        }
    });

    document.getElementById("drawerCatalogBtn").addEventListener("click", () => {
        cerrarCarrito();
        if (!window.location.pathname.includes("catalogo.html")) {
            window.location.href = "catalogo.html";
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            const drawer = document.getElementById("cartDrawer");
            if (drawer && drawer.classList.contains("active")) {
                cerrarCarrito();
            }
        }
    });
}


function abrirCarrito() {
    const drawer = document.getElementById("cartDrawer");
    if (!drawer) return;
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");

    /* Mover el foco dentro del drawer */
    const closeBtn = document.getElementById("cartDrawerClose");
    if (closeBtn) closeBtn.focus();
}

function cerrarCarrito() {
    const drawer = document.getElementById("cartDrawer");
    if (!drawer) return;
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");

    /* Devolver el foco al botón que abrió el drawer */
    const floatingBtn = document.getElementById("floatingCart");
    if (floatingBtn) floatingBtn.focus();
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimeout;

function mostrarToast(mensaje) {
    let toast = document.getElementById("toast");
    if (!toast) toast = document.getElementById("catalogToast");
    if (!toast) return;

    clearTimeout(toastTimeout);
    toast.textContent = mensaje;
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   CUPONES
   ========================================================= */

function iniciarCupones() {
    const btn = document.getElementById("applyCouponBtn");
    const input = document.getElementById("cupon");

    if (btn) {
        btn.addEventListener("click", aplicarCupon);
    }

    if (input) {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                aplicarCupon();
            }
        });
    }
}

/* Restaurar cupón previamente guardado (al recargar) */
function restaurarCuponAplicado() {
    if (!cuponAplicado) return;
    const input = document.getElementById("cupon");
    const mensaje = document.getElementById("couponMessage");
    if (input) input.value = cuponAplicado.codigo;
    if (mensaje) {
        mensaje.textContent = `✓ ${cuponAplicado.descripcion} aplicado`;
        mensaje.className = "coupon-message success";
    }
}

function aplicarCupon() {
    const input = document.getElementById("cupon");
    const mensaje = document.getElementById("couponMessage");

    if (!input || !mensaje) return;

    const codigo = input.value.trim().toUpperCase();

    mensaje.textContent = "";
    mensaje.className = "coupon-message";

    if (!codigo) {
        mensaje.textContent = "Ingresa un código";
        mensaje.classList.add("error");
        return;
    }

    const cupon = CUPONES_VALIDOS[codigo];

    if (!cupon) {
        mensaje.textContent = "❌ Cupón no válido";
        mensaje.classList.add("error");
        cuponAplicado = null;
        localStorage.removeItem(CUPON_KEY);
        actualizarCarrito();
        return;
    }

    if (!cupon.activo) {
        mensaje.textContent = "❌ Este cupón ha expirado";
        mensaje.classList.add("error");
        cuponAplicado = null;
        localStorage.removeItem(CUPON_KEY);
        actualizarCarrito();
        return;
    }

    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

    if (subtotal < cupon.minimo) {
        mensaje.textContent = `Mínimo S/ ${cupon.minimo.toFixed(2)} para este cupón`;
        mensaje.classList.add("error");
        cuponAplicado = null;
        localStorage.removeItem(CUPON_KEY);
        actualizarCarrito();
        return;
    }

    cuponAplicado = { codigo: codigo, ...cupon };
    guardarCupon(); /* NUEVO: persistir */
    mensaje.textContent = `✓ ${cupon.descripcion} aplicado`;
    mensaje.classList.add("success");

    actualizarCarrito();
    mostrarToast(`Cupón ${codigo} aplicado`);
}

/* Persistencia del cupón */
function guardarCupon() {
    try {
        if (cuponAplicado) {
            localStorage.setItem(CUPON_KEY, JSON.stringify(cuponAplicado));
        } else {
            localStorage.removeItem(CUPON_KEY);
        }
    } catch (error) {
        console.warn("No se pudo guardar el cupón.", error);
    }
}

function cargarCupon() {
    try {
        const guardado = localStorage.getItem(CUPON_KEY);
        if (!guardado) {
            cuponAplicado = null;
            return;
        }
        const datos = JSON.parse(guardado);
        if (datos && datos.codigo && datos.tipo && datos.valor) {
            cuponAplicado = datos;
        } else {
            cuponAplicado = null;
            localStorage.removeItem(CUPON_KEY);
        }
    } catch (error) {
        console.warn("Cupón inválido.", error);
        cuponAplicado = null;
        localStorage.removeItem(CUPON_KEY);
    }
}

function calcularDescuento(total) {
    if (!cuponAplicado) return 0;

    /* Si el carrito ya no alcanza el mínimo requerido, el cupón deja de aplicar */
    if (total < cuponAplicado.minimo) {
        return 0;
    }

    if (cuponAplicado.tipo === "porcentaje") {
        return total * (cuponAplicado.valor / 100);
    } else if (cuponAplicado.tipo === "monto") {
        return Math.min(cuponAplicado.valor, total);
    }

    return 0;
}


/* =========================================================
   ENVIAR PEDIDO POR WHATSAPP
   ========================================================= */

function enviarPedido(event) {
    event.preventDefault();

    if (carrito.length === 0) {
        mostrarToast("Agrega al menos un producto al carrito");
        return;
    }

    const nombre = document.getElementById("nombre")?.value.trim();
    const telefono = document.getElementById("telefono")?.value.trim();
    const tipoPedido = document.getElementById("tipoPedido")?.value;
    const fecha = document.getElementById("fechaPedido")?.value;
    const hora = document.getElementById("horaPedido")?.value;
    const metodoPago = document.getElementById("metodoPago")?.value;
    const comentarios = document.getElementById("comentarios")?.value.trim();

    if (!nombre || !telefono) {
        mostrarToast("Completa tu nombre y teléfono");
        return;
    }

    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const descuento = calcularDescuento(subtotal);
    const total = subtotal - descuento;

    if (total < PEDIDO_MINIMO) {
        mostrarToast(`El pedido mínimo es S/ ${PEDIDO_MINIMO.toFixed(2)}`);
        return;
    }

    let mensaje = `🥖 *LINAJE DE REYES* 🥖\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `*NUEVO PEDIDO*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    mensaje += `👤 *DATOS DEL CLIENTE*\n`;
    mensaje += `• Nombre: ${nombre}\n`;
    mensaje += `• Teléfono: ${telefono}\n`;
    mensaje += `• Modalidad: ${tipoPedido}\n`;

    if (fecha) mensaje += `• Fecha: ${fecha}\n`;
    if (hora) mensaje += `• Hora: ${hora}\n`;
    if (metodoPago) mensaje += `• Pago: ${metodoPago}\n`;

    mensaje += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `🛒 *PRODUCTOS*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    carrito.forEach((producto, index) => {
        const sub = producto.precio * producto.cantidad;
        mensaje += `${index + 1}. ${producto.nombre}\n`;
        mensaje += `   ${producto.cantidad} × S/ ${producto.precio.toFixed(2)} = S/ ${sub.toFixed(2)}\n\n`;
    });

    mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💵 Subtotal: S/ ${subtotal.toFixed(2)}\n`;

    if (descuento > 0) {
        mensaje += `🎟️ Cupón ${cuponAplicado.codigo}: -S/ ${descuento.toFixed(2)}\n`;
    }

    mensaje += `💰 *TOTAL: S/ ${total.toFixed(2)}*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;

    if (comentarios) {
        mensaje += `\n📝 *Comentarios:*\n${comentarios}\n`;
    }

    mensaje += `\n_Enviado desde linajedereyes.com_`;

    window.open(
        `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   MODO OSCURO
   ========================================================= */

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    aplicarTema(theme);

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
        toggle.addEventListener("click", toggleTheme);
    }
}

function aplicarTema(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const icon = document.querySelector(".theme-icon");
    if (icon) {
        icon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    aplicarTema(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    mostrarToast(newTheme === "dark" ? "Modo oscuro activado" : "Modo claro activado");
}


/* =========================================================
   HORARIOS
   ========================================================= */

function verificarHorario() {
    const scheduleStatus = document.getElementById("scheduleStatus");
    if (!scheduleStatus) return;

    const ahora = new Date();
    const dia = ahora.getDay();
    const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

    let abierto = false;
    let horario = "";

    if (dia >= 1 && dia <= 5) {
        abierto = horaActual >= 6 && horaActual < 21;
        horario = "Lun-Vie: 6:00 AM - 9:00 PM";
    } else if (dia === 6) {
        abierto = horaActual >= 6 && horaActual < 21.5;
        horario = "Sáb: 6:00 AM - 9:30 PM";
    } else {
        abierto = horaActual >= 7 && horaActual < 20;
        horario = "Dom: 7:00 AM - 8:00 PM";
    }

    const strong = scheduleStatus.querySelector("strong");

    if (abierto) {
        scheduleStatus.classList.add("open");
        scheduleStatus.classList.remove("closed");
        if (strong) strong.textContent = "Abierto ahora · " + horario;
    } else {
        scheduleStatus.classList.add("closed");
        scheduleStatus.classList.remove("open");
        if (strong) strong.textContent = "Cerrado · " + horario;
    }
}


/* =========================================================
   GUARDAR / CARGAR CARRITO
   ========================================================= */

function guardarCarrito() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    } catch (error) {
        console.warn("No se pudo guardar el carrito.", error);
    }
}

function cargarCarrito() {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY);

        if (!guardado) {
            carrito = [];
            return;
        }

        const datos = JSON.parse(guardado);

        if (!Array.isArray(datos)) {
            carrito = [];
            return;
        }

        carrito = datos
            .filter(p =>
                p &&
                typeof p.nombre === "string" &&
                Number.isFinite(Number(p.precio)) &&
                Number.isFinite(Number(p.cantidad)) &&
                Number(p.cantidad) > 0
            )
            .map(p => ({
                nombre: p.nombre,
                precio: Number(p.precio),
                cantidad: Math.max(1, Math.floor(Number(p.cantidad)))
            }));

    } catch (error) {
        console.warn("Carrito inválido.", error);
        carrito = [];
        localStorage.removeItem(STORAGE_KEY);
    }
}


/* =========================================================
   UTILIDADES
   ========================================================= */

function escapeHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function crearScrollTop() {
    if (document.getElementById("scrollTopBtn")) return;

    const btn = document.createElement("button");
    btn.className = "scroll-top";
    btn.id = "scrollTopBtn";
    btn.innerHTML = "↑";
    btn.setAttribute("aria-label", "Volver arriba");
    document.body.appendChild(btn);

    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.pageYOffset > 400);
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* =========================================================
   PWA - SERVICE WORKER
   ========================================================= */

function registrarServiceWorker() {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./sw.js")
                .then(reg => console.log("SW registrado:", reg.scope))
                .catch(err => console.warn("Error SW:", err));
        });
    }
}
/* =========================================================
   IMPRESIÓN — Generar número de pedido y fecha
   ========================================================= */

function prepararComprobanteImpresion() {
    const numeroEl = document.getElementById("printOrderNumber");
    const fechaEl = document.getElementById("printOrderDate");

    if (!numeroEl || !fechaEl) return;

    /* Número de pedido: basado en timestamp, formato LDR-YYYYMMDD-XXXX */
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, "0");
    const dd = String(ahora.getDate()).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 9000) + 1000);

    numeroEl.textContent = `LDR-${yyyy}${mm}${dd}-${random}`;

    /* Fecha legible en español */
    const fecha = ahora.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    const hora = ahora.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    fechaEl.textContent = `${fecha} · ${hora}`;
}

/* Registrar el hook antes de imprimir */
window.addEventListener("beforeprint", prepararComprobanteImpresion);

/* También prepararlo cuando el usuario haga click en el botón de enviar
   (así el número queda registrado antes de abrir WhatsApp) */
document.addEventListener("DOMContentLoaded", () => {
    const enviarBtn = document.querySelector(".whatsapp-btn");
    if (enviarBtn) {
        enviarBtn.addEventListener("click", prepararComprobanteImpresion);
    }
});