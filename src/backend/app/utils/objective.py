from app.models.state import State
from app.utils.constraints import cnt_violations
from app.utils.geometry import Placement, package_box, placement_in_truck


def objective(state: State) -> int:
    total_value = 0

    for package, rep in zip(state.packages, state.shape_pack_models):
        box = package_box(package, rep)

        if placement_in_truck(box, state.truck) == Placement.INSIDE:
            total_value += package.value

    return total_value


def penalty_weight(state: State) -> int:
    #buat pelanggaran maksimal -1
    return sum(package.value for package in state.packages)+1


def score(state: State) -> int:
    return objective(state)-penalty_weight(state)*cnt_violations(state).total
