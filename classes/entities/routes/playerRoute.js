const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

router.post("/create",(req,res) =>{
    const { name, health, attack, score } = req.body;
    try {
        const player = playerController.createNewPlayer(name, health, attack, score);
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
