/**
 * Handles enemy collisions, stomp attacks and enemy damage.
 */
class WorldEnemyHandler {
    /**
     * Creates an enemy handler for one world instance.
     * @param {World} world - Game world that owns the enemies.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks collisions between Pepe and all enemies.
     */
    checkEnemyCollisions() {
        if (this.checkStompCollision()) {
            return;
        }
        this.world.level.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
    }

    /**
     * Checks the correct collision type for one enemy.
     * @param {MovableObject} enemy - Enemy that may collide with Pepe.
     */
    checkEnemyCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.checkEndbossCollision(enemy);
        } else {
            this.checkEnemyDamageCollision(enemy);
        }
    }

    /**
     * Checks whether Pepe jumps on any normal enemy before damage is checked.
     * @returns {boolean} True when an enemy was stomped.
     */
    checkStompCollision() {
        let enemy = this.findStompedEnemy();
        if (!enemy) {
            return false;
        }
        this.killEnemy(enemy);
        this.world.character.speedY = 20;
        return true;
    }

    /**
     * Finds the first normal enemy that Pepe lands on while falling.
     * @returns {MovableObject|undefined} Enemy that was stomped.
     */
    findStompedEnemy() {
        return this.world.level.enemies.find((enemy) =>
            !(enemy instanceof Endboss) && !enemy.isDead && this.isJumpingOnEnemy(enemy)
        );
    }

    /**
     * Checks whether the character lands on top of an enemy.
     * @param {MovableObject} enemy - Enemy that may be jumped on.
     * @returns {boolean} True when the character hits the enemy from above.
     */
    isJumpingOnEnemy(enemy) {
        let characterHitbox = this.world.getHitbox(this.world.character);
        let enemyHitbox = this.world.getHitbox(enemy);
        let previousBottom = this.getPreviousCharacterBottom();
        return this.isCharacterFallingOnEnemy(characterHitbox, enemyHitbox, previousBottom) &&
            this.hasEnoughHorizontalOverlap(characterHitbox, enemyHitbox, enemy);
    }

    /**
     * Checks whether Pepe is falling into the upper area of an enemy.
     * @param {Object} characterHitbox - Pepe's hitbox.
     * @param {Object} enemyHitbox - Enemy hitbox.
     * @param {number} previousBottom - Pepe's previous bottom position.
     * @returns {boolean} True when Pepe falls into the enemy stomp area.
     */
    isCharacterFallingOnEnemy(characterHitbox, enemyHitbox, previousBottom) {
        return this.world.character.speedY < 0 &&
            previousBottom <= enemyHitbox.top + 12 &&
            characterHitbox.bottom >= enemyHitbox.top - 10 &&
            characterHitbox.bottom <= enemyHitbox.bottom + 10;
    }

    /**
     * Calculates Pepe's previous bottom hitbox position.
     * @returns {number} Previous bottom position of Pepe's hitbox.
     */
    getPreviousCharacterBottom() {
        return this.world.character.previousY +
            this.world.character.height -
            (this.world.character.offsetBottom || 0);
    }

    /**
     * Checks whether Pepe's foot center is above the enemy.
     * @param {Object} characterHitbox - Pepe's hitbox.
     * @param {Object} enemyHitbox - Enemy hitbox.
     * @param {MovableObject} enemy - Enemy that may be stomped.
     * @returns {boolean} True when Pepe is horizontally above the enemy.
     */
    hasEnoughHorizontalOverlap(characterHitbox, enemyHitbox, enemy) {
        let characterCenter = characterHitbox.left + (characterHitbox.right - characterHitbox.left) / 2;
        let tolerance = enemy instanceof SmallChicken ? 18 : 8;
        return characterCenter >= enemyHitbox.left - tolerance &&
            characterCenter <= enemyHitbox.right + tolerance;
    }

    /**
     * Checks whether the endboss attack hits Pepe.
     * @param {Endboss} endboss - Endboss that may hit Pepe.
     */
    checkEndbossCollision(endboss) {
        if (endboss.isAttacking && this.world.isCollidingWithOffset(this.world.character, endboss)) {
            this.hitCharacter();
        }
    }

    /**
     * Checks whether Pepe touches a normal enemy from the side.
     * @param {MovableObject} enemy - Enemy that may damage Pepe.
     */
    checkEnemyDamageCollision(enemy) {
        if (!enemy.isDead && this.world.isCollidingWithOffset(this.world.character, enemy)) {
            this.hitCharacter();
        }
    }

    /**
     * Applies damage to Pepe and updates the health status bar.
     */
    hitCharacter() {
        this.world.character.hit();
        this.world.character.updateLastActionTime();
        this.world.startusBar.setPercentage(this.world.character.energy);
    }

    /**
     * Applies a bottle hit to a normal enemy or the endboss.
     * @param {MovableObject} enemy - Enemy hit by a bottle.
     */
    hitEnemyWithBottle(enemy) {
        if (enemy instanceof Endboss) {
            this.hitEndboss(enemy);
        } else {
            this.killEnemy(enemy);
        }
    }

    /**
     * Applies bottle damage to the endboss and updates the endboss status bar.
     * @param {Endboss} endboss - Endboss hit by a bottle.
     */
    hitEndboss(endboss) {
        endboss.hitEndboss();
        this.world.statusbarEndboss.setPercentage(endboss.energy);
        if (endboss.isDead()) {
            this.removeDeadEndboss(endboss);
        }
    }

    /**
     * Removes the dead endboss after the death animation and shows the winning screen.
     * @param {Endboss} endboss - Endboss that should be removed.
     */
    removeDeadEndboss(endboss) {
        setTimeout(() => {
            this.killEnemy(endboss);
            this.world.showWinningScreen();
        }, 800);
    }

    /**
     * Removes an enemy from the current level.
     * @param {MovableObject} enemy - Enemy that should be removed.
     */
    killEnemy(enemy) {
        let enemyIndex = this.world.level.enemies.indexOf(enemy);
        if (enemyIndex === -1) {
            return;
        }
        this.removeEnemy(enemy, enemyIndex);
    }

    /**
     * Removes an enemy immediately or after its death state.
     * @param {MovableObject} enemy - Enemy that should be removed.
     * @param {number} enemyIndex - Current enemy array index.
     */
    removeEnemy(enemy, enemyIndex) {
        if (typeof enemy.die === 'function') {
            this.removeEnemyAfterDeath(enemy);
        } else {
            this.world.level.enemies.splice(enemyIndex, 1);
        }
    }

    /**
     * Shows an enemy death image before removing the enemy from the level.
     * @param {MovableObject} enemy - Enemy that should play its death state.
     */
    removeEnemyAfterDeath(enemy) {
        if (enemy.isDead) {
            return;
        }
        enemy.die();
        setTimeout(() => this.removeEnemyFromLevel(enemy), 500);
    }

    /**
     * Removes an enemy object from the level enemy array.
     * @param {MovableObject} enemy - Enemy that should be removed.
     */
    removeEnemyFromLevel(enemy) {
        let enemyIndex = this.world.level.enemies.indexOf(enemy);
        if (enemyIndex !== -1) {
            this.world.level.enemies.splice(enemyIndex, 1);
        }
    }
}
