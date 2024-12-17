const pool = require("../config/db"); // Import the database pool

// Controller to get all departments
const getDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name FROM department");
    res.status(200).json(rows); // Send the result as JSON
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Failed to fetch departments" }); // Send error response
  }
};

module.exports = {
  getDepartments, // Export the controller function
};
