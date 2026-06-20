/**
 * Displays the collected bottle progress as an image-based status bar.
 * @extends DrawableObject
 */
class StatusbarBottle extends DrawableObject {

  IMAGES = [
    'assets/7_statusbars/1_statusbar/3_statusbar_bottle/orange/hotsauce_bar_000_595x158.png',
    'assets/7_statusbars/1_statusbar/3_statusbar_bottle/orange/hotsauce_bar_020_595x158.png',
    'assets/7_statusbars/1_statusbar/3_statusbar_bottle/orange/hotsauce_bar_040_595x158.png',
    'assets/7_statusbars/1_statusbar/3_statusbar_bottle/orange/hotsauce_bar_060_595x158.png',
    'assets/7_statusbars/1_statusbar/3_statusbar_bottle/orange/hotsauce_bar_080_595x158.png',
    'assets/7_statusbars/1_statusbar/3_statusbar_bottle/orange/hotsauce_bar_100_595x158.png',
  ];

  percentage = 0;

  /**
   * Initialises the bottle status bar at 0 % and positions it on the HUD.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
    this.x = 88;
    this.y = 75;
    this.width = 180;
    this.height = 28;
  }

  /**
   * Updates the bar's stored percentage and refreshes the displayed image.
   * @param {number} percentage - New value between 0 and 100.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    this.chooseImage(this.percentage);
  }

  /**
   * Selects and applies the image matching the given percentage.
   * @param {number} percentage - Value between 0 and 100.
   */
  chooseImage(percentage) {
    let index = this.resolveImageIndex(percentage);
    this.img = this.imageCache[this.IMAGES[index]];
  }

  /**
   * Maps a percentage value to the corresponding image-array index from 0 to 5.
   * @param {number} percentage - Value between 0 and 100.
   * @returns {number} Index of the bottle status bar image.
   */
  resolveImageIndex(percentage) {
    if (percentage >= 100) return 5;
    else if (percentage >= 80) return 4;
    else if (percentage >= 60) return 3;
    else if (percentage >= 40) return 2;
    else if (percentage >= 20) return 1;
    else return 0;
  }
}
