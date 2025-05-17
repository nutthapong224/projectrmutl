const express = require("express");
const dotenv = require("dotenv");

const path = require("path");
const winston = require("winston");
const cors = require("cors"); // Import cors 
const bodyParser = require('body-parser');
const departmentRoutes = require("./routes/departmentRoutes")

const studentorganizationRoutes = require("./routes/studentOrganizationRoutes") 

const esportRoutes = require("./routes/esportRoutes");

const registrationRoutes = require("./routes/registationRoutes");
const sportRoutes = require('./routes/sportRoutes');

const adminRoutes = require("./routes/adminRoutes")
const playerRoutes = require('./routes/playerRoutes');

const teamRoutes = require('./routes/teamRoutes');
const matchRoutes = require('./routes/matchRoutes');
const campusRoutes = require('./routes/campusesRoutes');
const coachRoutes = require("./routes/coachRoutes");
const positionDirectorRoutes= require("./routes/positiondirectorRoutes")
const directorRoutes = require("./routes/directorRoutes");
const positionCoachRoutes= require("./routes/positioncoachRoutes")
const newsRoutes = require("./routes/newsRoutes");
const medalRoutes = require("./routes/medalRoutes");
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
app.use(bodyParser.json());
// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
// app.use("/api", userRoutes); 
app.use("/api/admin", adminRoutes);

app.use("/api/esport",esportRoutes);
app.use("/api/coach",coachRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/medal',medalRoutes);
app.use("/api/registration", registrationRoutes);
app.use('/api/players', playerRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/campuses", campusRoutes);
app.use("/api/director", directorRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/positiondirector", positionDirectorRoutes);
app.use("/api/positioncoach", positionCoachRoutes);
app.use("/api/studentorgranization", studentorganizationRoutes);
app.use("/api/news", newsRoutes);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
