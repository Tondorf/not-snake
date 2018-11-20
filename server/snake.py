from collections import deque
from enum import Enum

import config


class Direction(Enum):
    RIGHT = 1
    TOP = 2
    LEFT = 3
    BOTTOM = 4


class Snake:
    def __init__(self, id, body, direction):
        self.id = id
        self.body = deque(body)
        self._direction = direction
        self.cooldown_in_ms = config.snake_init_cooldown_in_ms
        self.last_update = 0
        self.dead = False

    def create_at(id, head_x, head_y, direction=Direction.RIGHT):
        return Snake(id, [(head_x, head_y), ], direction)

    @property
    def direction(self):
        return self._direction

    @direction.setter
    def direction(self, direction):
        valid = True
        if direction is Direction.LEFT and self._direction is Direction.RIGHT:
            valid = False
        if direction is Direction.RIGHT and self._direction is Direction.LEFT:
            valid = False
        if direction is Direction.TOP and self._direction is Direction.BOTTOM:
            valid = False
        if direction is Direction.BOTTOM and self._direction is Direction.TOP:
            valid = False
        if valid:
            self._direction = direction

    def move(self, world):
        delta = (0, 0)
        if self.direction is Direction.RIGHT:
            delta = (1, 0)
        elif self.direction is Direction.TOP:
            delta = (0, -1)
        elif self.direction is Direction.LEFT:
            delta = (-1, 0)
        elif self.direction is Direction.BOTTOM:
            delta = (0, 1)

        head = self.body[0]
        tail = self.body[-1]
        self.body.rotate(1)

        x, y = head
        dx, dy = delta
        world_size_x, world_size_y = config.world_size
        self.body[0] = ((x + dx) % world_size_x, (y + dy) % world_size_y)

        head = self.body[0]
        if head in world.food:
            self.body.append(tail)
            world.food = []

        # collision detection, without head-head check
        pos = list(self.body)[1:]
        for id in world.snakes:
            if id != self.id:
                pos += list(world.snakes[id].body)[1:]

        if head in pos:
            self.dead = True

