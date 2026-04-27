const express = require('express');
const router = express.Router();
const {db} = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM provider ORDER BY id_provider'
        );
        res.json({success: true, data: rows});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar la lista de Proveedores",
            error: err.message
        })
    }
});
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM provider WHERE id_provider= ?', [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se a encontrado al proveedor"
            })
        }
        res.json({success: true, data: rows[0]});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener proveedor",
            error: err.message,
        });
    }
})

router.post('/', async (req, res) => {
    const {provaider, addres} = req.body;


    if (!provaider.trim() || !addres.trim()) {
        return res.status(400).json({
            success: false,
            message: "Proveedor y dirección son requeridos"
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO provider (provaider, addres) VALUES (?, ?)',
            [provaider.trim(), addres.trim()]
        );

        res.status(201).json({
            success: true,
            message: "Proveedor creado exitosamente",
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear proveedor",
            error: err.message
        });
    }
});

router.put('/:id', async (req, res) => {
    const {provaider, addres} = req.body;

    if (!provaider || provaider.trim() === "" || !addres || addres.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El nombre y la direccion son requeridos"
        });
    }

    try {
        const [result] = await db.query(
            'UPDATE provider SET provaider = ?, addres = ? WHERE id_provider = ?',
            [provaider.trim(), addres.trim(), req.params.id],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontro el proveedor"
            });
        }

        res.json({
            success: true,
            message: "proveedor actualizado"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar proveedor",
            error: err.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [receipts] = await db.query(
            'SELECT COUNT(*) as total FROM receipts WHERE id_provider= ?',
            [req.params.id]
        );
        if (receipts[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: El proveedor tiene ${receipts[0].total} recivo `,
            });
        }
        const [result] = await db.query('DELETE FROM provider WHERE id_provider = ?', [
            req.params.id,
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "proveedor no encontrada"
            });
        }
        res.json({success: true, message: "proveedor eliminada correctamente"});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar al proveedor",
            error: err.message,
        });
    }
});

module.exports = router;