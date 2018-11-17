#!/usr/bin/env python3

import asyncio
import json
import time

import websockets

from snake import Snake, Direction

snake = Snake.create_at(10, 10)
last_update = 0


def time_in_ms():
    return time.time() * 1000.


def serialize_coordinates(coordinates):
    xs, ys = zip(*coordinates)
    return json.dumps({'xs': xs, 'ys': ys})


def consumer(message):
    try:
        snake.direction = Direction(int(message))
    except ValueError:
        pass


def producer():
    global last_update

    now = time_in_ms()
    if now - last_update > snake.cooldown_in_ms:
        snake.move()
        last_update = now

    return serialize_coordinates(snake.body)


async def consumer_handler(websocket, path):
    async for message in websocket:
        consumer(message)


async def producer_handler(websocket, path):
    one_ms = 1. / 1000.
    sleep_time = 100 * one_ms;

    while True:
        message = producer()
        await websocket.send(message)
        await asyncio.sleep(sleep_time)


async def handler(websocket, path):
    consumer_task = asyncio.ensure_future(consumer_handler(websocket, path))
    producer_task = asyncio.ensure_future(producer_handler(websocket, path))
    done, pending = await asyncio.wait([consumer_task, producer_task],
                                       return_when=asyncio.FIRST_COMPLETED)
    for task in pending:
        task.cancel()


if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(handler, 'localhost', 8080))
    asyncio.get_event_loop().run_forever()