var config = {
    type: Phaser.AUTO,
    width: 1366,
    height: 768,
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         gravity: { y: 200 }
    //     }
    // },
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

var grid;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('star', 'image/star.png');
}

function create ()
{
    this.add.image(400, 300, 'star');
    grid = new Phaser.GameObjects.Grid(
        x=200, y=200,
        width=128, height=128,
        cellWidth=16, cellHeight=16);
}

function update ()
{
}
