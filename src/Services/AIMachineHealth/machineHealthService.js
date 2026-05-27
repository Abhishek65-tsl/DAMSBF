import axios from 'axios';
import { generateSensorSeries, generateSensorSnapshot } from './mockProvider';
import { runRuleBasedInference } from './ruleEngine';
import { validateSensorPayload } from './schema';

const API_URL = import.meta.env.VITE_AI_MACHINE_HEALTH_API_URL;

function mapApiResponse(responseData, fallbackLastUpdated) {
  return {
    healthScore: responseData.healthScore,
    currentStatus: responseData.currentStatus,
    anomalies: responseData.anomalies || [],
    alerts: responseData.alerts || [],
    predictedFailures: responseData.predictedFailures || [],
    recommendations: responseData.recommendations || [],
    lastUpdated: responseData.lastUpdated || fallbackLastUpdated
  };
}

export async function fetchMachineHealthInference({ latestSensor, thresholds }) {
  const validation = validateSensorPayload(latestSensor);
  if (!validation.valid) {
    throw new Error(`Invalid sensor payload: ${validation.errors.join('; ')}`);
  }

  const lastUpdated = new Date().toISOString();

  if (API_URL) {
    try {
      const response = await axios.post(API_URL, {
        sensorData: latestSensor,
        thresholds
      });
      return mapApiResponse(response.data, lastUpdated);
    } catch (error) {
      console.warn('AI API unavailable, switching to local rule engine.', error);
    }
  }

  return runRuleBasedInference(latestSensor, { thresholds });
}

export async function fetchMachineHealthBundle({ historyLength = 30, intervalMs = 5000, thresholds } = {}) {
  const sensorSeries = generateSensorSeries(historyLength, intervalMs);
  const latestSensor = sensorSeries[sensorSeries.length - 1] || generateSensorSnapshot();
  const inference = await fetchMachineHealthInference({ latestSensor, thresholds });

  return {
    sensorSeries,
    latestSensor,
    ...inference
  };
}
