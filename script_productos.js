document.getElementById('form_producto').addEventListener('submit', (e) => {
    e.preventDefault(); 

    // Obtener los valores del formulario
    const imagenInput = document.getElementById('imagen');
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;

    if (!categoria) {
        alert('Por favor, seleccione una categoría.');
        return;
    }
    
    const precio = document.getElementById('precio').value;

    // Convertir la imagen a base64
    const reader = new FileReader();
    reader.onload = function(event) {
        const imagenBase64 = event.target.result;

        // Crear el nuevo producto
        const nuevoProducto = {
            imagen: imagenBase64,  // Guardamos la imagen como base64
            nombre: nombre,
            categoria: categoria,
            precio: precio
        };

        // Recuperar productos existentes del localStorage
        let productos = JSON.parse(localStorage.getItem('productos')) || [];

        // Agregar el nuevo producto a la lista
        productos.push(nuevoProducto);

        // Guardar los productos actualizados en localStorage
        localStorage.setItem('productos', JSON.stringify(productos));

        // Mostrar la imagen cargada (para que el usuario pueda verla inmediatamente)
        const imagenPreview = document.createElement('img');
        imagenPreview.src = imagenBase64;
        imagenPreview.alt = nombre;
        imagenPreview.style.maxWidth = '200px';

        // Agregar la imagen al mensaje de éxito
        const mensajeExito = document.getElementById('mensaje_exito');
        mensajeExito.insertBefore(imagenPreview, mensajeExito.firstChild);

        // Mostrar el mensaje de éxito y ocultar el formulario
        document.getElementById('form_producto').style.display = 'none';
        mensajeExito.style.display = 'block';
    };

    // Leer la imagen como base64
    reader.readAsDataURL(imagenInput.files[0]);
});

// Función para mostrar productos guardados
function mostrarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const contenedorProductos = document.getElementById('productos_generales');

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('productos_descripcion');
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 200px;">
            <div class="productos_informacion_adicional">
                <h3>${producto.nombre}</h3>
                <p>${producto.categoria.toUpperCase()}</p>
                <p class="productos_precio">$${producto.precio}</p>
                <a href="#" class="productos_a_agregar btn-3" data-id="${producto.id}">Agregar al carrito</a>
            </div>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

// Llamar a la función para mostrar productos al cargar la página
mostrarProductos();
