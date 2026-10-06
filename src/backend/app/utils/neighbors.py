import random
from itertools import product
from typing import Iterator
from app.models.orientation import Orientation
from app.models.package import Package
from app.models.pack_representation import PackRepresentation
from app.models.position import Position
from app.models.state import State
from app.models.truck import Truck

ROTATION_SWAPS = {"x": (1, 2), "y": (0, 2), "z": (0, 1)}

def copy_state(state: State) -> State:
    new_state = State(state.truck)
    new_state.packages = list(state.packages)
    new_state.shape_pack_models = [
        PackRepresentation(rep.package_id, rep.position, rep.orientation)
        for rep in state.shape_pack_models
    ]
    return new_state

def outside_position(truck: Truck) -> Position:
    return Position(truck.dimension.get_w(), 0, 0)

def rotated(orientation: Orientation, axis: str) -> Orientation:
    i, j = ROTATION_SWAPS[axis]
    order = list(orientation.value)
    order[i], order[j] = order[j], order[i]
    return Orientation(tuple(order))

# gerakan dasar
def swap(state: State, i: int, j: int) -> State:
    new_state = copy_state(state)
    a, b = new_state.shape_pack_models[i], new_state.shape_pack_models[j]
    a_position = a.position
    a.set_position(b.position)
    b.set_position(a_position)
    return new_state

def move(state: State, i: int, position: Position) -> State:
    new_state = copy_state(state)
    new_state.shape_pack_models[i].set_position(position)
    return new_state

def rotate(state: State, i: int, axis: str) -> State:
    new_state = copy_state(state)
    rep = new_state.shape_pack_models[i]
    rep.set_orientation(rotated(rep.orientation, axis))
    return new_state


# posisi yang mungkin di truk
def all_pos(truck: Truck, size: tuple[int, int, int]) -> list[Position]:
    limit = truck.dimension.get_wlh()
    ranges = [range(limit[k] - size[k] + 1) for k in range(3)]
    return [Position(*point) for point in product(*ranges)] + [outside_position(truck)]

# random posisi di truk
def random_pos(truck: Truck, size: tuple[int, int, int], rng=random) -> Position:
    room = [limit - s for limit, s in zip(truck.dimension.get_wlh(), size)]
    if all(r >= 0 for r in room) and rng.random() < 0.5:
        return Position(*(rng.randint(0, r) for r in room))
    return outside_position(truck)

def package_size(state: State, i: int) -> tuple[int, int, int]:
    return state.packages[i].get_dimension().get_dimension_orient(state.shape_pack_models[i].orientation)

def all_neighbors(state: State) -> Iterator[State]:
    n = len(state.packages)
    for i in range(n):
        for j in range(i + 1, n):
            if state.shape_pack_models[i].position.get_xyz() != state.shape_pack_models[j].position.get_xyz():
                yield swap(state, i, j)
    for i in range(n):
        for axis in ROTATION_SWAPS:
            yield rotate(state, i, axis)
        current = state.shape_pack_models[i].position.get_xyz()
        for position in all_pos(state.truck, package_size(state, i)):
            if position.get_xyz() != current:
                yield move(state, i, position)


def random_neighbor(state: State, rng=random) -> State:
    n = len(state.packages)
    kind = rng.choice(("swap", "move", "rotate") if n >= 2 else ("move", "rotate"))
    i = rng.randrange(n)
    if kind == "swap":
        j = rng.choice([k for k in range(n) if k != i])
        return swap(state, i, j)
    if kind == "rotate":
        return rotate(state, i, rng.choice(tuple(ROTATION_SWAPS)))
    return move(state, i, random_pos(state.truck, package_size(state, i), rng))

def random_state(truck: Truck, packages: list[Package], rng=random) -> State:
    state = State(truck)
    for package in packages:
        orientation = rng.choice(list(Orientation))
        size = package.get_dimension().get_dimension_orient(orientation)
        state.add_pack(package, random_pos(truck, size, rng), orientation)
    return state
