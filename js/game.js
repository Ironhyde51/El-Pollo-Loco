let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let introMusic = new Audio('audio/world_sounds/intro.mp3');
let backgroundMusic = new Audio('audio/world_sounds/background.mp3');
let lostSound = new Audio('audio/world_sounds/lost.mp3');
let winningSound = new Audio('audio/world_sounds/winning.mp3');
let nextLevelSound = new Audio('audio/world_sounds/nuklea-level.mp3');
let coinCollectSound = new Audio('audio/world_sounds/coin_collect.mp3');
let showdownSound = new Audio('audio/world_sounds/showdown.mp3');
introMusic.loop = true;
backgroundMusic.loop = true;
introMusic.volume = 0.4;
backgroundMusic.volume = 0.4;
lostSound.volume = 0.5;
winningSound.volume = 0.5;
nextLevelSound.volume = 0.5;
coinCollectSound.volume = 0.5;
showdownSound.volume = 0.6;

let allSounds = [
    introMusic,
    backgroundMusic,
    lostSound,
    winningSound,
    nextLevelSound,
    coinCollectSound,
    showdownSound
];

let isMuted = localStorage.getItem('isMuted') === 'true';

/**
 * Adds a sound to the global mute handling.
 * @param {HTMLAudioElement} sound - Audio object that should follow the mute state.
 */
function registerSound(sound) {
    if (!allSounds.includes(sound)) {
        allSounds.push(sound);
    }
    sound.muted = isMuted;
}

/**
 * Applies the current mute state to all globally managed game sounds and updates the mute button.
 */
function applyMuteState() {
    allSounds.forEach((sound) => {
        sound.muted = isMuted;
    });
    updateMuteButton();
}

/**
 * Updates the mute button icon, title and aria-label based on the current mute state.
 */
function updateMuteButton() {
    let muteButton = document.getElementById("muteButton");
    if (!muteButton) {
        return;
    }
    muteButton.innerHTML = isMuted ? "&#128263;" : "&#128266;";
    muteButton.title = isMuted ? "Sound einschalten" : "Sound stummschalten";
    muteButton.setAttribute("aria-label", muteButton.title);
}

/**
 * Toggles all globally managed game sounds and stores the setting in localStorage.
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    applyMuteState();
}

/**
 * Plays an audio object while respecting the global mute state.
 * @param {HTMLAudioElement} sound - Audio object that should be played.
 * @param {boolean} [restart=true] - Whether the sound should restart from the beginning.
 */
function playSound(sound, restart = true) {
    if (isMuted) {
        sound.pause();
        return;
    }
    registerSound(sound);
    sound.muted = false;
    if (restart) {
        sound.currentTime = 0;
    }
    sound.play().catch(() => {
        setTimeout(() => {
            if (!isMuted) {
                sound.play().catch(() => { });
            }
        }, 100);
    });
}

/**
 * Stops an audio object and resets it to the beginning.
 * @param {HTMLAudioElement} sound - Audio object that should be stopped.
 */
function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

/**
 * Starts the looping background music while respecting the global mute state.
 */
function playBackgroundMusic() {
    if (isMuted) {
        return;
    }
    backgroundMusic.muted = false;
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(() => {
        setTimeout(() => {
            if (!isMuted) {
                backgroundMusic.play().catch(() => { });
            }
        }, 100);
    });
}

function playIntroMusic() {
    playSound(introMusic, false);
}

function playLostSound() {
    stopSound(backgroundMusic);
    playSound(lostSound);
}

function playWinningSound() {
    stopSound(backgroundMusic);
    playSound(winningSound);
}

function playNextLevelSound() {
    stopSound(winningSound);
    playSound(nextLevelSound);
}

function playCoinCollectSound() {
    playSound(coinCollectSound);
}

function playShowdownSound() {
    playSound(showdownSound);
}

/**
 * Stops all endscreen music and restarts the regular gameplay background music.
 */
function restartBackgroundMusic() {
    stopSound(introMusic);
    stopSound(lostSound);
    stopSound(winningSound);
    stopSound(nextLevelSound);
    stopSound(backgroundMusic);
    playBackgroundMusic();
}

/**
 * Starts the game from the start screen and initializes the first level.
 */
function startGame() {
    if (gameStarted) {
        return;
    }
    gameStarted = true;
    hideHomeButton();
    stopSound(introMusic);
    applyMuteState();
    playBackgroundMusic();
    document.getElementById("startScreen").classList.add("d-none");
    showTouchControls();
    init();
}

/**
 * Restarts the current level after an endscreen without reloading the page.
 */
function restartGame() {
    if (world) {
        world.gameEnded = true;
    }
    hideNextLevelButton();
    hideHomeButton();
    showTouchControls();
    restartBackgroundMusic();
    keyboard = new Keyboard();
    gameStarted = true;
    init();
}

function init() {
    initLevel1();
    canvas = document.getElementById("canvas");
    canvas.onclick = () => {
        if (world && world.gameEnded) {
            restartGame();
        }
    };
    ctx = canvas.getContext("2d");
    world = new World(canvas, keyboard);
}

/**
 * Shows the next-level button on winning-related screens.
 */
function showNextLevelButton() {
    document.getElementById("nextLevelButton").classList.remove("d-none");
}

/**
 * Hides the next-level button.
 */
function hideNextLevelButton() {
    document.getElementById("nextLevelButton").classList.add("d-none");
}

/**
 * Shows the home button on end screens.
 */
function showHomeButton() {
    document.getElementById("homeButton").classList.remove("d-none");
}

/**
 * Hides the home button.
 */
function hideHomeButton() {
    document.getElementById("homeButton").classList.add("d-none");
}

/**
 * Shows mobile touch controls during gameplay.
 */
function showTouchControls() {
    document.querySelector(".touch-controls").classList.add("touch-controls-visible");
}

/**
 * Hides mobile touch controls outside gameplay.
 */
function hideTouchControls() {
    document.querySelector(".touch-controls").classList.remove("touch-controls-visible");
}

/**
 * Opens the game information modal.
 */
function openInfoModal() {
    document.getElementById("infoModal").classList.remove("d-none");
}

/**
 * Closes the game information modal.
 */
function closeInfoModal() {
    document.getElementById("infoModal").classList.add("d-none");
}

/**
 * Shows the next-level screen after the winning screen.
 */
function openNextLevelScreen() {
    if (world) {
        world.showNextLevelScreen();
    }
}

/**
 * Returns from an endscreen to the start screen and resets UI controls.
 */
function goHome() {
    if (world) {
        world.gameEnded = true;
    }
    hideHomeButton();
    hideNextLevelButton();
    hideTouchControls();
    stopSound(backgroundMusic);
    stopSound(lostSound);
    stopSound(winningSound);
    stopSound(nextLevelSound);
    gameStarted = false;
    keyboard = new Keyboard();
    document.getElementById("startScreen").classList.remove("d-none");
}

function toggleFullscreen() {
    let gameContainer = document.querySelector(".game-container");

    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function updateFullscreenButton() {
    let fullscreenButton = document.getElementById("fullscreenButton");

    if (!fullscreenButton) {
        return;
    }

    fullscreenButton.innerHTML = document.fullscreenElement ? "&times;" : "&#x26F6;";
    fullscreenButton.title = document.fullscreenElement ? "Fullscreen beenden" : "Fullscreen umschalten";
    fullscreenButton.setAttribute("aria-label", fullscreenButton.title);
}

document.addEventListener("fullscreenchange", updateFullscreenButton);

document.addEventListener("keydown", (event) => {
    if (event.key == " " && !gameStarted) {
        event.preventDefault();
        startGame();
        return;
    }

    if (event.key == "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (event.key == "ArrowLeft") {
        keyboard.LEFT = true;
    }
    if (event.key == " ") {
        keyboard.SPACE = true;
    }
    if (event.key == "ArrowUp") {
        keyboard.UP = true;
    }
    if (event.key == "ArrowDown") {
        keyboard.DOWN = true;
    }
    if (event.key == "d" || event.key == "D") {
        keyboard.D = true;
    }
});

document.addEventListener("keyup", (event) => {

    if (event.key == "ArrowRight") {
        keyboard.RIGHT = false;
    }
    if (event.key == "ArrowLeft") {
        keyboard.LEFT = false;
    }
    if (event.key == " ") {
        keyboard.SPACE = false;
    }
    if (event.key == "ArrowUp") {
        keyboard.UP = false;
    }
    if (event.key == "ArrowDown") {
        keyboard.DOWN = false;
    }
    if (event.key == "d" || event.key == "D") {
        keyboard.D = false;
    }
});
applyMuteState();
