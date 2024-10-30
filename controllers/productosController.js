const pool = require('../config.js');
const nodemailer = require('nodemailer');

exports.getAllProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}
exports.getProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}   
exports.crearProductos = async (req, res) => {
    const { nombre, precio, stock, foto, descripcion } = req.body;
    const precioComparacion = precio * 2;
    try {
        const [rows] = await pool.query('INSERT INTO productos (nombre, precio, stock, foto, descripcion, categoria, precio_comparacion) VALUES (?, ?, ?, ?, ?)', [nombre, precio, stock, foto, descripcion, categoria, precioComparacion]);
        res.status(201).json({
            id: rows.insertId,
            nombre,
            precio,
            precioComparacion,
            stock,
            foto,
            descripcion,
            categoria
        });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};
exports.actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio,stock,foto,descripcion } = req.body;
    const precioComparacion = precio * 2;
    try {
        const [result] = await pool.query('UPDATE productos SET nombre = ?, precio = ?,stock = ?,foto = ?, descripcion = ?,  precio_comparacion = ? WHERE id_producto = ?', [nombre,precio,stock,foto,descripcion,precioComparacion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'producto no encontrado' });
        }
        res.json({ message: 'producto actualizado con exito' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }   
}
exports.borrarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'producto no encontrado' });
        }
        res.json({ message: 'producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
exports.getProductosPorCategoria = async (req, res) => {
    const { categoria } = req.params; // Obtenemos la categoría de los parámetros de la URL
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE categoria = ?', [categoria]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener productos por categoría' });
    }


};


