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
    throwableObjects = [];
    bottleWasThrown = false;
    collectedCoins = 0;
    collectedBottles = 0;
    maxBottles = 0;



    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.maxBottles = this.level.bottles.length;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.checkThrowObjects();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.startusBar.setPercentage(this.character.energy);
                }
            });

            this.level.coins.forEach((coin) => {
                if (this.isCollidingWithOffset(this.character, coin)) {
                    this.collectCoin(coin);
                }
            });

            this.level.bottles.forEach((bottle) => {
                if (this.isCollidingWithOffset(this.character, bottle)) {
                    this.collectBottle(bottle);
                }
            });

            this.throwableObjects.forEach((bottle) => {
                this.level.enemies.forEach((enemy) => {
                    if (!bottle.isSplashing && bottle.isColliding(enemy)) {
                        bottle.splash();
                    }
                });
            });

            this.level.bottleBoxes.forEach((bottleBox) => {
                if (this.isCollidingWithOffset(this.character, bottleBox)) {
                    this.collectBottleBox(bottleBox);
                }
            });

            this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.markedForDeletion);
        }, 200);
    }

    collectCoin(coin) {
        let coinIndex = this.level.coins.indexOf(coin);
        if (coinIndex === -1) {
            return;
        }

        this.level.coins.splice(coinIndex, 1);
        this.collectedCoins++;
        this.updateCoinStatusbar();
    }

    updateCoinStatusbar() {
        let totalCoins = this.collectedCoins + this.level.coins.length;
        let percentage = totalCoins === 0 ? 0 : (this.collectedCoins / totalCoins) * 100;
        this.statusbarCoin.setPercentage(percentage);
    }

    isCollidingWithOffset(firstObject, secondObject) {
        let first = this.getHitbox(firstObject);
        let second = this.getHitbox(secondObject);

        return first.right > second.left &&
            first.bottom > second.top &&
            first.left < second.right &&
            first.top < second.bottom;
    }

    collectBottle(bottle) {
        let bottleIndex = this.level.bottles.indexOf(bottle);
        if (bottleIndex === -1) {
            return;
        }

        this.level.bottles.splice(bottleIndex, 1);
        this.collectedBottles++;
        this.updateBottleStatusbar();
    }

    updateBottleStatusbar() {
        let percentage = this.maxBottles === 0 ? 0 : (this.collectedBottles / this.maxBottles) * 100;
        this.statusbarBottle.setPercentage(percentage);
    }

    collectBottleBox(bottleBox) {
        let bottleBoxIndex = this.level.bottleBoxes.indexOf(bottleBox);
        if (bottleBoxIndex === -1) {
            return;
        }
        this.level.bottleBoxes.splice(bottleBoxIndex, 1);
        this.collectedBottles = this.maxBottles;
        this.updateBottleStatusbar();
    }

    getHitbox(object) {
        return {
            left: object.x + (object.offsetLeft || 0),
            right: object.x + object.width - (object.offsetRight || 0),
            top: object.y + (object.offsetTop || 0),
            bottom: object.y + object.height - (object.offsetBottom || 0)
        };
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.D && !this.bottleWasThrown && this.collectedBottles > 0) {
                this.throwBottle();
                this.bottleWasThrown = true;
            }

            if (!this.keyboard.D) {
                this.bottleWasThrown = false;
            }
        }, 1000 / 60);
    }

    throwBottle() {
        let direction = this.character.othersDirection ? -1 : 1;
        let x = this.character.othersDirection ? this.character.x + 20 : this.character.x + 100;
        let y = this.character.y + 100;
        let bottle = new ThrowableObject(x, y, direction);
        this.throwableObjects.push(bottle);
        this.collectedBottles--;
        this.updateBottleStatusbar();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addObjectToMap([this.startusBar]);
        this.addObjectToMap([this.statusbarCoin]);
        this.addObjectToMap([this.statusbarBottle]);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.bottleBoxes);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        //draw wird immerwieder aufgerufen, damit die Bewegungen der Charaktere sichtbar werden
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(movableObject) {

        if (movableObject.othersDirection) {
            this.flipImage(movableObject);
        }

        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);

        if (movableObject.othersDirection) {
            this.flipImageBack(movableObject);
        }
    }

    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    flipImageBack(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }
}
