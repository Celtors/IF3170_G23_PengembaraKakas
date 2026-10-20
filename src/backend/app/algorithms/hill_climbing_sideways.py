from app.models.state import State
from app.utils.objective import score
from app.utils.neighbors import all_neighbors, copy_state
from app.algorithms.search_algorithms import SearchAlgorithms
from typing import Callable
import random
import time

class HillClimbingSideways(SearchAlgorithms):
    def __init__(self, max_sideways: int = 100, rng=random):
        self.max_sideways = max_sideways
        self.rng = rng
        self.history: list[int] = []
        self.iterations = 0
        self.sideways_moves = 0
        self.duration = 0.0

    def run(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        start = time.perf_counter()
        curr_val = obj_fn(init_state)
        curr = copy_state(init_state)
        self.history = [curr_val]
        self.sideways_moves = 0
        while (True):
            neigh, neigh_val = self.gen_neighbor(curr, obj_fn)
            if (neigh is None or neigh_val < curr_val):
                break
            if (neigh_val == curr_val):
                if (self.sideways_moves >= self.max_sideways):
                    break
                self.sideways_moves += 1
            curr = neigh
            curr_val = neigh_val
            self.history.append(curr_val)
        self.iterations = len(self.history) - 1
        self.duration = time.perf_counter() - start
        return curr

    def gen_neighbor(self, init_state: State, obj_fn: Callable[[State], int] = score) -> tuple[State | None, int | None]:
        neighbor: State | None = None
        neighbor_val: int | None = None
        ties = 0
        for succ in all_neighbors(init_state):
            succ_val = obj_fn(succ)
            if (neighbor_val is None or succ_val > neighbor_val):
                neighbor = succ
                neighbor_val = succ_val
                ties = 1
            elif (succ_val == neighbor_val):
                ties += 1
                if (self.rng.randrange(ties) == 0):
                    neighbor = succ
        return neighbor, neighbor_val
