import time
from typing import Callable

from app.models.state import State
from app.utils.objective import score
from app.utils.neighbors import all_neighbors, copy_state
from app.algorithms.search_algorithms import SearchAlgorithms

class HillClimbingSA(SearchAlgorithms):
    def __init__(self):
        self.history: list[int] = []
        self.iterations = 0
        self.duration = 0.0

    def run(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        start = time.perf_counter()
        curr = copy_state(init_state)
        curr_val = obj_fn(curr)
        
        self.history = [curr_val]
        
        while True:
            best_neighbor = None
            # Inisialisasi dengan nilai minimum
            best_neighbor_val = float('-inf') 
            
            # Evaluasi seluruh kemungkinan neighbor
            for succ in all_neighbors(curr):
                succ_val = obj_fn(succ)
                if succ_val > best_neighbor_val:
                    best_neighbor = succ
                    best_neighbor_val = succ_val
                    
            if best_neighbor is None or best_neighbor_val <= curr_val:
                break
                
            curr = best_neighbor
            curr_val = best_neighbor_val
            self.history.append(curr_val)
            
        self.iterations = len(self.history) - 1
        self.duration = time.perf_counter() - start
        return curr