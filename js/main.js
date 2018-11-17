var config = {
    type: Phaser.AUTO,
    width: GAME_X,
    height: GAME_Y,
    backgroundColor: PLAYFIELD_BG_COLOR,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var snake;
var food;
var controls;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('food', 'image/food.png');
    this.load.image('body', 'image/body.png');
}

function create() {
    food = new Food(this, 4, 4);
    snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    controls = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
    if (!snake.alive) {
        return;
    }

    /**
     * Check which key is pressed, and then change the direction the snake
     * is heading based on that. The checks ensure you don't double-back
     * on yourself, for example if you're moving to the right and you press
     * the LEFT cursor, it ignores it, because the only valid directions you
     * can move in at that time is up and down.
     */
    if (controls.left.isDown) {
        snake.faceLeft();
    } else if (controls.right.isDown) {
        snake.faceRight();
    } else if (controls.up.isDown) {
        snake.faceUp();
    } else if (controls.down.isDown) {
        snake.faceDown();
    } else if (this.input.keyboard.checkDown(controls.space, 1000)) {
        snake.shrink();
    }

    if (snake.update(time)) {
        //  If the snake updated, we need to check for collision against food
        if (snake.collideWithFood(food)) {
            repositionFood();
        }
    }
}
