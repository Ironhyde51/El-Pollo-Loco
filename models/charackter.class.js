/**
 * Player character Pepe with movement, jump, idle, hurt and death animations.
 * @extends MovableObject
 */
class Character extends MovableObject {

    x = 120;
    y = 140;
    height = 300;
    speed = 5;
    energy = 100;
    offsetTop = 80;
    offsetBottom = 5;
    offsetLeft = 45;
    offsetRight = 50;

    IMAGES_IDLE = [
        'assets/2_character_pepe/1_idle/idle/I-1.png',
        'assets/2_character_pepe/1_idle/idle/I-2.png',
        'assets/2_character_pepe/1_idle/idle/I-3.png',
        'assets/2_character_pepe/1_idle/idle/I-4.png',
        'assets/2_character_pepe/1_idle/idle/I-5.png',
        'assets/2_character_pepe/1_idle/idle/I-6.png',
        'assets/2_character_pepe/1_idle/idle/I-7.png',
        'assets/2_character_pepe/1_idle/idle/I-8.png',
        'assets/2_character_pepe/1_idle/idle/I-9.png',
        'assets/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'assets/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

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
    jumpAnimationStarted = false;

    world;
    currentImage = 0;
    lastActionTime = new Date().getTime();


    /**
     * Creates Pepe, loads his animation images and starts gravity and animation.
     */
    constructor() {
        super();
        this.loadImage('assets/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.walking_sound.loop = true;
        this.registerCharacterSounds();
        this.applyGravity();
        this.animate();
    }

    /**
     * Registers Pepe's sounds so they follow the global mute button.
     */
    registerCharacterSounds() {
        if (typeof registerSound === 'function') {
            registerSound(this.walking_sound);
            registerSound(this.landing_sound);
        }
    }

    /**
     * Saves the time of the latest movement or jump input.
     */
    updateLastActionTime() {
        this.lastActionTime = new Date().getTime();
    }

    /**
     * Checks whether Pepe has been inactive long enough for long idle animation.
     * @returns {boolean} True when Pepe has been idle for more than five seconds.
     */
    isLongIdle() {
        let timePassed = new Date().getTime() - this.lastActionTime;
        timePassed = timePassed / 1000;
        return timePassed > 5;
    }

    /**
     * Starts the input movement loop and the character animation loop.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts the movement loop for keyboard input and camera movement.
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.world.gameEnded || this.isDead()) {
                this.stopCharacterSounds();
                return;
            }
            let isMoving = this.handleMovement();
            this.handleJumpInput();
            this.updateActionTime(isMoving);
            this.playMovementSounds(isMoving);
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    /**
     * Stops all looping character sounds.
     */
    stopCharacterSounds() {
        this.walking_sound.pause();
    }
    /**
     * Starts the animation loop for Pepe's current state.
     */
    startAnimationLoop() {
        setInterval(() => {
            this.playCurrentAnimation();
        }, 100);
    }

    /**
     * Handles left and right movement input.
     * @returns {boolean} True when Pepe moved left or right.
     */
    handleMovement() {
        let isMoving = false;
        isMoving = this.moveCharacterRight() || isMoving;
        isMoving = this.moveCharacterLeft() || isMoving;
        return isMoving;
    }

    /**
     * Moves Pepe right when the right key is pressed.
     * @returns {boolean} True when Pepe moved right.
     */
    moveCharacterRight() {
        if (!this.world.keyboard.RIGHT || this.x >= this.world.level.level_end_x) {
            return false;
        }
        this.moveRight();
        this.othersDirection = false;
        return true;
    }

    /**
     * Moves Pepe left when the left key is pressed.
     * @returns {boolean} True when Pepe moved left.
     */
    moveCharacterLeft() {
        if (!this.world.keyboard.LEFT || this.x <= -520) {
            return false;
        }
        this.x -= this.speed;
        this.othersDirection = true;
        return true;
    }

    /**
     * Starts a jump when the space key is pressed and Pepe is on the ground.
     */
    handleJumpInput() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.jumpAnimationStarted = false;
        }
    }

    /**
     * Updates the idle timer after movement or jump input.
     * @param {boolean} isMoving - True when Pepe moved left or right.
     */
    updateActionTime(isMoving) {
        if (isMoving || this.world.keyboard.SPACE) {
            this.updateLastActionTime();
        }
    }

    /**
     * Plays the animation that matches Pepe's current state.
     */
    playCurrentAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playJumpAnimation();
        } else {
            this.playGroundAnimation();
        }
    }

    /**
     * Starts the jump animation from the first frame while Pepe is in the air.
     */
    playJumpAnimation() {
        if (!this.jumpAnimationStarted) {
            this.currentImage = 0;
            this.jumpAnimationStarted = true;
        }
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /**
     * Plays walking or idle animations while Pepe is on the ground.
     */
    playGroundAnimation() {
        this.jumpAnimationStarted = false;
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isLongIdle()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Gives Pepe upward speed for a jump.
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Plays walking and landing sounds depending on Pepe's movement state.
     * @param {boolean} isMoving - True when Pepe is walking left or right.
     */
    playMovementSounds(isMoving) {
        let isAboveGround = this.isAboveGround();
        this.playWalkingSound(isMoving, isAboveGround);
        this.playLandingSound(isAboveGround);
        this.wasAboveGround = isAboveGround;
    }

    /**
     * Plays or pauses the walking sound.
     * @param {boolean} isMoving - True when Pepe is moving.
     * @param {boolean} isAboveGround - True when Pepe is in the air.
     */
    playWalkingSound(isMoving, isAboveGround) {
        if (isMoving && !isAboveGround) {
            playSound(this.walking_sound, false);
        } else {
            this.walking_sound.pause();
        }
    }

    /**
     * Plays the landing sound when Pepe touches the ground.
     * @param {boolean} isAboveGround - True when Pepe is in the air.
     */
    playLandingSound(isAboveGround) {
        if (this.wasAboveGround && !isAboveGround) {
            playSound(this.landing_sound);
        }
    }
}
