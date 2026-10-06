from position import Position
from orientation import Orientation

class PackRepresentation:
    def __init__(
            self,
            package_id: str,
            position: Position,
            orientation: Orientation
    ):
        self.package_id = package_id
        self.position = position
        self.orientation = orientation

    def get_package_id(self): return self.package_id

    def set_position(self, npos: Position): self.position = npos
    def set_orientation(self, norient: Orientation): self.orientation = norient
