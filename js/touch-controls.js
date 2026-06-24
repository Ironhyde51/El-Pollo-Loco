
/**
 * Checks whether touch input should be ignored.
 * @returns {boolean} True when the game is not active.
 */
function shouldBlockTouchInput() {
    return !world || world.gameEnded;
}

/**
 * Enables movement to the left while the left touch button is pressed.
 */
document.getElementById("touchLeft").addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (shouldBlockTouchInput()) {
        return;
    }
    keyboard.LEFT = true;
});

/**
 * Stops movement to the left when the left touch button is released.
 */
document.getElementById("touchLeft").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.LEFT = false;
});

/**
 * Resets left movement when the left touch interaction is cancelled by the browser.
 */
document.getElementById("touchLeft").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.LEFT = false;
});

/**
 * Enables movement to the right while the right touch button is pressed.
 */
document.getElementById("touchRight").addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (shouldBlockTouchInput()) {
        return;
    }
    keyboard.RIGHT = true;
});

/**
 * Stops movement to the right when the right touch button is released.
 */
document.getElementById("touchRight").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.RIGHT = false;
});

/**
 * Resets right movement when the right touch interaction is cancelled by the browser.
 */
document.getElementById("touchRight").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.RIGHT = false;
});

/**
 * Enables jumping while the jump touch button is pressed.
 */
document.getElementById("touchJump").addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (shouldBlockTouchInput()) {
        return;
    }
    keyboard.SPACE = true;
});

/**
 * Stops the jump input when the jump touch button is released.
 */
document.getElementById("touchJump").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.SPACE = false;
});

/**
 * Resets the jump input when the jump touch interaction is cancelled by the browser.
 */
document.getElementById("touchJump").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.SPACE = false;
});

/**
 * Enables bottle throwing while the throw touch button is pressed.
 */
document.getElementById("touchThrow").addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (shouldBlockTouchInput()) {
        return;
    }
    keyboard.D = true;
});

/**
 * Stops the throw input when the throw touch button is released.
 */
document.getElementById("touchThrow").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.D = false;
});

/**
 * Resets the throw input when the throw touch interaction is cancelled by the browser.
 */
document.getElementById("touchThrow").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.D = false;
});

/**
 * Prevents the mobile context menu from opening on long press.
 */
document.querySelectorAll(".touch-button").forEach((button) => {
    button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
});
