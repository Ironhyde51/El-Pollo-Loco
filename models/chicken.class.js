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

    IMAGES_WALKING = [
        "assets/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    /**
     * Creates a chicken at a random level position and starts its animation.
     */
    constructor() {
        super()
        this.loadImage("assets/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.3;
        this.animate();
    }

    /**
     * Starts the movement loop and walking animation loop.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}
