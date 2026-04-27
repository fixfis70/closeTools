const express = require('express');
const router = express.Router();
const {db,onUpdate} = require('../db/db');

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM roles WHERE id_roles = ?", [id]);

    res.json(rows[0]);
})

router.get('/', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM roles");

    res.json(rows);
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const role = req.body.role;

    const [result] = await db.query("update roles set role = ? where id_roles = ?", [role,id]);
    return onUpdate(result,res);
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const [usos] = await db.query('SELECT COUNT(*) as total FROM asigned_roles WHERE roles_id = ?', [req.params.id]);
    if (usos[0].total > 0) {
        return res.status(409).json({ success: false, message: `No se puede eliminar: la marca tiene ${usos[0].total} producto(s) asociado(s)` });
    }

    const [result] = await db.query("delete from roles where id_roles = ?", [id]);
    return onUpdate(result, res)
})


module.exports = router;



