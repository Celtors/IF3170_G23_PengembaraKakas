import re
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter
from pydantic import BaseModel
from app.api.schemas import ExperimentRequest, ExperimentResponse, RunRequest, RunResponse
from app.services.experiment import run_experiment
from app.services.normal_run import run_once

router = APIRouter(prefix="/api")

OUTPUT_DIR = Path(__file__).resolve().parents[4] / "output"


def save_output(kind: str, label: str, result: BaseModel) -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    slug = re.sub(r"[^\w-]+", "-", label).strip("-")
    path = OUTPUT_DIR / f"{datetime.now():%Y%m%d-%H%M%S-%f}_{kind}_{slug}.json"
    path.write_text(result.model_dump_json(indent=2), encoding="utf-8")


@router.post("/run", response_model=RunResponse)
def run(req: RunRequest):
    result = run_once(req)
    save_output("run", req.algorithm, result)
    return result


@router.post("/experiment", response_model=ExperimentResponse)
def experiment(req: ExperimentRequest):
    result = run_experiment(req)
    save_output("experiment", f"{req.algorithm}_{req.experiment.name}", result)
    return result
