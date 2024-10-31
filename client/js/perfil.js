window.onload = function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario && usuario.id_cliente) {
        fetch(`http://localhost:8080/usuario/verUsuario/${usuario.id_cliente}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos del usuario");
            }
            return response.json();
        })
        .then(data => {
            // Asignar datos a los campos correspondientes
            document.getElementById('usuario-nombre').innerText = data.nombre || 'Usuario';
            document.getElementById('detalle-nombre').innerText = data.nombre || 'Usuario';
            document.getElementById('detalle-email').innerText = data.email;
            document.getElementById('usuario-direccion').innerText = data.direccion || 'Sin dirección';
            document.getElementById('usuario-fecha-registro').innerText = new Date(data.fecha_registro).toLocaleDateString();
            document.getElementById('usuario-foto').src = data.foto || 'assets/default-profile.png';
        })
        .catch(error => {
            console.error("Error al obtener los datos del usuario:", error);
        });
    } else {
        console.error("Usuario no encontrado en el localStorage");
    }

    document.getElementById('logout-button').onclick = function() {
        localStorage.removeItem('usuario');
        localStorage.removeItem('cart');
        alert('Cerraste sesión correctamente');
        window.location.href = 'index.html';
    };
};
