const pool = require('../config.js');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

const upload = multer({ storage: storage });

exports.upload = upload;

exports.getAllUsuariosClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE rol = "cliente"');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

exports.getAllUsuariosadministrador = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE rol = "administrador"');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}

exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

const crearTransportadorEthereal = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 8080,
  secure: false,
  auth: {
    user: "ignacio.jose.pancho@outlook.com",
    pass: "Nro19975@gmail.com",
  },
  tls: {
    ciphers: 'SSLv3'
  }
});


async function enviarCorreoVerificacion(email, nombre, apellido) {
  let transportador = crearTransportadorEthereal;

  let info = await transportador.sendMail({
    from: 'ecommerce verificacion <ignacio.jose.pancho@outlook.com>',
    to: email,
    subject: "Registro exitoso",
    html: `<p>Felicidades ${nombre} ${apellido}, tu correo ha sido verificado exitosamente</p>`,
  });

  console.log("Mensaje enviado: %s", info.messageId);
}


exports.createUsuario = async (req, res) => {
  const { nombre, apellido, direccion, email, contrasena } = req.body;
  let fotoUrl = null;

  // Si se envió una imagen, asignar la URL correspondiente
  if (req.file) {
      fotoUrl = `/uploads/${req.file.filename}`; // Ruta de la imagen guardada
  }

  if (!nombre || !apellido || !email || !contrasena) {
      return res.status(400).send({ message: "Nombre, apellido, email y contraseña son obligatorios." });
  }

  try {
      const query = `INSERT INTO clientes (nombre, apellido, direccion, email, contrasena, foto, rol, estado_logueo) VALUES (?, ?, ?, ?, ?, ?, 'cliente', FALSE)`;
      const [result] = await pool.execute(query, [
          nombre,
          apellido,
          direccion || null,
          email,
          contrasena,
          fotoUrl // Guardar la URL de la foto
      ]);


        /*
      try {
          await enviarCorreoVerificacion(email, nombre, apellido);
      } catch (correoError) {
          console.error("Error al enviar el correo de verificación:", correoError);
      }
      */

      res.status(201).send({ message: "Usuario creado exitosamente", userId: result.insertId });
  } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).send({ message: "Error al crear el usuario" });
  }
};



/*async function enviarCorreoActualizacion(email, nombre, apellido) {
  let transportador = crearTransportadorEthereal;

  let info = await transportador.sendMail({
    from: 'ecommerce verificacion <ignacio.jose.pancho@outlook.com>',
    to: email,
    subject: "Actualización de perfil exitosa",
    html: `<p>Hola ${nombre} ${apellido}, tus datos han sido actualizados correctamente.</p>`,
  });

  console.log("Mensaje de actualización enviado: %s", info.messageId);
} */

exports.updateUsuario = async (req, res) => { 
  const { id } = req.params;
  const { nombre, apellido, direccion, email, contrasena, foto } = req.body; 
  try {
    const [rows] = await pool.query('UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, email = ?, contrasena = ?, foto = ? WHERE id_cliente = ?', [nombre, apellido, direccion, email, contrasena, foto, id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await enviarCorreoActualizacion(email, nombre, apellido);

    res.json({
      id,
      nombre,
      apellido,
      direccion,
      email,
      contrasena,
      foto
    });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al borrar el usuario:', error);
    res.status(500).json({ error: 'Error al borrar el usuario' });
  }
};


// Inicio de sesión del usuario
exports.loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE email = ? AND contrasena = ?', [email, contrasena]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = rows[0];
    
    // Actualizar el estado de logueo a TRUE
    await pool.query(`UPDATE clientes SET estado_logueo = TRUE WHERE email = ?`, [email]);

    // Enviar todos los datos del usuario al frontend
    res.json({
      id_cliente: usuario.id_cliente,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      email: usuario.email,
      foto: usuario.foto || 'ruta/foto_predeterminada.jpg', // Si no hay foto, usa una predeterminada
      fecha_registro: usuario.fecha_registro,
      rol: usuario.rol
    });
  } catch (error) {
    console.error('Error al obtener el usuario o al actualizar el estado de logueo:', error);
    res.status(500).json({ error: 'Error al obtener el usuario o al actualizar el estado de logueo' });
  }
};




