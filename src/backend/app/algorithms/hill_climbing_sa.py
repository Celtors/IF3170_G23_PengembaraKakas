from app.models.state import State
from app.utils.objective import objective
from app.utils.neighbors import all_neighbors, copy_state
from app.algorithms.search_algorithms import SearchAlgorithms

class HillClimbingSA(SearchAlgorithms):
    def run(self, init_state: State) -> State:
        curr_val = objective(init_state)
        neigh = copy_state(init_state)
        while (True):
            if (objective(self.gen_neighbor(neigh)) <= curr_val):
                return neigh
            neigh = self.gen_neighbor(neigh)

    def gen_neighbor(self, init_state: State) -> State:
        neighbor: State
        for succ in all_neighbors(init_state):
            if (objective(succ) > curr_val):
                curr_val = objective(succ)
                neighbor = succ
        return neighbor