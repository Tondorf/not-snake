var Snake = new Phaser.Class({

    initialize:

        function Snake(scene, x, y) {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * GRID_SIZE, y * GRID_SIZE, 'body');
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 100;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

    update: function (time) {
        if (time >= this.moveTime) {
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
        }
        else {
            //  Update the timer ready for the next movement
            this.moveTime = time + this.speed;

            return true;
        }
    },

    grow: function () {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

        newPart.setOrigin(0);
    },

    collideWithFood: function (food) {
        if (this.head.x === food.x && this.head.y === food.y) {
            this.grow();

            food.eat();

            //  For every 5 items of food eaten we'll increase the snake speed a little
            if (this.speed > 20 && food.total % 5 === 0) {
                this.speed -= 5;
            }

            return true;
        }
        else {
            return false;
        }
    },

    updateGrid: function (grid) {
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

            var bx = segment.x / GRID_SIZE;
            var by = segment.y / GRID_SIZE;

            grid[by][bx] = false;

        });

        return grid;
    }

});
