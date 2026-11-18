require('dotenv').config();
const express = require('express');
const session = require('express-session');

// Importaciones de rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tareaRoutes = require('./routes/tareaRoutes'); // Ruta del CRUD de tareas

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    console.error('Falta SESSION_SECRET en .env');
    process.exit(1);
}

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

// Logger (opcional, pero útil para ver peticiones)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Servir archivos estáticos
app.use(express.static('public'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/tareas', tareaRoutes); // Ruta del To-Do List

// Redirección inicial
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});