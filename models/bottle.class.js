/**
 * Collectible salsa bottle that can later be thrown by the player.
 * @extends MovableObject
 */
class Bottle extends MovableObject {
  width = 60;
  height = 50;
  offsetTop = 0;
  offsetBottom = 4;
  offsetLeft = 0;
  offsetRight = 0;
  IMAGES = [
    'assets/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'assets/6_salsa_bottle/2_salsa_bottle_on_ground.png'
  ];

  /**
   * Creates a bottle at the given x position.
   * @param {number} x - Horizontal position of the bottle on the ground.
   * @param {number} [imageIndex=0] - Index of the bottle image variant.
   */
  constructor(x, imageIndex = 0) {
    super();
    this.loadImage(this.IMAGES[imageIndex]);
    this.x = x;
    this.y = 370;
  }
}
