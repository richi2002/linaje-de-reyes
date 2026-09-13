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
   CLASE DE FONDO ESPECÍFICA DEL CATÁLOGO
   (catalogo.css define .bread-product, .cake-product, etc.)
   ========================================================= */

function getProductBgClassCatalog(categoria) {
    const clases = {
        panaderia: "bread-product",
        pasteleria: "cake-product",
        postres: "dessert-product",
        tortas: "custom-product",
        bebidas: "cookie-product"
    };
    return clases[categoria] || "bread-product";
}


/* =========================================================
   COMPARTIR PRODUCTO POR WHATSAPP
   ========================================================= */

function compartirProductoWhatsApp(nombre, precio) {
    const urlProducto = `https://richi2002.github.io/linaje-de-reyes/catalogo.html`;

    const mensaje =
        `🥖 *LINAJE DE REYES*\n\n` +
        `Mira este producto:\n\n` +
        `*${nombre}*\n` +
        `💰 Precio: S/ ${Number(precio).toFixed(2)}\n\n` +
        `🛒 Pídelo aquí:\n${urlProducto}`;

    /* Si el navegador soporta Web Share API, usarla (móvil) */
    if (navigator.share) {
        navigator.share({
            title: `LINAJE DE REYES — ${nombre}`,
            text: `Mira este producto: ${nombre} — S/ ${Number(precio).toFixed(2)}`,
            url: urlProducto
        }).catch(() => {
            /* Si falla o el usuario cancela, no hacemos nada */
        });
        return;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}


/* =========================================================
   CARGAR PRODUCTOS EN EL CATÁLOGO
   ========================================================= */

function cargarCatalogo() {
    if (!catalogGrid) return;

    if (typeof PRODUCTOS_DB === "undefined") {
        console.error("PRODUCTOS_DB no está definido. ¿Falta script.js?");
        return;
    }

    const productos = Object.values(PRODUCTOS_DB);

    catalogGrid.innerHTML = productos.map(p => {
        const bgClass = getProductBgClassCatalog(p.categoria);
        const precioTexto = p.precioTexto || `S/ ${p.precio.toFixed(2)}`;
        const precioLabel = p.precioTexto ? "Precio" : "Precio referencial";
        const nombreEscapado = p.nombre.replace(/'/g, "\\'");

        return `
            <article class="catalog-product" data-category="${p.categoria}" data-name="${escapeHTML(p.nombre.toLowerCase())}">
                <div class="catalog-product-image ${bgClass}">
                    <span>${p.emoji}</span>
                    ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}

                    <button
                        class="favorite-btn"
                        data-favorito="${escapeHTML(p.nombre)}"
                        onclick="toggleFavorito('${nombreEscapado}', event)"
                        aria-label="Agregar ${p.nombre} a favoritos"
                        aria-pressed="false"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>

                    <button
                        class="share-btn"
                        onclick="compartirProductoWhatsApp('${nombreEscapado}', ${p.precio})"
                        aria-label="Compartir ${p.nombre} por WhatsApp"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                    </button>

                    <a class="quick-view" href="./producto.html?producto=${p.id}">Ver detalle →</a>
                </div>
                <div class="catalog-product-info">
                    <span class="catalog-product-category">${p.categoriaNombre.toUpperCase()}</span>
                    <h3>${escapeHTML(p.nombre)}</h3>
                    <p>${escapeHTML(p.descripcion)}</p>
                    <div class="catalog-product-footer">
                        <div><small>${precioLabel}</small><strong>${precioTexto}</strong></div>
                        <button class="catalog-add" onclick="agregarAlCarrito('${nombreEscapado}', ${p.precio})" aria-label="Agregar ${p.nombre}">+</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    /* Actualizar botones de favoritos después de cargar */
    if (typeof actualizarBotonesFavoritos === "function") {
        actualizarBotonesFavoritos();
    }
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
    const noFavorites = document.getElementById("noFavorites");

    productos.forEach(producto => {
        const categoria = producto.dataset.category || "";
        const nombre = producto.dataset.name || "";
        const nombreOriginal = producto.querySelector("h3")?.textContent || "";

        let coincideCategoria = false;

        if (categoriaActiva === "todos") {
            coincideCategoria = true;
        } else if (categoriaActiva === "favoritos") {
            coincideCategoria = esFavorito(nombreOriginal);
        } else {
            coincideCategoria = categoria === categoriaActiva;
        }

        const coincideBusqueda = nombre.includes(busqueda);

        const mostrar = coincideCategoria && coincideBusqueda;

        if (mostrar) {
            producto.style.display = "";
            encontrados++;
        } else {
            producto.style.display = "none";
        }
    });

    /* Manejo especial de "sin resultados" */
    if (encontrados === 0) {
        if (categoriaActiva === "favoritos" && typeof favoritos !== "undefined" && favoritos.length === 0) {
            if (noProducts) noProducts.style.display = "none";
            if (noFavorites) noFavorites.style.display = "block";
        } else {
            if (noProducts) noProducts.style.display = "block";
            if (noFavorites) noFavorites.style.display = "none";
        }
    } else {
        if (noProducts) noProducts.style.display = "none";
        if (noFavorites) noFavorites.style.display = "none";
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
        catalogFilters.forEach(item => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        });
        filtro.classList.add("active");
        filtro.setAttribute("aria-pressed", "true");
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
    catalogMenuBtn.setAttribute("aria-expanded", menuAbierto);
});

catalogNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        catalogNav.classList.remove("active");
        catalogMenuBtn.textContent = "☰";
        catalogMenuBtn.setAttribute("aria-label", "Abrir menú");
        catalogMenuBtn.setAttribute("aria-expanded", "false");
    });
});
    }
});