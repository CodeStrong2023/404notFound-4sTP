const express = require('express');
const carritoController = require('../controllers/carritoController.js');
const router = express.Router();

router.get('/carritoUsuario/:id_cliente', carritoController.getCarritoByUser); // Ruta correcta

router.get('/verCarrito', carritoController.getAllCarrito);
router.get('/verCarrito/:id', carritoController.getCarritoById);
router.post('/crearCarrito', carritoController.crearCarrito);
router.post('/agregarProducto', carritoController.agregarProductoAlCarrito);
router.put('/actualizarCarrito/:id', carritoController.editarCarrito);
router.delete('/borrarCarrito/:id', carritoController.eliminarCarrito);
router.delete('/borrarProducto/:id_cliente/:id_producto', carritoController.eliminarProductoDelCarrito);

module.exports = router;
