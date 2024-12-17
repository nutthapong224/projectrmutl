const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const badmintonRoutes = require("./routes/badmintonRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(userRoutes);
app.use(badmintonRoutes);

module.exports = app;
