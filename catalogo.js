/* =========================================================
   LINAJE DE REYES
   FUNCIONES DEL CATÁLOGO
   ========================================================= */

/* =========================================================
   01. ELEMENTOS DEL CATÁLOGO
   ========================================================= */

const catalogProducts = document.querySelectorAll(".catalog-product");
const catalogFilters = document.querySelectorAll(".catalog-filter");
const productSearch = document.getElementById("productSearch");
const noProducts = document.getElementById("noProducts");


/* =========================================================
   02. FILTRAR CATÁLOGO
   ========================================================= */

function filtrarCatalogo() {
    const filtroActivo = document.querySelector(".catalog-filter.active");
    const categoriaActiva = filtroActivo ? filtroActivo.dataset.category : "todos";
    const busqueda = productSearch ? productSearch.value.toLowerCase().trim() : "";

    let encontrados = 0;

    catalogProducts.forEach(producto => {
        const categoria = producto.dataset.category || "";
        const nombre = producto.dataset.name || "";

        const coincideCategoria = categoriaActiva === "todos" || categoria === categoriaActiva;
        const coincideBusqueda = nombre.includes(busqueda);

        const mostrar = coincideCategoria && coincideBusqueda;

        if (mostrar) {
            producto.style.display = "";
            encontrados++;
        } else {
            producto.style.display = "none";
        }
    });

    if (noProducts) {
        noProducts.style.display = encontrados === 0 ? "block" : "none";
    }
}


/* =========================================================
   03. FILTROS POR CATEGORÍA
   ========================================================= */

catalogFilters.forEach(filtro => {
    filtro.addEventListener("click", () => {
        catalogFilters.forEach(item => item.classList.remove("active"));
        filtro.classList.add("active");
        filtrarCatalogo();
    });
});


/* =========================================================
   04. BUSCADOR
   ========================================================= */

if (productSearch) {
    productSearch.addEventListener("input", filtrarCatalogo);
}


/* =========================================================
   05. AGREGAR PRODUCTO AL CARRITO
   ========================================================= */

function agregarProductoCatalogo(nombre, precio) {
    if (typeof agregarAlCarrito !== "function") {
        console.error("No se encontró la función agregarAlCarrito().");
        return;
    }
    agregarAlCarrito(nombre, Number(precio));
}


/* =========================================================
   06. PRODUCTO SELECCIONADO
   ========================================================= */

let productoSeleccionado = null;


/* =========================================================
   07. ABRIR MODAL DE PRODUCTO
   ========================================================= */

function mostrarProducto(nombre, categoria, precio, descripcion, icono) {
    const modal = document.getElementById("productModal");
    const modalName = document.getElementById("modalName");
    const modalCategory = document.getElementById("modalCategory");
    const modalDescription = document.getElementById("modalDescription");
    const modalPrice = document.getElementById("modalPrice");
    const modalImage = document.getElementById("modalImage");
    const modalWhatsApp = document.getElementById("modalWhatsApp");

    if (!modal) return;

    if (modalName) modalName.textContent = nombre;
    if (modalCategory) modalCategory.textContent = categoria.toUpperCase();
    if (modalDescription) modalDescription.textContent = descripcion;
    if (modalPrice) modalPrice.textContent = `S/ ${Number(precio).toFixed(2)}`;
    if (modalImage) modalImage.textContent = icono;

    /* WhatsApp directo */
    if (modalWhatsApp) {
        const mensaje = `Hola, me interesa el producto: *${nombre}* (S/ ${Number(precio).toFixed(2)}). ¿Podrían darme más información?`;
        modalWhatsApp.href = `https://wa.me/920898321?text=${encodeURIComponent(mensaje)}`;
    }

    productoSeleccionado = {
        nombre: nombre,
        precio: Number(precio)
    };

    modal.classList.add("active");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
}


/* =========================================================
   08. CERRAR MODAL
   ========================================================= */

function cerrarProducto() {
    const modal = document.getElementById("productModal");

    if (!modal) return;

    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";

    productoSeleccionado = null;
}


/* =========================================================
   09. BOTÓN AGREGAR DESDE MODAL
   ========================================================= */

const modalAdd = document.getElementById("modalAdd");

if (modalAdd) {
    modalAdd.addEventListener("click", () => {
        if (!productoSeleccionado) return;

        agregarProductoCatalogo(productoSeleccionado.nombre, productoSeleccionado.precio);
        cerrarProducto();
    });
}


/* =========================================================
   10. ESCAPE PARA CERRAR MODAL
   ========================================================= */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        cerrarProducto();
    }
});


/* =========================================================
   11. MENÚ MÓVIL DEL CATÁLOGO
   ========================================================= */

const catalogMenuBtn = document.getElementById("catalogMenuBtn");
const catalogNav = document.querySelector(".nav");

if (catalogMenuBtn && catalogNav) {
    catalogMenuBtn.addEventListener("click", () => {
        catalogNav.classList.toggle("active");
        const menuAbierto = catalogNav.classList.contains("active");
        catalogMenuBtn.textContent = menuAbierto ? "✕" : "☰";
        catalogMenuBtn.setAttribute("aria-label", menuAbierto ? "Cerrar menú" : "Abrir menú");
    });

    catalogNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            catalogNav.classList.remove("active");
            catalogMenuBtn.textContent = "☰";
            catalogMenuBtn.setAttribute("aria-label", "Abrir menú");
        });
    });
}


/* =========================================================
   12. INICIALIZACIÓN
   ========================================================= */

filtrarCatalogo();