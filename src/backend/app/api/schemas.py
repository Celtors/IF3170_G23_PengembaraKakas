from typing import Literal
from pydantic import BaseModel, Field

AlgorithmName = Literal[
    "steepest", "sideways", "random_restart", "stochastic", "simulated_annealing", "genetic"
]
ObjectiveName = Literal["score", "score_plus_plus"]


class TruckIn(BaseModel):
    w: int = Field(gt=0)
    l: int = Field(gt=0)
    h: int = Field(gt=0)
    max_cap: int = Field(ge=0)


class PackageIn(BaseModel):
    id: str
    w: int = Field(gt=0)
    l: int = Field(gt=0)
    h: int = Field(gt=0)
    value: int = Field(ge=0)
    weight: int = Field(ge=0)
    is_fragile: bool = False
    eta: int = 0


class SolveRequest(BaseModel):
    truck: TruckIn
    packages: list[PackageIn] = Field(min_length=1, max_length=500)
    algorithm: AlgorithmName
    objective: ObjectiveName = "score"
    seed: int | None = None
    max_sideways: int = Field(100, ge=0, le=10_000)
    max_restart: int = Field(10, ge=0, le=1_000)
    max_iterations: int = Field(1000, ge=1, le=100_000)
    population_size: int = Field(50, ge=2, le=1_000)
    iterations: int = Field(100, ge=1, le=10_000)
    mutation_rate: float = Field(0.1, ge=0, le=1)
    initial_temp: float = Field(1000.0, gt=0, le=1e6)
    cooling_rate: float = Field(0.99, gt=0, le=0.9999)
    min_temp: float = Field(0.01, gt=0)


class PlacementOut(BaseModel):
    package_id: str
    x: int
    y: int
    z: int  
    w: int  
    l: int  
    h: int
    orientation: str
    inside: bool


class StateOut(BaseModel):
    placements: list[PlacementOut]
    objective: int
    score: int
    violations: dict[str, int]


class SolveResponse(BaseModel):
    algorithm: AlgorithmName
    initial: StateOut
    final: StateOut
    history: list[float]
    history_avg: list[float] | None = None
    prob_history: list[float] | None = None
    stuck_frequency: int | None = None
    iterations: int
    duration: float
