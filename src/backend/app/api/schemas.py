from datetime import datetime
from typing import Annotated, Any, Literal
from pydantic import BaseModel, Field, field_validator

AlgorithmName = Literal[
    "steepest", "sideways", "random_restart", "stochastic", "simulated_annealing", "genetic"
]
ObjectiveName = Literal["score", "score_plus_plus"]
Axis = Literal["x", "y", "z"]

class DimensionsIO(BaseModel):
    width: int = Field(gt=0)
    length: int = Field(gt=0)
    height: int = Field(gt=0)

class TruckIO(DimensionsIO):
    max_capacity: int = Field(ge=0)

class PackageIO(BaseModel):
    id: str
    dimensions: DimensionsIO
    weight: int = Field(ge=0)
    value: int = Field(ge=0)
    is_fragile: bool = False
    eta: int = Field(0, ge=0)
    model_url: str | None = None

class Problem(BaseModel):
    truck: TruckIO
    packages: list[PackageIO] = Field(min_length=1, max_length=500)

    @field_validator("packages")
    @classmethod
    def unique_ids(cls, packages: list[PackageIO]) -> list[PackageIO]:
        if len({p.id for p in packages}) != len(packages):
            raise ValueError("package id harus unik")
        return packages

#req

class AlgorithmParams(BaseModel):
    max_sideways: int = Field(100, ge=0, le=10_000)
    max_restart: int = Field(10, ge=0, le=1_000)
    max_iterations: int = Field(1000, ge=1, le=100_000)
    population_size: int = Field(50, ge=2, le=1_000)
    iterations: int = Field(100, ge=1, le=10_000)
    mutation_rate: float = Field(0.1, ge=0, le=1)
    initial_temp: float = Field(1000.0, gt=0, le=1e6)
    cooling_rate: float = Field(0.99, gt=0, le=0.9999)
    min_temp: float = Field(0.01, gt=0)

class RunRequest(BaseModel):
    algorithm: AlgorithmName
    objective: ObjectiveName = "score"
    seed: int | None = None
    params: AlgorithmParams = AlgorithmParams()
    problem: Problem

class ExperimentConfig(BaseModel):
    name: str = ""
    repetitions: int = Field(3, ge=1, le=20)
    ga_mode: Literal["population", "iteration"] = "population"
    population_variation: list[Annotated[int, Field(ge=2, le=1_000)]] = Field([10, 20, 40], min_length=1, max_length=10)
    iteration_variation: list[Annotated[int, Field(ge=1, le=10_000)]] = Field([50, 100, 200], min_length=1, max_length=10)

class ExperimentRequest(RunRequest):
    experiment: ExperimentConfig = ExperimentConfig()

# resp

class RunInfo(BaseModel):
    run_id: str
    algorithm: AlgorithmName
    status: Literal["completed"] = "completed"
    started_at: datetime
    duration_ms: int

class OrientationOut(BaseModel):
    w: Axis
    l: Axis
    h: Axis

class PlacementOut(BaseModel):
    package_id: str
    position: tuple[int, int, int]
    orientation: OrientationOut
    size: tuple[int, int, int]
    placement: Literal["inside", "outside", "stuck"]

class StateOut(BaseModel):
    state: Literal["init", "final"]
    objective_value: int
    placements: list[PlacementOut]

class ExperimentStats(BaseModel):
    iterations: int
    initial_objective: int
    final_objective: int
    best_objective: int
    objective_history: list[float]
    algorithm_metrics: dict[str, Any] = {}

class RunResponse(BaseModel):
    schema_version: Literal["1.0"] = "1.0"
    run: RunInfo
    problem: Problem
    states: list[StateOut]
    experiment: ExperimentStats

class VariationResult(BaseModel):
    params: dict[str, int]
    runs: list[RunResponse]

class ExperimentResponse(BaseModel):
    schema_version: Literal["1.0"] = "1.0"
    name: str
    algorithm: AlgorithmName
    variations: list[VariationResult]
