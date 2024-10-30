const express = require('express');
const pedidosController = require('../controllers/pedidosController.js');
const router = express.Router();

router.get('/verPedidos', pedidosController.getAllPedidos);
router.get('/verPedidos/:id', pedidosController.getPedidosById);
router.post('/crearPedidos', pedidosController.crearPedidos);
router.put('/actualizarPedidos/:id', pedidosController.editarPedidos);
router.delete('/borrarPedidos/:id', pedidosController.eliminarPedidos);
module.exports = router; 