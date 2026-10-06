from position import Position
from orientation import Orientation

class ShapePackModel:
    def __init__(
            self,
            package_id: str,
            position: Position,
            orientation: Orientation
    ):
        self.package_id = package_id
        self.position = position
        self.orientation = orientation
