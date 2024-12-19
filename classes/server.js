const express = require("express");
const cors = require("cors");
const playerRoutes = require("./entities/routes/playerRoute");
const enemyRoutes = require("./entities/routes/enemyRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/players", playerRoutes);
app.use("/enemies", enemyRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
    res.status(200).send("Server is running successfully!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});