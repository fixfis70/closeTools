const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// ========================
//         MODELS
// ========================

// GET ALL models
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.id_model, m.model, m.kind_of_tool, m.id_brand, b.brand
            FROM models m
            JOIN brands b ON m.id_brand = b.id_brand
            ORDER BY m.id_model
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los modelos",
            error: err.message
        });
    }
});

// GET model by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.id_model, m.model, m.kind_of_tool, m.id_brand, b.brand
            FROM models m
            JOIN brands b ON m.id_brand = b.id_brand
            WHERE m.id_model = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Modelo no encontrado" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el modelo",
            error: err.message
        });
    }
});

// POST create model
router.post('/', async (req, res) => {
    const { model, kind_of_tool, id_brand } = req.body;

    if (!model || model.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del modelo es requerido" });
    }
    if (!id_brand) {
        return res.status(400).json({ success: false, message: "La marca (id_brand) es requerida" });
    }

    try {
        const [brand] = await db.query('SELECT * FROM brands WHERE id_brand = ?', [id_brand]);
        if (brand.length === 0) {
            return res.status(404).json({ success: false, message: "La marca asociada no existe" });
        }

        const [result] = await db.query(
            'INSERT INTO models (model, kind_of_tool, id_brand) VALUES (?, ?, ?)',
            [model.trim(), kind_of_tool?.trim() || null, id_brand]
        );
        res.status(201).json({ success: true, message: "Modelo creado exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el modelo",
            error: err.message
        });
    }
});

// PUT update model
router.put('/:id', async (req, res) => {
    const { model, kind_of_tool, id_brand } = req.body;

    if (!model || model.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del modelo es requerido" });
    }
    if (!id_brand) {
        return res.status(400).json({ success: false, message: "La marca (id_brand) es requerida" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM models WHERE id_model = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Modelo no encontrado" });
        }

        const [brand] = await db.query('SELECT * FROM brands WHERE id_brand = ?', [id_brand]);
        if (brand.length === 0) {
            return res.status(404).json({ success: false, message: "La marca asociada no existe" });
        }

        await db.query(
            'UPDATE models SET model = ?, kind_of_tool = ?, id_brand = ? WHERE id_model = ?',
            [model.trim(), kind_of_tool?.trim() || null, id_brand, req.params.id]
        );
        res.json({ success: true, message: "Modelo actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el modelo",
            error: err.message
        });
    }
});

// DELETE model
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM models WHERE id_model = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Modelo no encontrado" });
        }

        const [tools] = await db.query(
            'SELECT COUNT(*) as total FROM tools WHERE id_model = ?', [req.params.id]
        );
        if (tools[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el modelo tiene ${tools[0].total} herramienta(s) asociada(s)`
            });
        }

        await db.query('DELETE FROM models WHERE id_model = ?', [req.params.id]);
        res.json({ success: true, message: "Modelo eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el modelo",
            error: err.message
        });
    }
});

module.exports = router;