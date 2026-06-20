/**
 * Represents one background layer image in the level.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a background object at a fixed position and size.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Currently unused horizontal value.
     * @param {number} y - Vertical position on the canvas.
     * @param {number} offsetX - Horizontal position in the level.
     * @param {number} height - Height of the background object.
     */
    constructor(imagePath, x, y, offsetX, height) {
        super().loadImage(imagePath);

        this.x = offsetX;
        this.y = y;
        this.height = height;
    }
}