const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// GET ALL credentials
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id_user, user, enable, creation_date, id_worker FROM credentials ORDER BY id_user');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar las credenciales",
            error: err.message
        });
    }
});

// GET credential by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id_user, user, enable, creation_date, id_worker FROM credentials WHERE id_user = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Credencial no encontrada" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la credencial",
            error: err.message
        });
    }
});

// POST create credential
router.post('/', async (req, res) => {
    const { user, pass, enable, creation_date, id_worker } = req.body;

    if (!user || user.trim() === "") {
        return res.status(400).json({ success: false, message: "El usuario es requerido" });
    }
    if (!pass || pass.trim() === "") {
        return res.status(400).json({ success: false, message: "La contraseña es requerida" });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM credentials WHERE user = ?', [user.trim()]);
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: `El usuario '${user.trim()}' ya está en uso`
            });
        }

        if (id_worker) {
            const [worker] = await db.query('SELECT * FROM workers WHERE dni = ?', [id_worker]);
            if (worker.length === 0) {
                return res.status(404).json({ success: false, message: "El trabajador asociado no existe" });
            }
        }

        const [result] = await db.query(
            'INSERT INTO credentials (user, pass, enable, creation_date, id_worker) VALUES (?, ?, ?, ?, ?)',
            [user.trim(), pass.trim(), enable ?? 1, creation_date || new Date(), id_worker || null]
        );
        res.status(201).json({ success: true, message: "Credencial creada exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear la credencial",
            error: err.message
        });
    }
});

// PUT update credential
router.put('/:id', async (req, res) => {
    const { user, pass, enable, id_worker } = req.body;

    if (!user || user.trim() === "") {
        return res.status(400).json({ success: false, message: "El usuario es requerido" });
    }
    if (!pass || pass.trim() === "") {
        return res.status(400).json({ success: false, message: "La contraseña es requerida" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM credentials WHERE id_user = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Credencial no encontrada" });
        }

        const [duplicateUser] = await db.query(
            'SELECT * FROM credentials WHERE user = ? AND id_user != ?', [user.trim(), req.params.id]
        );
        if (duplicateUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: `El usuario '${user.trim()}' ya está en uso por otra cuenta`
            });
        }

        if (id_worker) {
            const [worker] = await db.query('SELECT * FROM workers WHERE dni = ?', [id_worker]);
            if (worker.length === 0) {
                return res.status(404).json({ success: false, message: "El trabajador asociado no existe" });
            }
        }

        await db.query(
            'UPDATE credentials SET user = ?, pass = ?, enable = ?, id_worker = ? WHERE id_user = ?',
            [user.trim(), pass.trim(), enable ?? 1, id_worker || null, req.params.id]
        );
        res.json({ success: true, message: "Credencial actualizada correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la credencial",
            error: err.message
        });
    }
});

// DELETE credential
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM credentials WHERE id_user = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Credencial no encontrada" });
        }

        const [roles] = await db.query(
            'SELECT COUNT(*) as total FROM asigned_roles WHERE user_id = ?', [req.params.id]
        );
        if (roles[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: la credencial tiene ${roles[0].total} rol(es) asignado(s)`
            });
        }

        const [loans] = await db.query(
            'SELECT COUNT(*) as total FROM loans WHERE loanBy = ?', [req.params.id]
        );
        if (loans[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: la credencial tiene ${loans[0].total} préstamo(s) registrado(s)`
            });
        }

        const [tools] = await db.query(
            'SELECT COUNT(*) as total FROM tools WHERE oss_responsable = ?', [req.params.id]
        );
        if (tools[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: la credencial es responsable de ${tools[0].total} herramienta(s)`
            });
        }

        await db.query('DELETE FROM credentials WHERE id_user = ?', [req.params.id]);
        res.json({ success: true, message: "Credencial eliminada correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la credencial",
            error: err.message
        });
    }
});

module.exports = router;