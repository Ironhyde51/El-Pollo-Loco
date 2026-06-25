/**
 * Small chicken enemy with faster movement and a smaller hitbox.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
    y = 390;
    height = 40;
    width = 40;
    energy = 5;
    isDead = false;
    offsetTop = 2;
    offsetBottom = 1;
    offsetLeft = 0;
    offsetRight = 0;

    IMAGES_WALKING = [
        'assets/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGE_DEAD = 'assets/3_enemies_chicken/chicken_small/2_dead/dead.png';

    /**
     * Creates a small chicken at a random level position and starts its animation.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);
        this.x = 500 + Math.random() * 1000;
        this.speed = 0.25 + Math.random() * 0.4;
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
     * Switches the small chicken to its dead image and stops movement.
     */
    die() {
        this.isDead = true;
        this.img = this.imageCache[this.IMAGE_DEAD];
    }
}
