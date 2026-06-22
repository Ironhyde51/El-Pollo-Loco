/**
 * Final boss enemy with alert, walk, attack, hurt and death animations.
 * @extends MovableObject
 */
class Endboss extends MovableObject {

    width = 250;
    height = 400;
    energy = 100;
    isAttacking = false;
    isAlerting = false;
    alertFinished = false;
    world;
    speed = 2.7;


    IMAGES_WALKING = [
        'assets/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'assets/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'assets/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'assets/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'assets/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates the endboss, loads all animation images and starts its behavior.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.y = 50;
        this.animate();
        this.moveTowardsCharacter();

    }

    /**
     * Chooses and plays the correct animation depending on the boss state.
     */
    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.isAlerting) {
                this.playAnimation(this.IMAGES_ALERT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Starts a short attack animation if the boss is alive and not attacking.
     */
    startAttack() {
        if (this.isDead() || this.isAttacking) {
            return;
        }
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 1400);
    }

    /**
     * Plays the alert animation once before the boss begins walking.
     */
    startAlert() {
        if (this.isAlerting || this.alertFinished) {
            return;
        }
        this.isAlerting = true;
        setTimeout(() => {
            this.isAlerting = false;
            this.alertFinished = true;
        }, 1600);
    }

    /**
     * Reduces the boss health and stores the hit time for the hurt animation.
     */
    hitEndboss() {
        this.energy -= 20;
        this.lastHit = new Date().getTime();

        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Moves the boss toward Pepe after the alert animation has finished.
     */
    moveTowardsCharacter() {
        setInterval(() => {
            if (!this.world || this.isDead()) {
                return;
            }
            if (this.world.endbossWasSeen && this.alertFinished && this.x > this.world.character.x + 40) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
    }

}

