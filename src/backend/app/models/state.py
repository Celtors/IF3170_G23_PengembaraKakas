from package import Package
from truck import Truck
from pack_representation import PackRepresentation
from position import Position
from orientation import Orientation

class State:
    def __init__(self, truck: Truck):
        self.packages = list()
        self.shape_pack_models = list()
        self.truck = truck

    def add_pack(
            self,
            pack: Package,
            position: Position = Position(0,0,0),
            orientation: Orientation = Orientation.WLH
        ):
            self.packages.append(pack)
            self.shape_pack_models.append(PackRepresentation(pack.get_id(), position, orientation))

    def set_a_pack_model_by_id(
            self,
            id: str,
            position: Position,
            orientation: Orientation
        ):
            for pack in self.shape_pack_models:
                if (pack.get_package_id() == id):
                    pack.set_orientation(orientation)
                    pack.set_position(position)


    def set_a_pack_model_by_idx(
            self,
            idx: int,
            position: Position,
            orientation: Orientation
        ):
            pack = self.shape_pack_models[idx]
            pack.set_orientation(orientation)
            pack.set_position(position)

