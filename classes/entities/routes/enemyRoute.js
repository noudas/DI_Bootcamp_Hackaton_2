const express = require("express");
const router = express.Router();
const enemyController = require("../controllers/enemyController");
const playerController = require("../controllers/playerController");


router.post("/create", (req, res) => {
    try {
        const { name, health, attack, weakness } = req.body;
        const enemy = enemyController.createEnemy(name, health, attack, weakness);
        res.status(201).json({ message: "Enemy created successfully", enemy });
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

router.patch("/:name/damage", (req, res) => {
    try {
        const { amount, attackType } = req.body;
        const enemy = enemyController.damageEnemy(req.params.name, amount, attackType);
        res.status(200).json({ message: "Enemy damaged", enemy });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.patch("/:name/heal", (req, res) => {
    try {
        const { amount } = req.body;
        const enemy = enemyController.healEnemy(req.params.name, amount);
        res.status(200).json({ message: "Enemy healed", enemy });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/:name/attack", (req, res) => {
    try {
        const playerName = req.body.playerName;
        const player = playerController.findPlayerByName(playerName);
        const result = enemyController.enemyAttackPlayer(req.params.name, player);
        res.status(200).json({ message: "Enemy attacked player", result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:name/death", (req, res) => {
    try {
        const isDead = enemyController.checkEnemyDeath(req.params.name);
        res.status(200).json({ isDead });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.get("/:name/win", (req, res) => {
    try {
        const playerName = req.query.playerName;
        const player = playerController.findPlayerByName(playerName);
        const didWin = enemyController.checkEnemyWin(req.params.name, player);
        res.status(200).json({ didWin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", (req, res) => {
    const enemies = enemyController.getAllEnemies();
    res.status(200).json(enemies);
});


router.delete("/:name", (req, res) => {
    try {
        const enemy = enemyController.removeEnemy(req.params.name);
        res.status(200).json({ message: "Enemy removed", enemy });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;