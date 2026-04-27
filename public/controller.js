const express = require('express');
const path = require("node:path");
const fs = require("node:fs/promises");
const router = express.Router();


router.get("/", async (req, res) => {
    const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');

    const finalHtml = html.replace('{{titulo}}', 'Panel de Administración');

    res.type('html');
    res.send(finalHtml);
});


module.exports = router;