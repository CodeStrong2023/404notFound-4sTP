const express = require('express');
const productosController = require('../controllers/productosController.js');
const router = express.Router();
router.get('/verProductos', productosController.getAllProductos);
router.get('/verProducto/:id', productosController.getProducto);
router.post('/crearProducto', productosController.crearProductos);
router.put('/actualizarProducto/:id', productosController.actualizarProducto);
router.delete('/borrarProducto/:id', productosController.borrarProducto);
router.get('/categoria/:categoria', productosController.getProductosPorCategoria);

module.exports = router;
