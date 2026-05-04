const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// GET ALL receipts
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.*, p.provaider
            FROM receipts r
            LEFT JOIN provider p ON r.id_provider = p.id_provider
            ORDER BY r.id_receipt
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los recibos",
            error: err.message
        });
    }
});

// GET receipt by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.*, p.provaider
            FROM receipts r
            LEFT JOIN provider p ON r.id_provider = p.id_provider
            WHERE r.id_receipt = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Recibo no encontrado" });
        }

        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el recibo",
            error: err.message
        });
    }
});

// POST create receipt
router.post('/', async (req, res) => {
    const { receipt_img_url, id_provider } = req.body;

    if (!receipt_img_url) {
        return res.status(400).json({ success: false, message: "La URL del recibo es requerida" });
    }

    try {
        if (id_provider) {
            const [provider] = await db.query('SELECT * FROM provider WHERE id_provider = ?', [id_provider]);
            if (provider.length === 0) {
                return res.status(404).json({ success: false, message: "Proveedor no existe" });
            }
        }

        const [result] = await db.query(
            'INSERT INTO receipts (receipt_img_url, id_provider) VALUES (?, ?)',
            [receipt_img_url, id_provider || null]
        );

        res.status(201).json({
            success: true,
            message: "Recibo creado exitosamente",
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el recibo",
            error: err.message
        });
    }
});

// PUT update receipt
router.put('/:id', async (req, res) => {
    const { receipt_img_url, id_provider } = req.body;

    if (!receipt_img_url) {
        return res.status(400).json({ success: false, message: "La URL es requerida" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM receipts WHERE id_receipt = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Recibo no encontrado" });
        }

        if (id_provider) {
            const [provider] = await db.query('SELECT * FROM provider WHERE id_provider = ?', [id_provider]);
            if (provider.length === 0) {
                return res.status(404).json({ success: false, message: "Proveedor no existe" });
            }
        }

        await db.query(
            'UPDATE receipts SET receipt_img_url = ?, id_provider = ? WHERE id_receipt = ?',
            [receipt_img_url, id_provider || null, req.params.id]
        );

        res.json({ success: true, message: "Recibo actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el recibo",
            error: err.message
        });
    }
});

// DELETE receipt
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM receipts WHERE id_receipt = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Recibo no encontrado" });
        }

        const [tools] = await db.query(
            'SELECT COUNT(*) as total FROM tools WHERE id_receipt = ?', [req.params.id]
        );

        if (tools[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: hay ${tools[0].total} herramienta(s) asociada(s)`
            });
        }

        await db.query('DELETE FROM receipts WHERE id_receipt = ?', [req.params.id]);

        res.json({ success: true, message: "Recibo eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el recibo",
            error: err.message
        });
    }
});

module.exports = router;