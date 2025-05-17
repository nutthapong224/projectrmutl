const db = require('../config/db');

exports.getTeams = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM teams");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTeam = async (req, res) => {
    const { name } = req.body;
    try {
        await db.query("INSERT INTO teams (name) VALUES (?)", [name]);
        res.status(201).json({ message: "Team added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
