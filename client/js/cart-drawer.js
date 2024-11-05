// Abrir el pop-up del carrito
$('#open-cart').click(function() {
    updateCart(); // Llama a la función para actualizar el carrito
    $('#cart-popup').addClass('active'); // Agrega la clase 'active' para mostrar
    $('#cart-popup-overlay').fadeIn(); // Mostrar la superposición
});

// Cerrar el pop-up del carrito
$('#close-cart').click(function() {
    $('#cart-popup').removeClass('active'); // Remueve la clase 'active' para ocultar
    $('#cart-popup-overlay').fadeOut(); // Ocultar la superposición
});

// Cerrar el pop-up si se hace clic fuera de él
$(document).mouseup(function(e) {
    var container = $("#cart-popup");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass('active');
        $('#cart-popup-overlay').fadeOut(); // Ocultar la superposición
    }
});
