const login = async () => {
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
        const response = await fetch('http://localhost:8080/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, contrasena }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Se inició sesión correctamente:', data);

        
            localStorage.setItem('usuario', JSON.stringify(data));

            await cargarCarritoDelUsuario(data.id_cliente);

           
            mostrarCartelitoSesionExitosa();

            // Permitir el cierre del popup de login
            document.getElementById('login-popup').style.display = 'none';
            document.getElementById('login-popup-overlay').style.display = 'none';

            // Redirigir a la página principal
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000); // Redirigir después de 3 segundos
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
    }
};

const cargarCarritoDelUsuario = async (id_cliente) => {
    try {
        const response = await fetch(`http://localhost:8080/carrito/carritoUsuario/${id_cliente}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (response.ok) {
                // Guardar los productos del carrito en localStorage, preservando información relevante
                const carrito = data.map(item => ({
                    id_producto: item.id_producto,
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio: item.precio,
                    foto: item.foto
                }));
                // Guardar el carrito con la estructura correcta
                localStorage.setItem('cart', JSON.stringify(carrito));
                updateCart(); // Llama a la función para actualizar la vista del carrito
            } else {
                console.error('Error al cargar el carrito:', data.error);
            }
        } else {
            // La respuesta no es JSON, probablemente un error HTML
            const errorText = await response.text();
            console.error('Error: La respuesta no es JSON:', errorText);
        }
    } catch (error) {
        console.error('Error al cargar el carrito del usuario:', error);
    }
};




// Mostrar una animación de vibración si hacen clic en el fondo sin iniciar sesión
document.getElementById('login-popup-overlay').onclick = function() {
    const loginForm = document.getElementById('login-popup');
    loginForm.classList.add('vibrar');

    // Eliminar la clase de vibración después de la animación
    setTimeout(() => {
        loginForm.classList.remove('vibrar');
    }, 500);  // Duración de la vibración
};

// Mostrar cartelito de inicio de sesión exitoso
function mostrarCartelitoSesionExitosa() {
    const cartel = document.createElement('div');
    cartel.className = 'sesion-exitosa';
    cartel.innerText = 'Sesión iniciada correctamente';

    document.body.appendChild(cartel);

    // Mostrar el cartelito con la animación
    setTimeout(() => {
        cartel.classList.add('show');
    }, 100); // Retraso pequeño para que la transición se vea suave

    // Ocultar y eliminar el cartelito después de 3 segundos
    setTimeout(() => {
        cartel.classList.remove('show');
        setTimeout(() => {
            cartel.remove();
        }, 500); // Esperar a que la transición de salida termine antes de removerlo
    }, 3000);
}

window.onload = function() {
    // No permitir cerrar el popup hasta que se inicie sesión
    document.getElementById('login-popup-overlay').onclick = function() {
        const loginForm = document.getElementById('login-popup');
        loginForm.classList.add('vibrar');

        // Eliminar la clase de vibración después de la animación
        setTimeout(() => {
            loginForm.classList.remove('vibrar');
        }, 300); // Ajustar la duración de la vibración
    };
};
