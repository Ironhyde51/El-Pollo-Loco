class Bottle extends MovableObject {
  width = 60;
  height = 50;
  offsetTop = 6;
  offsetBottom = 18;
  offsetLeft = 20;
  offsetRight = 18;

  IMAGES = [
  'assets/6_salsa_bottle/1_salsa_bottle_on_ground.png',
  'assets/6_salsa_bottle/2_salsa_bottle_on_ground.png'
];

  /**
   * @param {number} x - Horizontal position of the bottle on the ground.
   */
  constructor(x, imageIndex = 0) {
    super();
    this.loadImage(this.IMAGES[imageIndex]);
    this.x = x;
    this.y = 370;
  }
}
