import { DEFAULT_THRESHOLDS, SEVERITY, STATUS } from './constants';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const seedAnomalies = [
  {
    component: 'Cooling Loop',
    type: 'Overheating',
    severity: SEVERITY.HIGH,
    message: 'Cooling loop thermal rise exceeds expected envelope.',
    recommendation: 'Increase coolant flow and inspect blocked line segments.'
  },
  {
    component: 'Spindle Tooling',
    type: 'Tool Damage Alert',
    severity: SEVERITY.MEDIUM,
    message: 'Abnormal vibration harmonics suggest potential tool wear.',
    recommendation: 'Run tool integrity inspection in next maintenance window.'
  },
  {
    component: 'Gearbox',
    type: 'Gearbox Failure',
    severity: SEVERITY.CRITICAL,
    message: 'Torque transfer variance and vibration spikes indicate gearbox stress.',
    recommendation: 'Schedule immediate gearbox lubrication and alignment check.'
  },
  {
    component: 'System Core',
    type: 'Full System Issue',
    severity: SEVERITY.CRITICAL,
    message: 'Multiple subsystems drifting beyond safe operating bounds.',
    recommendation: 'Switch to safe mode and run full diagnostic sweep.'
  },
  {
    component: 'Surface Integrity',
    type: 'Crack Detection',
    severity: SEVERITY.HIGH,
    message: 'No direct image feed. Placeholder classifier reports probable micro-crack signature.',
    recommendation: 'Trigger manual NDT scan or vision-assisted inspection.'
  }
];

function buildSensorRisks(sensorData, thresholds = DEFAULT_THRESHOLDS) {
  const risks = Object.entries(thresholds).map(([key, limit]) => {
    const raw = sensorData[key] ?? 0;
    const slope = (raw - limit.warning) / Math.max(1, limit.critical - limit.warning);
    return clamp(30 + slope * 55, 0, 100);
  });

  return risks;
}

function deriveStatus(healthScore) {
  if (healthScore >= 75) return STATUS.HEALTHY;
  if (healthScore >= 45) return STATUS.WARNING;
  return STATUS.CRITICAL;
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function runRuleBasedInference(sensorData, options = {}) {
  const now = new Date();
  const thresholds = options.thresholds ?? DEFAULT_THRESHOLDS;
  const sensorRisks = buildSensorRisks(sensorData, thresholds);
  const aggregateRisk = sensorRisks.reduce((sum, n) => sum + n, 0) / sensorRisks.length;
  const healthScore = Math.round(clamp(100 - aggregateRisk, 0, 100));
  const currentStatus = deriveStatus(healthScore);

  const anomalySeed = Math.floor(now.getTime() / 1000);
  const anomalies = seedAnomalies
    .filter((_, idx) => seededRandom(anomalySeed + idx) > 0.35 || idx < 2)
    .map((item, idx) => ({
      id: `${item.type.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
      ...item,
      confidence: Number((0.72 + seededRandom(anomalySeed + idx + 99) * 0.25).toFixed(2)),
      timestamp: new Date(now.getTime() - idx * 8 * 60 * 1000).toISOString()
    }));

  const alerts = anomalies.map((anomaly, idx) => ({
    id: `alert-${idx + 1}`,
    severity: anomaly.severity,
    message: anomaly.message,
    component: anomaly.component,
    recommendation: anomaly.recommendation,
    confidence: anomaly.confidence,
    timestamp: anomaly.timestamp
  }));

  const predictedFailures = [
    {
      component: 'Spindle Assembly',
      risk: Number(clamp(aggregateRisk * 1.04, 5, 98).toFixed(1)),
      eta: '1h',
      confidence: Number((0.78 + seededRandom(anomalySeed + 101) * 0.18).toFixed(2))
    },
    {
      component: 'Gearbox',
      risk: Number(clamp(aggregateRisk * 0.91, 5, 97).toFixed(1)),
      eta: '24h',
      confidence: Number((0.75 + seededRandom(anomalySeed + 102) * 0.2).toFixed(2))
    },
    {
      component: 'Cooling Circuit',
      risk: Number(clamp(aggregateRisk * 0.8, 5, 94).toFixed(1)),
      eta: '7d',
      confidence: Number((0.7 + seededRandom(anomalySeed + 103) * 0.24).toFixed(2))
    }
  ];

  const recommendations = [
    'Increase cooling loop audit cadence for next 24 hours.',
    'Perform spindle vibration balancing before next production cycle.',
    'Validate gearbox oil condition and bearing temperature trend.',
    'Schedule manual crack verification until camera feed is integrated.'
  ];

  return {
    healthScore,
    currentStatus,
    anomalies,
    alerts,
    predictedFailures,
    recommendations,
    lastUpdated: now.toISOString()
  };
}
