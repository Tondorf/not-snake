var Snake = new Phaser.Class({

    initialize: function Snake(scene, x, y) {
        this.headPosition = new Phaser.Geom.Point(x, y);

        this.body = scene.add.group();

        this.head = this.body.create(x * GRID_SIZE, y * GRID_SIZE, 'body');
        this.head.setOrigin(0);

        this.blocks2spawn = STARTLENGTH;

        this.alive = true;
        this.moveCooldown = 100;
        this.lastMoveTime = 0; // time when next move can be made
        this.tail = new Phaser.Geom.Point(x, y);
        this.direction = RIGHT; // where we are going to at the moment
        this.heading = RIGHT; // where we want to go next
    },

    update: function (time) {
        if (time >= this.lastMoveTime) {
            if (this.blocks2spawn > 0) {
                this.grow();
                this.blocks2spawn--;
            }
            return this.move(time);
        }
    },

    faceLeft: function () {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = LEFT;
        }
    },

    faceRight: function () {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = RIGHT;
        }
    },

    faceUp: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = UP;
        }
    },

    faceDown: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = DOWN;
        }
    },

    move: function (time) {
        /**
         * Based on the heading property (which is the direction the pgroup pressed)
         * we update the headPosition value accordingly.
         *
         * The Math.wrap call allow the snake to wrap around the screen, so when
         * it goes off any of the sides it re-appears on the other.
         */
        switch (this.heading) {
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, GRID_X);
                break;
            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, GRID_X);
                break;
            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, GRID_Y);
                break;
            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, GRID_Y);
                break;
        }

        this.direction = this.heading;

        //  Update the body segments and place the last coordinate into this.tail
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * GRID_SIZE, this.headPosition.y * GRID_SIZE, 1, this.tail);

        //  Check to see if any of the body pieces have the same x/y as the head
        //  If they do, the head ran into the body
        var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), {x: this.head.x, y: this.head.y}, 1);
        if (hitBody) {
            console.log('dead');
            this.alive = false;
            return false;
        } else {
            //  Update the timer ready for the next movement
            this.lastMoveTime = time + this.moveCooldown;
            return true;
        }
    },

    grow: function () {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
        newPart.setOrigin(0);
    },

    shrink: function () {
        if (this.body.getLength() <= 1) {
            return;
        }
        console.log('shrink');
        var victim = this.body.getChildren()[this.body.getLength()-1]; // get last element
        this.body.kill(victim);
        this.body.remove(victim, true, true);
    },

    collideWithMeal: function (food, meal) {
        if (this.head.x === meal.x && this.head.y === meal.y) {
            console.log("NOMNOMNOM");
            this.blocks2spawn++;

            food.increment();
            food.meals.kill(meal);
            food.meals.remove(meal, true, true);

            //  For every 5 items of food eaten we'll decrease the snake move cooldown a little
            if (this.moveCooldown > 20 && meal.totalEaten % 5 === 0) {
                this.moveCooldown -= 5;
            }

            return true;
        } else {
            return false;
        }
    },

    markBlockedSpots: function (grid) {
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {
            var bx = segment.x / GRID_SIZE;
            var by = segment.y / GRID_SIZE;
            grid[by][bx] = false;
        });
        return grid;
    }

});
