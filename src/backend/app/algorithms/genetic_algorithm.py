import random
import time
from typing import Callable
from app.models.state import State
from app.utils.objective import score
from app.utils.neighbors import copy_state, random_neighbor, random_state
from app.algorithms.search_algorithms import SearchAlgorithms

class GeneticAlgorithm(SearchAlgorithms):
    def __init__(self, population_size: int, iterations: int, mutation_rate: float = 0.1, rng=random):
        self.population_size = population_size
        self.iterations = iterations
        self.mutation_rate = mutation_rate
        self.rng = rng
        self.history: list[tuple[int, float]] = []
        self.duration = 0.0

    def run(self, init_state: State, obj_fn: Callable[[State], int] = score) -> State:
        start = time.perf_counter()
        self.history = []
        packages = init_state.packages
        population = [copy_state(init_state)] + [
            random_state(init_state.truck, packages, self.rng) for _ in range(self.population_size - 1)
        ]
        fitness = [obj_fn(s) for s in population]
        best, best_fit = self.record(population, fitness)

        for _ in range(self.iterations):
            new_population = []
            for _ in range(self.population_size):
                x, y = self.random_selection(population, fitness)
                child = self.reproduce(x, y)
                if self.rng.random() < self.mutation_rate:
                    child = random_neighbor(child, self.rng)
                new_population.append(child)
            population = new_population
            fitness = [obj_fn(s) for s in population]
            gen_best, gen_fit = self.record(population, fitness)
            if gen_fit > best_fit:
                best, best_fit = gen_best, gen_fit

        self.duration = time.perf_counter() - start
        return best

    def record(self, population: list[State], fitness: list[int]) -> tuple[State, int]:
        self.history.append((max(fitness), sum(fitness) / len(fitness)))
        i = max(range(len(fitness)), key=fitness.__getitem__)
        return population[i], fitness[i]

    def random_selection(self, population: list[State], fitness: list[int]) -> list[State]:
        low = min(fitness)
        weights = [f - low + 1 for f in fitness]
        return self.rng.choices(population, weights=weights, k=2)

    def reproduce(self, x: State, y: State) -> State:
        n = len(x.packages)
        c = self.rng.randint(1, n - 1) if n > 1 else 0
        child = copy_state(x)
        child.shape_pack_models[c:] = copy_state(y).shape_pack_models[c:]
        return child
