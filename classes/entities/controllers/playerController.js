const Player = require("../config/playerClass")

class PlayerController{
    constructor(){
        this.players = []
    }

    createNewPlayer(name, health = 10, attack = 1, score = 0){
        const newPlayer = new Player(health,attack,score)
        newPlayer.name = name
        this.players.push(newPlayer);
        return newPlayer;
    }

    findPlayerByName(name){
        return this.players.find(player => player.name === name)
    }

    addScoretoPlayer(name,points){
        const player = this.findPlayerByName(name)
        if(player){
            player.increaseScore(points);
            return player
        }
        throw new Error(`Player ${name} not found`);
    }

    damagePlayer(name,amount){
        const player = this.findPlayerByName(name)
        if(player){
            player.takeDamage(amount);
            return player
        }
        throw new Error(`Player ${name} not found`);
    }

    healPlayer(name, amount) {
        const player = this.findPlayerByName(name);
        if (player) {
            player.healDamage(amount);
            return player;
        }
        throw new Error(`Player ${name} not found`);
    }

    checkWin(name) {
        const player = this.findPlayerByName(name);
        if (player) {
            return player.checkWinCondition();
        }
        throw new Error(`Player ${name} not found`);
    }

    checkWin(name) {
        const player = this.findPlayerByName(name);
        if (player) {
            return player.checkWinCondition();
        }
        throw new Error(`Player ${name} not found`);
    }
}

module.exports = new PlayerController();