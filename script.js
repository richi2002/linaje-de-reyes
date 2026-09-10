/* =========================================================
   LINAJE DE REYES
   SISTEMA PRINCIPAL + CARRITO + CUPONES + TEMA + PWA
   ========================================================= */

let carrito = [];

const whatsapp = "920898321";
const STORAGE_KEY = "linaje_de_reyes_carrito";
const THEME_KEY = "linaje_de_reyes_theme";
const PEDIDO_MINIMO = 10;


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

    /* Filtros homepage */
    iniciarFiltros();

    /* Preloader */
    ocultarPreloader();

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

    /* Contador navbar */
    actualizarContadorNavbar();
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
                    <button type="button" class="drawer-pay-btn" id="drawerPayBtn">💳 Pagar con Yape o Plin</button>
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
        const cartSection = document.getElementById("cartItems");
        if (cartSection) {
            cartSection.scrollIntoView({ behavior: "smooth", block: "center" });
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

    document.getElementById("drawerPayBtn").addEventListener("click", () => {
        if (carrito.length === 0) {
            mostrarToast("Agrega productos primero");
            return;
        }
        cerrarCarrito();
        setTimeout(abrirModalPago, 300);
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
   FILTROS HOMEPAGE
   ========================================================= */

function iniciarFiltros() {
    const filtros = document.querySelectorAll(".filter");
    const productos = document.querySelectorAll(".product-card");

    if (!filtros.length || !productos.length) return;

    filtros.forEach(filtro => {
        filtro.addEventListener("click", () => {
            filtros.forEach(item => item.classList.remove("active"));
            filtro.classList.add("active");

            const categoria = filtro.dataset.filter;

            productos.forEach(producto => {
                const categoriaProducto = producto.dataset.category;
                const mostrar = categoria === "todos" || categoriaProducto === categoria;
                producto.style.display = mostrar ? "" : "none";
            });
        });
    });
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
   MODAL DE PAGO YAPE/PLIN
   ========================================================= */

let metodoPagoActual = "yape";

function abrirModalPago() {
    const modal = document.getElementById("paymentModal");
    if (!modal) return;

    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const descuento = calcularDescuento(subtotal);
    const total = subtotal - descuento;

    const paymentAmount = document.getElementById("paymentAmount");
    if (paymentAmount) {
        paymentAmount.textContent = `S/ ${total.toFixed(2)}`;
    }

    modal.classList.add("active");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    cambiarMetodoPago(metodoPagoActual);
}

function cerrarModalPago() {
    const modal = document.getElementById("paymentModal");
    if (!modal) return;

    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
}

function cambiarMetodoPago(metodo) {
    metodoPagoActual = metodo;

    document.querySelectorAll(".payment-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.method === metodo);
    });

    const qrImage = document.getElementById("qrImage");

    if (metodo === "yape") {
        if (qrImage) {
            qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=yape:920898321";
        }
    } else {
        if (qrImage) {
            qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=plin:920898321";
        }
    }
}

function confirmarPago() {
    cerrarModalPago();

    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const descuento = calcularDescuento(subtotal);
    const total = subtotal - descuento;

    const mensaje = `Hola, acabo de realizar el pago por *${metodoPagoActual.toUpperCase()}* por un monto de *S/ ${total.toFixed(2)}*.\n\nAdjunto la captura de mi pago.`;

    window.open(
        `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`,
        "_blank",
        "noopener,noreferrer"
    );

    mostrarToast("Abriendo WhatsApp para confirmar pago...");
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
   CONTADOR NAVBAR
   ========================================================= */

function actualizarContadorNavbar() {
    const cantidadTotal = carrito.reduce((t, p) => t + p.cantidad, 0);

    let navbarCart = document.getElementById("navbarCart");

    if (!navbarCart) {
        const nav = document.getElementById("nav") || document.querySelector(".nav");
        if (!nav) return;

        const navOrder = nav.querySelector(".nav-order");
        if (!navOrder) return;

        navbarCart = document.createElement("a");
        navbarCart.id = "navbarCart";
        navbarCart.className = "navbar-cart";
        navbarCart.href = "#pedido";
        navbarCart.innerHTML = `🛒 <span id="navbarCartCount">0</span>`;

        navOrder.parentNode.insertBefore(navbarCart, navOrder);
    }

    const contador = document.getElementById("navbarCartCount");
    if (contador) {
        contador.textContent = cantidadTotal;
        navbarCart.style.display = cantidadTotal > 0 ? "inline-flex" : "none";
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

function ocultarPreloader() {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("hide");
            setTimeout(() => preloader.remove(), 600);
        }, 800);
    }
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