from abc import ABC, abstractmethod
from app.models.state import State

class SearchAlgorithms(ABC):
    @abstractmethod
    def run(self, init_state: State) -> State:
        pass