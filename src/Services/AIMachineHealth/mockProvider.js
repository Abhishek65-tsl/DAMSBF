import { SENSOR_KEYS } from './constants';

const ranges = {
  temperature: [62, 105],
  pressure: [90, 162],
  vibration: [3, 22],
  spindleSpeed: [3200, 6400],
  currentConsumption: [120, 305],
  windSpeed: [6, 36],
  batteryDegradation: [20, 92]
};

const trend = {
  temperature: 1.6,
  pressure: 1.1,
  vibration: 0.55,
  spindleSpeed: 48,
  currentConsumption: 2.8,
  windSpeed: 0.75,
  batteryDegradation: 0.65
};

const randomBetween = (min, max) => min + Math.random() * (max - min);

function waveValue(index, period, amplitude) {
  return Math.sin((index / period) * Math.PI * 2) * amplitude;
}

function nextValue(key, previous = null, index = 0) {
  const [min, max] = ranges[key];
  if (previous === null || previous === undefined) {
    return Number(randomBetween(min, max).toFixed(2));
  }

  const baseNoise = (Math.random() - 0.5) * trend[key] * 2.2;
  const smoothWave = waveValue(index, 18 + SENSOR_KEYS.indexOf(key) * 2, trend[key] * 0.9);
  const pulse = Math.random() > 0.93 ? trend[key] * (Math.random() > 0.5 ? 2.8 : -2.8) : 0;

  if (key === 'batteryDegradation') {
    const slowDrift = 0.12;
    const batteryWave = waveValue(index, 10, 0.65);
    const batteryNoise = (Math.random() - 0.5) * 0.9;
    const batteryStep = Math.random() > 0.9 ? (Math.random() > 0.5 ? 0.8 : -0.8) : 0;
    const batteryCandidate = previous + slowDrift + batteryWave + batteryNoise + batteryStep;
    return Number(Math.max(min, Math.min(max, batteryCandidate)).toFixed(2));
  }

  const candidate = Math.max(min, Math.min(max, previous + baseNoise + smoothWave + pulse));
  return Number(candidate.toFixed(2));
}

export function generateSensorSnapshot(previous = {}, index = Date.now() % 1000) {
  const entry = { timestamp: new Date().toISOString() };
  for (const key of SENSOR_KEYS) {
    entry[key] = nextValue(key, previous[key], index);
  }
  return entry;
}

export function generateSensorSeries(length = 30, intervalMs = 5000) {
  const start = Date.now() - length * intervalMs;
  const series = [];
  let prev = {};

  for (let i = 0; i < length; i += 1) {
    const snapshot = generateSensorSnapshot(prev, i);
    snapshot.timestamp = new Date(start + i * intervalMs).toISOString();
    series.push(snapshot);
    prev = snapshot;
  }

  return series;
}
