const { Pool } = require('pg');
require('dotenv').config();

// Si existe DATABASE_URL (en Render), la usa.
// Si no, construye la URL con las variables locales (tu .env).
const connectionString = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL 
    : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
    connectionString: connectionString,
    // SSL es obligatorio en producción (Render lo requiere).
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Prueba de conexión (útil en desarrollo, no expone datos sensibles)
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error al conectar a PostgreSQL:', err.stack);
    }
    console.log('✅ Conectado exitosamente a PostgreSQL');
    release();
});

module.exports = pool;
