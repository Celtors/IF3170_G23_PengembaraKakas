from app.models.state import State
from app.utils.objective import score
from app.utils.neighbors import random_neighbor, copy_state
from app.algorithms.search_algorithms import SearchAlgorithms
from typing import Callable
import random
import time

class HillClimbingStochastic(SearchAlgorithms):
    def __init__(self, max_iterations: int = 1000, rng=random):
        self.max_iterations = max_iterations
        self.rng = rng
        self.history: list[int] = []
        self.iterations = 0
        self.duration = 0.0

    def run(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        start = time.perf_counter()
        curr_val = obj_fn(init_state)
        curr = copy_state(init_state)
        self.history = [curr_val]
        for _ in range(self.max_iterations):
            neigh = random_neighbor(curr, self.rng)
            neigh_val = obj_fn(neigh)
            if (neigh_val > curr_val):
                curr = neigh
                curr_val = neigh_val
            self.history.append(curr_val)
        self.iterations = self.max_iterations
        self.duration = time.perf_counter() - start
        return curr
