const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// ========================
//        ROLES
// ========================

// GET ALL roles
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roles ORDER BY id_roles');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los roles",
            error: err.message
        });
    }
});

// GET role by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roles WHERE id_roles = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Rol no encontrado" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el rol",
            error: err.message
        });
    }
});

// POST create role
router.post('/', async (req, res) => {
    const { role } = req.body;
    if (!role || role.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del rol es requerido" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM roles WHERE role = ?', [role.trim()]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: `El rol '${role.trim()}' ya existe` });
        }

        const [result] = await db.query('INSERT INTO roles (role) VALUES (?)', [role.trim()]);
        res.status(201).json({ success: true, message: "Rol creado exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el rol",
            error: err.message
        });
    }
});

// PUT update role
router.put('/:id', async (req, res) => {
    const { role } = req.body;
    if (!role || role.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre del rol es requerido" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM roles WHERE id_roles = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Rol no encontrado" });
        }

        const [duplicate] = await db.query(
            'SELECT * FROM roles WHERE role = ? AND id_roles != ?', [role.trim(), req.params.id]
        );
        if (duplicate.length > 0) {
            return res.status(409).json({ success: false, message: `El rol '${role.trim()}' ya está en uso` });
        }

        await db.query('UPDATE roles SET role = ? WHERE id_roles = ?', [role.trim(), req.params.id]);
        res.json({ success: true, message: "Rol actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el rol",
            error: err.message
        });
    }
});

// DELETE role
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM roles WHERE id_roles = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Rol no encontrado" });
        }

        const [assigned] = await db.query(
            'SELECT COUNT(*) as total FROM asigned_roles WHERE roles_id = ?', [req.params.id]
        );
        if (assigned[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el rol está asignado a ${assigned[0].total} usuario(s)`
            });
        }

        await db.query('DELETE FROM roles WHERE id_roles = ?', [req.params.id]);
        res.json({ success: true, message: "Rol eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el rol",
            error: err.message
        });
    }
});

module.exports = router;