 
const express = require('express');
const metodosPagoController = require('../controllers/metodosPagoController.js');
const router = express.Router();
router.get('/metodos-pago', metodosPagoController.getAllMetodosPago);
router.get('/metodos-pago/:id', metodosPagoController.getMetodosById);
router.post('/metodos-pago', metodosPagoController.cargarMetodosPago);
router.delete('/metodos-pago/:id', metodosPagoController.deleteMetodosPago);
router.put('/metodos-pago/:id', metodosPagoController.updateMetodosPago);
router.post('/pago', metodosPagoController.crearPagoConPaypal);
module.exports = router;