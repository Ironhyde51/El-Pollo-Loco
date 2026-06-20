/**
 * Displays the endboss health as an image-based status bar.
 * @extends DrawableObject
 */
class StatusbarEndboss extends DrawableObject {
    IMAGES = [
        'assets/7_statusbars/2_statusbar_endboss/violet/0.png',
        'assets/7_statusbars/2_statusbar_endboss/violet/20.png',
        'assets/7_statusbars/2_statusbar_endboss/violet/40.png',
        'assets/7_statusbars/2_statusbar_endboss/violet/60.png',
        'assets/7_statusbars/2_statusbar_endboss/violet/80.png',
        'assets/7_statusbars/2_statusbar_endboss/violet/100.png'
    ];

    percentage = 100;

    /**
     * Creates the endboss status bar and initializes it with full health.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 200;
        this.y = 420;
        this.width = 320;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the endboss health percentage and refreshes the displayed image.
     * @param {number} percentage - Health value between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index that matches the current endboss health.
     * @returns {number} Index of the endboss status bar image.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        else if (this.percentage >= 80) return 4;
        else if (this.percentage >= 60) return 3;
        else if (this.percentage >= 40) return 2;
        else if (this.percentage >= 20) return 1;
        else return 0;
    }
}
