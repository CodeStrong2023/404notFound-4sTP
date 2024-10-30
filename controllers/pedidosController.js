const pool = require('../config.js');

exports.getAllPedidos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pedidos');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
}
exports.getPedidosById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
}
exports.crearPedidos = async (req, res) => {
    const { id_cliente, fecha_pedido, total, estado } = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO pedidos (id_cliente, fecha_pedido, total, estado) VALUES (?, ?, ?, ?)', [id_cliente, fecha_pedido, total, estado]);
        res.status(201).json({
            id_pedido: rows.insertId,
            id_cliente,
            fecha_pedido,
            total,
            estado
        });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
}
exports.editarPedidos = async (req, res) => {
    const { id } = req.params;
    const { id_cliente, fecha_pedido, total, estado } = req.body;
    try {
        const [result] = await pool.query('UPDATE pedidos SET id_cliente = ?, fecha_pedido = ?, total = ?, estado = ? WHERE id_pedido = ?', [id_cliente, fecha_pedido, total, estado, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json({ message: 'Pedido actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.eliminarPedidos = async (req, res) => { 
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}