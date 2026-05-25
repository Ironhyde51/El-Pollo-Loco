class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 270;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById("image") <img id="image" src="path">
        this.img.src = path;
    }

    draw(ctx) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) {
            return;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

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