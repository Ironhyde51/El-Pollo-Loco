class MovableObject extends DrawableObject {
    speed = 0.15;
    othersDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 140;
    }

    isColliding(movableObject) {
        return this.x + this.width > movableObject.x &&
            this.y + this.height > movableObject.y &&
            this.x < movableObject.x &&
            this.y < movableObject.y + movableObject.height;
    }

    hit() {

        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 10;
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(image) {
        let i = this.currentImage % image.length; // 0,1,2,3,4,5,0,1,2,...
        let path = image[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
        this.othersDirection = false;
    }

    moveLeft() {
        this.x -= this.speed;

    }

} 