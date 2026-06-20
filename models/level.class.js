/**
 * Stores all objects that belong to one level.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    bottleBoxes;
    level_end_x = 2252;

    /**
 * Creates a level with enemies, collectibles and background objects.
 * @param {MovableObject[]} enemies - Enemies and endboss of the level.
 * @param {Clouds[]} clouds - Cloud objects shown in the level.
 * @param {BackgroundObject[]} backgroundObjects - Background layers of the level.
 * @param {Coin[]} coins - Collectible coins.
 * @param {Bottle[]} bottles - Collectible bottles.
 * @param {BottleBox[]} bottleBoxes - Bottle boxes that refill bottles.
 */
    constructor(enemies, clouds, backgroundObjects, coins, bottles, bottleBoxes) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.bottleBoxes = bottleBoxes;
    }

}