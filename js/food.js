var Food = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function Food(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene);

        this.setTexture('food');
        this.setPosition(x * GRID_SIZE, y * GRID_SIZE);
        this.setOrigin(0);

        this.total = 0;

        scene.children.add(this);
    },

    eat: function () {
        this.total++;
    }

});

/**
 * We can place the food anywhere in our GRID_X * GRID_Y grid
 * *except* on-top of the snake, so we need
 * to filter those out of the possible food locations.
 * If there aren't any locations left, they've won!
 *
 * @method repositionFood
 * @return {boolean} true if the food was placed, otherwise false
 */
function repositionFood() {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < GRID_Y; y++) {
        testGrid[y] = [];
        for (var x = 0; x < GRID_X; x++) {
            testGrid[y][x] = true;
        }
    }

    snake.markBlockedSpots(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < GRID_Y; y++) {
        for (var x = 0; x < GRID_X; x++) {
            if (testGrid[y][x] === true) {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({x: x, y: y});
            }
        }
    }

    if (validLocations.length > 0) {
        //  Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //  And place it
        food.setPosition(pos.x * GRID_SIZE, pos.y * GRID_SIZE);

        return true;
    } else {
        return false;
    }
}
