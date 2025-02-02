const express = require("express");
const dotenv = require("dotenv");

const path = require("path");
const winston = require("winston");
const cors = require("cors"); // Import cors 

const departmentRoutes = require("./routes/departmentRoutes")
const badmintonsRoutes = require("./routes/badmintonsRoutes")
const studentorganizationRoutes = require("./routes/studentOrganizationRoutes") 
const adminRoutes = require("./routes/adminRoutes")
const approvebadmintonRoutes = require("./routes/approvebadmintonRoutes")
const approvebasketballRoutes = require("./routes/approvebasketballRoutes")
const basketballRoutes  = require("./routes/basketballRoutes");
const footballRoutes = require("./routes/footballRoutes")
const approvefootballRoutes = require("./routes/approvefootballRoutes");
const approvefutsalRoutes = require("./routes/approvefutsalRoutes");
const futsalRoutes = require("./routes/futsalRoutes");
const esportRoutes = require("./routes/esportRoutes"); 
const approveesportRoutes = require("./routes/approveesportRoutes");
const approvetakrawRoutes = require("./routes/approvetakrawRoutes");
const takrawRoutes  =require("./routes/takrawRoutes");
const hooptakrawRoutes = require("./routes/hooptakrawRoutes");
const approvehooptakrawRoutes = require("./routes/approvehooptakrawRoutes");
const approvevolleyballRoutes = require("./routes/approvevolleyballRoutes"); 
const volleyballRoutes = require("./routes/volleyballRoutes");
const petanqueRoutes = require("./routes/petanqueRoutes");
const approvepetanqueRoutes = require("./routes/approvepetanqueRoutes");
const tabletenisRoutes = require("./routes/tabletenisRoutes");
const approvetabletenisRoutes = require("./routes/approvetabletenisRoutes");

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
// app.use("/api", userRoutes); 
app.use("/api/badmintons", badmintonsRoutes); 
app.use("/api/approvebadminton", approvebadmintonRoutes); 
app.use("/api/approvebasketball", approvebasketballRoutes); 
app.use("/api/approvefootball", approvefootballRoutes); 
app.use("/api/approveesport", approveesportRoutes); 
app.use("/api/approvefutsal", approvefutsalRoutes); 
app.use("/api/approvetakraw", approvetakrawRoutes); 
app.use("/api/approvehooptakraw", approvehooptakrawRoutes); 
app.use("/api/approvevolleyball", approvevolleyballRoutes); 
app.use("/api/approvepetanque", approvepetanqueRoutes); 
app.use("/api/approvetabletenis", approvetabletenisRoutes); 
app.use("/api/esport", esportRoutes);
app.use("/api/futsal", futsalRoutes); 
app.use("/api/basketball", basketballRoutes); 
app.use("/api/football", footballRoutes); 
app.use("/api/takraw", takrawRoutes); 
app.use("/api/hooptakraw", hooptakrawRoutes); 
app.use("/api/volleyball", volleyballRoutes);
app.use("/api/petanque", petanqueRoutes);
app.use("/api/tabletenis", tabletenisRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/department", departmentRoutes);

app.use("/api/studentorgranization", studentorganizationRoutes);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
