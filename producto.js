/* =========================================================
   LINAJE DE REYES
   PÁGINA DE PRODUCTO
   ========================================================= */

/* =========================================================
   CATÁLOGO DE PRODUCTOS
   ========================================================= */

const productos = {
    /* ========== PANADERÍA ========== */
    panfrances: {
        nombre: "Pan Francés",
        precio: 0.50,
        categoria: "Panadería",
        emoji: "🥖",
        descripcion: "Nuestro clásico pan francés, elaborado para acompañar tus desayunos, comidas y momentos especiales. Crujiente por fuera, suave por dentro."
    },
    croissant: {
        nombre: "Croissant",
        precio: 3.50,
        categoria: "Panadería",
        emoji: "🥐",
        descripcion: "Delicado, dorado y de textura ligera. Un clásico ideal para comenzar el día con el sabor de LINAJE DE REYES."
    },
    panchalla: {
        nombre: "Pan Challa",
        precio: 1.00,
        categoria: "Panadería",
        emoji: "🍞",
        descripcion: "Pan tradicional peruano, esponjoso y ligeramente dulce. Ideal para desayunos y reuniones familiares."
    },
    pandecoco: {
        nombre: "Pan de Coco",
        precio: 0.90,
        categoria: "Panadería",
        emoji: "🥥",
        descripcion: "Dulce y delicioso, con el auténtico sabor del coco. Perfecto para acompañar el café de la tarde."
    },
    empanada: {
        nombre: "Empanada",
        precio: 3.00,
        categoria: "Panadería",
        emoji: "🥟",
        descripcion: "Empanadas de pollo, carne o queso, horneadas al momento con masa crujiente y relleno jugoso."
    },
    panartesanal: {
        nombre: "Pan Artesanal",
        precio: 8.00,
        categoria: "Panadería",
        emoji: "🥯",
        descripcion: "Pan de masa madre, multigrano o con avena. Elaborado con dedicación y técnicas tradicionales."
    },

    /* ========== PASTELERÍA ========== */
    torta: {
        nombre: "Porción de Torta",
        precio: 7.00,
        categoria: "Pastelería",
        emoji: "🍰",
        descripcion: "Una deliciosa porción de torta para disfrutar en cualquier momento del día. Elige tu sabor favorito."
    },
    galletas: {
        nombre: "Galletas",
        precio: 2.50,
        categoria: "Pastelería",
        emoji: "🍪",
        descripcion: "Galletas ideales para acompañar un café, compartir o simplemente darte un gusto. Crujientes y sabrosas."
    },
    piedelimon: {
        nombre: "Pie de Limón",
        precio: 9.00,
        categoria: "Pastelería",
        emoji: "🍋",
        descripcion: "Refrescante y cremoso, el equilibrio perfecto entre ácido y dulce. Con merengue suave y base crujiente."
    },

    /* ========== POSTRES ========== */
    postres: {
        nombre: "Postres Variados",
        precio: 5.00,
        categoria: "Postres",
        emoji: "🍮",
        descripcion: "Una selección de dulces y postres pensados para disfrutar de un momento especial."
    },
    cheesecake: {
        nombre: "Cheesecake",
        precio: 13.00,
        categoria: "Postres",
        emoji: "🧁",
        descripcion: "De maracuyá, fresa o frutos rojos. Cremoso, suave y con el equilibrio perfecto de sabores."
    },
    quesillo: {
        nombre: "Quesillo",
        precio: 10.50,
        categoria: "Postres",
        emoji: "🍯",
        descripcion: "Postre tradicional con textura suave y sabor inconfundible. Bañado en caramelo dorado."
    },

    /* ========== TORTAS ========== */
    tortapersonalizada: {
        nombre: "Torta Personalizada",
        precio: 50.00,
        categoria: "Tortas",
        emoji: "🎂",
        descripcion: "Diseñamos tortas para celebraciones y momentos especiales. Precio referencial desde S/ 50. Coordina el diseño y sabor por WhatsApp."
    },
    tortachocolate: {
        nombre: "Torta de Chocolate",
        precio: 11.00,
        categoria: "Tortas",
        emoji: "🍫",
        descripcion: "Húmeda, intensa y con el mejor sabor a chocolate. Porción individual perfecta para los amantes del cacao."
    },
    tresleches: {
        nombre: "Torta Tres Leches",
        precio: 10.00,
        categoria: "Tortas",
        emoji: "🥛",
        descripcion: "Suave, húmeda y con el equilibrio perfecto de sabores. Un clásico que nunca falla."
    },

    /* ========== BEBIDAS ========== */
    cafe: {
        nombre: "Café",
        precio: 4.00,
        categoria: "Bebidas",
        emoji: "☕",
        descripcion: "Café pasado o americano, preparado al momento. Perfecto para acompañar tus panes y postres."
    },
    chocolate: {
        nombre: "Chocolate Caliente",
        precio: 5.00,
        categoria: "Bebidas",
        emoji: "🍫",
        descripcion: "Chocolate caliente cremoso, perfecto para los días fríos. Elaborado con cacao de calidad."
    },
    infusiones: {
        nombre: "Infusiones",
        precio: 3.00,
        categoria: "Bebidas",
        emoji: "🍵",
        descripcion: "Manzanilla, anís, hierba luisa y más. Aromáticas y reconfortantes, ideales para cualquier momento."
    }
};


/* =========================================================
   OBTENER PRODUCTO DESDE LA URL
   ========================================================= */

const params = new URLSearchParams(window.location.search);
const productoID = params.get("producto") || "panfrances";
const producto = productos[productoID] || productos.panfrances;


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

if (productName) productName.textContent = producto.nombre;
if (productPrice) productPrice.textContent = producto.precio.toFixed(2);
if (productCategory) productCategory.textContent = producto.categoria.toUpperCase();
if (productEmoji) productEmoji.textContent = producto.emoji;
if (productDescription) productDescription.textContent = producto.descripcion;
if (breadcrumbProduct) breadcrumbProduct.textContent = producto.nombre;


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