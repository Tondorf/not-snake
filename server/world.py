import random

import config
from snake import Snake, Direction


class World:
    def __init__(self):
        self.food = []
        self.snakes = {}

    def random_but_empty_xypair(self):
        exclude = [self.snakes[id].body for id in self.snakes]
        exclude += self.food

        def get_random(boundaries, exclude):
            min, max = boundaries

            while True:
                x = random.randint(min, max - 1)
                if x not in exclude:
                    return x

        world_size_x, world_size_y = config.world_size
        xs, ys = zip(*exclude) if exclude else [], []
        x = get_random((0, world_size_x), xs)
        y = get_random((0, world_size_y), ys)
        return x, y

    def random_direction(self):
        return Direction(random.randint(1, 4))

    def spawn_food(self):
        self.food.append(self.random_but_empty_xypair())

    def add_user(self, id):
        x, y = self.random_but_empty_xypair()
        direction = self.random_direction()
        self.snakes[id] = Snake.create_at(x, y, direction)

    def remove_user(self, id):
        del self.snakes[id]

    def update(self, now):
        for id in self.snakes:
            snake = self.snakes[id]
            if snake.dead:
                self.remove_user(id)
            elif now - snake.last_update > snake.cooldown_in_ms:
                snake.move(self)
                snake.last_update = now

        if not self.food:
            self.spawn_food()
