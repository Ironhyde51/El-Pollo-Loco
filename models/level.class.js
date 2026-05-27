class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    bottleBoxes;
    level_end_x = 2252;

    constructor(enemies, clouds, backgroundObjects, coins, bottles, bottleBoxes) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.bottleBoxes = bottleBoxes;
    }
    
}