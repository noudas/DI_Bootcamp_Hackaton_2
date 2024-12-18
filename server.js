const express = require("express");

const cors = require("cors");
const {catRouter}= require('./routes/catRouter.js');
const playerRoutes = require("./routes/playerRoute");
const enemyRoutes = require("./routes/enemyRoute");

const PORT = 5000;

const app = express();
app.use(cors());

app.use("/players", playerRoutes);
app.use("/enemies", enemyRoutes);
app.use("/categories",catRouter)

app.use(express.json());




// Health Check Endpoint
app.get("/", (req, res) => {
    res.status(200).send("Server is running successfully!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`run on ${PORT}`);
});