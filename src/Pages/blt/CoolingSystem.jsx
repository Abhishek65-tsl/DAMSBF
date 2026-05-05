import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import BltDashboardToolbar from "../../Components/BltDashboardToolbar";
import coolingSystemImage from "../../assets/Images/CoolingSystem.png";
import {
  fetchCoolingAlarmSummaryMock,
  fetchCoolingDashboardMock,
  fetchCoolingEquipmentAlertsMock,
  fetchCoolingHealthMock,
  fetchCoolingMoComplianceMock,
  fetchCoolingTrendMock
} from "./coolingSystemMockData";

function getStyles(theme) {
  return `
.cooling-page {
  --bg: #07111f;
  --bg-soft: #0e1a2b;
  --panel: rgba(10, 23, 39, 0.82);
  --panel-strong: rgba(15, 34, 56, 0.94);
  --line: rgba(150, 180, 214, 0.18);
  --text: #edf6ff;
  --muted: #94a9bf;
  --accent: #4cc9f0;
  --accent-2: #4ade80;
  --warn: #f59e0b;
  --danger: #fb7185;
  --title-accent: #cfe6ff;
  --info-text: #7ee787;
  --inverse-text: #07111f;
  --inverse-muted: rgba(7, 17, 31, 0.72);
  --modal-surface: linear-gradient(180deg, #0d1c2f, #091321);
  --chart-axis: #aac0d6;
  --chart-point-stroke: #0d1c2f;
  --control-text: #0d2740;
  --control-surface: #ddf7ff;
  --score-core: #091524;
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(circle at top left, rgba(76, 201, 240, 0.14), transparent 28%),
    radial-gradient(circle at top right, rgba(74, 222, 128, 0.14), transparent 24%),
    linear-gradient(180deg, #091321 0%, #050b14 100%);
  color: var(--text);
  padding: 24px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
html[data-blt-theme="light"] .cooling-page {
  --text: ${theme.palette.text.primary};
  --muted: ${theme.palette.text.secondary};
  --title-accent: ${theme.palette.primary.dark};
  --info-text: ${theme.palette.success.dark};
  --modal-surface: linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default});
  --chart-axis: ${theme.palette.text.secondary};
  --chart-point-stroke: ${theme.palette.background.paper};
  --control-text: ${theme.palette.primary.contrastText};
  --control-surface: ${theme.palette.primary.main};
  --score-core: ${theme.palette.background.paper};
}
.cooling-shell {
  max-width: 1640px;
  margin: 0 auto;
}
.cooling-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.cooling-title {
  margin: 0;
  font-size: clamp(28px, 3vw, 42px);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.cooling-subtitle {
  margin-top: 8px;
  color: var(--muted);
  max-width: 760px;
  line-height: 1.5;
}
.cooling-badge-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.cooling-badge {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--text);
  font-size: 13px;
}
.cooling-refresh {
  border: 1px solid rgba(76, 201, 240, 0.35);
  background: linear-gradient(135deg, rgba(76, 201, 240, 0.22), rgba(39, 103, 167, 0.18));
  color: var(--text);
  border-radius: 16px;
  padding: 16px 18px;
  min-width: 220px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.2);
}
.refresh-label {
  font-size: 12px;
  color: var(--title-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.refresh-value {
  font-size: 24px;
  font-weight: 700;
  margin-top: 6px;
}
.refresh-action {
  margin-top: 14px;
  width: 100%;
  border: 0;
  border-radius: 12px;
  padding: 11px 14px;
  background: var(--control-surface);
  color: var(--control-text);
  cursor: pointer;
  font-weight: 700;
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.panel {
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(16, 30, 49, 0.9), rgba(9, 18, 31, 0.9));
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}
.metric-card {
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}
.metric-card:hover {
  transform: translateY(-2px);
  border-color: rgba(76, 201, 240, 0.34);
  background: rgba(76, 201, 240, 0.08);
}
.metric-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--accent), transparent);
}
.metric-label {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 14px;
  letter-spacing: 0.04em;
}
.metric-value {
  font-size: clamp(24px, 2.2vw, 32px);
  font-weight: 700;
}
.metric-unit {
  color: var(--muted);
  font-size: 12px;
  margin-top: 8px;
}
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.35fr) minmax(380px, 1fr);
  gap: 18px;
}
.process-grid {
  display: grid;
  grid-template-columns: minmax(230px, 1fr) minmax(340px, 1.35fr) minmax(230px, 1fr);
  gap: 14px;
  align-items: stretch;
  padding: 18px;
}
.sensor-column {
  display: grid;
  gap: 12px;
}
.sensor-card {
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(150, 180, 214, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}
.sensor-card:hover {
  transform: translateY(-2px);
  border-color: rgba(76, 201, 240, 0.34);
  background: rgba(76, 201, 240, 0.08);
}
.sensor-name {
  font-size: 13px;
  color: var(--text);
  margin-bottom: 9px;
}
.sensor-reading {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.sensor-value {
  font-size: 27px;
  font-weight: 700;
}
.sensor-unit {
  color: var(--muted);
  font-size: 12px;
}
.sensor-status {
  margin-top: 10px;
  font-size: 12px;
  color: var(--info-text);
}
.schematic {
  position: relative;
  min-height: 760px;
  padding: 22px;
  border-radius: 26px;
  background:
    linear-gradient(160deg, rgba(76, 201, 240, 0.08), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(165, 196, 230, 0.16);
  overflow: hidden;
}
.schematic::before {
  content: "";
  position: absolute;
  inset: 16px;
  border: 1px dashed rgba(160, 192, 225, 0.16);
  border-radius: 20px;
}
.schematic-title {
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: var(--title-accent);
}
.schematic-main {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  display: grid;
  gap: 18px;
}
.process-vessel {
  display: grid;
  place-items: center;
  min-height: 240px;
  border-radius: 28px;
  background: rgba(3, 7, 13, 0.78);
  border: 1px solid rgba(132, 162, 198, 0.2);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  overflow: hidden;
}
.cooling-system-image {
  width: 100%;
  max-height: 440px;
  object-fit: contain;
  display: block;
}
.process-pipes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.pipe-card {
  padding: 14px 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(160, 192, 225, 0.12);
}
.pipe-title {
  color: var(--muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pipe-value {
  margin-top: 8px;
  font-size: 20px;
  font-weight: 700;
}
.flow-track {
  margin-top: 12px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}
.flow-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4cc9f0, #4ade80);
}
.comparison-panel {
  padding: 18px;
}
.section-title {
  margin: 0 0 14px;
  font-size: 16px;
  letter-spacing: 0.04em;
}
.comparison-table {
  width: 100%;
  border-collapse: collapse;
}
.comparison-table th,
.comparison-table td {
  padding: 12px 10px;
  border-bottom: 1px solid rgba(160, 192, 225, 0.12);
  text-align: left;
  font-size: 13px;
}
.comparison-table th {
  color: var(--muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
.sidebar {
  display: grid;
  gap: 20px;
  align-content: start;
}
.sidebar-panel {
  padding: 22px 20px;
}
.overall-score {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.score-ring {
  width: 106px;
  height: 106px;
  flex-shrink: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  background: conic-gradient(var(--accent-2) calc(var(--value) * 1%), rgba(255,255,255,0.09) 0);
}
.score-ring::before {
  content: "";
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: var(--score-core);
}
.score-ring span {
  position: relative;
  z-index: 1;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}
.score-copy {
  flex: 1;
}
.score-copy p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.45;
  font-size: 13px;
}
.gauge-grid {
  display: grid;
  gap: 14px;
}
.gauge-card {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(160, 192, 225, 0.14);
  color: var(--text);
  cursor: pointer;
}
.gauge-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.gauge-label {
  font-size: 13px;
  color: var(--text);
}
.gauge-value {
  font-size: 14px;
  color: var(--text);
  font-weight: 700;
}
.gauge-bar {
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255,255,255,0.1);
}
.gauge-bar > div {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #fb7185, #f59e0b, #4ade80);
}
.alarm-lines {
  display: grid;
  gap: 12px;
}
.alarm-line {
  padding: 14px 16px;
  border-left: 4px solid var(--danger);
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  color: var(--text);
  line-height: 1.45;
  font-size: 13px;
}
.pill-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.pill {
  border-radius: 16px;
  padding: 16px;
  color: var(--inverse-text);
  font-weight: 700;
}
.pill small {
  display: block;
  margin-top: 8px;
  color: var(--inverse-muted);
  font-size: 12px;
  font-weight: 600;
}
.chart-card {
  display: grid;
  gap: 14px;
}
.bar-row {
  display: grid;
  grid-template-columns: 128px 1fr 44px;
  gap: 12px;
  align-items: center;
  font-size: 13px;
}
.bar-label {
  color: var(--text);
}
.bar-track {
  height: 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: inherit;
}
.modal-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  background: rgba(1, 7, 13, 0.72);
  backdrop-filter: blur(10px);
  z-index: 1200;
}
.modal-card {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: min(900px, 100%);
  border-radius: 28px;
  border: 1px solid rgba(165, 196, 230, 0.22);
  background: var(--modal-surface);
  color: var(--text);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
  padding: 24px;
  margin-bottom: 60px;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}
.modal-head h3,
.modal-head p {
  margin: 0;
}
.modal-head p {
  color: var(--muted);
  margin-top: 6px;
}
.modal-close {
  border: 0;
  background: rgba(255,255,255,0.08);
  color: var(--text);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
}
.trend-shell {
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(165, 196, 230, 0.14);
  background: rgba(255,255,255,0.03);
}
.trend-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.trend-meta strong {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 4px;
}
.trend-svg {
  width: 100%;
  height: 280px;
}
.trend-grid line {
  stroke: rgba(165, 196, 230, 0.12);
}
.trend-axis text {
  fill: var(--chart-axis);
  font-size: 11px;
}
.legend-note {
  margin-top: 10px;
  color: var(--muted);
  font-size: 12px;
}
@media (max-width: 1380px) {
  .metric-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .process-grid {
    grid-template-columns: 1fr;
  }
  .schematic {
    min-height: 560px;
  }
}
@media (max-width: 1100px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .cooling-page {
    padding: 16px;
  }
  .cooling-header {
    flex-direction: column;
  }
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pill-grid {
    grid-template-columns: 1fr;
  }
  .bar-row {
    grid-template-columns: 1fr;
  }
}
  `;
}

function formatMetric(value, unit) {
  if (value == null || value === "") return "NA";
  if (typeof value === "string") return value;
  const digits = unit === "mm" ? 0 : 1;
  return Number(value).toFixed(digits);
}

function findById(items, id) {
  return items.find((item) => String(item.id) === String(id));
}

function percentWidth(value, multiplier = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0%";
  return `${Math.min(Math.max(number * multiplier, 0), 100)}%`;
}

function getStatusTone(value, unit) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Stable";
  if (unit === "deg C" && number >= 62) return "Attention";
  if (unit === "mm" && number <= 360) return "Low";
  if (unit === "bar" && number < 160) return "Low";
  return "Normal";
}

function getBarColor(index) {
  const palette = [
    "linear-gradient(90deg, #4cc9f0, #4895ef)",
    "linear-gradient(90deg, #4ade80, #22c55e)",
    "linear-gradient(90deg, #fbbf24, #f59e0b)",
    "linear-gradient(90deg, #fb7185, #ef4444)",
    "linear-gradient(90deg, #a78bfa, #6366f1)"
  ];
  return palette[index % palette.length];
}

function SparkTrend({ data }) {
  if (!data?.length) return null;

  const width = 820;
  const height = 280;
  const padding = 28;
  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - ((item.value - min) / range) * (height - padding * 2);
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const yTicks = [0, 1, 2, 3].map((step) => min + (range * step) / 3);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" role="img" aria-label="Sensor trend">
      <defs>
        <linearGradient id="coolingTrendFill" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(76, 201, 240, 0.35)" />
          <stop offset="100%" stopColor="rgba(76, 201, 240, 0.02)" />
        </linearGradient>
      </defs>
      <g className="trend-grid">
        {yTicks.map((tick) => {
          const y = height - padding - ((tick - min) / range) * (height - padding * 2);
          return <line key={tick} x1={padding} y1={y} x2={width - padding} y2={y} />;
        })}
      </g>
      <path d={areaPath} fill="url(#coolingTrendFill)" />
      <path d={linePath} fill="none" stroke="#4cc9f0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point) => (
        <circle key={point.label} cx={point.x} cy={point.y} r="5" fill="#4ade80" stroke="var(--chart-point-stroke)" strokeWidth="3" />
      ))}
      <g className="trend-axis">
        {points.map((point) => (
          <text key={`${point.label}-axis`} x={point.x} y={height - 8} textAnchor="middle">
            {point.label}
          </text>
        ))}
        {yTicks.map((tick) => {
          const y = height - padding - ((tick - min) / range) * (height - padding * 2);
          return (
            <text key={`${tick}-value`} x={10} y={y + 4}>
              {tick.toFixed(1)}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function MetricCard({ metric, onSelect }) {
  return (
    <button type="button" className="panel metric-card" onClick={(e) => onSelect(metric, e)} style={{ textAlign: "left", border: "1px solid rgba(150,180,214,0.18)" }}>
      <div className="metric-label">{metric.label}</div>
      <div className="metric-value">{formatMetric(metric.value, metric.unit)}</div>
      <div className="metric-unit">{metric.unit || "Status"}</div>
    </button>
  );
}

function SensorCard({ sensor, onSelect }) {
  return (
    <button type="button" className="sensor-card" onClick={(e) => onSelect(sensor, e)} style={{ textAlign: "left" }}>
      <div className="sensor-name">{sensor.label}</div>
      <div className="sensor-reading">
        <span className="sensor-value">{formatMetric(sensor.value, sensor.unit)}</span>
        <span className="sensor-unit">{sensor.unit}</span>
      </div>
      <div className="sensor-status">{getStatusTone(sensor.value, sensor.unit)}</div>
    </button>
  );
}

function SidebarBarChart({ rows, maxValue }) {
  return (
    <div className="chart-card">
      {rows.map((row, index) => (
        <div className="bar-row" key={row.label}>
          <span className="bar-label">{row.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(row.value / maxValue) * 100}%`, background: getBarColor(index) }} />
          </div>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function CoolingSystem() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [dashboard, setDashboard] = useState(null);
  const [health, setHealth] = useState(null);
  const [alarms, setAlarms] = useState(null);
  const [equipmentAlerts, setEquipmentAlerts] = useState([]);
  const [moCompliance, setMoCompliance] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [modalY, setModalY] = useState(100);
  const [trendData, setTrendData] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedSensor && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSensor]);

  const handleItemSelect = useCallback((item, event) => {
    let y = 100;
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      y = rect.top + window.pageYOffset;
    } else if (event && typeof event.pageY === "number") {
      y = event.pageY;
    }
    setModalY(Math.max(20, y));
    setSelectedSensor(item);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!hasLoadedRef.current) setLoading(true);
    setError(null);

    try {
      const [dashboardData, healthData, alarmData, alertData, moData] = await Promise.all([
        fetchCoolingDashboardMock(),
        fetchCoolingHealthMock(),
        fetchCoolingAlarmSummaryMock(),
        fetchCoolingEquipmentAlertsMock(),
        fetchCoolingMoComplianceMock()
      ]);

      setDashboard(dashboardData);
      setHealth(healthData);
      setAlarms(alarmData);
      setEquipmentAlerts(alertData);
      setMoCompliance(moData);
      setLastRefresh(new Date());
      hasLoadedRef.current = true;
    } catch (loadError) {
      setError(loadError?.message || "Unable to load cooling system dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (
      !selectedSensor?.id ||
      selectedSensor.id === "pump-status" ||
      selectedSensor.detail ||
      typeof selectedSensor.value === "string"
    ) {
      setTrendData([]);
      setLoadingTrend(false);
      return;
    }

    let active = true;
    setLoadingTrend(true);
    fetchCoolingTrendMock(selectedSensor.id)
      .then((data) => {
        if (!active) return;
        setTrendData(data);
      })
      .catch(() => {
        if (!active) return;
        setTrendData([]);
      })
      .finally(() => {
        if (!active) return;
        setLoadingTrend(false);
      });

    return () => {
      active = false;
    };
  }, [selectedSensor]);

  if (loading || !dashboard || !health || !alarms) {
    return (
      <div className="cooling-page">
        <style>{styles}</style>
        <div className="cooling-shell">
          <div className="panel sidebar-panel">
            {error ? (
              <>
                <h2 className="section-title">Cooling dashboard unavailable</h2>
                <p className="legend-note">{error}</p>
                <button className="refresh-action" onClick={loadDashboard}>
                  Retry
                </button>
              </>
            ) : (
              "Loading cooling system dashboard..."
            )}
          </div>
        </div>
      </div>
    );
  }

  const equipmentMax = Math.max(...equipmentAlerts.map((item) => item.value), 1);
  const moMax = 100;
  const hydraulicPressure = findById(dashboard.headerMetrics, 2426);
  const pumpStatus = findById(dashboard.headerMetrics, "pump-status");
  const makeUpFlow = findById(dashboard.leftColumn, 1172);
  const searchItems = [
    ...dashboard.headerMetrics.map((item) => ({ ...item, group: "Header KPIs" })),
    ...dashboard.leftColumn.map((item) => ({ ...item, group: "Cooling sensors" })),
    ...dashboard.rightColumn.map((item) => ({ ...item, group: "Cooling sensors" })),
    ...dashboard.comparisonRows.map((item) => ({
      id: item.id,
      label: item.parameter,
      value: item.latest,
      unit: item.unit,
      group: "Performance snapshot"
    })),
    ...equipmentAlerts.map((item) => ({
      id: `equipment-alert-${item.label}`,
      label: item.label,
      value: `${item.value} equipment alerts`,
      unit: "",
      group: "Equipment alerts"
    })),
    ...moCompliance.map((item) => ({
      id: `mo-compliance-${item.label}`,
      label: item.label,
      value: `${item.value}%`,
      unit: "",
      group: "SAP PM MO compliance"
    })),
    ...alarms.recent.map((item, index) => ({
      id: `recent-alarm-${index}`,
      label: item,
      value: item,
      unit: "",
      group: "Recent alarms"
    })),
    ...health.items.map((item) => ({
      id: item.key,
      label: item.label,
      value: item.value,
      unit: "%",
      detail: item.detail,
      group: "Equipment health"
    }))
  ];
  const selectedHasTrend =
    selectedSensor &&
    !selectedSensor.detail &&
    selectedSensor.id !== "pump-status" &&
    typeof selectedSensor.value !== "string";

  return (
    <div className="cooling-page">
      <style>{styles}</style>
      <div className="cooling-shell">
        <BltDashboardToolbar
          title="Cooling System"
          breadcrumb="DAMS / BLT / Cooling"
          plantArea="BLT Cooling"
          alertsCount={alarms.OPEN}
          lastRefresh={lastRefresh}
          onRefresh={loadDashboard}
          searchItems={searchItems}
          onSearchSelect={setSelectedSensor}
          userName="BLT Operator"
        />

        <header className="cooling-header">
          <div>
            <h1 className="cooling-title">Cooling Circuit Overview</h1>
            <p className="cooling-subtitle">
              This version keeps the same operating signals and equipment-health intent, but presents them in a modern dashboard layout backed by mock API responses that can be replaced later.
            </p>
            <div className="cooling-badge-row">
              <span className="cooling-badge">Asset: BLT Cooling</span>
              {/* <span className="cooling-badge">Mode: Mock API</span> */}
              <span className="cooling-badge">Refresh: 5 min</span>
            </div>
          </div>
        </header>

        <section className="metric-grid">
          {dashboard.headerMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} onSelect={setSelectedSensor} />
          ))}
        </section>

        <section className="main-grid">
          <div style={{ display: "grid", gap: 18 }}>
            <div className="panel process-grid">
              <div className="sensor-column">
                {dashboard.leftColumn.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} onSelect={setSelectedSensor} />
                ))}
              </div>

              <div className="schematic">
                <div className="schematic-title">Process overview</div>
                <div className="schematic-main">
                  <div className="process-vessel">
                    <img className="cooling-system-image" src={coolingSystemImage} alt="Cooling system overview" />
                  </div>

                  <div className="process-pipes">
                    <div className="pipe-card">
                      <div className="pipe-title">Hydraulic Pressure</div>
                      <div className="pipe-value">{formatMetric(hydraulicPressure?.value, "bar")} bar</div>
                      <div className="flow-track">
                        <div className="flow-fill" style={{ width: percentWidth(hydraulicPressure?.value, 0.5) }} />
                      </div>
                    </div>
                    <div className="pipe-card">
                      <div className="pipe-title">Pump Health</div>
                      <div className="pipe-value">{pumpStatus?.value || "NA"}</div>
                      <div className="flow-track">
                        <div className="flow-fill" style={{ width: "86%" }} />
                      </div>
                    </div>
                    <div className="pipe-card">
                      <div className="pipe-title">Make up Flow</div>
                      <div className="pipe-value">{formatMetric(makeUpFlow?.value, "m3")} m3</div>
                      <div className="flow-track">
                        <div className="flow-fill" style={{ width: percentWidth(makeUpFlow?.value, 5) }} />
                      </div>
                    </div>
                    <div className="pipe-card">
                      <div className="pipe-title">Thermal Stability</div>
                      <div className="pipe-value">92.4%</div>
                      <div className="flow-track">
                        <div className="flow-fill" style={{ width: "92.4%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sensor-column">
                {dashboard.rightColumn.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} onSelect={setSelectedSensor} />
                ))}
              </div>
            </div>

            <div className="panel comparison-panel">
              <h2 className="section-title">Cooling Circuit Performance Snapshot</h2>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Current</th>
                    <th>Previous day average</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.comparisonRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.parameter}</td>
                      <td>{formatMetric(row.latest, row.unit)} {row.unit}</td>
                      <td>{formatMetric(row.previousAverage, row.unit)} {row.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="sidebar">
            <div className="panel sidebar-panel">
              <div className="overall-score">
                <div className="score-ring" style={{ "--value": health.overall }}>
                  <span>{health.overall}%</span>
                </div>
                <div className="score-copy">
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Equipment Health</h2>
                  <p>Aggregated from alert compliance, maintenance order completion, and notification closure signals from the legacy DAMS logic.</p>
                </div>
              </div>

              <div className="gauge-grid">
                {health.items.map((item) => (
                  <button key={item.key} type="button" className="gauge-card" onClick={(e) => handleItemSelect({ id: item.key, label: item.label, unit: "%", value: item.value, detail: item.detail }, e)} style={{ textAlign: "left" }}>
                    <div className="gauge-top">
                      <span className="gauge-label">{item.label}</span>
                      <span className="gauge-value">{item.value}%</span>
                    </div>
                    <div className="gauge-bar">
                      <div style={{ width: `${item.value}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel sidebar-panel">
              <h2 className="section-title">Recent Alarm</h2>
              <div className="alarm-lines">
                {alarms.recent.map((line) => (
                  <div className="alarm-line" key={line}>{line}</div>
                ))}
              </div>
            </div>

            <div className="panel sidebar-panel">
              <h2 className="section-title">Alert Summary</h2>
              <div className="pill-grid">
                <div className="pill" style={{ background: "#4ade80" }}>
                  {alarms.TOTAL}
                  <small>Total Alerts</small>
                </div>
                <div className="pill" style={{ background: "#4cc9f0" }}>
                  {alarms.OPEN}
                  <small>Open Alerts</small>
                </div>
                <div className="pill" style={{ background: "#f59e0b" }}>
                  {alarms.CLOSE}
                  <small>Closed Alerts</small>
                </div>
                <div className="pill" style={{ background: "#f8fafc" }}>
                  {alarms.ACK}
                  <small>Acknowledged</small>
                </div>
              </div>
            </div>

            <div className="panel sidebar-panel">
              <h2 className="section-title">Equipment Alert Distribution</h2>
              <SidebarBarChart rows={equipmentAlerts} maxValue={equipmentMax} />
            </div>

            <div className="panel sidebar-panel">
              <h2 className="section-title">SAP PM MO Compliance</h2>
              <SidebarBarChart rows={moCompliance} maxValue={moMax} />
            </div>
          </aside>
        </section>
      </div>

      {selectedSensor && (
        <div className="modal-backdrop" onClick={() => setSelectedSensor(null)}>
          <div ref={modalRef} className="modal-card" style={{ top: `${modalY}px` }} onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>{selectedSensor.label}</h3>
                <p>
                  {selectedSensor.detail
                    ? "Equipment health composition details from mock compliance data."
                    : selectedHasTrend
                      ? "Mock 7-point trend preview ready to be swapped with live trend API data."
                      : "Operational summary item selected from the dashboard search."}
                </p>
              </div>
              <button className="modal-close" onClick={() => setSelectedSensor(null)}>x</button>
            </div>

            {selectedSensor.detail ? (
              <div className="trend-shell">
                <div className="trend-meta">
                  <div>
                    <strong>Health Score</strong>
                    <span>{selectedSensor.value}%</span>
                  </div>
                  <div>
                    <strong>Alert Compliance</strong>
                    <span>{selectedSensor.detail.alertComp}%</span>
                  </div>
                  <div>
                    <strong>MO Compliance</strong>
                    <span>{selectedSensor.detail.moComp}%</span>
                  </div>
                  <div>
                    <strong>Notification Compliance</strong>
                    <span>{selectedSensor.detail.noComp}%</span>
                  </div>
                </div>
                <div className="legend-note">Use this click target for the future detailed compliance modal or drill-down route.</div>
              </div>
            ) : (
              <div className="trend-shell">
                <div className="trend-meta">
                  <div>
                    <strong>Current Reading</strong>
                    <span>{formatMetric(selectedSensor.value, selectedSensor.unit)} {selectedSensor.unit}</span>
                  </div>
                  <div>
                    <strong>Source Tag</strong>
                    <span>{selectedSensor.id}</span>
                  </div>
                  <div>
                    <strong>Trend Window</strong>
                    <span>Last 7 hours</span>
                  </div>
                </div>
                {!selectedHasTrend ? (
                  <div className="legend-note">This item is a summary value and does not have trend data.</div>
                ) : loadingTrend ? (
                  <div>Loading trend...</div>
                ) : trendData.length ? (
                  <SparkTrend data={trendData} />
                ) : (
                  <div className="legend-note">Trend data is not available for this item yet.</div>
                )}
                <div className="legend-note">Replace `fetchCoolingTrendMock` with your actual trend API later.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
