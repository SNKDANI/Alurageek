// Espera a que el contenido se cargue para ejecutar las funciones
document.addEventListener('DOMContentLoaded', () => {
    cargarEventListener();
    mostrarPrimerosProductos();
});

// Variables globales
let loadMoreBtn = document.querySelector('#cargar_mas');
let currentItem = 8;
const carrito = document.getElementById('cabecera_carrito');
const lista = document.querySelector('#lista_carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar_carrito');
let productosCarrito = [];
const cantidadCarrito = document.getElementById('cantidad-carrito');
const totalCarrito = document.getElementById('total-carrito');

// Evento para cargar más productos al hacer clic en "Cargar más"
loadMoreBtn.onclick = () => {
    mostrarMasProductos();
};

// Función para cargar los eventos
function cargarEventListener() {
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('productos_a_agregar')) {
            e.preventDefault();
            const elemento = e.target.closest('.productos_descripcion');
            leerDatosElemento(elemento);
        }
    });

    // Botón para vaciar el carrito
    vaciarCarritoBtn?.addEventListener('click', vaciarCarrito);

    // Botón para eliminar productos del carrito
    lista.addEventListener('click', eliminarElemento);
}

// Función para leer los datos del producto al hacer clic
function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.productos_precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id'),
    };
    insertarCarrito(infoElemento);
}

// Función para insertar un producto al carrito
function insertarCarrito(elemento) {
    const rowExistente = Array.from(lista.querySelectorAll('tr')).find(row => row.dataset.id === elemento.id);
    if (rowExistente) return;

    const row = document.createElement('tr');
    row.dataset.id = elemento.id;
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100" height="150px">
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            ${elemento.precio}
        </td>
        <td>
            <a href="#" class="borrar_elemento" data-id="${elemento.id}">X</a>
        </td>`;
    lista.appendChild(row);

    productosCarrito.push({
        id: elemento.id,
        titulo: elemento.titulo,
        precio: parseFloat(elemento.precio.replace('$', '')),
        imagen: elemento.imagen
    });

    actualizarContadorYTotal();
}

// Función para eliminar un producto del carrito
function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar_elemento')) {
        const fila = e.target.closest('tr');
        const idProducto = fila.dataset.id;

        productosCarrito = productosCarrito.filter(producto => producto.id !== idProducto);
        fila.remove();

        actualizarContadorYTotal();
    }
}

// Función para vaciar el carrito
function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    productosCarrito = [];
    actualizarContadorYTotal();
}

// Función para actualizar el contador y el total del carrito
function actualizarContadorYTotal() {
    const cantidad = productosCarrito.length;
    const total = productosCarrito.reduce((acc, producto) => acc + producto.precio, 0);
    
    cantidadCarrito.textContent = cantidad;
    totalCarrito.textContent = total.toFixed(2);
}

// Función para mostrar los primeros productos
function mostrarPrimerosProductos() {
    const productos = [...document.querySelectorAll('.productos_generales .productos_descripcion')];
    for (let i = 0; i < productos.length; i++) {
        if (i < 8) {
            productos[i].style.display = "inline-block";
        } else {
            productos[i].style.display = "none";
        }
    }
}

// Función para mostrar más productos
function mostrarMasProductos() {
    const productos = [...document.querySelectorAll('.productos_generales .productos_descripcion')];
    for (let i = currentItem; i < currentItem + 4; i++) {
        if (i < productos.length) {
            productos[i].style.display = "inline-block";
        }
    }
    currentItem += 4;

    if (currentItem >= productos.length) {
        loadMoreBtn.style.display = "none";
    }
}

// Función para inicializar los productos al cargar la página
window.onload = () => {
    let productosPredeterminados = [];
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    const contenedorProductos = document.getElementById('productos_generales');

    // Mostrar productos predeterminados
    productosPredeterminados.forEach((producto, index) => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('productos_descripcion');
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="productos_informacion_adicional">
                <h3>${producto.nombre}</h3>
                <p>${producto.categoria ? producto.categoria.toUpperCase() : 'Sin categoría'}</p>
                <p class="productos_precio">$${producto.precio}</p>
                <a href="#" class="productos_a_agregar btn-3" data-id="${index}" role="button">Agregar al carrito</a>
            </div>
        `;
        contenedorProductos.appendChild(productoDiv);
    });

    // Mostrar productos nuevos (agregados por el usuario)
    if (productos.length > 0) {
        productos.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('productos_descripcion');
            productoDiv.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="productos_informacion_adicional">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.categoria ? producto.categoria.toUpperCase() : 'Sin categoría'}</p>
                    <p class="productos_precio">$${producto.precio}</p>
                    <a href="#" class="productos_a_agregar btn-3" data-id="${index}" role="button">Agregar al carrito</a>
                    <button class="eliminar_producto" data-id="${index}">Eliminar</button>
                </div>
            `;
            contenedorProductos.appendChild(productoDiv);
        });
    }

    // Función para eliminar productos
    const botonesEliminar = document.querySelectorAll('.eliminar_producto');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-id');
            productos.splice(index, 1);
            localStorage.setItem('productos', JSON.stringify(productos));
            window.location.reload();
        });
    });
};

// Productos de ejemplo
const productos = [
    { id: 1, nombre: "Camisa", categoria: "ropa", precio: 200, img: "./assets/camisa (1).png" },
    { id: 2, nombre: "Camisa Azul", categoria: "ropa", precio: 200, img: "./assets/camisa (3).png" },
    { id: 3, nombre: "Camisa Roja", categoria: "ropa", precio: 200, img: "./assets/camisa (4).png" },
    { id: 4, nombre: "Camisa de Invierno", categoria: "ropa", precio: 200, img: "./assets/camisa-de-invierno.png" },
    { id: 5, nombre: "Camisa Blanca", categoria: "ropa", precio: 200, img: "./assets/camisa.png" },
    { id: 6, nombre: "Camisa Elegante", categoria: "ropa", precio: 200, img: "./assets/ropa.png" },
    { id: 7, nombre: "Suéter", categoria: "ropa", precio: 200, img: "./assets/sueter.png" },
    { id: 8, nombre: "Tela Decorativa", categoria: "ropa", precio: 200, img: "./assets/tela.png" },
    { id: 9, nombre: "Pantalones", categoria: "ropa", precio: 200, img: "./assets/pantalones.png" },
    { id: 10, nombre: "Pantalones de Vestir", categoria: "ropa", precio: 200, img: "./assets/pantalones (1).png" },
    { id: 11, nombre: "Alimento Decorativo", categoria: "accesorios", precio: 500, img: "./assets/alimento.png" },
    { id: 12, nombre: "Joyas Modernas", categoria: "accesorios", precio: 500, img: "./assets/joyas (1).png" },
    { id: 13, nombre: "Reloj de Bolsillo", categoria: "accesorios", precio: 500, img: "./assets/reloj-de-bolsillo.png" },
    { id: 14, nombre: "Reloj de Mano", categoria: "accesorios", precio: 500, img: "./assets/reloj-de-mano.png" },
    { id: 15, nombre: "Utensilios de Cocina", categoria: "accesorios", precio: 500, img: "./assets/cocina.png" },
    { id: 16, nombre: "Juego de Cocina", categoria: "accesorios", precio: 500, img: "./assets/cocina (1).png" },
    { id: 17, nombre: "Colgante Elegante", categoria: "accesorios", precio: 500, img: "./assets/pendant-37407_1280.png" },
    { id: 18, nombre: "Collar de Oro", categoria: "accesorios", precio: 500, img: "./assets/joyas.png" },

];

// Función para generar productos
const contenedorProductos = document.getElementById("productos_generales");
const enlacesCategorias = document.querySelectorAll("[data-categoria]");

function generarProductos(categoria = "todos") {
    contenedorProductos.innerHTML = ""; // Limpia el contenedor
    const productosFiltrados = categoria === "todos"
        ? productos
        : productos.filter(producto => producto.categoria === categoria);

    productosFiltrados.forEach(producto => {
        const productoHTML = `
            <div class="productos_descripcion">
                <img src="${producto.img}" alt="${producto.nombre}">
                <div class="productos_informacion_adicional">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.categoria ? producto.categoria.toUpperCase() : 'Sin categoría'}</p>
                    <p class="productos_precio">$${producto.precio}</p>
                    <a href="#" class="productos_a_agregar btn-3" data-id="${producto.id}">Agregar al carrito</a>
                </div>
            </div>`;
        contenedorProductos.innerHTML += productoHTML;
    });
}

// Mostrar todos los productos al cargar la página
generarProductos();

enlacesCategorias.forEach(enlace => {
    enlace.addEventListener("click", e => {
        e.preventDefault();
        const categoria = e.target.getAttribute("data-categoria");
        generarProductos(categoria);
    });
});