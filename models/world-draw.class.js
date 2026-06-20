class WorldDraw {
    constructor(world) {
        this.world = world;
    }

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

    updateDeathFall() {
        let world = this.world;
        if (world.pepeDeathFallStarted) {
            world.character.y += 12;
        }
    }

    clearCanvas() {
        let world = this.world;
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    drawEndScreen() {
        let world = this.world;
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
        if (world.endScreenImage && world.endScreenImage.complete) {
            world.ctx.drawImage(world.endScreenImage, 0, 0, world.canvas.width, world.canvas.height);
        }
    }

    drawBackground() {
        let world = this.world;
        world.ctx.translate(world.camera_x, 0);
        this.addObjectToMap(world.level.backgroundObjects);
    }

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

    addObjectToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        });
    }

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

    flipImage(movableObject) {
        let world = this.world;
        world.ctx.save();
        world.ctx.translate(movableObject.width, 0);
        world.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    flipImageBack(movableObject) {
        let world = this.world;
        movableObject.x = movableObject.x * -1;
        world.ctx.restore();
    }
}
