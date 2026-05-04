const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// GET ALL
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT tl.*, t.serial, l.id_loan
            FROM tools_loans tl
            JOIN tools t ON tl.id_tool = t.id_tool
            JOIN loans l ON tl.id_loan = l.id_loan
        `);

        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar tools_loans",
            error: err.message
        });
    }
});

// POST
router.post('/', async (req, res) => {
    const { id_tool, id_loan, loan_start } = req.body;

    if (!id_tool || !id_loan) {
        return res.status(400).json({
            success: false,
            message: "id_tool e id_loan son requeridos"
        });
    }

    try {
        await db.query(`
            INSERT INTO tools_loans (id_tool, id_loan, loan_start)
            VALUES (?, ?, ?)
        `, [id_tool, id_loan, loan_start || new Date()]);

        res.status(201).json({
            success: true,
            message: "Herramienta asignada al préstamo"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear tools_loans",
            error: err.message
        });
    }
});

// PUT (cerrar préstamo de herramienta)
router.put('/', async (req, res) => {
    const { id_tool, id_loan, loan_end, end_tool_state } = req.body;

    try {
        await db.query(`
            UPDATE tools_loans
            SET loan_end = ?, end_tool_state = ?
            WHERE id_tool = ? AND id_loan = ?
        `, [loan_end || new Date(), end_tool_state || null, id_tool, id_loan]);

        res.json({ success: true, message: "Herramienta devuelta correctamente" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar tools_loans",
            error: err.message
        });
    }
});

// DELETE
router.delete('/', async (req, res) => {
    const { id_tool, id_loan } = req.body;

    try {
        await db.query(
            'DELETE FROM tools_loans WHERE id_tool = ? AND id_loan = ?',
            [id_tool, id_loan]
        );

        res.json({ success: true, message: "Relación eliminada" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar tools_loans",
            error: err.message
        });
    }
});

module.exports = router;