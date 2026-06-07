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
    endScreenImage = new Image();
    pepeDeathFallStarted = false;
    throwableObjects = [];
    bottleWasThrown = false;
    collectedCoins = 0;
    collectedBottles = 0;
    maxBottles = 0;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
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

    setWorld() {
        this.character.world = this;
    }

    checkEndbossSeen() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && this.character.x > endboss.x - 700) {
            this.endbossWasSeen = true;
        }
    }

    checkCollisions() {
        setInterval(() => {
            if (this.gameEnded) {
                return;
            }
            this.checkEndbossSeen();
            this.checkGameEnd();
            this.checkEnemyCollisions();
            this.checkCoinCollisions();
            this.checkBottleCollisions();
            this.checkBottleBoxCollisions();
            this.checkThrowableObjectCollisions();
            this.removeDestroyedThrowableObjects();
        }, 50);
    }

    removeDestroyedThrowableObjects() {
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.markedForDeletion);
    }

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

    checkBottleBoxCollisions() {
        this.level.bottleBoxes.forEach((bottleBox) => {
            if (this.isCollidingWithOffset(this.character, bottleBox)) {
                this.collectBottleBox(bottleBox);
            }
        });
    }

    checkBottleCollisions() {
        this.level.bottles.forEach((bottle) => {
            if (this.isCollidingWithOffset(this.character, bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin) => {
            if (this.isCollidingWithOffset(this.character, coin)) {
                this.collectCoin(coin);
            }
        });
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                this.checkEndbossCollision(enemy);
            } else {
                this.checkNormalEnemyCollision(enemy);
            }
        });
    }

    checkEndbossCollision(endboss) {
        if (this.isCollidingWithOffset(this.character, endboss)) {
            this.character.hit();
            this.startusBar.setPercentage(this.character.energy);
        }
    }

    checkNormalEnemyCollision(enemy) {
        if (this.isJumpingOnEnemy(enemy)) {
            this.killEnemy(enemy);
            this.character.speedY = 15;
        } else if (this.isCollidingWithOffset(this.character, enemy)) {
            this.character.hit();
            this.startusBar.setPercentage(this.character.energy);
        }
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

    isJumpingOnEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        return this.character.speedY < 0 &&
            characterBottom >= enemyTop &&
            characterBottom <= enemyTop + 45 &&
            this.isCollidingWithOffset(this.character, enemy);
    }

    killEnemy(enemy) {
        let enemyIndex = this.level.enemies.indexOf(enemy);
        if (enemyIndex === -1) {
            return;
        }
        this.level.enemies.splice(enemyIndex, 1);
    }

    hitEnemyWithBottle(enemy) {
        if (enemy instanceof Endboss) {
            this.hitEndboss(enemy);
        } else {
            this.killEnemy(enemy);
        }
    }

    hitEndboss(endboss) {
        endboss.hit();
        this.statusbarEndboss.setPercentage(endboss.energy);
        if (endboss.isDead()) {
            this.removeDeadEndboss(endboss);
        }
    }

    removeDeadEndboss(endboss) {
        setTimeout(() => {
            this.killEnemy(endboss);
            this.showWinningScreen();
        }, 800);
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
            if (this.gameEnded) {
                return;
            }
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

    startPepeDeathFall() {
        if (this.pepeDeathFallStarted) {
            return;
        }
        this.pepeDeathFallStarted = true;
    }

    showGameOverScreen() {
        this.gameEnded = true;
        this.endScreenImage = this.gameOverImage;
        this.drawEndScreen();
    }

    showWinningScreen() {
        this.gameEnded = true;
        this.endScreenImage = this.winningImage;
        this.drawEndScreen();
    }

    draw() {
        if (this.gameEnded) {
            this.drawEndScreen();
            return;
        }
        this.updateDeathFall();
        this.clearCanvas();
        this.drawBackground();
        this.drawHud();
        this.drawMovableObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.requestNextFrame();
    }

    updateDeathFall() {
        if (this.pepeDeathFallStarted) {
            this.character.y += 12;
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
    }

    drawHud() {
        this.ctx.translate(-this.camera_x, 0);
        this.addObjectToMap([this.startusBar]);
        this.addObjectToMap([this.statusbarCoin]);
        this.addObjectToMap([this.statusbarBottle]);
        if (this.endbossWasSeen) {
            this.addObjectToMap([this.statusbarEndboss]);
        }
        this.ctx.translate(this.camera_x, 0);
    }

    drawMovableObjects() {
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.bottleBoxes);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObjects);
        this.addToMap(this.character);
    }

    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    drawEndScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.endScreenImage && this.endScreenImage.complete) {
            this.ctx.drawImage(this.endScreenImage, 0, 0, this.canvas.width, this.canvas.height);
        }
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
