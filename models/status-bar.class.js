/**
 * Displays the character health status as an image-based status bar.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    IMAGES = [
        'assets/7_statusbars/1_statusbar/2_statusbar_health/green/0pro.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/green/20pro.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/green/40pro.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/green/60pro.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/green/80pro.png',
        'assets/7_statusbars/1_statusbar/2_statusbar_health/green/100pro.png'
    ];

    percentage = 100;

    /**
     * Creates the health status bar and initializes it with full health.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 10;
        this.width = 250;
        this.height = 50;
        this.setPercentage(100);
    }

    /**
     * Updates the health percentage and changes the displayed status bar image.
     * @param {number} percentage - Health value between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index that matches the current health percentage.
     * @returns {number} Index of the status bar image.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
