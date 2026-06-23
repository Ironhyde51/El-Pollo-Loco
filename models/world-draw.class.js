/**
 * Handles all canvas drawing steps for the current world.
 */
class WorldDraw {
    
    /**
     * @param {World} world - Game world that provides objects, canvas and camera.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Draws one frame and schedules the next one.
     */
    draw() {
        let world = this.world;
        if (world.gameEnded) {
            this.drawEndScreen();
            return;
        }
        this.clearCanvas();
        this.updateDeathFall();
        this.drawBackground();
        this.drawHud();
        this.drawMovableObjects();
        world.ctx.translate(-world.camera_x, 0);
        this.requestNextFrame();
    }

    /**
     * Moves Pepe downward after the death fall starts.
     */
    updateDeathFall() {
        let world = this.world;
        if (world.pepeDeathFallStarted) {
            world.character.y += 12;
        }
    }

    /**
     * Clears the full canvas before a new frame is drawn.
     */
    clearCanvas() {
        let world = this.world;
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    /**
     * Requests the next animation frame for the draw loop.
     */
    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draws the current end screen image when the game has ended.
     */
    drawEndScreen() {
        let world = this.world;
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
        if (world.endScreenImage && world.endScreenImage.complete) {
            world.ctx.drawImage(world.endScreenImage, 0, 0, world.canvas.width, world.canvas.height);
            this.drawEndHint();
        }
    }

    /**
     * Draws the retry hint directly into the canvas end screen.
     */
    drawEndHint() {
        let world = this.world;
        world.ctx.font = "22px Rye";
        world.ctx.textAlign = "center";
        world.ctx.fillStyle = "rgba(42, 11, 0, 0.82)";
        world.ctx.fillRect(210, 420, 300, 42);
        world.ctx.strokeStyle = "#ffd43b";
        world.ctx.strokeRect(210, 420, 300, 42);
        world.ctx.fillStyle = "#ffd43b";
        world.ctx.fillText("Leertaste für Retry", 360, 448);
    }

    /**
     * Draws all background layers with camera translation.
     */
    drawBackground() {
        let world = this.world;
        world.ctx.translate(world.camera_x, 0);
        this.addObjectToMap(world.level.backgroundObjects);
    }

    /**
     * Draws fixed HUD elements like health, coins, bottles and boss health.
     */
    drawHud() {
        let world = this.world;
        world.ctx.translate(-world.camera_x, 0);
        this.addObjectToMap([world.startusBar]);
        this.addObjectToMap([world.statusbarCoin]);
        this.addObjectToMap([world.statusbarBottle]);
        if (world.endbossWasSeen) {
            this.addObjectToMap([world.statusbarEndboss]);
        }
        world.ctx.translate(world.camera_x, 0);
    }

    /**
     * Draws all world objects that move together with the camera.
     */
    drawMovableObjects() {
        let world = this.world;
        this.addObjectToMap(world.level.clouds);
        this.addObjectToMap(world.level.coins);
        this.addObjectToMap(world.level.bottles);
        this.addObjectToMap(world.level.bottleBoxes);
        this.addObjectToMap(world.level.enemies);
        this.addObjectToMap(world.throwableObjects);
        this.addToMap(world.character);
    }

    /**
     * Adds every object of an array to the canvas.
     * @param {DrawableObject[]} objects - Objects that should be drawn.
     */
    addObjectToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws one object and flips it when it faces the other direction.
     * @param {DrawableObject} movableObject - Object that should be drawn.
     */
    addToMap(movableObject) {
        let world = this.world;
        if (movableObject.othersDirection) {
            this.flipImage(movableObject);
        }
        movableObject.draw(world.ctx);
        if (movableObject.othersDirection) {
            this.flipImageBack(movableObject);
        }
    }

    /**
     * Mirrors the canvas before drawing an object that faces left.
     * @param {DrawableObject} movableObject - Object that should be flipped.
     */
    flipImage(movableObject) {
        let world = this.world;
        world.ctx.save();
        world.ctx.translate(movableObject.width, 0);
        world.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores object position and canvas state after drawing a flipped object.
     * @param {DrawableObject} movableObject - Object that was flipped.
     */
    flipImageBack(movableObject) {
        let world = this.world;
        movableObject.x = movableObject.x * -1;
        world.ctx.restore();
    }
}
