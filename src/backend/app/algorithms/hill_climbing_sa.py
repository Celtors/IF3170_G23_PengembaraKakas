from app.models.state import State
from app.utils.objective import score
from app.utils.neighbors import all_neighbors, copy_state
from app.algorithms.search_algorithms import SearchAlgorithms
from typing import Callable

class HillClimbingSA(SearchAlgorithms):
    def run(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        curr_val = obj_fn(init_state)
        neigh = copy_state(init_state)
        while (True):
            if (obj_fn(self.gen_neighbor(neigh, obj_fn)) <= curr_val):
                return neigh
            neigh = self.gen_neighbor(neigh)

    def gen_neighbor(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        neighbor: State
        for succ in all_neighbors(init_state):
            if (obj_fn(succ) > curr_val):
                curr_val = obj_fn(succ)
                neighbor = succ
        return neighbor