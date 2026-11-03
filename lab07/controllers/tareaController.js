const db = require('../db');

// 1. Obtener tareas
exports.getTareas = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM tareas WHERE usuario_id = $1 ORDER BY id DESC',
            [req.session.userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
};

// 2. Crear tarea
exports.createTarea = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        if (!titulo) return res.status(400).json({ message: 'El título es obligatorio' });

        const result = await db.query(
            'INSERT INTO tareas (usuario_id, titulo, descripcion) VALUES ($1, $2, $3) RETURNING *',
            [req.session.userId, titulo, descripcion || '']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear tarea' });
    }
};

// 3. Actualizar tarea
exports.updateTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, completada } = req.body;
        
        const result = await db.query(
            'UPDATE tareas SET titulo = $1, descripcion = $2, completada = $3 WHERE id = $4 AND usuario_id = $5 RETURNING *',
            [titulo, descripcion, completada, id, req.session.userId]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
};

// 4. Eliminar tarea
exports.deleteTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM tareas WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [id, req.session.userId]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.status(200).json({ message: 'Tarea eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
};
