from app.models.state import State
from app.utils.objective import score
from app.utils.neighbors import random_state
from app.algorithms.search_algorithms import SearchAlgorithms
from app.algorithms.hill_climbing_sideways import HillClimbingSideways
from typing import Callable
import random
import time

class HillClimbingRR(SearchAlgorithms):
    def __init__(self, max_restart: int = 10, rng=random):
        self.max_restart = max_restart
        self.rng = rng
        self.history: list[int] = []
        self.iterations_per_restart: list[int] = []
        self.restarts = 0
        self.duration = 0.0

    def run(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        start = time.perf_counter()
        goal = sum(pack.value for pack in init_state.packages)
        climber = HillClimbingSideways(max_sideways=0, rng=self.rng)
        self.history = []
        self.iterations_per_restart = []
        best: State | None = None
        best_val: int | None = None
        state = init_state
        for restart in range(self.max_restart + 1):
            if (restart > 0):
                state = random_state(init_state.truck, init_state.packages, self.rng)
            res = climber.run(state, obj_fn)
            res_val = climber.history[-1]
            self.history += climber.history
            self.iterations_per_restart.append(climber.iterations)
            self.restarts = restart
            if (best_val is None or res_val > best_val):
                best = res
                best_val = res_val
            if (best_val >= goal):
                break
        self.duration = time.perf_counter() - start
        return best
