/**
 * Represents a cloud that moves slowly across the level background.
 * @extends MovableObject
 */
class Clouds extends MovableObject {

    y = 50;
    width = 500;
    height = 250;

    IMAGES = [
        'assets/5_background/layers/4_clouds/1.png',
        'assets/5_background/layers/4_clouds/2.png',
    ];

    /**
     * Creates a cloud at a random horizontal position.
     * @param {number} x - Horizontal position of the cloud.
     */
    constructor(x = Math.random() * 2500) {
        super();
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[Math.floor(Math.random() * this.IMAGES.length)]);
        this.x = x;
        this.speed = 0.15;
        this.animate();
    }

    /**
    * Moves the cloud continuously to the left.
    */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

}
