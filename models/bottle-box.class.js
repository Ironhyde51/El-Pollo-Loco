/**
 * Collectible bottle box that refills the player's bottles.
 * @extends MovableObject
 */
class BottleBox extends MovableObject {
  width = 90;
  height = 90;

  /**
   * Creates a bottle box at the given x position.
   * @param {number} x - Horizontal position of the crate in the level.
   */
  constructor(x) {
    super();
    this.loadImage('assets/6_salsa_bottle/bottle_box.png');
    this.x = x;
    this.y = 350;
  }
}
