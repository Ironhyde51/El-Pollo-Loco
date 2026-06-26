/**
 * Handles throwing bottles and collisions between thrown bottles and enemies.
 */
class WorldThrowableHandler {
    /**
     * Creates a throwable handler for one world instance.
     * @param {World} world - Game world that owns the throwable objects.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Starts the interval that handles bottle throwing.
     */
    startThrowInterval() {
        setInterval(() => {
            if (this.world.gameEnded) {
                return;
            }
            this.handleBottleThrowInput();
        }, 1000 / 60);
    }

    /**
     * Handles bottle throw input and button release state.
     */
    handleBottleThrowInput() {
        if (this.canThrowBottle()) {
            this.throwBottle();
            this.world.bottleWasThrown = true;
            this.world.lastBottleThrowTime = new Date().getTime();
        }
        if (!this.world.keyboard.D) {
            this.world.bottleWasThrown = false;
        }
    }

    /**
     * Checks bottle stock, key input and throw cooldown.
     * @returns {boolean} True when Pepe can throw a bottle.
     */
    canThrowBottle() {
        let timePassed = new Date().getTime() - this.world.lastBottleThrowTime;
        return this.world.keyboard.D &&
            !this.world.bottleWasThrown &&
            this.world.collectedBottles > 0 &&
            timePassed >= this.world.bottleThrowCooldown;
    }

    /**
     * Creates and throws a bottle in Pepe's current direction.
     */
    throwBottle() {
        let direction = this.world.character.othersDirection ? -1 : 1;
        let x = this.world.character.othersDirection ? this.world.character.x + 20 : this.world.character.x + 100;
        let y = this.world.character.y + 100;
        let bottle = new ThrowableObject(x, y, direction);
        this.world.throwableObjects.push(bottle);
        this.world.collectedBottles--;
        this.world.collectableHandler.updateBottleStatusbar();
        this.world.character.updateLastActionTime();
    }

    /**
     * Checks whether thrown bottles hit enemies.
     */
    checkBottleCollisions() {
        this.world.throwableObjects.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => this.checkBottleHit(bottle, enemy));
        });
    }

    /**
     * Checks and handles one bottle hit against one enemy.
     * @param {ThrowableObject} bottle - Thrown bottle that may hit an enemy.
     * @param {MovableObject} enemy - Enemy that may be hit by a bottle.
     */
    checkBottleHit(bottle, enemy) {
        if (!this.canBottleHitEnemy(bottle, enemy)) {
            return;
        }
        this.world.enemyHandler.hitEnemyWithBottle(enemy);
        bottle.splash();
    }

    /**
     * Checks whether a bottle may currently hit an enemy.
     * @param {ThrowableObject} bottle - Thrown bottle to check.
     * @param {MovableObject} enemy - Enemy to check.
     * @returns {boolean} True when the bottle can hit the enemy.
     */
    canBottleHitEnemy(bottle, enemy) {
        return !bottle.isSplashing &&
            !this.isEnemyAlreadyDead(enemy) &&
            this.world.isCollidingWithOffset(bottle, enemy);
    }

    /**
     * Checks whether an enemy is already in its death state.
     * @param {MovableObject} enemy - Enemy that should be checked.
     * @returns {boolean} True when the enemy should ignore further hits.
     */
    isEnemyAlreadyDead(enemy) {
        return enemy instanceof Endboss ? enemy.isDead() : enemy.isDead;
    }

    /**
     * Removes bottles that finished their splash animation.
     */
    removeDestroyedBottles() {
        this.world.throwableObjects = this.world.throwableObjects.filter((bottle) => !bottle.markedForDeletion);
    }
}
