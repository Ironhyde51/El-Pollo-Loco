class BottleBox extends MovableObject {
  width = 90;
  height = 90;

  /**
   * @param {number} x - Horizontal position of the crate in the level.
   */
  constructor(x) {
    super();
    this.loadImage('assets/6_salsa_bottle/bottle_box.png');
    this.x = x;
    this.y = 350;
  }
}
