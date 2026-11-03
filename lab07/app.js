require('dotenv').config();
const express = require('express');
const session = require('express-session');

// Importaciones
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tareaRoutes = require('./routes/tareaRoutes'); // <-- ESTA LÍNEA ES OBLIGATORIA

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true }
    })
);

app.use(express.static('public'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/tareas', tareaRoutes); // <-- ESTA LÍNEA ES OBLIGATORIA

app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});
