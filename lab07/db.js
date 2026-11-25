const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Prueba de conexión rápida (opcional, pero útil para ver si funciona)
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectar a PostgreSQL:', err.stack);
    }
    console.log('✅ Conectado exitosamente a PostgreSQL (Base de datos: ' + process.env.DB_NAME + ')');
    release();
});

module.exports = pool;
