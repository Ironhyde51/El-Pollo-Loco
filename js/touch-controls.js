

document.getElementById("touchLeft").addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.LEFT = true;
});

document.getElementById("touchLeft").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.LEFT = false;
});

document.getElementById("touchLeft").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.LEFT = false;
});

document.getElementById("touchRight").addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.RIGHT = true;
});

document.getElementById("touchRight").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.RIGHT = false;
});

document.getElementById("touchRight").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.RIGHT = false;
});

document.getElementById("touchJump").addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.SPACE = true;
});

document.getElementById("touchJump").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.SPACE = false;
});

document.getElementById("touchJump").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.SPACE = false;
});

document.getElementById("touchThrow").addEventListener("touchstart", (event) => {
    event.preventDefault();
    keyboard.D = true;
});

document.getElementById("touchThrow").addEventListener("touchend", (event) => {
    event.preventDefault();
    keyboard.D = false;
});

document.getElementById("touchThrow").addEventListener("touchcancel", (event) => {
    event.preventDefault();
    keyboard.D = false;
});

document.querySelectorAll(".touch-button").forEach((button) => {
    button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
});