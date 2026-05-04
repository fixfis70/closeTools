const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// GET ALL workers
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM workers ORDER BY dni');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar la lista de trabajadores",
            error: err.message
        });
    }
});

// GET worker by DNI
router.get('/:dni', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM workers WHERE dni = ?', [req.params.dni]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trabajador no encontrado"
            });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el trabajador",
            error: err.message
        });
    }
});

// POST create worker
router.post('/', async (req, res) => {
    const { dni, names, role, work_area, shift } = req.body;

    if (!dni || isNaN(dni)) {
        return res.status(400).json({ success: false, message: "El DNI es requerido y debe ser un número" });
    }
    if (!names || names.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre es requerido" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM workers WHERE dni = ?', [dni]);
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: `Ya existe un trabajador con el DNI ${dni}`
            });
        }

        await db.query(
            'INSERT INTO workers (dni, names, role, work_area, shift) VALUES (?, ?, ?, ?, ?)',
            [dni, names.trim(), role || null, work_area || null, shift ?? null]
        );
        res.status(201).json({ success: true, message: "Trabajador creado exitosamente", dni });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el trabajador",
            error: err.message
        });
    }
});

// PUT update worker
router.put('/:dni', async (req, res) => {
    const { names, role, work_area, shift } = req.body;

    if (!names || names.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre es requerido" });
    }

    try {
        const [existing] = await db.query('SELECT * FROM workers WHERE dni = ?', [req.params.dni]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Trabajador no encontrado" });
        }

        await db.query(
            'UPDATE workers SET names = ?, role = ?, work_area = ?, shift = ? WHERE dni = ?',
            [names.trim(), role || null, work_area || null, shift ?? null, req.params.dni]
        );
        res.json({ success: true, message: "Trabajador actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el trabajador",
            error: err.message
        });
    }
});

// DELETE worker
router.delete('/:dni', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM workers WHERE dni = ?', [req.params.dni]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Trabajador no encontrado" });
        }

        const [credentials] = await db.query(
            'SELECT COUNT(*) as total FROM credentials WHERE id_worker = ?', [req.params.dni]
        );
        if (credentials[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el trabajador tiene ${credentials[0].total} credencial(es) asociada(s)`
            });
        }

        const [loans] = await db.query(
            'SELECT COUNT(*) as total FROM loans WHERE loanTo = ?', [req.params.dni]
        );
        if (loans[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el trabajador tiene ${loans[0].total} préstamo(s) asociado(s)`
            });
        }

        await db.query('DELETE FROM workers WHERE dni = ?', [req.params.dni]);
        res.json({ success: true, message: "Trabajador eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el trabajador",
            error: err.message
        });
    }
});

module.exports = router;