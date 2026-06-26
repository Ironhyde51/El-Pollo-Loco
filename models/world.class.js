/**
 * Main game world that connects the character, level, status bars, handlers and drawing logic.
 */
class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
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

    /**
     * Creates the game world and starts drawing, collision checks and throwing logic.
     * @param {HTMLCanvasElement} canvas - Canvas where the game is drawn.
     * @param {Keyboard} keyboard - Keyboard input object used to control the character.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.loadWorldHelpers();
        this.loadEndScreenImages();
        this.maxBottles = this.level.bottles.length;
        this.draw();
        this.setWorld();
        this.collisionHandler.start();
        this.throwableHandler.startThrowInterval();
    }

    /**
     * Creates helper classes that handle separated world responsibilities.
     */
    loadWorldHelpers() {
        this.worldDraw = new WorldDraw(this);
        this.collectableHandler = new WorldCollectableHandler(this);
        this.enemyHandler = new WorldEnemyHandler(this);
        this.throwableHandler = new WorldThrowableHandler(this);
        this.collisionHandler = new WorldCollisionHandler(this);
    }

    /**
     * Loads the images used for the game end screens.
     */
    loadEndScreenImages() {
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'assets/You won, you lost/Game-Over.png';
        this.winningImage = new Image();
        this.winningImage.src = 'assets/You won, you lost/winning-screen.png';
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
