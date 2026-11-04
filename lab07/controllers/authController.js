const bcrypt = require('bcryptjs');
let users = []; // Arreglo en memoria temporal

// ==================================================
// REGISTRO
// ==================================================
exports.register = async (req, res) => {
    try {
        let { nombres, apellidos, email, password } = req.body;
        email = email.trim().toLowerCase();
        
        if (!email || !password || !nombres || !apellidos) {
            return res.status(400).json({ status: 'fail', message: 'Todos los campos son obligatorios' });
        }
        
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ status: 'fail', message: 'El usuario ya existe' });
        }
        
        // Generar hash de la contraseña NUNCA en texto plano
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: users.length + 1,
            nombres,
            apellidos,
            email,
            password: hashedPassword
        };
        users.push(newUser);
        
        return res.status(201).json({ status: 'success', message: 'Usuario registrado' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: 'Error en servidor' });
    }
};

// ==================================================
// LOGIN
// ==================================================
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();
        
        const user = users.find(user => user.email === email);
        if (!user) return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
        
        // Comparar contraseña con el hash
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
        
        // Crear sesión[cite: 4]
        req.session.userId = user.id;
        
        return res.status(200).json({ status: 'success', message: 'Login exitoso' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: 'Error en servidor' });
    }
};

// ==================================================
// LOGOUT
// ==================================================
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ status: 'fail', message: 'Error' });
        res.clearCookie('connect.sid');
        return res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
    });
};

// ==================================================
// PERFIL (Ruta Protegida)
// ==================================================
exports.getProfile = (req, res) => {
    const user = users.find(user => user.id === req.session.userId);
    if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
    
    return res.status(200).json({
        status: 'success',
        data: {
            id: user.id,
            email: user.email,
            nombres: user.nombres, // Añadido para el index
            apellidos: user.apellidos
        }
    });
};