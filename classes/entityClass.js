class Entity {
    constructor(health = 10, attack = 10) {
        this.health = Math.max(0, health); // Prevent negative health
        this.attack = Math.max(0, attack); // Prevent negative attack
        this.win_condition = false;
        this.lose_condition = false;
    }
}
