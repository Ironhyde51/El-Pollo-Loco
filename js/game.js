let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let introMusic = new Audio('audio/world_sounds/intro.mp3');
let backgroundMusic = new Audio('audio/world_sounds/background.mp3');
let lostSound = new Audio('audio/world_sounds/lost.mp3');
let winningSound = new Audio('audio/world_sounds/winning.mp3');
let coinCollectSound = new Audio('audio/world_sounds/coin_collect.mp3');
let showdownSound = new Audio('audio/world_sounds/showdown.mp3');
introMusic.loop = true;
backgroundMusic.loop = true;
introMusic.volume = 0.4;
backgroundMusic.volume = 0.4;
lostSound.volume = 0.5;
winningSound.volume = 0.5;
coinCollectSound.volume = 0.5;
showdownSound.volume = 0.6;

let allSounds = [
    introMusic,
    backgroundMusic,
    lostSound,
    winningSound,
    coinCollectSound,
    showdownSound
];

let keyMap = {
    ArrowRight: "RIGHT",
    ArrowLeft: "LEFT",
    " ": "SPACE",
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    d: "D",
    D: "D"
};

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
        stopMutedSound(sound);
        return;
    }
    registerSound(sound);
    sound.muted = false;
    if (restart) {
        sound.currentTime = 0;
    }
    playSoundWithRetry(sound);
}

/**
 * Pauses a sound when the global mute state is active.
 * @param {HTMLAudioElement} sound - Audio object that should be paused.
 */
function stopMutedSound(sound) {
    sound.pause();
}

/**
 * Plays a sound and retries once after the browser unlocks audio.
 * @param {HTMLAudioElement} sound - Audio object that should be played.
 */
function playSoundWithRetry(sound) {
    sound.play().catch(() => {
        setTimeout(() => playSoundAfterDelay(sound), 100);
    });
}

/**
 * Plays a delayed sound retry when sound is not muted.
 * @param {HTMLAudioElement} sound - Audio object that should be played.
 */
function playSoundAfterDelay(sound) {
    if (!isMuted) {
        sound.play().catch(() => { });
    }
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

/**
 * Starts the intro music on the start screen.
 */
function playIntroMusic() {
    playSound(introMusic, false);
}

/**
 * Stops gameplay music and plays the losing sound.
 */
function playLostSound() {
    stopSound(backgroundMusic);
    playSound(lostSound);
}

/**
 * Stops gameplay music and plays the winning sound.
 */
function playWinningSound() {
    stopSound(backgroundMusic);
    playSound(winningSound);
}

/**
 * Plays the sound for collecting a coin.
 */
function playCoinCollectSound() {
    playSound(coinCollectSound);
}

/**
 * Plays the showdown sound when the endboss appears.
 */
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
    hideHomeButton();
    showTouchControls();
    restartBackgroundMusic();
    keyboard = new Keyboard();
    gameStarted = true;
    init();
}

/**
 * Initializes the level, canvas context and world instance.
 */
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
 * Returns from an endscreen to the start screen and resets UI controls.
 */
function goHome() {
    if (world) {
        world.gameEnded = true;
    }
    hideHomeButton();
    hideTouchControls();
    stopSound(backgroundMusic);
    stopSound(lostSound);
    stopSound(winningSound);
    gameStarted = false;
    keyboard = new Keyboard();
    document.getElementById("startScreen").classList.remove("d-none");
}

/**
 * Toggles fullscreen mode for the game container.
 */
function toggleFullscreen() {
    let gameContainer = document.querySelector(".game-container");

    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * Updates the fullscreen button icon and accessibility text.
 */
function updateFullscreenButton() {
    let fullscreenButton = document.getElementById("fullscreenButton");
    if (!fullscreenButton) {
        return;
    }
    fullscreenButton.innerHTML = document.fullscreenElement ? "&times;" : "&#x26F6;";
    fullscreenButton.title = document.fullscreenElement ? "Fullscreen beenden" : "Fullscreen umschalten";
    fullscreenButton.setAttribute("aria-label", fullscreenButton.title);
}

/**
 * Updates the fullscreen button whenever fullscreen mode changes.
 */
document.addEventListener("fullscreenchange", updateFullscreenButton);

/**
 * Handles keyboard input for starting, restarting and controlling the game.
 */
document.addEventListener("keydown", handleKeyDown);

/**
 * Handles keyboard input for starting, restarting and controlling the game.
 * @param {KeyboardEvent} event - Pressed keyboard event.
 */
function handleKeyDown(event) {
    if (handleGameStateKey(event)) {
        return;
    }
    setKeyboardKey(event, true);
}

/**
 * Handles start and retry shortcuts before gameplay input is processed.
 * @param {KeyboardEvent} event - Pressed keyboard event.
 * @returns {boolean} True when the key was handled.
 */
function handleGameStateKey(event) {
    if (event.key == " " && world && world.gameEnded) {
        event.preventDefault();
        restartGame();
        return true;
    }
    if (event.key == " " && !gameStarted) {
        event.preventDefault();
        startGame();
        return true;
    }
    return false;
}

/**
 * Resets keyboard input states when movement or action keys are released.
 * @param {KeyboardEvent} event - Released keyboard event.
 */
document.addEventListener("keyup", handleKeyUp);

/**
 * Resets keyboard input states when movement or action keys are released.
 * @param {KeyboardEvent} event - Released keyboard event.
 */
function handleKeyUp(event) {
    setKeyboardKey(event, false);
}

/**
 * Sets the keyboard state matching the given key event.
 * @param {KeyboardEvent} event - Keyboard event to read.
 * @param {boolean} isPressed - New pressed state.
 */
function setKeyboardKey(event, isPressed) {
    let keyName = getKeyboardProperty(event.key);
    if (keyName) {
        keyboard[keyName] = isPressed;
    }
}

/**
 * Maps a pressed key to the matching keyboard state property.
 * @param {string} key - Keyboard event key value.
 * @returns {string|undefined} Keyboard property name.
 */
function getKeyboardProperty(key) {
    return keyMap[key];
}

/**
 * Applies the saved mute setting when the page loads.
 */
applyMuteState();

/**
 * Registers the intro music hover event for the start screen.
 */
function registerStartScreenHover() {
    let startScreen = document.getElementById("startScreen");
    if (startScreen) {
        startScreen.addEventListener("mouseenter", playIntroMusic);
    }
}

registerStartScreenHover();
