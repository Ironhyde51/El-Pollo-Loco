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

function applyMuteState() {
    allSounds.forEach((sound) => {
        sound.muted = isMuted;
    });
    updateMuteButton();
}

function updateMuteButton() {
    let muteButton = document.getElementById("muteButton");
    if (!muteButton) {
        return;
    }
    muteButton.innerHTML = isMuted ? "&#128263;" : "&#128266;";
    muteButton.title = isMuted ? "Sound einschalten" : "Sound stummschalten";
    muteButton.setAttribute("aria-label", muteButton.title);
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    applyMuteState();
}

function playSound(sound, restart = true) {
    if (isMuted) {
        return;
    }
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

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

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

function restartBackgroundMusic() {
    stopSound(introMusic);
    stopSound(lostSound);
    stopSound(winningSound);
    stopSound(nextLevelSound);
    stopSound(backgroundMusic);
    playBackgroundMusic();
}

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

function showNextLevelButton() {
    document.getElementById("nextLevelButton").classList.remove("d-none");
}

function hideNextLevelButton() {
    document.getElementById("nextLevelButton").classList.add("d-none");
}

function showHomeButton() {
    document.getElementById("homeButton").classList.remove("d-none");
}

function hideHomeButton() {
    document.getElementById("homeButton").classList.add("d-none");
}

function showTouchControls() {
    document.querySelector(".touch-controls").classList.add("touch-controls-visible");
}

function hideTouchControls() {
    document.querySelector(".touch-controls").classList.remove("touch-controls-visible");
}

function openInfoModal() {
    document.getElementById("infoModal").classList.remove("d-none");
}

function closeInfoModal() {
    document.getElementById("infoModal").classList.add("d-none");
}

function openNextLevelScreen() {
    if (world) {
        world.showNextLevelScreen();
    }
}

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
