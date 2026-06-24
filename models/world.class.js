/**
 * Main game world that connects the character, level, status bars, collisions and drawing logic.
 */
class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    worldDraw;
    camera_x = 0;
    startusBar = new StatusBar();
    statusbarCoin = new StatusbarCoin();
    statusbarBottle = new StatusbarBottle();
    statusbarEndboss = new StatusbarEndboss();
    endbossWasSeen = false;
    gameEnded = false;
    endScreenType = '';
    endScreenImage = new Image();
    pepeDeathFallStarted = false;
    throwableObjects = [];
    bottleWasThrown = false;
    lastBottleThrowTime = 0;
    bottleThrowCooldown = 600;
    collectedCoins = 0;
    collectedBottles = 0;
    maxBottles = 0;
    worldDraw = new WorldDraw(this);

    /**
     * Creates the game world and starts drawing, collision checks and throwing logic.
     * @param {HTMLCanvasElement} canvas - Canvas where the game is drawn.
     * @param {Keyboard} keyboard - Keyboard input object used to control the character.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.worldDraw = new WorldDraw(this);
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'assets/You won, you lost/Game-Over.png';
        this.winningImage = new Image();
        this.winningImage.src = 'assets/You won, you lost/winning-screen.png';
        this.maxBottles = this.level.bottles.length;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.checkThrowObjects();
    }

    /**
     * Passes the current world instance to objects that need access to global game state.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
    }

    /**
     * Detects the first time the character gets close to the endboss and starts the showdown.
     */
    checkEndbossSeen() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && !this.endbossWasSeen && this.character.x > endboss.x - 700) {
            this.endbossWasSeen = true;
            endboss.startAlert();
            playShowdownSound();
        }
    }

    /**
     * Starts the interval that checks all gameplay collisions and game-end conditions.
     */
    checkCollisions() {
        setInterval(() => {
            if (this.gameEnded) {
                return;
            }
            this.checkEndbossSeen();
            this.checkEndbossAttack();
            this.checkGameEnd();
            this.checkEnemyCollisions();
            this.checkCoinCollisions();
            this.checkBottleCollisions();
            this.checkBottleBoxCollisions();
            this.checkThrowableObjectCollisions();
            this.removeDestroyedThrowableObjects();
        }, 50);
    }

    /**
     * Removes bottles that finished their splash animation.
     */
    removeDestroyedThrowableObjects() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.markedForDeletion);
    }

    /**
     * Checks whether thrown bottles hit enemies.
     */
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!bottle.isSplashing && this.isCollidingWithOffset(bottle, enemy)) {
                    this.hitEnemyWithBottle(enemy);
                    bottle.splash();
                }
            });
        });
    }

    /**
     * Checks whether Pepe collides with bottle boxes.
     */
    checkBottleBoxCollisions() {
        this.level.bottleBoxes.forEach((bottleBox) => {
            if (this.isCollidingWithOffset(this.character, bottleBox)) {
                this.collectBottleBox(bottleBox);
            }
        });
    }

    /**
     * Checks whether Pepe collects bottles.
     */
    checkBottleCollisions() {
        this.level.bottles.forEach((bottle) => {
            if (this.isCollidingWithOffset(this.character, bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    /**
     * Checks whether Pepe collects coins.
     */
    checkCoinCollisions() {
        this.level.coins.forEach((coin) => {
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
        let character = {
            x: this.character.x,
            y: this.character.y,
            width: this.character.width,
            height: this.character.height,
            offsetTop: 140,
            offsetBottom: 55,
            offsetLeft: 30,
            offsetRight: 30
        };

        return this.isCollidingWithOffset(character, coin);
    }

    /**
     * Checks collisions between Pepe and all enemies.
     */
    checkEnemyCollisions() {
        if (this.checkStompCollision()) {
            return;
        }
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                this.checkEndbossCollision(enemy);
            } else {
                this.checkEnemyDamageCollision(enemy);
            }
        });
    }

    /**
     * Checks whether Pepe jumps on any normal enemy before damage is checked.
     * @returns {boolean} True when an enemy was stomped.
     */
    checkStompCollision() {
        let enemy = this.level.enemies.find((enemy) =>
            !(enemy instanceof Endboss) && this.isJumpingOnEnemy(enemy)
        );
        if (!enemy) {
            return false;
        }
        this.killEnemy(enemy);
        this.character.speedY = 20;
        return true;
    }

    /**
     * Checks whether the endboss attack hits Pepe.
     * @param {Endboss} endboss - Endboss that may hit Pepe.
     */
    checkEndbossCollision(endboss) {
        if (endboss.isAttacking && this.isCollidingWithOffset(this.character, endboss)) {
            this.character.hit();
            this.startusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Checks whether Pepe touches a normal enemy from the side.
     * @param {MovableObject} enemy - Enemy that may damage Pepe.
     */
    checkEnemyDamageCollision(enemy) {
        if (this.isCollidingWithOffset(this.character, enemy)) {
            this.character.hit();
            this.startusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Removes a collected coin from the level and updates the coin status bar.
     * @param {Coin} coin - Coin that collided with the character.
     */
    collectCoin(coin) {
        let coinIndex = this.level.coins.indexOf(coin);
        if (coinIndex === -1) {
            return;
        }
        this.level.coins.splice(coinIndex, 1);
        playCoinCollectSound();
        this.collectedCoins++;
        this.updateCoinStatusbar();
    }

    /**
     * Calculates and applies the current coin collection percentage.
     */
    updateCoinStatusbar() {
        let totalCoins = this.collectedCoins + this.level.coins.length;
        let percentage = totalCoins === 0 ? 0 : (this.collectedCoins / totalCoins) * 100;
        this.statusbarCoin.setPercentage(percentage);
    }

    /**
     * Checks whether two objects collide while respecting their hitbox offsets.
     * @param {MovableObject|DrawableObject} firstObject - First object to check.
     * @param {MovableObject|DrawableObject} secondObject - Second object to check.
     * @returns {boolean} True when both hitboxes overlap.
     */
    isCollidingWithOffset(firstObject, secondObject) {
        let first = this.getHitbox(firstObject);
        let second = this.getHitbox(secondObject);
        return first.right > second.left &&
            first.bottom > second.top &&
            first.left < second.right &&
            first.top < second.bottom;
    }

    /**
     * Checks whether the character lands on top of an enemy.
     * @param {MovableObject} enemy - Enemy that may be jumped on.
     * @returns {boolean} True when the character hits the enemy from above.
     */
    isJumpingOnEnemy(enemy) {
        let characterHitbox = this.getHitbox(this.character);
        let enemyHitbox = this.getHitbox(enemy);
        let stompArea = enemy instanceof SmallChicken ? 20 : 28;
        return this.character.speedY < 0 &&
            characterHitbox.bottom >= enemyHitbox.top &&
            characterHitbox.bottom <= enemyHitbox.top + stompArea &&
            characterHitbox.right > enemyHitbox.left + 8 &&
            characterHitbox.left < enemyHitbox.right - 8;
    }

    /**
     * Removes an enemy from the current level.
     * @param {MovableObject} enemy - Enemy that should be removed.
     */
    killEnemy(enemy) {
        let enemyIndex = this.level.enemies.indexOf(enemy);
        if (enemyIndex === -1) {
            return;
        }
        this.level.enemies.splice(enemyIndex, 1);
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
        this.statusbarEndboss.setPercentage(endboss.energy);
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
            this.showWinningScreen();
        }, 800);
    }

    /**
     * Collects a bottle and updates the bottle status bar.
     * @param {Bottle} bottle - Bottle that collided with Pepe.
     */
    collectBottle(bottle) {
        let bottleIndex = this.level.bottles.indexOf(bottle);
        if (bottleIndex === -1) {
            return;
        }
        this.level.bottles.splice(bottleIndex, 1);
        this.collectedBottles++;
        this.updateBottleStatusbar();
    }

    /**
     * Updates the bottle status bar based on collected bottles.
     */
    updateBottleStatusbar() {
        let percentage = this.maxBottles === 0 ? 0 : (this.collectedBottles / this.maxBottles) * 100;
        this.statusbarBottle.setPercentage(percentage);
    }

    /**
     * Collects a bottle box and refills Pepe's bottles.
     * @param {BottleBox} bottleBox - Bottle box that collided with Pepe.
     */
    collectBottleBox(bottleBox) {
        let bottleBoxIndex = this.level.bottleBoxes.indexOf(bottleBox);
        if (bottleBoxIndex === -1) {
            return;
        }
        this.level.bottleBoxes.splice(bottleBoxIndex, 1);
        this.collectedBottles = this.maxBottles;
        this.updateBottleStatusbar();
    }

    /**
     * Builds a collision hitbox from object position, size and offsets.
     * @param {MovableObject|DrawableObject} object - Object whose hitbox is calculated.
     * @returns {{left: number, right: number, top: number, bottom: number}} Calculated hitbox.
     */
    getHitbox(object) {
        return {
            left: object.x + (object.offsetLeft || 0),
            right: object.x + object.width - (object.offsetRight || 0),
            top: object.y + (object.offsetTop || 0),
            bottom: object.y + object.height - (object.offsetBottom || 0)
        };
    }

    /**
     * Starts the interval that handles bottle throwing.
     */
    checkThrowObjects() {
        setInterval(() => {
            if (this.gameEnded) {
                return;
            }
            if (this.canThrowBottle()) {
                this.throwBottle();
                this.bottleWasThrown = true;
                this.lastBottleThrowTime = new Date().getTime();
            }
            if (!this.keyboard.D) {
                this.bottleWasThrown = false;
            }
        }, 1000 / 60);
    }

    /**
     * Checks bottle stock, key input and throw cooldown.
     * @returns {boolean} True when Pepe can throw a bottle.
     */
    canThrowBottle() {
        let timePassed = new Date().getTime() - this.lastBottleThrowTime;

        return this.keyboard.D &&
            !this.bottleWasThrown &&
            this.collectedBottles > 0 &&
            timePassed >= this.bottleThrowCooldown;
    }

    /**
     * Creates and throws a bottle in Pepe's current direction.
     */
    throwBottle() {
        let direction = this.character.othersDirection ? -1 : 1;
        let x = this.character.othersDirection ? this.character.x + 20 : this.character.x + 100;
        let y = this.character.y + 100;
        let bottle = new ThrowableObject(x, y, direction);
        this.throwableObjects.push(bottle);
        this.collectedBottles--;
        this.updateBottleStatusbar();
    }

    /**
     * Starts the endboss attack when Pepe is close enough.
     */
    checkEndbossAttack() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.alertFinished && this.character.x > endboss.x - 320) {
            endboss.startAttack();
        }
    }

    /**
     * Checks whether Pepe died and whether the game-over screen should be shown.
     */
    checkGameEnd() {
        if (this.gameEnded) {
            return;
        }
        if (this.character.isDead()) {
            this.startPepeDeathFall();
        }
        if (this.pepeDeathFallStarted && this.character.y > this.canvas.height) {
            this.showGameOverScreen();
        }
    }

    /**
     * Starts Pepe's death fall once.
     */
    startPepeDeathFall() {
        if (this.pepeDeathFallStarted) {
            return;
        }
        this.pepeDeathFallStarted = true;
    }

    /**
     * Stops the game and draws the game-over screen.
     */
    showGameOverScreen() {
        this.gameEnded = true;
        this.endScreenType = 'gameover';
        this.endScreenImage = this.gameOverImage;
        hideTouchControls();
        showHomeButton();
        playLostSound();
        this.worldDraw.drawEndScreen();
    }

    /**
     * Stops the game and draws the winning screen.
     */
    showWinningScreen() {
        this.gameEnded = true;
        this.endScreenType = 'winning';
        this.endScreenImage = this.winningImage;
        hideTouchControls();
        showHomeButton();
        playWinningSound();
        this.worldDraw.drawEndScreen();
    }

    /**
     * Starts the world draw loop.
     */
    draw() {
        this.worldDraw.draw();
    }
}
