const db = require("../config/db");

// Get all campuses
exports.getAllCampuses = async (req, res) => {
  try {
    const [campuses] = await db.query("SELECT * FROM campuses");
    res.json(campuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new campus
exports.addCampus = async (req, res) => {
  const { campus_name } = req.body;
  try {
    const [result] = await db.query("INSERT INTO campuses (campus_name) VALUES (?)", [campus_name]);
    res.json({ id: result.insertId, campus_name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a campus
exports.deleteCampus = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM campuses WHERE campus_id = ?", [id]);
    res.json({ message: "Campus deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
