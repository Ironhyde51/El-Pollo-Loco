class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    constructor(imagePath, x, y, offsetX, height) {
        super().loadImage(imagePath);

        this.x = offsetX;
        this.y = y;
        this.height = height;
    }
}