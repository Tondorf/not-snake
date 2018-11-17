class World:
    def __init__(self):
        self.food = []

    def __repr__(self):
        repr = {'food': [pos for pos in self.food]}
        return f'World: {repr}'
