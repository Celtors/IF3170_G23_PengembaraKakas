import math
import random
import time
from typing import Callable

from app.models.state import State
from app.utils.objective import score
from app.utils.neighbors import copy_state, random_neighbor
from app.algorithms.search_algorithms import SearchAlgorithms

class SimulatedAnnealing(SearchAlgorithms):
    def __init__(self, initial_temp: float = 1000.0, cooling_rate: float = 0.99, min_temp: float = 0.01, rng=random):
        self.initial_temp = initial_temp
        self.cooling_rate = cooling_rate
        self.min_temp = min_temp
        self.rng = rng
        
        # Metrik untuk eksperimen
        self.history: list[int] = []
        self.prob_history: list[float] = [] # Mencatat e^(delta E / T)
        self.stuck_frequency = 0
        self.duration = 0.0

    def run(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        start = time.perf_counter()
        
        curr = copy_state(init_state)
        curr_val = obj_fn(curr)
        
        best = copy_state(curr)
        best_val = curr_val
        
        self.history = [curr_val]
        self.prob_history = []
        self.stuck_frequency = 0
        
        temp = self.initial_temp
        
        while temp > self.min_temp:
            neigh = random_neighbor(curr, self.rng)
            neigh_val = obj_fn(neigh)
            
            delta_e = neigh_val - curr_val
            
            if delta_e > 0:
                curr = neigh
                curr_val = neigh_val
                self.prob_history.append(1.0)
            else:
                prob = math.exp(delta_e / temp) if temp > 0 else 0
                self.prob_history.append(prob)
                
                if self.rng.random() < prob:
                    curr = neigh
                    curr_val = neigh_val
                else:
                    self.stuck_frequency += 1
                    
            self.history.append(curr_val)
            
            if curr_val > best_val:
                best = copy_state(curr)
                best_val = curr_val
                
            temp *= self.cooling_rate
            
        self.duration = time.perf_counter() - start
        return best