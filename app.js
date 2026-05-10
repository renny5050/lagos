const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

// Configuración de variables de entorno
dotenv.config();

// Importar Controladores
const authCtrl = require('./controllers/authController');
const exerciseCtrl = require('./controllers/exerciseController');
const workoutCtrl = require('./controllers/workoutController');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Para leer formularios
app.use(express.json()); // Para peticiones AJAX si las hubiera


const path = require('path');
// ... other imports

// This makes everything inside the "public" folder available at the root URL
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Sesiones
app.use(session({
    secret: 'mi_clave_secreta_super_segura', // Cambia esto en producción
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Ponlo en true si usas HTTPS
}));

// --- MIDDLEWARE DE AUTENTICACIÓN ---
// Protege las rutas para que solo usuarios logueados entren
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// --- RUTAS PÚBLICAS ---
app.get('/', (req, res) => res.redirect('/login'));

app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

app.get('/register', authCtrl.getRegister);
app.post('/register', authCtrl.postRegister);

app.get('/login', authCtrl.getLogin);
app.post('/login', authCtrl.postLogin);
app.get('/logout', authCtrl.logout);

// --- RUTAS PRIVADAS (Requieren login) ---
app.get('/dashboard', isAuthenticated, workoutCtrl.getDashboard);

// Rutas de Ejercicios
app.get('/exercises', isAuthenticated, exerciseCtrl.listExercises);

// Rutas de Entrenamientos
app.get('/workout/new', isAuthenticated, workoutCtrl.getNewSession);
app.post('/workout/save', isAuthenticated, workoutCtrl.postWorkout);

// --- MANEJO DE ERRORES 404 ---
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});