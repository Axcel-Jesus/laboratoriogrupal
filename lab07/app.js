require('dotenv').config();
const express = require('express');
const session = require('express-session');

// IMPORTACIONES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tareaRoutes = require('./routes/tareaRoutes'); // <-- DEBE ESTAR

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true }
    })
);

app.use(express.static('public'));

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareaRoutes); // <-- DEBE ESTAR
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});
