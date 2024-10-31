// Obtener el parámetro de ID de producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

$(document).ready(function() {
    // Cargar los datos del producto al cargar la página
    cargarDatosProducto(productId);

    // Manejar el evento de aumento o disminución de cantidad
    $('.increase-quantity').click(function() {
        let cantidad = parseInt($('#producto-cantidad').val());
        $('#producto-cantidad').val(cantidad + 1);
    });

    $('.decrease-quantity').click(function() {
        let cantidad = parseInt($('#producto-cantidad').val());
        if (cantidad > 1) {
            $('#producto-cantidad').val(cantidad - 1);
        }
    });

    // Asignar al botón de agregar al carrito, utilizando la función de `main.js`
    $('#agregar-carrito').off('click').on('click', function() {
        const cantidad = parseInt($('#producto-cantidad').val());
        agregarAlCarrito(productId, cantidad); // Llamar la función desde `main.js`
    });
});

function cargarDatosProducto(id) {
    // Llamada para obtener los datos del producto desde el backend
    $.get(`http://localhost:8080/productos/verProducto/${id}`, function(producto) {
        $('#producto-imagen').attr('src', producto.foto);
        $('#producto-nombre').text(producto.nombre);
        $('#producto-precio').text(`$${producto.precio}`);
        $('#producto-descripcion').text(producto.descripcion);

        // Asignar el ID de producto al botón de agregar al carrito (esto es opcional, solo por referencia)
        $('#agregar-carrito').data('id', producto.id_producto);
    }).fail(function() {
        alert("Error al cargar los datos del producto");
    });
}
