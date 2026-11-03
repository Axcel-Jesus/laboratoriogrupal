require('dotenv').config();
const express = require('express');
const session = require('express-session');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tareaRoutes = require('./routes/tareaRoutes'); // NUEVA RUTA

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true
        }
    })
);

// Servir frontend
app.use(express.static('public'));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareaRoutes); // Nueva ruta para el To-Do List
app.use('/api', userRoutes);

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});
