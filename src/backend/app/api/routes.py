from fastapi import APIRouter
from app.api.schemas import ExperimentRequest, ExperimentResponse, RunRequest, RunResponse
from app.services.experiment import run_experiment, run_once

router = APIRouter(prefix="/api")


@router.post("/run", response_model=RunResponse)
def run(req: RunRequest):
    return run_once(req)


@router.post("/experiment", response_model=ExperimentResponse)
def experiment(req: ExperimentRequest):
    return run_experiment(req)
