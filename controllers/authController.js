const User = require('../models/User');

exports.getRegister = (req, res) => res.render('auth/register');

exports.postRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // En un caso real: const hash = await bcrypt.hash(password, 10);
        await User.create(username, email, password); 
        res.redirect('/login');
    } catch (error) {
        // Manejamos el error (ej. email duplicado) con la nueva vista
        res.status(500).render('error', {
            title: 'Error de',
            titleHighlight: 'Registro',
            message: 'No pudimos crear tu cuenta. Es posible que el correo o usuario ya estén en uso.',
            redirectUrl: '/register'
        });
    }
};

exports.getLogin = (req, res) => res.render('auth/login');

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (user && user.password_hash === password) { // Validación simple
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.redirect('/dashboard');
        }
        // Credenciales inválidas
        res.status(401).render('error', {
            title: 'Acceso',
            titleHighlight: 'Denegado',
            message: 'Las credenciales proporcionadas son incorrectas. Verifica tu email y contraseña.',
            redirectUrl: '/login'
        });
    } catch (error) {
        // Error del servidor
        res.status(500).render('error', {
            title: 'Error del',
            titleHighlight: 'Sistema',
            message: 'Ocurrió un problema de nuestro lado al intentar iniciar sesión. Intenta de nuevo.',
            redirectUrl: '/login'
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};