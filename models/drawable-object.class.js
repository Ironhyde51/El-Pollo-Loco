/**
 * Base class for objects that can load images and draw themselves on the canvas.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 270;
    height = 150;
    width = 100;

    /**
     * Loads a single image and stores it as the current image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById("image") <img id="image" src="path">
        this.img.src = path;
    }

    /**
    * Draws the current image on the canvas when it is fully loaded.
    * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
    */
    draw(ctx) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) {
            return;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads multiple images and stores them in the image cache.
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
    * Draws a debug frame around selected objects when called.
    * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
    */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

        }
    }
}