from collections import deque
from enum import Enum
import json


class Direction(Enum):
    RIGHT = 1
    TOP = 2
    LEFT = 3
    BOTTOM = 4


class Snake:
    def __init__(self, body, direction):
        self.cooldown_in_ms = 1000
        self.body = deque(body)
        self.direction = direction

    def create_at(head_x, head_y, direction=Direction.LEFT):
        return Snake([(head_x, head_y),], direction)

    def serialize_body(self):
        xs = [x for (x, _) in self.body]
        ys = [y for (_, y) in self.body]
        return json.dumps({'xs' : xs, 'ys' : ys})

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

        self.body.rotate(1)

        x, y = self.body[0][0:2]
        dx, dy = delta
        self.body[0] = (x + dx, y + dy)
