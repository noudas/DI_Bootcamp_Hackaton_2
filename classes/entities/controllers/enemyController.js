const Enemy = require("../config/enemyClass")

class EnemyController{
    constructor(){
        this.enemies = {}
    };

    createEnemy(name, health = 10, attack = 10, weakness = "") {
        if (this.enemies[name]) {
            throw new Error("Enemy with this name already exists.");
        }
        const enemy = new Enemy(health, attack, weakness);
        this.enemies[name] = enemy;
        return enemy;
    };

    findEnemyByName(name) {
        const enemy = this.enemies[name];
        if (!enemy) {
            throw new Error("Enemy not found.");
        }
        return enemy;
    };

};