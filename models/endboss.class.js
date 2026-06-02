class Endboss extends MovableObject {

    width = 250;
    height = 400;
    energy = 100;



    IMAGES_WALKING = [
        'assets/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_DEAD = [
        'assets/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES_DEAD);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.y = 50;
        this.animate();

    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }


}

