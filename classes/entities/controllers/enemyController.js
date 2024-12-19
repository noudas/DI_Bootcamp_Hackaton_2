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

    damageEnemy(name, amount, attackType = "") {
        const enemy = this.findEnemyByName(name);
        enemy.takeDamage(amount, attackType);
        return enemy;
    };

    healEnemy(name, amount){
        const enemy = this.findEnemyByName(name);
        enemy.healDamage(amount);
        return enemy
    };

    enemyAttackPlayer(name, player) {
        const enemy = this.findEnemyByName(name);
        enemy.attackPlayer(player);
        return { enemy, player };
    };

    checkEnemyDeath(name) {
        const enemy = this.findEnemyByName(name);
        return enemy.checkDeathCondition();
    };

    checkEnemyWin(name, player) {
        const enemy = this.findEnemyByName(name);
        return enemy.checkWinCondition(player);
    };

    getAllEnemies() {
        return Object.values(this.enemies);
    };

    removeEnemy(name) {
        const enemy = this.findEnemyByName(name);
        delete this.enemies[name];
        return enemy;
    };

};

module.exports = new EnemyController();