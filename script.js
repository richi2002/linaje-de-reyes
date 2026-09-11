/* =========================================================
   LINAJE DE REYES
   SISTEMA PRINCIPAL + CARRITO + CUPONES + TEMA + PWA
   ========================================================= */

let carrito = [];

const whatsapp = "51920898321";
const STORAGE_KEY = "linaje_de_reyes_carrito";
const THEME_KEY = "linaje_de_reyes_theme";
const PEDIDO_MINIMO = 10;


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
    /* Menú principal */
    iniciarMenuPrincipal();

    /* Carrito */
    cargarCarrito();
    crearCarritoFlotante();
    actualizarCarrito();

    /* Productos destacados en homepage */
    cargarProductosDestacados();

    /* Botón volver arriba */
    crearScrollTop();

    /* Cupones */
    iniciarCupones();

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
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuBtn.textContent = "☰";
            menuBtn.setAttribute("aria-label", "Abrir menú");
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
                </div>
                <div class="product-info">
                    <span class="product-category">${p.categoriaNombre.toUpperCase()}</span>
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion}</p>
                    <div class="product-bottom">
                        <strong>${p.precioTexto || `S/ ${p.precio.toFixed(2)}`}</strong>
                        <button class="add-btn" onclick="agregarAlCarrito('${p.nombre}', ${p.precio})" aria-label="Agregar ${p.nombre}">+</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

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

    if (!nombre || typeof nombre !== 'string' || Number.isNaN(precio) || precio < 0) {
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

    carrito[indice].cantidad += cambio;

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
            <aside class="cart-drawer-panel" role="dialog" aria-modal="true" aria-label="Carrito de compras">
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
            </aside>
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
}

function cerrarCarrito() {
    const drawer = document.getElementById("cartDrawer");
    if (!drawer) return;
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
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
        actualizarCarrito();
        return;
    }

    if (!cupon.activo) {
        mensaje.textContent = "❌ Este cupón ha expirado";
        mensaje.classList.add("error");
        cuponAplicado = null;
        actualizarCarrito();
        return;
    }

    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

    if (subtotal < cupon.minimo) {
        mensaje.textContent = `Mínimo S/ ${cupon.minimo.toFixed(2)} para este cupón`;
        mensaje.classList.add("error");
        cuponAplicado = null;
        actualizarCarrito();
        return;
    }

    cuponAplicado = { codigo: codigo, ...cupon };
    mensaje.textContent = `✓ ${cupon.descripcion} aplicado`;
    mensaje.classList.add("success");

    actualizarCarrito();
    mostrarToast(`Cupón ${codigo} aplicado`);
}

function calcularDescuento(total) {
    if (!cuponAplicado) return 0;

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