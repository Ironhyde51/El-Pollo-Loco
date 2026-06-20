/**
 * Stores the current keyboard input state for movement, jumping and throwing.
 */
class Keyboard {

    LEFT = false;
    RIGHT = false;
    SPACE = false;
    UP = false;
    DOWN = false;
    D = false;

    /**
     * Initializes all keyboard inputs as not pressed.
     */
    constructor() {
        this.Left = false;
        this.Right = false;
        this.Space = false;
        this.Up = false;
        this.Down = false;
        this.D = false;
    }
}
