class SmallChicken extends MovableObject {
    y = 390;
    height = 40;
    width = 40;
    energy = 5;

    IMAGES_WALKING = [
        'assets/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 500 + Math.random() * 1000;
        this.speed = 0.25 + Math.random() * 0.4;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}