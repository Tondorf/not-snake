#!/usr/bin/env python3

import asyncio
import json
import time

import websockets

import config
import world
from snake import Direction

world = world.World()


def time_in_ms():
    return time.time() * 1000.


def serialize_coordinates(coordinates):
    if coordinates:
        xs, ys = zip(*coordinates)
    else:
        xs, ys = [], []
    return {'xs': xs, 'ys': ys}


def consumer(id, message):
    try:
        if id in world.snakes:
            world.snakes[id].direction = Direction(int(message))
    except ValueError:
        pass


def update_world():
    world.update(time_in_ms())

    snakes = [serialize_coordinates(world.snakes[id].body)
              for id in world.snakes]

    food = serialize_coordinates(world.food)

    return json.dumps({'snakes': snakes, 'food': food})


async def consumer_handler(websocket, path):
    async for message in websocket:
        consumer(websocket, message)


async def producer_handler(websocket, path):
    while True:
        message = update_world()
        await websocket.send(message)
        await asyncio.sleep(config.server_sleep_time_in_ms / 1000.)


async def handler(websocket, path):
    world.add_user(websocket)
    try:
        consumer_task = asyncio.ensure_future(consumer_handler(websocket, path))
        producer_task = asyncio.ensure_future(producer_handler(websocket, path))
        done, pending = await asyncio.wait([consumer_task, producer_task],
                                           return_when=asyncio.FIRST_COMPLETED)
        for task in pending:
            task.cancel()
    except:
        pass
    finally:
        world.remove_user(websocket)


if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(handler, 'localhost', 8080))
    asyncio.get_event_loop().run_forever()
