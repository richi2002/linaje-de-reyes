/* =========================================================
   LINAJE DE REYES
   FUNCIONES DEL CATÁLOGO
   ========================================================= */


/* =========================================================
   ELEMENTOS DEL CATÁLOGO
   ========================================================= */

const catalogFilters = document.querySelectorAll(".catalog-filter");
const productSearch = document.getElementById("productSearch");
const noProducts = document.getElementById("noProducts");
const catalogGrid = document.getElementById("catalogGrid");


/* =========================================================
   CARGAR PRODUCTOS EN EL CATÁLOGO
   ========================================================= */

function cargarCatalogo() {
    if (!catalogGrid) return;

    const productos = Object.values(PRODUCTOS_DB);

    catalogGrid.innerHTML = productos.map(p => {
        const bgClass = getProductBgClass(p.categoria);
        const precioTexto = p.precioTexto || `S/ ${p.precio.toFixed(2)}`;
        const precioLabel = p.precioTexto ? "Precio" : "Precio referencial";

        return `
            <article class="catalog-product" data-category="${p.categoria}" data-name="${p.nombre.toLowerCase()}">
                <div class="catalog-product-image ${bgClass}">
                    <span>${p.emoji}</span>
                    ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
                    <a class="quick-view" href="./producto.html?producto=${p.id}">Ver detalle →</a>
                </div>
                <div class="catalog-product-info">
                    <span class="catalog-product-category">${p.categoriaNombre.toUpperCase()}</span>
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion}</p>
                    <div class="catalog-product-footer">
                        <div><small>${precioLabel}</small><strong>${precioTexto}</strong></div>
                        <button class="catalog-add" onclick="agregarAlCarrito('${p.nombre}', ${p.precio})" aria-label="Agregar ${p.nombre}">+</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}


/* =========================================================
   FILTRAR CATÁLOGO
   ========================================================= */

function filtrarCatalogo() {
    const filtroActivo = document.querySelector(".catalog-filter.active");
    const categoriaActiva = filtroActivo ? filtroActivo.dataset.category : "todos";
    const busqueda = productSearch ? productSearch.value.toLowerCase().trim() : "";

    let encontrados = 0;
    const productos = document.querySelectorAll(".catalog-product");

    productos.forEach(producto => {
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
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar productos primero
    cargarCatalogo();

    // 2. Aplicar filtro inicial
    filtrarCatalogo();

    // 3. Configurar filtros por categoría
    catalogFilters.forEach(filtro => {
        filtro.addEventListener("click", () => {
            catalogFilters.forEach(item => item.classList.remove("active"));
            filtro.classList.add("active");
            filtrarCatalogo();
        });
    });

    // 4. Configurar buscador
    if (productSearch) {
        productSearch.addEventListener("input", filtrarCatalogo);
    }

    // 5. Configurar menú móvil del catálogo
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
});