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

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 200;
        this.y = 420;
        this.width = 320;
        this.height = 60;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        else if (this.percentage >= 80) return 4;
        else if (this.percentage >= 60) return 3;
        else if (this.percentage >= 40) return 2;
        else if (this.percentage >= 20) return 1;
        else return 0;
    }
} 0