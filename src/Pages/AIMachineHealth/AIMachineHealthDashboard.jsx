import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DamsCasterThemeSwitch from '../../Components/DamsCasterThemeSwitch';
import useDamsCasterTheme from '../../Components/useDamsCasterTheme';
import HealthCard from '../../Components/AIMachineHealth/HealthCard';
import SensorChart from '../../Components/AIMachineHealth/SensorChart';
import SensorGraphModal from '../../Components/AIMachineHealth/SensorGraphModal';
import AlertTable from '../../Components/AIMachineHealth/AlertTable';
import FailureForecast from '../../Components/AIMachineHealth/FailureForecast';
import HealthScoreGauge from '../../Components/AIMachineHealth/HealthScoreGauge';
import EventTimeline from '../../Components/AIMachineHealth/EventTimeline';
import AIAssistantPanel from '../../Components/AIMachineHealth/AIAssistantPanel';
import { SENSOR_LABELS } from '../../Services/AIMachineHealth/constants';
import { useMachineHealthData } from './useMachineHealthData';
import {
  fetchPredictiveMaintenanceSummary,
  predictMotorMaintenanceRisk
} from '../../Services/predictiveMaintenanceApi';
import './AIMachineHealthDashboard.css';

const chartColorMap = {
  temperature: '#ef4444',
  pressure: '#06b6d4',
  vibration: '#f97316',
  spindleSpeed: '#39ff14',
  currentConsumption: '#7c3aed',
  windSpeed: '#14b8a6',
  batteryDegradation: '#f43f5e'
};

const SEARCH_ALIASES = {
  motor: ['spindle', 'gearbox', 'drive', 'rotor'],
  health: ['status', 'risk', 'condition']
};

const tokenize = (text = '') =>
  text
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

const tokenMatches = (queryTokens, haystack) =>
  queryTokens.every((token) => {
    const aliases = SEARCH_ALIASES[token] || [];
    return [token, ...aliases].some((candidate) => haystack.includes(candidate));
  });

export default function AIMachineHealthDashboard() {
  const theme = useDamsCasterTheme();
  const isLight = theme.isLight;
  const { loading, error, data, isEmpty, lastUpdatedLabel, refreshMs, reload } = useMachineHealthData();
  const [equipmentQuery, setEquipmentQuery] = useState('');
  const [equipmentDraft, setEquipmentDraft] = useState('');
  const [lockedEquipmentDetail, setLockedEquipmentDetail] = useState(null);
  const [graphModal, setGraphModal] = useState({ open: false, sensorKey: 'temperature' });
  const [predictiveResult, setPredictiveResult] = useState(null);
  const [predictiveSummary, setPredictiveSummary] = useState(null);
  const [predictiveError, setPredictiveError] = useState('');
  const detailCardRef = useRef(null);
  const safeData = data || { anomalies: [], predictedFailures: [] };

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      try {
        const summary = await fetchPredictiveMaintenanceSummary();
        if (active) setPredictiveSummary(summary);
      } catch (error) {
        if (active) {
          setPredictiveSummary(null);
          setPredictiveError('Using rule-engine fallback (predictive API summary unavailable).');
        }
      }
    };

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!data?.sensorSeries?.length) return undefined;

    const runPredictive = async () => {
      const lastPoints = data.sensorSeries.slice(-30);
      if (lastPoints.length < 10) return;

      const pressure = lastPoints.map((point) => Number(point.pressure || 0));
      const temperature = lastPoints.map((point) => Number(point.temperature || 0));
      const torque = lastPoints.map((point) =>
        Number(((point.spindleSpeed || 0) * 0.015 + (point.currentConsumption || 0) * 0.08).toFixed(2))
      );

      try {
        const prediction = await predictMotorMaintenanceRisk({ torque, pressure, temperature });
        if (active) {
          setPredictiveResult(prediction);
          setPredictiveError('');
        }
      } catch (error) {
        if (active) {
          setPredictiveResult(null);
          setPredictiveError('Using rule-engine fallback (predictive API temporarily unavailable).');
        }
      }
    };

    runPredictive();
    return () => {
      active = false;
    };
  }, [data?.sensorSeries]);

  const conditionFromRisk = (risk) => {
    if (risk >= 75) return 'Critical';
    if (risk >= 45) return 'Warning';
    return 'Healthy';
  };

  const equipmentRows = useMemo(() => {
    const risks = (safeData.predictedFailures || []).map((item) => ({
      equipment: item.component,
      risk: item.risk,
      confidence: item.confidence,
      eta: item.eta
    }));

    const anomalyRows = (safeData.anomalies || []).map((item) => ({
      equipment: item.component,
      risk: null,
      confidence: item.confidence,
      eta: 'Current',
      severity: item.severity,
      message: item.message
    }));

    const combined = [...risks, ...anomalyRows];
    const grouped = combined.reduce((acc, row) => {
      const key = row.equipment;
      if (!acc[key]) {
        acc[key] = {
          equipment: key,
          risk: row.risk ?? 0,
          confidence: row.confidence ?? 0,
          eta: row.eta,
          messages: []
        };
      }

      acc[key].risk = Math.max(acc[key].risk, row.risk ?? 0);
      acc[key].confidence = Math.max(acc[key].confidence, row.confidence ?? 0);
      if (row.message) acc[key].messages.push(row.message);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [safeData.anomalies, safeData.predictedFailures]);

  const filteredEquipment = useMemo(() => {
    const query = equipmentQuery.trim().toLowerCase();
    if (!query) return equipmentRows;
    const queryTokens = tokenize(query);
    return equipmentRows.filter((row) => {
      const haystack = `${row.equipment} ${(row.messages || []).join(' ')}`.toLowerCase();
      return haystack.includes(query) || tokenMatches(queryTokens, haystack);
    });
  }, [equipmentQuery, equipmentRows]);
  const buildEquipmentDetail = (rawQuery) => {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return null;
    if (query.includes('motor')) {
      return {
        name: 'Motor',
        status: data.currentStatus || 'Healthy',
        risk: predictiveResult?.failureProbability != null ? Math.round(predictiveResult.failureProbability * 100) : 0,
        confidence: avgConfidence || 0,
        alerts: (data.alerts || []).filter((item) => tokenMatches(['motor'], `${item.component} ${item.message}`.toLowerCase())),
        anomalies: (data.anomalies || []).filter((item) => tokenMatches(['motor'], `${item.component} ${item.type} ${item.message}`.toLowerCase())),
        forecasts: (data.predictedFailures || []).filter((item) => tokenMatches(['motor'], `${item.component} ${item.eta}`.toLowerCase())),
        recommendations: (data.recommendations || []).slice(0, 4),
        latestSensor: data.latestSensor || {}
      };
    }
    const queryTokens = tokenize(query);
    const queryMatch = (text) => {
      const normalized = String(text || '').toLowerCase();
      return normalized.includes(query) || tokenMatches(queryTokens, normalized);
    };

    const localFilteredEquipment = equipmentRows.filter((row) =>
      queryMatch(`${row.equipment} ${(row.messages || []).join(' ')}`)
    );
    const matchedAlerts = (data.alerts || []).filter((item) =>
      queryMatch(`${item.component} ${item.message}`)
    );
    const matchedAnomalies = (data.anomalies || []).filter((item) =>
      queryMatch(`${item.component} ${item.type} ${item.message}`)
    );
    const matchedForecasts = (data.predictedFailures || []).filter((item) =>
      queryMatch(`${item.component} ${item.eta}`)
    );

    const primary =
      matchedForecasts[0]?.component ||
      matchedAlerts[0]?.component ||
      matchedAnomalies[0]?.component ||
      localFilteredEquipment[0]?.equipment ||
      null;

    if (!primary) return null;

    const risk =
      matchedForecasts[0]?.risk ??
      localFilteredEquipment.find((item) => item.equipment === primary)?.risk ??
      0;
    const confidenceRaw =
      matchedForecasts[0]?.confidence ??
      matchedAlerts[0]?.confidence ??
      matchedAnomalies[0]?.confidence ??
      localFilteredEquipment.find((item) => item.equipment === primary)?.confidence ??
      0;

    const derivedStatus = risk >= 75 ? 'Critical' : risk >= 45 ? 'Warning' : 'Healthy';

    return {
      name: primary,
      status: derivedStatus,
      risk,
      confidence: Math.round((confidenceRaw || 0) * 100),
      alerts: matchedAlerts,
      anomalies: matchedAnomalies,
      forecasts: matchedForecasts,
      recommendations: (data.recommendations || []).slice(0, 4),
      latestSensor: data.latestSensor || {}
    };
  };

  if (loading && !data) {
    return (
      <div className={`ai-machine-health ${isLight ? 'ai-machine-health--light' : 'ai-machine-health--dark'}`}>
        <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }} spacing={1.5}>
          <CircularProgress />
          <Typography>Loading AI machine health telemetry...</Typography>
        </Stack>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`ai-machine-health ${isLight ? 'ai-machine-health--light' : 'ai-machine-health--dark'}`}>
        <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={reload}>Retry</Button>
      </div>
    );
  }

  if (isEmpty || !data) {
    return (
      <div className={`ai-machine-health ${isLight ? 'ai-machine-health--light' : 'ai-machine-health--dark'}`}>
        <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />
        <Card>
          <CardContent>
            <Typography variant="h6">No telemetry available</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Start stream ingestion to populate health analytics.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sensorEntries = Object.entries(SENSOR_LABELS);
  const modalSensorLabel = SENSOR_LABELS[graphModal.sensorKey];
  const modalSensorColor = chartColorMap[graphModal.sensorKey] || '#4f46e5';
  const trendSeries = (data.sensorSeries || []).map((point) => ({
    ...point,
    torque: Number((((point.spindleSpeed || 0) * 0.015) + ((point.currentConsumption || 0) * 0.08)).toFixed(2))
  }));
  const trendGraphConfigs = [
    { key: 'torque', label: 'Torque vs Time', color: '#2563eb' },
    { key: 'pressure', label: 'Pressure vs Time', color: '#06b6d4' },
    { key: 'temperature', label: 'Temperature vs Time', color: '#ef4444' }
  ];
  const runSearch = () => {
    const nextQuery = equipmentDraft.trim();
    setEquipmentQuery(nextQuery);
    const nextDetail = buildEquipmentDetail(nextQuery);
    setLockedEquipmentDetail(nextDetail);
    if (nextDetail) {
      requestAnimationFrame(() => {
        detailCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };
  const spark = (key) => (data.sensorSeries || []).slice(-12).map((row) => Number(row[key] || 0));
  const trend = (arr) => {
    if (!arr?.length) return 'flat';
    const delta = arr[arr.length - 1] - arr[0];
    if (delta > 0.2) return 'up';
    if (delta < -0.2) return 'down';
    return 'flat';
  };
  const avgConfidence = Math.round(((data.predictedFailures || []).reduce((acc, item) => acc + (item.confidence || 0), 0) / Math.max((data.predictedFailures || []).length, 1)) * 100);
  const uptime = Math.max(90, Math.min(99.9, Number((99.7 - data.anomalies.length * 0.45).toFixed(1))));
  const cpuUsage = Math.min(95, Math.max(18, Math.round(42 + (100 - data.healthScore) * 0.45)));
  const networkLatency = Math.min(220, Math.max(12, Math.round(18 + data.anomalies.length * 11)));
  const sensorHealth = Math.max(40, Math.min(99, Math.round((data.healthScore + avgConfidence) / 2)));
  const energyConsumption = Math.min(980, Math.max(280, Math.round(420 + (100 - data.healthScore) * 4.2)));
  const modelAccuracy = Math.max(68, Math.min(99, avgConfidence - 2));
  const maintenanceCountdown = Math.max(1, Math.round(14 - data.anomalies.length * 1.6));
  const systemLoad = Math.min(98, Math.max(22, Math.round((cpuUsage * 0.6) + ((100 - data.healthScore) * 0.4))));
  const temperatureTrend = trend(trendSeries.map((point) => Number(point.temperature || 0)));
  const pressureTrend = trend(trendSeries.map((point) => Number(point.pressure || 0)));
  const torqueTrend = trend(trendSeries.map((point) => Number(point.torque || 0)));
  const aiInsights = [
    temperatureTrend === 'up' ? 'Temperature rising abnormally.' : 'Temperature trend is stable.',
    pressureTrend === 'up' ? 'Pressure is gradually increasing.' : 'Pressure is within expected pattern.',
    torqueTrend === 'up' ? 'Torque demand is trending upward.' : 'Torque demand is steady.'
  ];
  const failurePredictionText = predictiveResult?.predictedFailure
    ? 'Bearing failure possible in next 24 hrs.'
    : 'No immediate bearing failure expected in next 24 hrs.';
  const recentAlerts = (data.alerts || []).slice(0, 4);
  const logRows = [...(data.alerts || []).map((item) => ({
    type: 'Alert',
    label: item.component,
    message: item.message,
    time: item.timestamp
  })), ...(data.anomalies || []).map((item) => ({
    type: 'Anomaly',
    label: item.type,
    message: item.message,
    time: item.timestamp
  }))].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className={`ai-machine-health ${isLight ? 'ai-machine-health--light' : 'ai-machine-health--dark'}`}>
      <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />
      <div className="ai-machine-health__header">
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>AI Machine Health Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdatedLabel} | Auto refresh: {Math.floor(refreshMs / 1000)}s
          </Typography>
        </div>
        <Button variant="outlined" onClick={reload}>Refresh now</Button>
      </div>

      <div className="ai-machine-health__grid">
        <div className="ai-span-12">
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Equipment Condition Search</Typography>
              <div className="ai-search-wrap">
                <TextField
                  fullWidth
                  placeholder="Search equipment (e.g., Gearbox, Spindle Assembly, Cooling Circuit)"
                  value={equipmentDraft}
                  onChange={(event) => setEquipmentDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') runSearch();
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
                <Button variant="contained" onClick={runSearch} className="ai-search-btn">Search</Button>
              </div>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                {filteredEquipment.length ? (
                  filteredEquipment.map((row) => (
                    <Chip
                      key={row.equipment}
                      label={`${row.equipment} | ${conditionFromRisk(row.risk)} | Risk ${Math.round(row.risk)}% | Confidence ${Math.round(row.confidence * 100)}%`}
                      color={conditionFromRisk(row.risk) === 'Critical' ? 'error' : conditionFromRisk(row.risk) === 'Warning' ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No equipment matched your search.</Typography>
                )}
              </Stack>

              {lockedEquipmentDetail ? (
                <Card sx={{ mt: 1.8 }} ref={detailCardRef}>
                  <CardContent>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <Typography variant="h6">{lockedEquipmentDetail.name} - Full Details</Typography>
                      <IconButton
                        size="small"
                        aria-label="Close details"
                        onClick={() => setLockedEquipmentDetail(null)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Status: <b>{lockedEquipmentDetail.status}</b> | Risk: <b>{Math.round(lockedEquipmentDetail.risk)}%</b> | Confidence: <b>{lockedEquipmentDetail.confidence}%</b>
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1.2 }}>Related Forecast</Typography>
                    {(lockedEquipmentDetail.forecasts.length ? lockedEquipmentDetail.forecasts : [{ component: lockedEquipmentDetail.name, risk: lockedEquipmentDetail.risk, eta: '-', confidence: lockedEquipmentDetail.confidence / 100 }]).map((item, idx) => (
                      <Typography key={`${item.component}-${idx}`} variant="body2" color="text.secondary">
                        {item.component} | ETA: {item.eta} | Risk: {Math.round(item.risk)}% | Confidence: {Math.round((item.confidence || 0) * 100)}%
                      </Typography>
                    ))}

                    <Typography variant="subtitle2" sx={{ mt: 1.2 }}>Related Alerts / Anomalies</Typography>
                    {[...(lockedEquipmentDetail.alerts || []), ...(lockedEquipmentDetail.anomalies || [])].slice(0, 6).map((item, idx) => (
                      <Typography key={`${item.id || idx}`} variant="body2" color="text.secondary">- {item.message}</Typography>
                    ))}

                    <Typography variant="subtitle2" sx={{ mt: 1.2 }}>AI Recommendations</Typography>
                    {lockedEquipmentDetail.recommendations.map((rec, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary">- {rec}</Typography>
                    ))}


                    <Typography variant="subtitle2" sx={{ mt: 1.2 }}>Latest Sensor Snapshot</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Temp: {lockedEquipmentDetail.latestSensor.temperature ?? '-'} | Pressure: {lockedEquipmentDetail.latestSensor.pressure ?? '-'} | Vibration: {lockedEquipmentDetail.latestSensor.vibration ?? '-'} | Spindle: {lockedEquipmentDetail.latestSensor.spindleSpeed ?? '-'} | Current: {lockedEquipmentDetail.latestSensor.currentConsumption ?? '-'} | Wind: {lockedEquipmentDetail.latestSensor.windSpeed ?? '-'} | Battery Degradation: {lockedEquipmentDetail.latestSensor.batteryDegradation ?? '-'}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1.4, mb: 0.8 }}>
                      Trend Graphs
                    </Typography>
                    <div className="ai-charts-grid">
                      {trendGraphConfigs.map((item) => (
                        <SensorChart
                          key={`locked-${item.key}`}
                          title={item.label}
                          data={trendSeries}
                          dataKey={item.key}
                          color={item.color}
                          isLight={isLight}
                        />
                      ))}
                    </div>

                    <Typography variant="subtitle2" sx={{ mt: 1.3 }}>
                      {lockedEquipmentDetail.name} Predictive Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Failure Prediction: <b>{failurePredictionText}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                      Health Meter (0-100): <b>{predictiveResult?.healthScore ?? '-'}/100</b> | Failure Probability: <b>{predictiveResult?.failureProbability != null ? `${Math.round(predictiveResult.failureProbability * 100)}%` : '-'}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                      Action: {predictiveResult?.recommendedAction || 'Waiting for model response...'}
                    </Typography>
                  </CardContent>
                </Card>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="ai-span-12 ai-top-grid">
          <HealthCard title="AI Health Score" value={data.healthScore} unit="/100" progress={data.healthScore} subtitle="Overall machine health" sparklineData={spark('temperature')} trendDirection={trend(spark('temperature'))} />
          <HealthCard title="Live Status" value={data.currentStatus} status={data.currentStatus} subtitle="Real-time AI state" sparklineData={spark('vibration')} trendDirection={trend(spark('vibration'))} />
          <HealthCard title="Total Alerts" value={data.alerts.length} subtitle="Current actionable alerts" sparklineData={spark('pressure')} trendDirection={trend(spark('pressure'))} />
          <HealthCard title="Uptime" value={uptime} unit="%" subtitle="Estimated operational stability" sparklineData={spark('windSpeed')} trendDirection={trend(spark('windSpeed'))} />
          <HealthCard title="AI Confidence" value={avgConfidence} unit="%" subtitle="Average model confidence" sparklineData={spark('spindleSpeed')} trendDirection={trend(spark('spindleSpeed'))} />
        </div>

        <div className="ai-span-12">
          <div className="ai-mini-widgets">
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">CPU Usage</Typography><Typography variant="h6">{cpuUsage}%</Typography></CardContent></Card>
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">Network Latency</Typography><Typography variant="h6">{networkLatency} ms</Typography></CardContent></Card>
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">Sensor Health</Typography><Typography variant="h6">{sensorHealth}%</Typography></CardContent></Card>
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">Machine Uptime</Typography><Typography variant="h6">{uptime}%</Typography></CardContent></Card>
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">Energy Consumption</Typography><Typography variant="h6">{energyConsumption} kW</Typography></CardContent></Card>
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">AI Model Accuracy</Typography><Typography variant="h6">{modelAccuracy}%</Typography></CardContent></Card>
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">Maintenance Countdown</Typography><Typography variant="h6">{maintenanceCountdown} d</Typography></CardContent></Card>
            <Card><CardContent className="ai-mini-widget"><Typography variant="caption">System Load Meter</Typography><Typography variant="h6">{systemLoad}%</Typography></CardContent></Card>
          </div>
        </div>

        <div className="ai-span-8">
          <div className="ai-charts-grid">
            {sensorEntries.map(([key, label], idx) => (
              <div
                key={key}
                className={sensorEntries.length % 2 === 1 && idx === sensorEntries.length - 1 ? 'ai-chart-full' : ''}
              >
                <SensorChart
                  title={label}
                  data={data.sensorSeries}
                  dataKey={key}
                  color={chartColorMap[key] || '#4f46e5'}
                  isLight={isLight}
                  onOpenGraph={() => {
                    setGraphModal({ open: true, sensorKey: key });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="ai-span-4">
          <div className="ai-right-rail">
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Recent Alerts</Typography>
                <Stack spacing={1.1}>
                  {recentAlerts.map((item) => (
                    <div key={item.id}>
                      <Typography variant="subtitle2">{item.component}</Typography>
                      <Typography variant="body2" color="text.secondary">{new Date(item.timestamp).toLocaleString()}</Typography>
                    </div>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Recommendations</Typography>
                <Stack spacing={1}>
                  {(data.recommendations || []).slice(0, 4).map((rec, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary">- {rec}</Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Motor Predictive Health</Typography>
                {predictiveError ? (
                  <Alert severity="warning" sx={{ mb: 1.2 }}>{predictiveError}</Alert>
                ) : null}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
                  Failure Prediction: <b>{failurePredictionText}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Health Meter (0-100): <b>{predictiveResult?.healthScore ?? '-'}/100</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Failure Probability: <b>
                    {predictiveResult?.failureProbability != null
                      ? `${Math.round(predictiveResult.failureProbability * 100)}%`
                      : '-'}
                  </b>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Predicted Failure: <b>{predictiveResult?.predictedFailure == null ? '-' : predictiveResult.predictedFailure ? 'Yes' : 'No'}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Live Status: <b>{data.currentStatus}</b> (Healthy / Warning / Critical)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Action: {predictiveResult?.recommendedAction || 'Waiting for model response...'}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1.1 }}>AI Insights</Typography>
                {aiInsights.map((insight, idx) => (
                  <Typography key={`insight-${idx}`} variant="body2" color="text.secondary">
                    - {insight}
                  </Typography>
                ))}
                {predictiveSummary ? (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Model: {predictiveSummary.modelType} | Train Acc: {Math.round((predictiveSummary.trainAccuracy || 0) * 100)}%
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
            <HealthScoreGauge score={data.healthScore} status={data.currentStatus} />
          </div>
        </div>

        <div className="ai-span-8 ai-assistant-tight">
          <AIAssistantPanel predictedFailures={data.predictedFailures} anomalies={data.anomalies} />
        </div>
        <div className="ai-span-4">
          <FailureForecast predictedFailures={data.predictedFailures} isLight={isLight} />
        </div>

        <div className="ai-span-8">
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Logs / History</Typography>
              <div className="ai-logs-wrap">
                {logRows.slice(0, 12).map((row, idx) => (
                  <div className="ai-log-row" key={`${row.type}-${idx}`}>
                    <Typography variant="caption" sx={{ minWidth: 62 }}>{row.type}</Typography>
                    <Typography variant="body2" sx={{ minWidth: 150 }}>{row.label}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{row.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(row.time).toLocaleString()}</Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="ai-span-4">
          <EventTimeline anomalies={data.anomalies} />
        </div>

        <div className="ai-span-12"><AlertTable alerts={data.alerts} /></div>
      </div>
      <SensorGraphModal
        open={graphModal.open}
        onClose={() => setGraphModal((prev) => ({ ...prev, open: false }))}
        title={modalSensorLabel}
        sensorKey={graphModal.sensorKey}
        sensorSeries={data.sensorSeries}
        color={modalSensorColor}
        isLight={isLight}
      />
    </div>
  );
}



