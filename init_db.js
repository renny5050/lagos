const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Asegurar que la carpeta 'database' existe
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
    console.log('--- Carpeta "database" creada ---');
}

const dbPath = path.join(dbDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// 1. Script de creación de tablas
const sqlTables = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    muscle_group TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS workout_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_session_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight REAL NOT NULL,
    set_order INTEGER NOT NULL,
    FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);
`;

// 2. Catálogo fijo de ejercicios (Seeding)
const sqlSeed = `
INSERT OR IGNORE INTO exercises (name, muscle_group, description) VALUES 
('Press de Banca', 'Pecho', 'Empuje horizontal con barra para pectoral mayor.'),
('Sentadilla con Barra', 'Piernas', 'Ejercicio compuesto para cuádriceps y glúteos.'),
('Peso Muerto', 'Espalda/Piernas', 'Levantamiento de potencia para cadena posterior.'),
('Press Militar', 'Hombros', 'Empuje vertical para deltoides.'),
('Dominadas', 'Espalda', 'Tracción vertical para dorsal ancho.'),
('Remo con Barra', 'Espalda', 'Tracción horizontal para densidad de espalda.'),
('Curl de Bíceps', 'Brazos', 'Flexión de codos para bíceps braquial.'),
('Press Francés', 'Brazos', 'Extensión de codos para tríceps.'),
('Zancadas', 'Piernas', 'Trabajo unilateral para piernas y estabilidad.');
`;

// 3. Ejecución secuencial
db.serialize(() => {
    // Crear tablas
    db.exec(sqlTables, (err) => {
        if (err) {
            console.error('Error al crear las tablas:', err.message);
            return;
        }
        console.log('--- Estructura de tablas lista ---');

        // Insertar datos iniciales
        db.exec(sqlSeed, (err) => {
            if (err) {
                console.error('Error al precargar ejercicios:', err.message);
            } else {
                console.log('--- Catálogo de ejercicios precargado con éxito ---');
                console.log('--- Base de datos inicializada por completo ---');
            }
            // Cerrar la conexión al terminar todo
            db.close();
        });
    });
});