const mysql = require('mysql2/promise')
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 50,
    timezone: '00:00'
});

(async () => {
    try {
        const conn = await db.getConnection();
        conn.release();
        console.log('Connected to database');
    } catch (err){
        console.error(err)
    }
})();


function onUpdate (result, res) {
    if (result.affectedRows === 0) {
        return res.json({
            success: false ,
            msg: "No se hizo algun tipo de cambios"
        })
    }
    return res.status(200).json({
        success: true,
        msg: "Accion ejecutada con exito"
    })
}

module.exports = {db,onUpdate}