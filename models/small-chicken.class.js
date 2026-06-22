/**
 * Small chicken enemy with faster movement and a smaller hitbox.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
    y = 390;
    height = 40;
    width = 40;
    energy = 5;
    offsetTop = 6;
    offsetBottom = 3;
    offsetLeft = 4;
    offsetRight = 4;

    IMAGES_WALKING = [
        'assets/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /**
     * Creates a small chicken at a random level position and starts its animation.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 500 + Math.random() * 1000;
        this.speed = 0.25 + Math.random() * 0.4;
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
