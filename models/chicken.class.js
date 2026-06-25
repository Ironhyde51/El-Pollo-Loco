/**
 * Standard chicken enemy that walks left and can be defeated by Pepe.
 * @extends MovableObject
 */
class Chicken extends MovableObject {

    y = 370;
    height = 60;
    width = 60;
    energy = 5;
    isDead = false;
    offsetTop = 2;
    offsetBottom = 1;
    offsetLeft = 0;
    offsetRight = 0;

    IMAGES_WALKING = [
        "assets/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];
    IMAGE_DEAD = "assets/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    /**
     * Creates a chicken at a random level position and starts its animation.
     */
    constructor() {
        super()
        this.loadImage("assets/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.3;
        this.animate();
    }

    /**
     * Starts the movement loop and walking animation loop.
     */
    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Switches the chicken to its dead image and stops movement.
     */
    die() {
        this.isDead = true;
        this.img = this.imageCache[this.IMAGE_DEAD];
    }
}
