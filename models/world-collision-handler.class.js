/**
 * Handles the repeated world checks for collisions, boss state and game end state.
 */
class WorldCollisionHandler {
    /**
     * Creates a collision handler for one world instance.
     * @param {World} world - Game world that owns the checked objects.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Starts the interval that checks gameplay collisions and game-end conditions.
     */
    start() {
        setInterval(() => {
            if (this.world.gameEnded) {
                return;
            }
            this.runChecks();
        }, 50);
    }

    /**
     * Runs all world checks for one interval tick.
     */
    runChecks() {
        this.checkEndbossSeen();
        this.checkEndbossAttack();
        this.checkGameEnd();
        this.world.enemyHandler.checkEnemyCollisions();
        this.world.collectableHandler.checkCollectableCollisions();
        this.world.throwableHandler.checkBottleCollisions();
        this.world.throwableHandler.removeDestroyedBottles();
    }

    /**
     * Detects the first time Pepe gets close to the endboss and starts the showdown.
     */
    checkEndbossSeen() {
        let endboss = this.world.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && !this.world.endbossWasSeen && this.world.character.x > endboss.x - 700) {
            this.world.endbossWasSeen = true;
            endboss.startAlert();
            playShowdownSound();
        }
    }

    /**
     * Starts the endboss attack when Pepe is close enough.
     */
    checkEndbossAttack() {
        let endboss = this.world.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.alertFinished && this.world.character.x > endboss.x - 320) {
            endboss.startAttack();
        }
    }

    /**
     * Checks whether Pepe died and whether the game-over screen should be shown.
     */
    checkGameEnd() {
        if (this.world.character.isDead()) {
            this.startPepeDeathFall();
        }
        if (this.world.pepeDeathFallStarted && this.world.character.y > this.world.canvas.height) {
            this.world.showGameOverScreen();
        }
    }

    /**
     * Starts Pepe's death fall once.
     */
    startPepeDeathFall() {
        if (!this.world.pepeDeathFallStarted) {
            this.world.pepeDeathFallStarted = true;
        }
    }
}
