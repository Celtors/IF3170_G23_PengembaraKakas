class Position:
    def __init__(
            self,
            x: int,
            y: int,
            z: int
    ):
        self.x = x
        self.y = y
        self.z = z

    def get_xyz(self): return tuple(self.x, self.y, self.z)