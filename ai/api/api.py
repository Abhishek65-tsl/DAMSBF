from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.model import AIModel

app = FastAPI()
model = AIModel()

class PredictionRequest(BaseModel):
    data: list

class PredictionResponse(BaseModel):
    result: list
    confidence: float

@app.post('/predict', response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        # In a real app, you would load the model once at startup
        # model.load_model('path/to/model')
        
        prediction = model.predict(request.data)
        
        # Mock confidence score for demonstration
        confidence = 0.95
        
        return PredictionResponse(
            result=prediction,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run: uvicorn api.api:app --reload
