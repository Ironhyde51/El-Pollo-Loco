/**
 * Collectible coin that plays a simple spin animation.
 * @extends MovableObject
 */
class Coin extends MovableObject {
  width = 50;
  height = 50;
  offsetTop = 15;
  offsetBottom = 15;
  offsetLeft = 20;
  offsetRight = 20;

  IMAGES = [
    'assets/8_coin/coin_1.png',
    'assets/8_coin/coin_2.png',
  ];

  /**
   * Creates a coin at the given level position.
   * @param {number} x - Horizontal position on the level.
   * @param {number|null} y - Vertical position; defaults to 200 when omitted.
   */
  constructor(x, y) {
    super();
    this.loadImages(this.IMAGES);
    this.loadImage(this.IMAGES[0]);
    this.x = x;
    this.y = y ?? 200;
    this.animate();
  }

  /** Starts the two-frame spin animation on a 600 ms interval. */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 600);
  }
}
