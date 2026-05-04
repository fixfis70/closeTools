const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// ========================
//        STORAGES
// ========================

// GET ALL storages
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM storages ORDER BY id_storage');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los almacenes",
            error: err.message
        });
    }
});

// GET storage by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM storages WHERE id_storage = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Almacén no encontrado" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el almacén",
            error: err.message
        });
    }
});

// POST create storage
router.post('/', async (req, res) => {
    const { addres } = req.body;
    if (!addres || addres.trim() === "") {
        return res.status(400).json({ success: false, message: "La dirección del almacén es requerida" });
    }

    try {
        const [result] = await db.query('INSERT INTO storages (addres) VALUES (?)', [addres.trim()]);
        res.status(201).json({ success: true, message: "Almacén creado exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el almacén",
            error: err.message
        });
    }
});

// PUT update storage
router.put('/:id', async (req, res) => {
    const { addres } = req.body;
    if (!addres || addres.trim() === "") {
        return res.status(400).json({ success: false, message: "La dirección del almacén es requerida" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM storages WHERE id_storage = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Almacén no encontrado" });
        }

        await db.query('UPDATE storages SET addres = ? WHERE id_storage = ?', [addres.trim(), req.params.id]);
        res.json({ success: true, message: "Almacén actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el almacén",
            error: err.message
        });
    }
});

// DELETE storage
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM storages WHERE id_storage = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Almacén no encontrado" });
        }

        const [lockers] = await db.query(
            'SELECT COUNT(*) as total FROM locker WHERE id_storage = ?', [req.params.id]
        );
        if (lockers[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el almacén tiene ${lockers[0].total} casillero(s) asociado(s)`
            });
        }

        const [tools] = await db.query(
            'SELECT COUNT(*) as total FROM tools WHERE id_storage = ?', [req.params.id]
        );
        if (tools[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el almacén tiene ${tools[0].total} herramienta(s) asociada(s)`
            });
        }

        await db.query('DELETE FROM storages WHERE id_storage = ?', [req.params.id]);
        res.json({ success: true, message: "Almacén eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el almacén",
            error: err.message
        });
    }
});

module.exports = router;