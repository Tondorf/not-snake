var Food = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function Food(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene);

        // list of meals
        this.meals = scene.add.group();

        // create one
        this.newFood(x, y);

        // and more
        while (this.meals.getLength() < MAX_MEALS_ON_SCREEN) {
            placeNewMeal(this);
        }

        this.totalEaten = 0;

        scene.children.add(this);
    },

    newFood: function (x, y) {
        var newMeal = this.meals.create(x * GRID_SIZE, y * GRID_SIZE, 'food');
        newMeal.setOrigin(0);
    },

    increment: function () {
        this.totalEaten++;
    }

});

/**
 * We can place the food anywhere in our GRID_X * GRID_Y grid
 * *except* on-top of the snake, so we need
 * to filter those out of the possible food locations.
 * If there aren't any locations left, they've won!
 *
 * @method placeNewMeal
 * @return {boolean} true if the food was placed, otherwise false
 */
function placeNewMeal(food) {
    if (food.meals.getLength() >= MAX_MEALS_ON_SCREEN) {
        console.error("FOOD SHOULDN'T BE PLACED!!!");
    }

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
        food.newFood(pos.x, pos.y);

        return true;
    } else {
        return false;
    }
}
