$(document).ready(function() {
    // Inicializar el carrito y el total
    updateCart();

    // Evento de pago
    $('#checkout-btn').click(function() {
        alert('Redirigiendo a la página de pago...');
    });

    // Evento para eliminar del carrito
    $(document).on('click', '.remove-item', function() {
        const productId = $(this).data('id');
        eliminarDelCarrito(productId);
    });
});

// Declarar totalPrice como variable global
let totalPrice = 0;

function updateCart() {
    // Obtener el carrito desde el localStorage cada vez que se actualiza
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = $('#cart-items');
    cartItemsDiv.empty(); // Vaciar el contenido actual del carrito
    totalPrice = 0; // Reiniciar el total del precio en cada actualización

    // Crear un objeto para contar las cantidades
    cart.forEach(product => {
        // Verificar que el producto tenga toda la información necesaria antes de mostrarlo
        if (product && product.id_producto && product.nombre && product.cantidad && product.precio) {
            const quantity = product.cantidad;
            cartItemsDiv.append(`
                <div class="row mb-2">
                    <div class="col-md-2">
                        <img src="${product.foto}" alt="${product.nombre}" class="img-fluid" style="max-height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-6">
                        <span class="small">${product.nombre}</span>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${product.id_producto}">-</button>
                            <input type="text" class="form-control quantity-input mx-2" value="${quantity}" data-id="${product.id_producto}" readonly style="width: 50px; text-align: center;height: 32px;">
                            <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${product.id_producto}">+</button>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex flex-column align-items-start">
                        <span class="text-success small">$${(product.precio * quantity).toFixed(2)}</span>
                        <button class="btn btn-link remove-item p-0 mt-2" data-id="${product.id_producto}">
                            <i class="fas fa-trash text-danger"></i>
                        </button>
                    </div>
                </div>
            `);
            totalPrice += product.precio * quantity;
        }
    });

    if (totalPrice === 0) {
        $('#total-price').text("$0");
    } else {
        $('#total-price').text(`$${totalPrice.toFixed(2)}`);
    }

  
    updateCartCount(cart.length);
}



function eliminarDelCarrito(productId) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Debe iniciar sesión para realizar esta acción.");
        return;
    }

    // Eliminar producto del carrito en la base de datos
    fetch(`http://localhost:8080/carrito/borrarProducto/${usuario.id_cliente}/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => { throw new Error(data.error) });
        }
        return response.json();
    })
    .then(() => {
        // Eliminar el producto de localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(product => product.id_producto !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar la vista del carrito
        updateCart();
    })
    .catch(error => console.error('Error al eliminar el producto del carrito:', error));
}


function updateCartCount(count) {
    const cartCountElement = $('#cart-count');

    if (count > 0) {
        cartCountElement.css('visibility', 'visible'); // Mostrar el círculo rojo
    } else {
        cartCountElement.css('visibility', 'hidden'); // Ocultar el círculo si no hay productos
    }
}


$(document).on('click', '.increase-quantity', function() {
    const productId = $(this).data('id');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Debe iniciar sesión para realizar esta acción.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Encontrar el producto en el carrito y aumentar su cantidad
    cart = cart.map(product => {
        if (product.id_producto === productId) {
            product.cantidad += 1;
        }
        return product;
    });
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar la cantidad en la base de datos
    fetch('http://localhost:8080/carrito/agregarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_cliente: usuario.id_cliente,
            id_producto: productId,
            cantidad: 1 // Incrementar la cantidad en 1
        })
    })
    .then(() => {
        // Actualizar la vista del carrito
        updateCart();
    })
    .catch(error => console.error('Error al actualizar la cantidad en la base de datos:', error));
});

$(document).on('click', '.decrease-quantity', function() {
    const productId = $(this).data('id');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Debe iniciar sesión para realizar esta acción.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Encontrar el producto en el carrito y disminuir su cantidad
    cart = cart.map(product => {
        if (product.id_producto === productId && product.cantidad > 1) {
            product.cantidad -= 1;
        }
        return product;
    });
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar la cantidad en la base de datos
    fetch('http://localhost:8080/carrito/agregarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_cliente: usuario.id_cliente,
            id_producto: productId,
            cantidad: -1 // Disminuir la cantidad en 1
        })
    })
    .then(() => {
        // Actualizar la vista del carrito
        updateCart();
    })
    .catch(error => console.error('Error al actualizar la cantidad en la base de datos:', error));
});


// PayPal botón
paypal.Buttons({
    style:{
        color: 'blue',
        shape: 'pill',
        label: 'pay'
    },
    createOrder: function(data, actions) {
        // Aquí usamos el totalPrice calculado dinámicamente
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalPrice.toFixed(2) // Convertir el total a dos decimales
                }
            }]
        });
    },

    onApprove: function(data, actions){
        actions.order.capture().then(function(detalles){
            alert('Pago realizado con éxito');
            console.log(detalles);
        });
    },

    onCancel: function(data){
        alert("Pago cancelado");
        console.log(data);
    }
}).render('#paypal-button-container');
