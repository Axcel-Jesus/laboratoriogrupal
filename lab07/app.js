require('dotenv').config();
const express = require('express');
const session = require('express-session');
// const authRoutes = require('./routes/authRoutes'); // Lo descomentaremos cuando armemos las rutas
// const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Permitir a Express recibir datos en formato JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar express-session para mantener a los usuarios logueados
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true // Medida de seguridad vital para proteger la cookie
        }
    })
);

// Servir archivos estáticos del frontend (HTML, CSS, JS)
// app.use(express.static('public')); 

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});