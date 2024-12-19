const express = require("express");
const router = express.Router();
const enemyController = require("../controllers/enemyController");

router.post("/create", (req,res) =>{
    const { name, health, attack, weakness } = req.body;
    try {
        const enemy = enemyController.createEnemy(name, health, attack, weakness);
        res.status(200).json(enemy);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:name",(req,res) =>{
    const { name } = req.params;
    try {
        const enemy = enemyController.findEnemyByName(name);
        res.status(200).json(enemy);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

