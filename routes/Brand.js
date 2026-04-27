const express = require('express');
const router = express.Router();
const {db} = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM brands ORDER BY id_brand '
        );
        res.json({success: true, data: rows});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al cargar la lista de Marcas",
            error: err.message
        })
    }
});
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM brands WHERE id_brand= ?', [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se a encontrado la marca"
            })
        }
        res.json({success: true, data: rows[0]});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener Marca",
            error: err.message,
        });
    }
})

router.post('/', async (req, res) => {
    const {brand} = req.body;


    if (!brand || brand.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El nombre es requerido"
        });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO brands (brand) VALUES (?)',
            [brand.trim()],
        );
        res.status(201).json({
            success: true,
            message: "Creado exitosamente",
            id: result.insertId,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear Marca",
            error: err.message,
        });
    }
})
router.put('/:id', async (req, res) => {
    const {brand} = req.body;
    if (!brand || brand.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El nombre es requerido"
        });
    }
    try {
        const [result] = await db.query(
            'UPDATE brands SET brand = ? WHERE id_brand = ?',
            [brand.trim(), req.params.id],
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la marca"
            });
        }
        res.json({success: true, message: "Marca actualizada"});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la marca",
            error: err.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [models] = await db.query(
            'SELECT COUNT(*) as total FROM models WHERE id_brand= ?',
            [req.params.id]
        );
        if (models[0].total > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar: La marca tiene ${models[0].total} Modelo(s) asociado(s) `,
            });
        }
        const [result] = await db.query('DELETE FROM brands WHERE id_brand = ?', [
            req.params.id,
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Marca no encontrada"
            });
        }
        res.json({success: true, message: "Marca eliminada correctamente"});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la marca",
            error: err.message,
        });
    }
});

module.exports = router;