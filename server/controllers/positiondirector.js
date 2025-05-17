const pool = require("../config/db"); // Import the database pool

// Controller to get all positiondirector
exports.getPositiondirector = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name FROM positiondirector");
    res.status(200).json(rows); // Send the result as JSON
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Failed to fetch positiondirector" }); // Send error response
  }
};

