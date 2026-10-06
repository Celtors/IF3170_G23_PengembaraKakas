from enum import Enum
from typing import NamedTuple
from app.models.package import Package
from app.models.pack_representation import PackRepresentation
from app.models.truck import Truck

class Box(NamedTuple):
    lo: tuple[int, int, int]
    hi: tuple[int, int, int]


class Placement(Enum):
    INSIDE = "inside"
    OUTSIDE = "outside"
    STUCK = "stuck"

def package_box(package: Package, rep: PackRepresentation) -> Box:
    low = rep.position.get_xyz()
    size = package.get_dimension().get_dimension_orient(rep.orientation)
    return Box(low, tuple(p + s for p, s in zip(low, size)))


def container_box(truck: Truck) -> Box:
    return Box((0, 0, 0), truck.dimension.get_wlh())


def overlap_volume(a: Box, b: Box) -> int:
    volume = 1
    for axis in range(3):
        length = min(a.hi[axis], b.hi[axis]) - max(a.lo[axis], b.lo[axis])
        if length <= 0:
            return 0
        volume *= length
    return volume


def box_volume(box: Box) -> int:
    return overlap_volume(box, box)


def placement_in_truck(box: Box, truck: Truck) -> Placement:
    inside_volume = overlap_volume(box, container_box(truck))
    if inside_volume == 0:
        return Placement.OUTSIDE
    if inside_volume == box_volume(box):
        return Placement.INSIDE
    return Placement.STUCK
