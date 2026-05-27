from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional
import sys
import os
import time
import logging

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.model import AIModel
from model.predictive_maintenance import PredictiveMaintenanceModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("predictive-maintenance-api")

allowed_origins_raw = os.getenv(
    "AI_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
allowed_origins = [origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = AIModel()
predictive_model = PredictiveMaintenanceModel.create()

class PredictionRequest(BaseModel):
    data: Optional[list] = None
    torque: Optional[list[float]] = None
    pressure: Optional[list[float]] = None
    temperature: Optional[list[float]] = None

class PredictionResponse(BaseModel):
    result: list
    confidence: float


class TimeSeriesPayload(BaseModel):
    torque: list[float]
    pressure: list[float]
    temperature: list[float]


class PredictiveMaintenanceResponse(BaseModel):
    predictedFailure: bool
    failureProbability: float
    healthScore: int
    recommendedAction: str


class ModelSummaryResponse(BaseModel):
    equipment: str
    parameters: list[str]
    trainingSamples: int
    modelType: str
    trainAccuracy: float
    correlationMatrix: list[list[float]]
    correlationLabels: list[str]


class SampleTimeSeriesResponse(BaseModel):
    equipment: str
    points: int
    torque: list[float]
    pressure: list[float]
    temperature: list[float]

@app.post('/predict', response_model=PredictionResponse)
async def predict(request: dict[str, Any]):
    try:
        data = request.get("data")
        torque = request.get("torque")
        pressure = request.get("pressure")
        temperature = request.get("temperature")

        if torque is not None or pressure is not None or temperature is not None:
            if not (torque is not None and pressure is not None and temperature is not None):
                raise HTTPException(
                    status_code=400,
                    detail="For time-series prediction, provide torque, pressure, and temperature arrays together.",
                )
            if not isinstance(torque, list) or not isinstance(pressure, list) or not isinstance(temperature, list):
                raise HTTPException(
                    status_code=400,
                    detail="torque, pressure, and temperature must be arrays.",
                )
            if not (len(torque) == len(pressure) == len(temperature)):
                raise HTTPException(
                    status_code=400,
                    detail="torque, pressure, and temperature series must have the same length.",
                )
            if len(torque) < 10:
                raise HTTPException(status_code=400, detail="Provide at least 10 time points for prediction.")

            pm_result = predictive_model.predict(
                torque=[float(v) for v in torque],
                pressure=[float(v) for v in pressure],
                temperature=[float(v) for v in temperature],
            )
            prediction = [1 if pm_result["predictedFailure"] else 0]
        else:
            if data is None:
                raise HTTPException(
                    status_code=400,
                    detail="Provide either 'data' for generic prediction or torque/pressure/temperature for maintenance prediction.",
                )
            prediction = model.predict(data)
        
        # Mock confidence score for demonstration
        confidence = 0.95
        
        return PredictionResponse(
            result=prediction,
            confidence=confidence
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/predictive-maintenance/summary", response_model=ModelSummaryResponse)
async def get_predictive_maintenance_summary():
    logger.info("predictive_summary_requested model=%s samples=%s", "logistic_regression", predictive_model.training_sample_count)
    return ModelSummaryResponse(
        equipment="motor",
        parameters=["torque", "pressure", "temperature"],
        trainingSamples=predictive_model.training_sample_count,
        modelType="logistic_regression",
        trainAccuracy=round(predictive_model.train_accuracy, 4),
        correlationMatrix=predictive_model.correlation_matrix,
        correlationLabels=["torque", "pressure", "temperature"],
    )


@app.get("/predictive-maintenance/sample-data", response_model=SampleTimeSeriesResponse)
async def get_predictive_maintenance_sample_data(points: int = 30):
    if points < 10 or points > 200:
        raise HTTPException(status_code=400, detail="points must be between 10 and 200.")

    torque: list[float] = []
    pressure: list[float] = []
    temperature: list[float] = []

    base_torque = 118.0
    base_pressure = 122.0
    base_temperature = 146.0

    for i in range(points):
        torque_value = base_torque + (0.42 * i) + ((i % 5) - 2) * 0.35
        pressure_value = base_pressure + (0.34 * i) + 0.52 * (torque_value - base_torque) + ((i % 4) - 1.5) * 0.28
        temperature_value = (
            base_temperature
            + (0.58 * i)
            + 0.26 * (torque_value - base_torque)
            + 0.31 * (pressure_value - base_pressure)
            + ((i % 3) - 1) * 0.4
        )

        torque.append(round(torque_value, 2))
        pressure.append(round(pressure_value, 2))
        temperature.append(round(temperature_value, 2))

    return SampleTimeSeriesResponse(
        equipment="motor",
        points=points,
        torque=torque,
        pressure=pressure,
        temperature=temperature,
    )


@app.post("/predictive-maintenance/predict", response_model=PredictiveMaintenanceResponse)
async def predict_maintenance_risk(payload: TimeSeriesPayload):
    start_time = time.perf_counter()
    try:
        if not (len(payload.torque) == len(payload.pressure) == len(payload.temperature)):
            raise HTTPException(status_code=400, detail="torque, pressure, and temperature series must have the same length.")
        if len(payload.torque) < 10:
            raise HTTPException(status_code=400, detail="Provide at least 10 time points for prediction.")

        response = PredictiveMaintenanceResponse(
            **predictive_model.predict(
                torque=payload.torque,
                pressure=payload.pressure,
                temperature=payload.temperature,
            )
        )
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.info(
            "predictive_inference points=%s failure_probability=%.4f predicted_failure=%s latency_ms=%.2f",
            len(payload.torque),
            response.failureProbability,
            response.predictedFailure,
            latency_ms,
        )
        return response
    except HTTPException:
        logger.warning("predictive_inference_validation_failed")
        raise
    except Exception as e:
        logger.exception("predictive_inference_failed")
        raise HTTPException(status_code=500, detail=str(e))

# To run: uvicorn api.api:app --reload
