// Game Field
const GRID_SIZE = 16;
const GRID_X = 75; // 75
const GRID_Y = 50; // 50

// Game Globals
const GAME_X = GRID_X * GRID_SIZE;
const GAME_Y = GRID_Y * GRID_SIZE;
const BG_COLOR = "#101010";
const PLAYFIELD_BG_COLOR = '#e1ae15';

//  Direction consts
const RIGHT = 1;
const UP = 2;
const LEFT = 3;
const DOWN = 4;
const SPACE = 5;

var websocket = new WebSocket('ws://127.0.0.1:8080');

websocket.onmessage = function (event) {
    new_world(JSON.parse(event.data));
};

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

var graphics;

function preload() {
    this.load.image('body', 'image/body16.png');
    this.load.image('food', 'image/food16.png');
    this.load.image('apple', 'image/apple16.png');
    this.load.image('pill', 'image/pill16.png');
}

function create() {
    snake = new Snake(this, 8, 8);
    food = new Food(this, 24, 8);

    //  Create our keyboard controls
    controls = this.input.keyboard.createCursorKeys();

    graphics = this.add.graphics();
}

function update(time, delta) {
    if (controls.left.isDown) {
        websocket.send(LEFT);
    } else if (controls.right.isDown) {
        websocket.send(DOWN);
    } else if (controls.up.isDown) {
        websocket.send(UP);
    } else if (controls.down.isDown) {
        websocket.send(DOWN);
    } else if (this.input.keyboard.checkDown(controls.space, 1000)) {
        websocket.send(SPACE);
    }
}

function zip(as, bs) {
    //console.assert(as.length === bs.length);
    cs = [];
    for (i=0; i < as.length; i++) {
        cs.push([as[i], bs[i]]);
    }
    return cs;
}

function new_world(json) {
    positions = zip(json.xs, json.ys);
    console.log(positions);

    graphics.clear();
    graphics.lineStyle(1, 0x000000, 0.5);
    graphics.fillStyle(0x000000, 0.5);
    positions.forEach(function (pos) {
        graphics.fillRect(pos[0], pos[1], 16, 16);
    });
}
