const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// ========================
//       PROVIDERS
// ========================

// GET ALL providers
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM provider ORDER BY id_provider');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los proveedores",
            error: err.message
        });
    }
});

// GET provider by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM provider WHERE id_provider = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el proveedor",
            error: err.message
        });
    }
});

// POST create provider
router.post('/', async (req, res) => {
    const { provaider, addres } = req.body;

    if (!provaider || provaider.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del proveedor es requerido" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO provider (provaider, addres) VALUES (?, ?)',
            [provaider.trim(), addres?.trim() || null]
        );
        res.status(201).json({ success: true, message: "Proveedor creado exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el proveedor",
            error: err.message
        });
    }
});

// PUT update provider
router.put('/:id', async (req, res) => {
    const { provaider, addres } = req.body;

    if (!provaider || provaider.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del proveedor es requerido" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM provider WHERE id_provider = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
        }

        await db.query(
            'UPDATE provider SET provaider = ?, addres = ? WHERE id_provider = ?',
            [provaider.trim(), addres?.trim() || null, req.params.id]
        );
        res.json({ success: true, message: "Proveedor actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el proveedor",
            error: err.message
        });
    }
});

// DELETE provider
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM provider WHERE id_provider = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
        }

        const [receipts] = await db.query(
            'SELECT COUNT(*) as total FROM receipts WHERE id_provider = ?', [req.params.id]
        );
        if (receipts[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el proveedor tiene ${receipts[0].total} recibo(s) asociado(s)`
            });
        }

        await db.query('DELETE FROM provider WHERE id_provider = ?', [req.params.id]);
        res.json({ success: true, message: "Proveedor eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el proveedor",
            error: err.message
        });
    }
});

module.exports = router;