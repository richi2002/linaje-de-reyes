/* =========================================================
   LINAJE DE REYES
   PÁGINA DE PRODUCTO
   ========================================================= */

/* =========================================================
   OBTENER PRODUCTO DESDE LA URL
   ========================================================= */

const params = new URLSearchParams(window.location.search);
const productoID = params.get("producto") || "panfrances";
const producto = PRODUCTOS_DB[productoID] || PRODUCTOS_DB.panfrances;


/* =========================================================
   MOSTRAR PRODUCTO
   ========================================================= */

document.title = `${producto.nombre} | LINAJE DE REYES`;

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productEmoji = document.getElementById("productEmoji");
const productDescription = document.getElementById("productDescription");
const breadcrumbProduct = document.getElementById("breadcrumbProduct");
const productImageContainer = document.getElementById("productImageContainer");

if (productName) productName.textContent = producto.nombre;
if (productPrice) productPrice.textContent = producto.precio.toFixed(2);
if (productCategory) productCategory.textContent = producto.categoriaNombre.toUpperCase();
if (productEmoji) productEmoji.textContent = producto.emoji;
if (productDescription) productDescription.textContent = producto.descripcion;
if (breadcrumbProduct) breadcrumbProduct.textContent = producto.nombre;

// Aplicar fondo según categoría
if (productImageContainer) {
    const bgClass = getProductBgClass(producto.categoria);
    productImageContainer.classList.add(bgClass);
}


/* =========================================================
   CONTROL DE CANTIDAD
   ========================================================= */

let cantidad = 1;

const quantityElement = document.getElementById("quantity");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");

function actualizarCantidad() {
    if (quantityElement) quantityElement.textContent = cantidad;
}

if (minusBtn) {
    minusBtn.addEventListener("click", () => {
        if (cantidad > 1) {
            cantidad--;
            actualizarCantidad();
        }
    });
}

if (plusBtn) {
    plusBtn.addEventListener("click", () => {
        if (cantidad < 99) {
            cantidad++;
            actualizarCantidad();
        }
    });
}


/* =========================================================
   AGREGAR AL CARRITO
   ========================================================= */

const addProductBtn = document.getElementById("addProductBtn");

if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
        if (typeof agregarAlCarrito !== "function") {
            console.error("No se encontró agregarAlCarrito().");
            return;
        }

        for (let i = 0; i < cantidad; i++) {
            agregarAlCarrito(producto.nombre, producto.precio);
        }

        mostrarToastProducto();
    });
}


/* =========================================================
   NOTIFICACIÓN
   ========================================================= */

let productoToastTimeout;

function mostrarToastProducto() {
    const toast = document.getElementById("toast");

    if (!toast) return;

    clearTimeout(productoToastTimeout);

    toast.textContent = cantidad === 1
        ? "Producto agregado al pedido ✓"
        : `${cantidad} unidades agregadas al pedido ✓`;

    toast.classList.add("show");

    productoToastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   MENÚ MOBILE
   ========================================================= */

const menuBtn = document.getElementById("productoMenuBtn");
const nav = document.getElementById("productoNav");

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("active");
        const menuAbierto = nav.classList.contains("active");
        menuBtn.textContent = menuAbierto ? "✕" : "☰";
        menuBtn.setAttribute("aria-label", menuAbierto ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuBtn.textContent = "☰";
            menuBtn.setAttribute("aria-label", "Abrir menú");
        });
    });
}