$(document).ready(function() {
    // Verificar si el usuario está autenticado
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Si no hay usuario en localStorage, forzar el login
    if (!usuario) {
        mostrarLoginObligatorio();
    } else {
        // Si el usuario ya está autenticado, cargar la página normalmente
        cargarProductos();
        cargarCarritoDelUsuario(usuario.id_cliente); // Cargar el carrito del usuario autenticado
        actualizarCuentaCarrito();

        // Cambiar el comportamiento del ícono de login
        document.getElementById('icon-login').onclick = function() {
            window.location.href = 'perfil.html'; // Redirigir a la página de perfil
        };
    }
});

// Función para mostrar el popup de login y bloquear cualquier intento de cierre
function mostrarLoginObligatorio() {
    document.getElementById('login-popup').style.display = 'block';
    document.getElementById('login-popup-overlay').style.display = 'block';

    // Desactivar el botón de cerrar y el clic en el fondo
    document.getElementById('close-login').style.display = 'none'; // Ocultar el botón de cerrar

    // Desactivar el cierre al hacer clic en el overlay de fondo
    document.getElementById('login-popup-overlay').onclick = function() {
        // No hacemos nada aquí para evitar el cierre
    };
}

// Función para cargar los productos si el usuario está autenticado
function cargarProductos() {
    $.get('http://localhost:8080/productos/verProductos', function(data) {
        const productList = $('#product-list');
        productList.empty();
        data.forEach(product => {
            productList.append(`
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <a href="producto.html?id=${product.id_producto}">
                            <div class="image-container">
                                <img src="${product.foto}" class="card-img-top zoom-effect" alt="${product.nombre}">
                            </div>
                        </a>
                        <div class="card-body">
                            <h5 class="card-title">${product.nombre}</h5>
                            <p class="card-text">${product.descripcion}</p>
                            <p class="card-text">
                                <span class="text-muted"><s>$${product.precio_comparacion}</s></span>
                                <span class="ms-2">$${product.precio}</span>
                            </p>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id_producto}">Agregar al Carrito</button>
                        </div>
                    </div>
                </div>
            `);
        });

        // Evento para agregar al carrito
        $('.add-to-cart').click(function(event) {
            event.preventDefault();
            const productId = $(this).data('id');
            agregarAlCarrito(productId);
        });
    });
}


// Modificar función de agregar al carrito para actualizar en la base de datos
function agregarAlCarrito(productId, cantidad = 1) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Debe iniciar sesión para agregar productos al carrito.");
        return;
    }

    // Obtener los detalles del producto desde el servidor antes de agregarlo al carrito
    fetch(`http://localhost:8080/productos/verProducto/${productId}`)
        .then(response => response.json())
        .then(product => {
            if (!product || !product.id_producto) {
                console.error('Error al obtener los detalles del producto:', product);
                return;
            }

            // Obtener el carrito actual desde localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.findIndex(item => item.id_producto === productId);
            if (existingProductIndex !== -1) {
                // Si el producto ya existe en el carrito, aumentar su cantidad
                cart[existingProductIndex].cantidad += cantidad;
            } else {
                // Si el producto no existe en el carrito, agregarlo con todos sus detalles
                cart.push({
                    id_producto: product.id_producto,
                    nombre: product.nombre,
                    cantidad: cantidad,
                    precio: product.precio,
                    foto: product.foto
                });
            }

            // Guardar el carrito actualizado en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            actualizarCuentaCarrito();

            // Actualizar producto en el carrito de la base de datos
            fetch('http://localhost:8080/carrito/agregarProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_cliente: usuario.id_cliente,
                    id_producto: productId,
                    cantidad: cantidad
                })
            })
            .then(() => {
                // Llamar a la función para actualizar la vista del carrito sin duplicar
                updateCart();
            })
            .catch(error => console.error('Error al enviar la solicitud al servidor:', error));
        })
        .catch(error => console.error('Error al obtener los detalles del producto:', error));
}





// Función para actualizar el contador de productos en el carrito
function actualizarCuentaCarrito() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    $('#cart-count').text(cart.length);
}

function eliminarDelCarrito(productId) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Debe iniciar sesión para realizar esta acción.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    actualizarCuentaCarrito();

    // Eliminar producto del carrito en la base de datos
    fetch(`http://localhost:8080/carrito/borrarProducto/${usuario.id_cliente}/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!response.ok) {
            console.error('Error al eliminar el producto del carrito:', data.error);
        } else {
            console.log('Producto eliminado correctamente del carrito.');
        }
    })
    .catch(error => console.error('Error al enviar la solicitud al servidor:', error));
}

// Mostrar el popup de login
document.getElementById('open-login').onclick = function() {
    document.getElementById('login-popup').style.display = 'block';
    document.getElementById('login-popup-overlay').style.display = 'block';
};

// Cerrar el popup de login
document.getElementById('close-login').onclick = function() {
    document.getElementById('login-popup').style.display = 'none';
    document.getElementById('login-popup-overlay').style.display = 'none';
};

document.getElementById('login-popup-overlay').onclick = function() {
    document.getElementById('login-popup').style.display = 'none';
    document.getElementById('login-popup-overlay').style.display = 'none';
};


