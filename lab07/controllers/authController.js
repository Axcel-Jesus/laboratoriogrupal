const bcrypt = require('bcryptjs');
const db = require('../db'); // Conectamos a Postgres

// REGISTRO
exports.register = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Email y password son obligatorios' });
        }

        // Verificar si existe en la BD
        const userExists = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ status: 'fail', message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar en Postgres
        const newUser = await db.query(
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        return res.status(201).json({ status: 'success', message: 'Usuario registrado', data: newUser.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'fail', message: 'Error en servidor' });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();

        // Buscar en Postgres
        const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const passwordCorrect = await bcrypt.compare(password, user.password);
        
        if (!passwordCorrect) {
            return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
        }

        req.session.userId = user.id;
        return res.status(200).json({ status: 'success', message: 'Login exitoso', data: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'fail', message: 'Error en servidor' });
    }
};

// LOGOUT
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ status: 'fail', message: 'Error' });
        res.clearCookie('connect.sid');
        return res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
    });
};

// PERFIL
exports.getProfile = async (req, res) => {
    try {
        const result = await db.query('SELECT id, email FROM usuarios WHERE id = $1', [req.session.userId]);
        if (result.rows.length === 0) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
        res.status(200).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Error en servidor' });
    }
};
