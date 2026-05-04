const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// ========================
//     ASIGNED ROLES
// ========================

// GET ALL assigned roles (optionally filter by user_id)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ar.user_id, c.user, ar.roles_id, r.role
            FROM asigned_roles ar
            JOIN credentials c ON ar.user_id = c.id_user
            JOIN roles r ON ar.roles_id = r.id_roles
            ORDER BY ar.user_id
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los roles asignados",
            error: err.message
        });
    }
});

// GET assigned roles by user_id
router.get('/user/:user_id', async (req, res) => {
    try {
        const [user] = await db.query('SELECT * FROM credentials WHERE id_user = ?', [req.params.user_id]);
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const [rows] = await db.query(`
            SELECT ar.roles_id, r.role
            FROM asigned_roles ar
            JOIN roles r ON ar.roles_id = r.id_roles
            WHERE ar.user_id = ?
        `, [req.params.user_id]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener roles del usuario",
            error: err.message
        });
    }
});

// POST assign role to user
router.post('/', async (req, res) => {
    const { user_id, roles_id } = req.body;

    if (!user_id || !roles_id) {
        return res.status(400).json({ success: false, message: "user_id y roles_id son requeridos" });
    }

    try {
        const [user] = await db.query('SELECT * FROM credentials WHERE id_user = ?', [user_id]);
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "El usuario no existe" });
        }

        const [role] = await db.query('SELECT * FROM roles WHERE id_roles = ?', [roles_id]);
        if (role.length === 0) {
            return res.status(404).json({ success: false, message: "El rol no existe" });
        }

        const [existing] = await db.query(
            'SELECT * FROM asigned_roles WHERE user_id = ? AND roles_id = ?', [user_id, roles_id]
        );
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "El usuario ya tiene ese rol asignado"
            });
        }

        await db.query('INSERT INTO asigned_roles (user_id, roles_id) VALUES (?, ?)', [user_id, roles_id]);
        res.status(201).json({ success: true, message: "Rol asignado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al asignar el rol",
            error: err.message
        });
    }
});

// DELETE remove role from user
router.delete('/', async (req, res) => {
    const { user_id, roles_id } = req.body;

    if (!user_id || !roles_id) {
        return res.status(400).json({ success: false, message: "user_id y roles_id son requeridos" });
    }

    try {
        const [existing] = await db.query(
            'SELECT * FROM asigned_roles WHERE user_id = ? AND roles_id = ?', [user_id, roles_id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "La asignación no existe" });
        }

        await db.query('DELETE FROM asigned_roles WHERE user_id = ? AND roles_id = ?', [user_id, roles_id]);
        res.json({ success: true, message: "Rol removido del usuario correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al remover el rol",
            error: err.message
        });
    }
});

module.exports = router;