/**
 * Handles all collectable objects inside the game world.
 */
class WorldCollectableHandler {
    /**
     * Creates a collectable handler for one world instance.
     * @param {World} world - Game world that owns the collectable objects.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks collisions with all collectable objects.
     */
    checkCollectableCollisions() {
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkBottleBoxCollisions();
    }

    /**
     * Checks whether Pepe collects coins.
     */
    checkCoinCollisions() {
        this.world.level.coins.forEach((coin) => {
            if (this.isCharacterCollectingCoin(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    /**
     * Checks coin collection with a smaller character hitbox.
     * @param {Coin} coin - Coin that may be collected.
     * @returns {boolean} True when Pepe's coin hitbox touches the coin.
     */
    isCharacterCollectingCoin(coin) {
        let character = this.getCoinCollectCharacter();
        return this.world.isCollidingWithOffset(character, coin);
    }

    /**
     * Creates Pepe's coin collection hitbox.
     * @returns {Object} Character-sized object used for coin collection.
     */
    getCoinCollectCharacter() {
        return {
            x: this.world.character.x,
            y: this.world.character.y,
            width: this.world.character.width,
            height: this.world.character.height,
            offsetTop: 140,
            offsetBottom: 55,
            offsetLeft: 30,
            offsetRight: 30
        };
    }

    /**
     * Removes a collected coin and updates the coin status bar.
     * @param {Coin} coin - Coin that collided with Pepe.
     */
    collectCoin(coin) {
        let coinIndex = this.world.level.coins.indexOf(coin);
        if (coinIndex === -1) {
            return;
        }
        this.world.level.coins.splice(coinIndex, 1);
        playCoinCollectSound();
        this.world.collectedCoins++;
        this.updateCoinStatusbar();
    }

    /**
     * Calculates and applies the current coin collection percentage.
     */
    updateCoinStatusbar() {
        let totalCoins = this.world.collectedCoins + this.world.level.coins.length;
        let percentage = totalCoins === 0 ? 0 : (this.world.collectedCoins / totalCoins) * 100;
        this.world.statusbarCoin.setPercentage(percentage);
    }

    /**
     * Checks whether Pepe collects bottles.
     */
    checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle) => {
            if (this.world.isCollidingWithOffset(this.world.character, bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    /**
     * Collects a bottle and updates the bottle status bar.
     * @param {Bottle} bottle - Bottle that collided with Pepe.
     */
    collectBottle(bottle) {
        let bottleIndex = this.world.level.bottles.indexOf(bottle);
        if (bottleIndex === -1) {
            return;
        }
        this.world.level.bottles.splice(bottleIndex, 1);
        this.world.collectedBottles++;
        this.updateBottleStatusbar();
    }

    /**
     * Checks whether Pepe collides with bottle boxes.
     */
    checkBottleBoxCollisions() {
        this.world.level.bottleBoxes.forEach((bottleBox) => {
            if (this.world.isCollidingWithOffset(this.world.character, bottleBox)) {
                this.collectBottleBox(bottleBox);
            }
        });
    }

    /**
     * Collects a bottle box and refills Pepe's bottles.
     * @param {BottleBox} bottleBox - Bottle box that collided with Pepe.
     */
    collectBottleBox(bottleBox) {
        let bottleBoxIndex = this.world.level.bottleBoxes.indexOf(bottleBox);
        if (bottleBoxIndex === -1) {
            return;
        }
        this.world.level.bottleBoxes.splice(bottleBoxIndex, 1);
        this.world.collectedBottles = this.world.maxBottles;
        this.updateBottleStatusbar();
    }

    /**
     * Updates the bottle status bar based on collected bottles.
     */
    updateBottleStatusbar() {
        let percentage = this.getBottlePercentage();
        this.world.statusbarBottle.setPercentage(percentage);
    }

    /**
     * Calculates the current bottle fill percentage.
     * @returns {number} Bottle status bar percentage.
     */
    getBottlePercentage() {
        if (this.world.maxBottles === 0) {
            return 0;
        }
        return (this.world.collectedBottles / this.world.maxBottles) * 100;
    }
}
