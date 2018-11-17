from collections import deque
from enum import Enum

import config
import food


class Direction(Enum):
    RIGHT = 1
    TOP = 2
    LEFT = 3
    BOTTOM = 4


class Snake:
    def __init__(self, body, direction):
        self.body = deque(body)
        self.direction = direction
        self.cooldown_in_ms = 1000
        self.last_update = 0

    def create_at(head_x, head_y, direction=Direction.LEFT):
        return Snake([(head_x, head_y), ], direction)

    def move(self):
        delta = (0, 0)
        if self.direction is Direction.RIGHT:
            delta = (1, 0)
        elif self.direction is Direction.TOP:
            delta = (0, 1)
        elif self.direction is Direction.LEFT:
            delta = (-1, 0)
        elif self.direction is Direction.BOTTOM:
            delta = (0, -1)

        head = self.body[0]
        tail = self.body[-1]
        self.body.rotate(1)

        x, y = head
        dx, dy = delta
        world_size_x, world_size_y = config.world_size
        self.body[0] = ((x + dx) % world_size_x, (y + dy) % world_size_y)

        if self.body[0] in food.food:
            self.body.append(tail)
            food.food = []
