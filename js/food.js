var Food = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function Food(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene);

        // list of nutrients and garbage
        this.nutrients = scene.add.group();
        this.garbage = scene.add.group();

        // create one
        this.newNutrient({x: x, y: y});
        while (this.nutrients.getLength() < MAX_MEALS_ON_SCREEN) {
            this.newRandomNutrient();
        }

        while (this.garbage.getLength() < MAX_MEALS_ON_SCREEN) {
            this.newRandomGarbage();
        }

        this.totalEaten = 0;
        this.garbageEaten = 0;

        scene.children.add(this);
    },

    newRandomNutrient: function () {
        var pos = getLegalSpawnPosition(this);
        if (pos !== false) {
            this.newNutrient(pos);
        }
    },

    newNutrient: function (pos) {
        this.nutrients.create(pos.x * GRID_SIZE, pos.y * GRID_SIZE, 'apple').setOrigin(0);
    },

    newRandomGarbage: function () {
        var pos = getLegalSpawnPosition(this);
        if (pos !== false) {
            this.newGarbage(pos);
        }
    },

    newGarbage: function (pos) {
        this.garbage.create(pos.x * GRID_SIZE, pos.y * GRID_SIZE, 'pill').setOrigin(0);
    }

});

/**
 * We can place the edible anywhere in our GRID_X * GRID_Y grid
 * *except* on-top of the snake, so we need
 * to filter those out of the possible edible locations.
 * If there aren't any locations left, they've won!
 *
 * @method getLegalSpawnPosition
 * @return {boolean} true if the edible was placed, otherwise false
 */
function getLegalSpawnPosition(food) {
    //  First create an array that assumes all positions
    //  are valid for new food items

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
                //  Is this position valid for edible? If so, add it here ...
                validLocations.push({x: x, y: y});
            }
        }
    }

    if (validLocations.length > 0) {
        //  Use the RNG to pick a random edible position
        return Phaser.Math.RND.pick(validLocations);
    } else {
        return false;
    }
}
