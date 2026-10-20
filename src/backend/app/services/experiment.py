from app.api.schemas import ExperimentRequest, ExperimentResponse, VariationResult
from app.services.normal_run import run_once


def run_experiment(req: ExperimentRequest) -> ExperimentResponse:
    cfg = req.experiment
    if req.algorithm != "genetic":
        variations = [{}]
    elif cfg.ga_mode == "population":
        variations = [{"population_size": v, "iterations": req.params.iterations} for v in cfg.population_variation]
    else:
        variations = [{"population_size": req.params.population_size, "iterations": v} for v in cfg.iteration_variation]

    return ExperimentResponse(
        name=cfg.name,
        algorithm=req.algorithm,
        variations=[
            VariationResult(params=v, runs=[
                run_once(req, req.params.model_copy(update=v), None if req.seed is None else req.seed + i)
                for i in range(cfg.repetitions)
            ])
            for v in variations
        ],
    )
