/**
 * Base class for drawable objects that can move, collide, take damage and play animations.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    othersDirection = false;
    speedY = 0;
    previousY = 0;
    groundY = 140;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity by continuously updating vertical position and speed.
     */
    applyGravity() {
        setInterval(() => {
            this.previousY = this.y;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                this.keepObjectOnGround();
            }
        }, 1000 / 25);
    }

    /**
     * Keeps the object from falling below its fixed ground position.
     */
    keepObjectOnGround() {
        if (this.y > this.groundY) {
            this.y = this.groundY;
            this.speedY = 0;
        }
    }

    /**
     * Checks whether the object is above the ground.
     * @returns {boolean} True when the object is above the ground.
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Checks whether this object collides with another movable object.
     * @param {MovableObject} movableObject - Object to check collision with.
     * @returns {boolean} True when both objects overlap.
     */
    isColliding(movableObject) {
        return this.x + this.width > movableObject.x &&
            this.y + this.height > movableObject.y &&
            this.x < movableObject.x &&
            this.y < movableObject.y + movableObject.height;
    }

    /**
     * Reduces energy when the object is hit and prevents repeated damage during hurt time.
     */
    hit() {
        if (this.isHurt()) {
            return;
        }
        this.energy -= 15;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object is currently in hurt state.
     * @returns {boolean} True when the last hit was less than one second ago.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }

    /**
     * Checks whether the object's energy is empty.
     * @returns {boolean} True when energy is zero.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Plays an animation by cycling through a list of image paths.
     * @param {string[]} images - Image paths used for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length; 
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right and updates its direction.
     */
    moveRight() {
        this.x += this.speed;
        this.othersDirection = false;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;

    }

}
