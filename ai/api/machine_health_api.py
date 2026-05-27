from typing import Dict, List

from fastapi import APIRouter
from pydantic import BaseModel, Field

from model.machine_health_engine import run_machine_health_inference

router = APIRouter(prefix="/machine-health", tags=["machine-health"])


class SensorPayload(BaseModel):
    temperature: float = Field(..., ge=-50, le=300)
    pressure: float = Field(..., ge=0, le=500)
    vibration: float = Field(..., ge=0, le=100)
    spindleSpeed: float = Field(..., ge=0, le=20000)
    currentConsumption: float = Field(..., ge=0, le=2000)
    windSpeed: float = Field(..., ge=0, le=200)
    batteryDegradation: float = Field(..., ge=0, le=100)
    timestamp: str | None = None


class InferenceRequest(BaseModel):
    sensorData: SensorPayload
    thresholds: Dict[str, Dict[str, float]] | None = None


class PredictedFailure(BaseModel):
    component: str
    risk: float
    eta: str
    confidence: float


class EventItem(BaseModel):
    id: str
    severity: str
    component: str
    message: str
    confidence: float
    timestamp: str


class AlertItem(EventItem):
    recommendation: str


class InferenceResponse(BaseModel):
    healthScore: int
    currentStatus: str
    anomalies: List[EventItem]
    alerts: List[AlertItem]
    predictedFailures: List[PredictedFailure]
    recommendations: List[str]
    lastUpdated: str


@router.post("/predict", response_model=InferenceResponse)
async def predict_machine_health(payload: InferenceRequest):
    return run_machine_health_inference(payload.sensorData.model_dump())
