export const SENSOR_KEYS = [
  'temperature',
  'pressure',
  'vibration',
  'spindleSpeed',
  'currentConsumption',
  'windSpeed',
  'batteryDegradation'
];

export const SENSOR_LABELS = {
  temperature: 'Temperature (°C)',
  pressure: 'Pressure (bar)',
  vibration: 'Vibration (mm/s)',
  spindleSpeed: 'Spindle Speed (RPM)',
  currentConsumption: 'Current (A)',
  windSpeed: 'Wind Speed (m/s)',
  batteryDegradation: 'Battery Degradation (%)'
};

export const STATUS = {
  HEALTHY: 'Healthy',
  WARNING: 'Warning',
  CRITICAL: 'Critical'
};

export const SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const DEFAULT_THRESHOLDS = {
  temperature: { warning: 80, critical: 95 },
  pressure: { warning: 130, critical: 150 },
  vibration: { warning: 12, critical: 18 },
  spindleSpeed: { warning: 5200, critical: 6100 },
  currentConsumption: { warning: 220, critical: 280 },
  windSpeed: { warning: 24, critical: 32 },
  batteryDegradation: { warning: 60, critical: 80 }
};
