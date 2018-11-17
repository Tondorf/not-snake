var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
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

var game = new Phaser.Game(config);

function preload ()
{
}

function create ()
{
}

function update ()
{
}
