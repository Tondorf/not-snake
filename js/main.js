
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
var cursors;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('food', 'image/food.png');
    this.load.image('body', 'image/body.png');
}

function create() {
    food = new Food(this, 3, 4);
    snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
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
    if (cursors.left.isDown) {
        snake.faceLeft();
    }
    else if (cursors.right.isDown) {
        snake.faceRight();
    }
    else if (cursors.up.isDown) {
        snake.faceUp();
    }
    else if (cursors.down.isDown) {
        snake.faceDown();
    }

    if (snake.update(time)) {
        //  If the snake updated, we need to check for collision against food

        if (snake.collideWithFood(food)) {
            repositionFood();
        }
    }
}
