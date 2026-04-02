const db = require('./db');

const Workout = {
    // Crear una nueva sesión de entrenamiento
    async createSession(userId, notes) {
        const sql = `INSERT INTO workout_sessions (user_id, notes) VALUES (?, ?)`;
        return await db.run(sql, [userId, notes]);
    },

    // Registrar una serie (Set)
    async addSet(sessionId, exerciseId, reps, weight, order) {
        const sql = `INSERT INTO sets (workout_session_id, exercise_id, reps, weight, set_order) 
                     VALUES (?, ?, ?, ?, ?)`;
        return await db.run(sql, [sessionId, exerciseId, reps, weight, order]);
    },

    // Obtener el historial completo de un usuario con los nombres de los ejercicios
    async getUserHistory(userId) {
        const sql = `
            SELECT ws.date, e.name as exercise_name, e.muscle_group, s.reps, s.weight, s.set_order
            FROM workout_sessions ws
            JOIN sets s ON ws.id = s.workout_session_id
            JOIN exercises e ON s.exercise_id = e.id
            WHERE ws.user_id = ?
            ORDER BY ws.date DESC, s.set_order ASC
        `;
        return await db.query(sql, [userId]);
    }
};

module.exports = Workout;