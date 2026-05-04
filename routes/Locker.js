const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// ========================
//         LOCKER
// ========================

// GET ALL lockers
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.id_locker, l.locker, l.id_storage, s.addres AS storage_address
            FROM locker l
            JOIN storages s ON l.id_storage = s.id_storage
            ORDER BY l.id_locker
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los casilleros",
            error: err.message
        });
    }
});

// GET locker by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.id_locker, l.locker, l.id_storage, s.addres AS storage_address
            FROM locker l
            JOIN storages s ON l.id_storage = s.id_storage
            WHERE l.id_locker = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Casillero no encontrado" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el casillero",
            error: err.message
        });
    }
});

// POST create locker
router.post('/', async (req, res) => {
    const { locker, id_storage } = req.body;

    if (!locker || locker.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del casillero es requerido" });
    }
    if (!id_storage) {
        return res.status(400).json({ success: false, message: "El almacén (id_storage) es requerido" });
    }

    try {
        const [storage] = await db.query('SELECT * FROM storages WHERE id_storage = ?', [id_storage]);
        if (storage.length === 0) {
            return res.status(404).json({ success: false, message: "El almacén asociado no existe" });
        }

        const [result] = await db.query(
            'INSERT INTO locker (locker, id_storage) VALUES (?, ?)',
            [locker.trim(), id_storage]
        );
        res.status(201).json({ success: true, message: "Casillero creado exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el casillero",
            error: err.message
        });
    }
});

// PUT update locker
router.put('/:id', async (req, res) => {
    const { locker, id_storage } = req.body;

    if (!locker || locker.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del casillero es requerido" });
    }
    if (!id_storage) {
        return res.status(400).json({ success: false, message: "El almacén (id_storage) es requerido" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM locker WHERE id_locker = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Casillero no encontrado" });
        }

        const [storage] = await db.query('SELECT * FROM storages WHERE id_storage = ?', [id_storage]);
        if (storage.length === 0) {
            return res.status(404).json({ success: false, message: "El almacén asociado no existe" });
        }

        await db.query(
            'UPDATE locker SET locker = ?, id_storage = ? WHERE id_locker = ?',
            [locker.trim(), id_storage, req.params.id]
        );
        res.json({ success: true, message: "Casillero actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el casillero",
            error: err.message
        });
    }
});

// DELETE locker
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM locker WHERE id_locker = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Casillero no encontrado" });
        }

        await db.query('DELETE FROM locker WHERE id_locker = ?', [req.params.id]);
        res.json({ success: true, message: "Casillero eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el casillero",
            error: err.message
        });
    }
});

module.exports = router;