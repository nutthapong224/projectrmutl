const express = require("express");
const dotenv = require("dotenv");

const path = require("path");
const winston = require("winston");
const cors = require("cors"); // Import cors 
const badmintonRoutes = require("./routes/badmintonRoutes")
const departmentRoutes = require("./routes/departmentRoutes")
const basketballRoutes = require("./routes/basketballRoutes") 
const studentorganizationRoutes = require("./routes/studentOrganizationRoutes") 
const adminRoutes = require("./routes/adminRoutes")

// Load environment variables
dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads/")));

// Routes
// app.use("/api", userRoutes); 
app.use("/api/badminton", badmintonRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/basketball", basketballRoutes); 
app.use("/api/studentorgranization", studentorganizationRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
