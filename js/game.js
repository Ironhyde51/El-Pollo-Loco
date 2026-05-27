let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

function startGame() {
    if (gameStarted) {
        return;
    }

    gameStarted = true;
    document.getElementById("startScreen").classList.add("d-none");
    init();
}

function init() {
    initLevel1();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    world = new World(canvas, keyboard);
}

document.addEventListener("keydown", (event) => {
    if (event.key == " " && !gameStarted) {
        event.preventDefault();
        startGame();
        return;
    }
    
    if(event.key == "ArrowRight"){
        keyboard.RIGHT = true;
    }
    if(event.key == "ArrowLeft"){
        keyboard.LEFT = true;
    }
    if(event.key == " "){
        keyboard.SPACE = true;
    }
    if(event.key == "ArrowUp"){
        keyboard.UP = true;
    }
    if(event.key == "ArrowDown"){
        keyboard.DOWN = true;
    }
    if(event.key == "d" || event.key == "D"){
        keyboard.D = true;
    }
});

document.addEventListener("keyup", (event) => {
    
    if(event.key == "ArrowRight"){
        keyboard.RIGHT = false;
    }
    if(event.key == "ArrowLeft"){
        keyboard.LEFT = false;
    }
    if(event.key == " "){
        keyboard.SPACE = false;
    }
    if(event.key == "ArrowUp"){
        keyboard.UP = false;
    }
    if(event.key == "ArrowDown"){
        keyboard.DOWN = false;
    }
    if(event.key == "d" || event.key == "D"){
        keyboard.D = false;
    }
});
