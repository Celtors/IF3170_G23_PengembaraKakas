from typing import NamedTuple
from app.models.state import State
from app.utils.geometry import Placement, footprint_overlap, overlap_volume, package_box, placement_in_truck

class Violations(NamedTuple):
    above_fragile: int = 0
    overweight: int = 0
    stuck: int = 0
    overlap_pairs: int = 0
    floating: int = 0
    @property
    def total(self) -> int:
        return sum(self)

def count_violations(state: State) -> Violations:
    stuck = 0
    inside = []
    for package, rep in zip(state.packages, state.shape_pack_models):
        box = package_box(package, rep)
        placement = placement_in_truck(box, state.truck)
        if placement == Placement.STUCK:
            stuck += 1
        elif placement == Placement.INSIDE:
            inside.append((package, box))

    overlap_pairs = floating = above_fragile = 0
    for i, (package, box) in enumerate(inside):
        supported = box.bottom == 0
        for j, (other, other_box) in enumerate(inside):
            if i == j:
                continue
            if i < j and overlap_volume(box, other_box) > 0:
                overlap_pairs += 1
            rests_on_other = other_box.top == box.bottom and footprint_overlap(box, other_box) > 0
            if rests_on_other:
                supported = True
                if other.is_fragile:
                    above_fragile += 1
        if not supported:
            floating += 1

    total_weight = sum(package.weight for package, _ in inside)
    overweight = max(0, total_weight - state.truck.max_cap)

    return Violations(
        above_fragile=above_fragile,
        overweight=overweight,
        stuck=stuck,
        overlap_pairs=overlap_pairs,
        floating=floating,
    )

def is_valid(state: State) -> bool:
    return count_violations(state).total == 0