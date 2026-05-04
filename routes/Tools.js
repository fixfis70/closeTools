const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// GET ALL tools
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, m.model, s.addres AS storage
            FROM tools t
            LEFT JOIN models m ON t.id_model = m.id_model
            LEFT JOIN storages s ON t.id_storage = s.id_storage
            ORDER BY t.id_tool
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar herramientas",
            error: err.message
        });
    }
});

// GET tool by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tools WHERE id_tool = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Herramienta no encontrada" });
        }

        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener herramienta",
            error: err.message
        });
    }
});

// POST create tool
router.post('/', async (req, res) => {
    const {
        serial, inv_code, state, oos_reason,
        purchase_cost, purchase_date,
        oss_responsable, id_model, id_receipt, id_storage
    } = req.body;

    if (!serial) return res.status(400).json({ success: false, message: "Serial requerido" });

    try {
        const [result] = await db.query(`
            INSERT INTO tools 
            (serial, inv_code, state, oos_reason, purchase_cost, purchase_date,
             oss_responsable, id_model, id_receipt, id_storage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            serial, inv_code || null, state || null, oos_reason || null,
            purchase_cost || null, purchase_date || null,
            oss_responsable || null, id_model || null,
            id_receipt || null, id_storage || null
        ]);

        res.status(201).json({
            success: true,
            message: "Herramienta creada",
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear herramienta",
            error: err.message
        });
    }
});

// PUT update tool
router.put('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM tools WHERE id_tool = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Herramienta no encontrada" });
        }

        await db.query('UPDATE tools SET ? WHERE id_tool = ?', [req.body, req.params.id]);

        res.json({ success: true, message: "Herramienta actualizada" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar herramienta",
            error: err.message
        });
    }
});

// DELETE tool
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM tools WHERE id_tool = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Herramienta no encontrada" });
        }

        const [toolLoans] = await db.query(
            'SELECT COUNT(*) as total FROM tools_loans WHERE id_tool = ?', [req.params.id]
        );

        if (toolLoans[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: está en ${toolLoans[0].total} préstamo(s)`
            });
        }

        await db.query('DELETE FROM tools WHERE id_tool = ?', [req.params.id]);

        res.json({ success: true, message: "Herramienta eliminada" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar herramienta",
            error: err.message
        });
    }
});

module.exports = router;