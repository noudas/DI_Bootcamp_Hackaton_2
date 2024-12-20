const express = require("express");

const cors = require("cors");
const {catRouter}= require('./routes/catRouter.js');
const playerRoutes = require("./routes/playerRoute");
const enemyRoutes = require("./routes/enemyRoute");

const PORT = 5000;

const app = express();
app.use(cors());
app.use("/", express.static(__dirname + "/public"));
app.use(express.json());

app.use("/players", playerRoutes);
app.use("/enemies", enemyRoutes);
app.use("/categories",catRouter)



// Health Check Endpoint
app.get("/healthcheck", (req, res) => {
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

