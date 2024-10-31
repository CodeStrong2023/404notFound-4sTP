const registrarUsuario = async () => {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const direccion = document.getElementById('direccion').value || null;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;
    const foto = document.getElementById('foto').files[0];

    // Verifica que no haya campos obligatorios vacíos antes de enviar la solicitud
    if (!nombre || !apellido || !email || !contrasena) {
        alert("Todos los campos obligatorios deben ser completados.");
        return;
    }

    // Crear un objeto FormData para enviar los datos del formulario y la imagen
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('direccion', direccion);
    formData.append('email', email);
    formData.append('contrasena', contrasena);
    if (foto) {
        formData.append('foto', foto);
    }

    try {
        const response = await fetch('http://localhost:8080/usuario/crearUsuario', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registro exitoso. Por favor, inicia sesión.');
            window.location.href = 'index.html'; // Redirige al login
        } else {
            alert(data.message || 'Error al registrar usuario.');
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario.');
    }
};
