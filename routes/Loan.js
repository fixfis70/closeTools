const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// ========================
//         LOANS
// ========================

// GET ALL loans
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.id_loan, l.reason,
                   w.dni, w.names AS worker_name,
                   c.id_user, c.user AS loaned_by
            FROM loans l
            JOIN workers w ON l.loanTo = w.dni
            JOIN credentials c ON l.loanBy = c.id_user
            ORDER BY l.id_loan
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar los préstamos",
            error: err.message
        });
    }
});

// GET loan by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.id_loan, l.reason,
                   w.dni, w.names AS worker_name,
                   c.id_user, c.user AS loaned_by
            FROM loans l
            JOIN workers w ON l.loanTo = w.dni
            JOIN credentials c ON l.loanBy = c.id_user
            WHERE l.id_loan = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Préstamo no encontrado" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el préstamo",
            error: err.message
        });
    }
});

// POST create loan
router.post('/', async (req, res) => {
    const { loanTo, loanBy, reason } = req.body;

    if (!loanTo) return res.status(400).json({ success: false, message: "loanTo (DNI del trabajador) es requerido" });
    if (!loanBy) return res.status(400).json({ success: false, message: "loanBy (ID del usuario) es requerido" });
    if (reason === undefined || reason === null) return res.status(400).json({ success: false, message: "El motivo (reason) es requerido" });

    try {
        const [worker] = await db.query('SELECT * FROM workers WHERE dni = ?', [loanTo]);
        if (worker.length === 0) {
            return res.status(404).json({ success: false, message: "El trabajador (loanTo) no existe" });
        }

        const [credential] = await db.query('SELECT * FROM credentials WHERE id_user = ?', [loanBy]);
        if (credential.length === 0) {
            return res.status(404).json({ success: false, message: "El usuario (loanBy) no existe" });
        }

        const [result] = await db.query(
            'INSERT INTO loans (loanTo, loanBy, reason) VALUES (?, ?, ?)',
            [loanTo, loanBy, reason]
        );
        res.status(201).json({ success: true, message: "Préstamo creado exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear el préstamo",
            error: err.message
        });
    }
});

// PUT update loan
router.put('/:id', async (req, res) => {
    const { loanTo, loanBy, reason } = req.body;

    if (!loanTo) return res.status(400).json({ success: false, message: "loanTo es requerido" });
    if (!loanBy) return res.status(400).json({ success: false, message: "loanBy es requerido" });
    if (reason === undefined || reason === null) return res.status(400).json({ success: false, message: "El motivo es requerido" });

    try {
        const [existing] = await db.query('SELECT * FROM loans WHERE id_loan = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Préstamo no encontrado" });
        }

        const [worker] = await db.query('SELECT * FROM workers WHERE dni = ?', [loanTo]);
        if (worker.length === 0) {
            return res.status(404).json({ success: false, message: "El trabajador (loanTo) no existe" });
        }

        const [credential] = await db.query('SELECT * FROM credentials WHERE id_user = ?', [loanBy]);
        if (credential.length === 0) {
            return res.status(404).json({ success: false, message: "El usuario (loanBy) no existe" });
        }

        await db.query(
            'UPDATE loans SET loanTo = ?, loanBy = ?, reason = ? WHERE id_loan = ?',
            [loanTo, loanBy, reason, req.params.id]
        );
        res.json({ success: true, message: "Préstamo actualizado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el préstamo",
            error: err.message
        });
    }
});

// DELETE loan
router.delete('/:id', async (req, res) => {
    try {
        const [existing] = await db.query('SELECT * FROM loans WHERE id_loan = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Préstamo no encontrado" });
        }

        const [toolLoans] = await db.query(
            'SELECT COUNT(*) as total FROM tools_loans WHERE id_loan = ?', [req.params.id]
        );
        if (toolLoans[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: el préstamo tiene ${toolLoans[0].total} herramienta(s) asociada(s)`
            });
        }

        await db.query('DELETE FROM loans WHERE id_loan = ?', [req.params.id]);
        res.json({ success: true, message: "Préstamo eliminado correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el préstamo",
            error: err.message
        });
    }
});

module.exports = router;