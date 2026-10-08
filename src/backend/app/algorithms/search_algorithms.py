from abc import ABC, abstractmethod
from app.models.state import State
from typing import Callable

class SearchAlgorithms(ABC):
    @abstractmethod
    def run(self, init_state: State, obj_fn: Callable[[State], int]) -> State:
        pass