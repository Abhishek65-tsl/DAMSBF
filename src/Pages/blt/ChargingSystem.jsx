import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import BltDashboardToolbar from "../../Components/BltDashboardToolbar";
import chargingSystemImage from "../../assets/Images/ChargingSystem.png";
import {
  fetchChargingAlarmSummaryMock,
  fetchChargingAlertDistributionMock,
  fetchChargingDashboardMock,
  fetchChargingHealthMock,
  fetchChargingMoComplianceMock,
  fetchChargingTrendMock
} from "./chargingSystemMockData";

function getStyles(theme) {
  return `
.charging-page {
  --bg: #091019;
  --panel: rgba(9, 22, 35, 0.9);
  --line: rgba(140, 175, 204, 0.15);
  --text: #edf5ff;
  --muted: #94a8bc;
  --accent: #ff8a00;
  --accent-soft: #ffb347;
  --accent-2: #40c4ff;
  --good: #4ade80;
  --danger: #fb7185;
  --title-accent: #ffe2bf;
  --inverse-text: #08111a;
  --inverse-muted: rgba(8,17,26,0.72);
  --modal-surface: linear-gradient(180deg, #102033, #08111a);
  --chart-axis: #b2c6d9;
  --chart-point-stroke: #08111a;
  --control-text: #0f1722;
  --control-surface: #fff4e5;
  --score-core: #08111a;
  min-height: 100vh;
  position: relative;
  padding: 24px;
  color: var(--text);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(255, 138, 0, 0.14), transparent 24%),
    radial-gradient(circle at top right, rgba(64, 196, 255, 0.14), transparent 22%),
    linear-gradient(180deg, #08111a, #03070d 100%);
}
html[data-blt-theme="light"] .charging-page {
  --text: ${theme.palette.text.primary};
  --muted: ${theme.palette.text.secondary};
  --title-accent: ${theme.palette.warning.dark};
  --modal-surface: linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default});
  --chart-axis: ${theme.palette.text.secondary};
  --chart-point-stroke: ${theme.palette.background.paper};
  --control-text: ${theme.palette.warning.contrastText};
  --control-surface: ${theme.palette.warning.main};
  --score-core: ${theme.palette.background.paper};
}
.charging-shell {
  max-width: 1640px;
  margin: 0 auto;
}
.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}
.hero h1 {
  margin: 0;
  font-size: clamp(30px, 3vw, 44px);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.hero p {
  margin: 10px 0 0;
  max-width: 760px;
  color: var(--muted);
  line-height: 1.5;
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
}
.chip {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
  padding: 8px 14px;
  font-size: 13px;
}
.status-box {
  min-width: 240px;
  border-radius: 18px;
  border: 1px solid rgba(255, 179, 71, 0.24);
  padding: 18px;
  background: linear-gradient(135deg, rgba(255,138,0,0.18), rgba(12, 29, 47, 0.65));
}
.status-box small {
  color: var(--title-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.status-box strong {
  display: block;
  margin-top: 8px;
  font-size: 26px;
}
.status-box button {
  margin-top: 14px;
  width: 100%;
  border: 0;
  border-radius: 12px;
  padding: 11px 14px;
  font-weight: 700;
  cursor: pointer;
  color: var(--control-text);
  background: var(--control-surface);
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.panel {
  border-radius: 22px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(11, 25, 39, 0.96), rgba(6, 14, 23, 0.96));
  box-shadow: 0 20px 48px rgba(0,0,0,0.24);
}
.metric-card {
  padding: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, background 0.18s ease;
}
.metric-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.06);
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
  font-size: 13px;
  color: var(--muted);
}
.metric-value {
  margin-top: 14px;
  font-size: clamp(24px, 2.1vw, 32px);
  font-weight: 700;
}
.metric-unit {
  margin-top: 8px;
  color: var(--muted);
  font-size: 12px;
}
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.35fr) minmax(380px, 1fr);
  gap: 18px;
}
.process-panel {
  padding: 18px;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(360px, 1.3fr) minmax(220px, 1fr);
  gap: 14px;
}
.column {
  display: grid;
  gap: 12px;
}
.sensor-card {
  border-radius: 18px;
  border: 1px solid rgba(140,175,204,0.12);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  padding: 14px;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.sensor-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 179, 71, 0.34);
}
.sensor-name {
  color: var(--text);
  font-size: 13px;
}
.sensor-reading {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.sensor-reading strong {
  font-size: 28px;
}
.sensor-reading span {
  font-size: 12px;
  color: var(--muted);
}
.sensor-tone {
  margin-top: 10px;
  color: var(--title-accent);
  font-size: 12px;
}
.schematic {
  min-height: 760px;
  border-radius: 28px;
  padding: 22px;
  border: 1px solid rgba(140,175,204,0.14);
  background:
    linear-gradient(160deg, rgba(255,138,0,0.08), transparent 36%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  position: relative;
  overflow: hidden;
}
.schematic::before {
  content: "";
  position: absolute;
  inset: 16px;
  border-radius: 22px;
  border: 1px dashed rgba(180, 201, 221, 0.12);
}
.schematic-title {
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--title-accent);
  font-size: 12px;
}
.furnace {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  display: grid;
  gap: 18px;
}
.furnace-core {
  min-height: 270px;
  display: grid;
  place-items: center;
  border-radius: 30px;
  background: rgba(3, 7, 13, 0.78);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}
.charging-system-image {
  width: 100%;
  max-height: 440px;
  object-fit: contain;
  display: block;
}
.charge-lines {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.line-card {
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(140,175,204,0.12);
  background: rgba(255,255,255,0.03);
}
.line-card small {
  display: block;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
.line-card strong {
  display: block;
  margin-top: 8px;
  font-size: 20px;
}
.track {
  margin-top: 10px;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
}
.track > div {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}
.bottom-panel {
  padding: 18px;
}
.bottom-panel h2,
.sidebar-panel h2 {
  margin: 0 0 16px;
  font-size: 16px;
  letter-spacing: 0.02em;
}
.temp-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.temp-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(140,175,204,0.12);
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.temp-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 179, 71, 0.34);
}
.temp-card span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}
.temp-card strong {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.sidebar {
  display: grid;
  gap: 20px;
  align-content: start;
}
.sidebar-panel {
  padding: 22px 20px;
}
.health-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
}
.score {
  width: 108px;
  height: 108px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(var(--good) calc(var(--value) * 1%), rgba(255,255,255,0.08) 0);
}
.score::before {
  content: "";
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: var(--score-core);
}
.score span {
  position: relative;
  z-index: 1;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}
.health-copy p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}
.gauge-list {
  display: grid;
  gap: 14px;
}
.gauge-card {
  border-radius: 18px;
  border: 1px solid rgba(140,175,204,0.12);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  padding: 14px;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.gauge-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 179, 71, 0.34);
}
.gauge-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.gauge-label {
  font-size: 13px;
}
.gauge-value {
  font-size: 14px;
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
  background: linear-gradient(90deg, #fb7185, #f59e0b, #4ade80);
}
.alarm-list {
  display: grid;
  gap: 12px;
}
.alarm-item {
  border-left: 3px solid var(--danger);
  border-radius: 12px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.03);
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
}
.bars {
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
  background: rgba(3, 8, 14, 0.74);
  backdrop-filter: blur(10px);
  z-index: 1200;
}
.modal-card {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: min(900px, 100%);
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(140,175,204,0.18);
  background: var(--modal-surface);
  color: var(--text);
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
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
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text);
  background: rgba(255,255,255,0.08);
}
.trend-shell {
  border-radius: 20px;
  border: 1px solid rgba(140,175,204,0.14);
  background: rgba(255,255,255,0.03);
  padding: 16px;
}
.trend-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.trend-meta strong {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--muted);
}
.trend-svg {
  width: 100%;
  height: 280px;
}
.trend-grid line {
  stroke: rgba(140,175,204,0.12);
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
  .process-panel {
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
  .charging-page {
    padding: 16px;
  }
  .hero {
    flex-direction: column;
  }
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pill-grid,
  .temp-grid {
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
  const digits = unit === "t" ? 1 : 1;
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

function toneForMetric(value, unit) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Stable";
  if (unit === "deg C" && number > 300) return "Thermal watch";
  if (unit === "A" && number > 36) return "Elevated load";
  if (unit === "s" && number > 12) return "Cycle drift";
  return "Within band";
}

function palette(index) {
  const colors = [
    "linear-gradient(90deg, #ff8a00, #ffb347)",
    "linear-gradient(90deg, #40c4ff, #0ea5e9)",
    "linear-gradient(90deg, #4ade80, #22c55e)",
    "linear-gradient(90deg, #f472b6, #ec4899)",
    "linear-gradient(90deg, #fbbf24, #f59e0b)"
  ];
  return colors[index % colors.length];
}

function TrendChart({ data }) {
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

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const yTicks = [0, 1, 2, 3].map((step) => min + (range * step) / 3);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" role="img" aria-label="Charging trend">
      <defs>
        <linearGradient id="chargingTrendFill" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,138,0,0.34)" />
          <stop offset="100%" stopColor="rgba(255,138,0,0.02)" />
        </linearGradient>
      </defs>
      <g className="trend-grid">
        {yTicks.map((tick) => {
          const y = height - padding - ((tick - min) / range) * (height - padding * 2);
          return <line key={tick} x1={padding} y1={y} x2={width - padding} y2={y} />;
        })}
      </g>
      <path d={area} fill="url(#chargingTrendFill)" />
      <path d={path} fill="none" stroke="#ffb347" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point) => (
        <circle key={point.label} cx={point.x} cy={point.y} r="5" fill="#40c4ff" stroke="var(--chart-point-stroke)" strokeWidth="3" />
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
            <text key={`${tick}-tick`} x={10} y={y + 4}>
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
    <button type="button" className="panel metric-card" onClick={(e) => onSelect(metric, e)} style={{ textAlign: "left" }}>
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
        <strong>{formatMetric(sensor.value, sensor.unit)}</strong>
        <span>{sensor.unit}</span>
      </div>
      <div className="sensor-tone">{toneForMetric(sensor.value, sensor.unit)}</div>
    </button>
  );
}

function Bars({ rows, max }) {
  return (
    <div className="bars">
      {rows.map((row, index) => (
        <div className="bar-row" key={row.label}>
          <span>{row.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(row.value / max) * 100}%`, background: palette(index) }} />
          </div>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function ChargingSystem() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [dashboard, setDashboard] = useState(null);
  const [health, setHealth] = useState(null);
  const [alarms, setAlarms] = useState(null);
  const [alertDistribution, setAlertDistribution] = useState([]);
  const [moCompliance, setMoCompliance] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalY, setModalY] = useState(100);
  const [trendData, setTrendData] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedItem && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedItem]);

  const handleItemSelect = useCallback((item, event) => {
    let y = 100;
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      y = rect.top + window.pageYOffset;
    } else if (event && typeof event.pageY === "number") {
      y = event.pageY;
    }
    setModalY(Math.max(20, y));
    setSelectedItem(item);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!hasLoadedRef.current) setLoading(true);
    setError(null);

    try {
      const [dashboardData, healthData, alarmData, distributionData, moData] = await Promise.all([
        fetchChargingDashboardMock(),
        fetchChargingHealthMock(),
        fetchChargingAlarmSummaryMock(),
        fetchChargingAlertDistributionMock(),
        fetchChargingMoComplianceMock()
      ]);

      setDashboard(dashboardData);
      setHealth(healthData);
      setAlarms(alarmData);
      setAlertDistribution(distributionData);
      setMoCompliance(moData);
      setLastRefresh(new Date());
      hasLoadedRef.current = true;
    } catch (loadError) {
      setError(loadError?.message || "Unable to load charging system dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (
      !selectedItem?.id ||
      selectedItem.id === "pump-status" ||
      selectedItem.detail ||
      typeof selectedItem.value === "string"
    ) {
      setTrendData([]);
      setLoadingTrend(false);
      return;
    }

    let active = true;
    setLoadingTrend(true);
    fetchChargingTrendMock(selectedItem.id)
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
  }, [selectedItem]);

  if (loading || !dashboard || !health || !alarms) {
    return (
      <div className="charging-page">
        <style>{styles}</style>
        <div className="charging-shell">
          <div className="panel sidebar-panel">
            {error ? (
              <>
                <h2>Charging dashboard unavailable</h2>
                <div className="legend-note">{error}</div>
                <button
                  onClick={loadDashboard}
                  style={{ marginTop: 14, border: 0, borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}
                >
                  Retry
                </button>
              </>
            ) : (
              "Loading charging system dashboard..."
            )}
          </div>
        </div>
      </div>
    );
  }

  const alertMax = Math.max(...alertDistribution.map((item) => item.value), 1);
  const furnaceTemp = findById(dashboard.leftColumn, 1408);
  const topPressure = findById(dashboard.leftColumn, 1407);
  const hydraulicPressure = findById(dashboard.headerMetrics, 1047);
  const pumpStatus = findById(dashboard.headerMetrics, "pump-status");
  const searchItems = [
    ...dashboard.headerMetrics.map((item) => ({ ...item, group: "Header KPIs" })),
    ...dashboard.leftColumn.map((item) => ({ ...item, group: "Charging sensors" })),
    ...dashboard.rightColumn.map((item) => ({ ...item, group: "Charging sensors" })),
    ...dashboard.motorTemperature.map((item) => ({ ...item, group: "Motor temperature" })),
    ...alertDistribution.map((item) => ({
      id: `alert-distribution-${item.label}`,
      label: item.label,
      value: `${item.value} open alerts`,
      unit: "",
      group: "Open alert distribution"
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
    selectedItem &&
    !selectedItem.detail &&
    selectedItem.id !== "pump-status" &&
    typeof selectedItem.value !== "string";

  return (
    <div className="charging-page">
      <style>{styles}</style>
      <div className="charging-shell">
        <BltDashboardToolbar
          title="Charging System"
          breadcrumb="DAMS / BLT / Charging"
          plantArea="BLT Charging"
          alertsCount={alarms.OPEN}
          lastRefresh={lastRefresh}
          onRefresh={loadDashboard}
          searchItems={searchItems}
          onSearchSelect={handleItemSelect}
          userName="BLT Operator"
        />

        <header className="hero">
          <div>
            <h1>Charging Flow Overview</h1>
            <p>
              The original hopper timings, chute angles, furnace readings, motor currents, alarms, and equipment-health sections are preserved in a cleaner dashboard that is ready for future API integration.
            </p>
            <div className="chip-row">
              <span className="chip">Asset: BLT Charging</span>
              <span className="chip">Source: Mock API</span>
              <span className="chip">Refresh: 5 min</span>
            </div>
          </div>
        </header>

        <section className="metric-grid">
          {dashboard.headerMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} onSelect={setSelectedItem} />
          ))}
        </section>

        <section className="main-grid">
          <div style={{ display: "grid", gap: 18 }}>
            <div className="panel process-panel">
              <div className="column">
                {dashboard.leftColumn.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} onSelect={setSelectedItem} />
                ))}
              </div>

              <div className="schematic">
                <div className="schematic-title">Charging flow overview</div>
                <div className="furnace">
                  <div className="furnace-core">
                    <img className="charging-system-image" src={chargingSystemImage} alt="Charging system overview" />
                  </div>

                  <div className="charge-lines">
                    <div className="line-card">
                      <small>Furnace Temp</small>
                      <strong>{formatMetric(furnaceTemp?.value, "deg C")} deg C</strong>
                      <div className="track">
                        <div style={{ width: percentWidth(furnaceTemp?.value, 1 / 3.6) }} />
                      </div>
                    </div>
                    <div className="line-card">
                      <small>Top Pressure</small>
                      <strong>{formatMetric(topPressure?.value, "bar")} bar</strong>
                      <div className="track">
                        <div style={{ width: percentWidth(topPressure?.value, 48) }} />
                      </div>
                    </div>
                    <div className="line-card">
                      <small>Hydraulic Pressure</small>
                      <strong>{formatMetric(hydraulicPressure?.value, "bar")} bar</strong>
                      <div className="track">
                        <div style={{ width: percentWidth(hydraulicPressure?.value, 0.5) }} />
                      </div>
                    </div>
                    <div className="line-card">
                      <small>Pump Status</small>
                      <strong>{pumpStatus?.value || "NA"}</strong>
                      <div className="track">
                        <div style={{ width: "88%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column">
                {dashboard.rightColumn.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} onSelect={setSelectedItem} />
                ))}
              </div>
            </div>

            <div className="panel bottom-panel">
              <h2>Rotation Motor Temperature</h2>
              <div className="temp-grid">
                {dashboard.motorTemperature.map((item) => (
                  <button key={item.id} type="button" className="temp-card" onClick={() => setSelectedItem(item)} style={{ textAlign: "left" }}>
                    <span>{item.label}</span>
                    <strong>{formatMetric(item.value, item.unit)} {item.unit}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="sidebar">
            <div className="panel sidebar-panel">
              <div className="health-header">
                <div className="score" style={{ "--value": health.overall }}>
                  <span>{health.overall}%</span>
                </div>
                <div className="health-copy">
                  <h2>Equipment Health</h2>
                  <p>Average of weighing system, drives, stock rod, switch gear, electrics, and instrument blocks from the legacy page logic.</p>
                </div>
              </div>
              <div className="gauge-list">
                {health.items.map((item) => (
                  <button key={item.key} type="button" className="gauge-card" onClick={(e) => handleItemSelect({ id: item.key, label: item.label, value: item.value, unit: "%", detail: item.detail }, e)} style={{ textAlign: "left" }}>
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
              <h2>Recent Alarm</h2>
              <div className="alarm-list">
                {alarms.recent.map((item) => (
                  <div className="alarm-item" key={item}>{item}</div>
                ))}
              </div>
            </div>

            <div className="panel sidebar-panel">
              <h2>Alert Summary</h2>
              <div className="pill-grid">
                <div className="pill" style={{ background: "#4ade80" }}>
                  {alarms.TOTAL}
                  <small>Total Alerts</small>
                </div>
                <div className="pill" style={{ background: "#40c4ff" }}>
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
              <h2>Open Alert Distribution</h2>
              <Bars rows={alertDistribution} max={alertMax} />
            </div>

            <div className="panel sidebar-panel">
              <h2>SAP PM MO Compliance</h2>
              <Bars rows={moCompliance} max={100} />
            </div>
          </aside>
        </section>
      </div>

      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div ref={modalRef} className="modal-card" style={{ top: `${modalY}px` }} onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>{selectedItem.label}</h3>
                <p>
                  {selectedItem.detail
                    ? "Mock compliance drill-down matching the legacy equipment health modal."
                    : selectedHasTrend
                      ? "Mock trend preview for the selected charging system metric."
                      : "Operational summary item selected from the dashboard search."}
                </p>
              </div>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>x</button>
            </div>

            {selectedItem.detail ? (
              <div className="trend-shell">
                <div className="trend-meta">
                  <div>
                    <strong>Health Score</strong>
                    <span>{selectedItem.value}%</span>
                  </div>
                  <div>
                    <strong>Alert Compliance</strong>
                    <span>{selectedItem.detail.alertComp}%</span>
                  </div>
                  <div>
                    <strong>MO Compliance</strong>
                    <span>{selectedItem.detail.moComp}%</span>
                  </div>
                  <div>
                    <strong>Notification Compliance</strong>
                    <span>{selectedItem.detail.noComp}%</span>
                  </div>
                </div>
                <div className="legend-note">Swap this with your real compliance modal payload later.</div>
              </div>
            ) : (
              <div className="trend-shell">
                <div className="trend-meta">
                  <div>
                    <strong>Current Reading</strong>
                    <span>{formatMetric(selectedItem.value, selectedItem.unit)} {selectedItem.unit}</span>
                  </div>
                  <div>
                    <strong>Source Tag</strong>
                    <span>{selectedItem.id}</span>
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
                  <TrendChart data={trendData} />
                ) : (
                  <div className="legend-note">Trend data is not available for this item yet.</div>
                )}
                <div className="legend-note">Replace `fetchChargingTrendMock` with your live trend endpoint when the backend is ready.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
