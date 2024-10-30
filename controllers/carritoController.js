const pool = require('../config.js');

exports.getAllCarrito = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM carrito');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
};
exports.getCarritoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM carrito WHERE id_carrito = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};
exports.crearCarrito = async (req, res) => {
    const { id_cliente } = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO carrito (id_cliente) VALUES (?)', [id_cliente]);
        res.status(201).json({
            id_carrito: rows.insertId,
            id_cliente
        });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};
exports.editarCarrito = async (req, res) => {
    const { id } = req.params;
    const { id_cliente } = req.body;
    try {
        const [result] = await pool.query('UPDATE carrito SET id_cliente = ? WHERE id_carrito = ?', [id_cliente, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
};
exports.eliminarCarrito = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM carrito WHERE id_carrito = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
}   

// Obtener carrito por usuario autenticado
// Obtener carrito por usuario autenticado
exports.getCarritoByUser = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT c.id_carrito, c.id_cliente, c.id_producto, c.cantidad, p.nombre, p.precio, p.foto 
            FROM carrito c 
            JOIN productos p ON c.id_producto = p.id_producto 
            WHERE c.id_cliente = ?`, 
            [id_cliente]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos en el carrito para este usuario' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener el carrito del usuario:', error);
        res.status(500).json({ error: 'Error al obtener el carrito del usuario' });
    }
};


// Agregar producto al carrito
// Agregar producto al carrito
exports.agregarProductoAlCarrito = async (req, res) => {
    const { id_cliente, id_producto, cantidad } = req.body;
    try {
        // Verificar si el cliente y el producto existen antes de agregar al carrito
        const [clienteExists] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id_cliente]);
        const [productoExists] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id_producto]);

        if (clienteExists.length === 0) {
            return res.status(400).json({ error: 'Cliente no encontrado' });
        }
        if (productoExists.length === 0) {
            return res.status(400).json({ error: 'Producto no encontrado' });
        }

        // Verificar si el producto ya está en el carrito del usuario
        const [existingProduct] = await pool.query(
            'SELECT * FROM carrito WHERE id_cliente = ? AND id_producto = ?',
            [id_cliente, id_producto]
        );

        if (existingProduct.length > 0) {
            // Si ya existe, actualizar la cantidad
            await pool.query(
                'UPDATE carrito SET cantidad = cantidad + ? WHERE id_cliente = ? AND id_producto = ?',
                [cantidad, id_cliente, id_producto]
            );
        } else {
            // Si no existe, insertar un nuevo registro
            await pool.query(
                'INSERT INTO carrito (id_cliente, id_producto, cantidad) VALUES (?, ?, ?)',
                [id_cliente, id_producto, cantidad]
            );
        }

        res.status(201).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};


// Eliminar producto del carrito del usuario autenticado
exports.eliminarProductoDelCarrito = async (req, res) => {
    const { id_cliente, id_producto } = req.params;
    try {
        const [result] = await pool.query(
            'DELETE FROM carrito WHERE id_cliente = ? AND id_producto = ?',
            [id_cliente, id_producto]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
};