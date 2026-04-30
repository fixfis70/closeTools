const express = require('express');
const router = express.Router();
const {db} = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM storages ORDER BY id_storage '
        );
        res.json({success: true, data: rows});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar la lista de Almacen",
            error: err.message
        })
    }
})
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM storages WHERE id_storage= ?', [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se a encontrado el almacen"
            })
        }
        res.json({success: true, data: rows[0]});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener almacen",
            error: err.message,
        });
    }
})
router.post('/', async (req, res) => {
    const {storage} = req.body;
    if (!storage || storage.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El nombre es requerido"
        });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO storages (addres) VALUES (?)',
            [storage.trim()],
        );
        res.status(201).json({
            success: true,
            message: "Creado exitosamente",
            id: result.insertId,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear almacen",
            error: err.message,
        });
    }
})
router.put('/:id', async (req, res) => {
    const {storage} = req.body;
    if (!storage || storage.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El nombre es requerido"
        })
    }
    try {
        const [result] = await db.query(
            'UPDATE storages SET addres = ? WHERE id_storage = ?',
            [storage.trim(), req.params.id],
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontro el almacen"
            })
        }
        res.json({success: true, message: "Almacen actualizado"});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar almacen",
            error: err.message,
        });
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const [locker] = await db.query(
            'SELECT COUNT(*) as total FROM locker WHERE id_storage= ?',
            [req.params.id]
        );
        if (locker[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: El almacen tiene ${locker[0].total} Locker(s) asociado(s) `,
            })
        }
        const [result] = await db.query('DELETE FROM storages WHERE id_storage = ?', [
            req.params.id,
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Almacen no encontrado"
            });
        }
        res.json({success: true, message: "Almacen eliminado correctamente"});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar almacen",
            error: err.message,
        });
    }
})

module.exports = router;