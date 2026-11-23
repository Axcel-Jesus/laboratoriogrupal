require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Importaciones de rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tareaRoutes = require('./routes/tareaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'clave_secreta_super_segura';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax'
        }
    })
);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/tareas', tareaRoutes);

// ESTA ES LA LÍNEA QUE ARREGLA EL "NOT FOUND"
// Redirige la raíz a tu página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
