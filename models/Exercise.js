const db = require('./db');

const Exercise = {
    async getAll() {
        const sql = `SELECT * FROM exercises ORDER BY name ASC`;
        return await db.query(sql);
    },

    async create(name, muscleGroup, description) {
        const sql = `INSERT INTO exercises (name, muscle_group, description) VALUES (?, ?, ?)`;
        return await db.run(sql, [name, muscleGroup, description]);
    },

    async getById(id) {
        const sql = `SELECT * FROM exercises WHERE id = ?`;
        const rows = await db.query(sql, [id]);
        return rows[0];
    }
};

module.exports = Exercise;