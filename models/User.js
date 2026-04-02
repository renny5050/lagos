const db = require('./db');

const User = {
    async create(username, email, passwordHash) {
        const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
        return await db.run(sql, [username, email, passwordHash]);
    },

    async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const rows = await db.query(sql, [email]);
        return rows[0];
    },

    async findById(id) {
        const sql = `SELECT id, username, email FROM users WHERE id = ?`;
        const rows = await db.query(sql, [id]);
        return rows[0];
    }
};

module.exports = User;