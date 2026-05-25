class Character extends MovableObject {

    y = 10;
    height = 300;
    speed = 5;
    energy = 100;

    IMAGES_WALKING = [
        'assets/2_character_pepe/2_walk/W-21.png',
        'assets/2_character_pepe/2_walk/W-22.png',
        'assets/2_character_pepe/2_walk/W-23.png',
        'assets/2_character_pepe/2_walk/W-24.png',
        'assets/2_character_pepe/2_walk/W-25.png',
        'assets/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/2_character_pepe/3_jump/J-31.png',
        'assets/2_character_pepe/3_jump/J-32.png',
        'assets/2_character_pepe/3_jump/J-33.png',
        'assets/2_character_pepe/3_jump/J-34.png',
        'assets/2_character_pepe/3_jump/J-35.png',
        'assets/2_character_pepe/3_jump/J-36.png',
        'assets/2_character_pepe/3_jump/J-37.png',
        'assets/2_character_pepe/3_jump/J-38.png',
        'assets/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'assets/2_character_pepe/5_dead/D-51.png',
        'assets/2_character_pepe/5_dead/D-52.png',
        'assets/2_character_pepe/5_dead/D-53.png',
        'assets/2_character_pepe/5_dead/D-54.png',
        'assets/2_character_pepe/5_dead/D-55.png',
        'assets/2_character_pepe/5_dead/D-56.png',
        'assets/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'assets/2_character_pepe/4_hurt/H-41.png',
        'assets/2_character_pepe/4_hurt/H-42.png',
        'assets/2_character_pepe/4_hurt/H-43.png',
    ];

    walking_sound = new Audio('audio/pepe/walking1.mp3');
    landing_sound = new Audio('audio/pepe/walking.mp3');
    wasAboveGround = false;

    world;
    currentImage = 0;


    constructor() {
        super();
        this.loadImage('assets/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.walking_sound.loop = true;
        this.applyGravity();
        this.animate();
    }

    animate() {


        setInterval(() => {
            let isMoving = false;

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.othersDirection = false;
                isMoving = true;
            }

            if (this.world.keyboard.LEFT && this.x > -610) {
                this.x -= this.speed;
                this.othersDirection = true;
                isMoving = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            this.playMovementSounds(isMoving);
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);


        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    //walking animation
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 100);
    }

    jump() {
        this.speedY = 25;
    }

    playMovementSounds(isMoving) {
        let isAboveGround = this.isAboveGround();

        if (isMoving && !isAboveGround) {
            this.walking_sound.play().catch(() => {});
        } else {
            this.walking_sound.pause();
        }

        if (this.wasAboveGround && !isAboveGround) {
            this.landing_sound.currentTime = 0;
            this.landing_sound.play().catch(() => {});
        }

        this.wasAboveGround = isAboveGround;
    }
}
