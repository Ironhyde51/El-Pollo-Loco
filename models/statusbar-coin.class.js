/**
 * Displays the collected coin progress as an image-based status bar.
 * @extends DrawableObject
 */
class StatusbarCoin extends DrawableObject {

  IMAGES = [
    'assets/7_statusbars/1_statusbar/1_statusbar_coin/blue/coin_bar_000_595x158.png',
    'assets/7_statusbars/1_statusbar/1_statusbar_coin/blue/coin_bar_020_595x158.png',
    'assets/7_statusbars/1_statusbar/1_statusbar_coin/blue/coin_bar_040_595x158.png',
    'assets/7_statusbars/1_statusbar/1_statusbar_coin/blue/coin_bar_060_595x158.png',
    'assets/7_statusbars/1_statusbar/1_statusbar_coin/blue/coin_bar_080_595x158.png',
    'assets/7_statusbars/1_statusbar/1_statusbar_coin/blue/coin_bar_100_595x158.png',
  ];

  percentage = 0;
  emptyImage;
  fullImage;

  /**
   * Initialises the coin status bar at 0 % and positions it on the HUD.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.emptyImage = this.imageCache[this.IMAGES[0]];
    this.fullImage = this.imageCache[this.IMAGES[5]];
    this.setPercentage(0);
    this.x = 53;
    this.y = 45;
    this.width = 218;
    this.height = 40;
  }

  /**
   * Updates the bar's stored percentage and refreshes the displayed image.
   * @param {number} percentage - New value between 0 and 100.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    this.img = this.emptyImage;
  }

  /**
   * Draws the empty bar and overlays the filled bar based on the current percentage.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  draw(ctx) {
    if (!this.emptyImage.complete || !this.fullImage.complete) {
      return;
    }
    this.drawEmptyBar(ctx);
    this.drawFilledBar(ctx);
  }

  /**
   * Draws the empty coin bar background.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  drawEmptyBar(ctx) {
    ctx.drawImage(this.emptyImage, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws the visible filled part of the coin bar.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  drawFilledBar(ctx) {
    let fillWidth = this.width * (this.percentage / 100);
    if (fillWidth <= 0) {
      return;
    }
    ctx.drawImage(this.fullImage, 0, 0, this.fullImage.width * (this.percentage / 100),
      this.fullImage.height, this.x, this.y, fillWidth, this.height);
  }
}
