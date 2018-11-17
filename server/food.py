import random

import config


def spawn_food(world, exclude=[]):
    def get_random(boundaries, exclude):
        min, max = boundaries

        while True:
            x = random.randint(min, max - 1)
            if x not in exclude:
                return x

    world_size_x, world_size_y = config.world_size
    xs, ys = zip(*exclude)
    x, y = get_random((0, world_size_x), xs), get_random((0, world_size_y), ys)
    world.food.append((x, y))
