import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import BltDashboardToolbar from "../../Components/BltDashboardToolbar";
import hydraulicSystemImage from "../../assets/Images/HydraulicSystem.png";
import {
  fetchHydraulicAlarmSummaryMock,
  fetchHydraulicDashboardMock,
  fetchHydraulicEquipmentAlertsMock,
  fetchHydraulicHealthMock,
  fetchHydraulicMoComplianceMock,
  fetchHydraulicTrendMock
} from "./hydraulicViewMockData";

function getStyles(theme) {
  return `
.hydraulic-page {
  --text: #eef7ff;
  --muted: #98aec2;
  --line: rgba(158, 187, 214, 0.14);
  --accent: #26c6da;
  --accent-2: #66bb6a;
  --alert: #fb7185;
  --title-accent: #d3f7fb;
  --info-text: #7fe1ec;
  --inverse-text: #08111a;
  --inverse-muted: rgba(8,17,26,0.72);
  --modal-surface: linear-gradient(180deg, #102033, #08111a);
  --chart-axis: #b8cade;
  --chart-point-stroke: #08111a;
  --control-text: #08202a;
  --control-surface: #dcf8fb;
  --score-core: #08111a;
  --ok-text: #8fe39a;
  --warn-text: #ff9eb0;
  min-height: 100vh;
  position: relative;
  padding: 24px;
  color: var(--text);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(38,198,218,0.14), transparent 24%),
    radial-gradient(circle at top right, rgba(102,187,106,0.14), transparent 22%),
    linear-gradient(180deg, #071019, #03070d 100%);
}
html[data-blt-theme="light"] .hydraulic-page {
  --text: ${theme.palette.text.primary};
  --muted: ${theme.palette.text.secondary};
  --title-accent: ${theme.palette.info.dark};
  --info-text: ${theme.palette.info.dark};
  --modal-surface: linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default});
  --chart-axis: ${theme.palette.text.secondary};
  --chart-point-stroke: ${theme.palette.background.paper};
  --control-text: ${theme.palette.info.contrastText};
  --control-surface: ${theme.palette.info.main};
  --score-core: ${theme.palette.background.paper};
  --ok-text: ${theme.palette.success.dark};
  --warn-text: ${theme.palette.error.dark};
}
.hydraulic-shell {
  max-width: 1660px;
  margin: 0 auto;
}
.hero {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
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
  max-width: 780px;
  color: var(--muted);
  line-height: 1.55;
}
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
}
.tag {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
  padding: 8px 14px;
  font-size: 13px;
}
.sync-card {
  min-width: 240px;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(38,198,218,0.22);
  background: linear-gradient(135deg, rgba(38,198,218,0.18), rgba(11, 28, 44, 0.68));
}
.sync-card small {
  color: var(--title-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.sync-card strong {
  display: block;
  margin-top: 8px;
  font-size: 26px;
}
.sync-card button {
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
  background: linear-gradient(180deg, rgba(10, 24, 38, 0.96), rgba(5, 13, 21, 0.96));
  box-shadow: 0 20px 48px rgba(0,0,0,0.26);
}
.metric-card {
  padding: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
.ops-panel {
  padding: 18px;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(380px, 1.25fr) minmax(220px, 1fr);
  gap: 14px;
}
.column {
  display: grid;
  gap: 12px;
}
.sensor-card {
  border-radius: 18px;
  border: 1px solid rgba(158,187,214,0.12);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  padding: 14px;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.sensor-card:hover {
  transform: translateY(-2px);
  border-color: rgba(38,198,218,0.34);
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
  color: var(--info-text);
  font-size: 12px;
}
.schematic {
  min-height: 760px;
  border-radius: 28px;
  padding: 22px;
  border: 1px solid rgba(158,187,214,0.14);
  background:
    linear-gradient(160deg, rgba(38,198,218,0.08), transparent 36%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  position: relative;
  overflow: hidden;
}
.schematic::before {
  content: "";
  position: absolute;
  inset: 16px;
  border-radius: 22px;
  border: 1px dashed rgba(176, 201, 223, 0.12);
}
.schematic-title {
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--title-accent);
  font-size: 12px;
}
.hydraulic-core {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  display: grid;
  gap: 18px;
}
.tank {
  min-height: 270px;
  display: grid;
  place-items: center;
  border-radius: 30px;
  background: rgba(3, 7, 13, 0.78);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}
.hydraulic-system-image {
  width: 100%;
  max-height: 440px;
  object-fit: contain;
  display: block;
}
.flow-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.flow-card {
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(158,187,214,0.12);
  background: rgba(255,255,255,0.03);
}
.flow-card small {
  display: block;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
.flow-card strong {
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
.detail-grid {
  display: grid;
  gap: 18px;
}
.detail-panel {
  padding: 18px;
}
.detail-panel h2,
.sidebar-panel h2 {
  margin: 0 0 16px;
  font-size: 16px;
  letter-spacing: 0.02em;
}
.diagnostic-table {
  width: 100%;
  border-collapse: collapse;
}
.diagnostic-table th,
.diagnostic-table td {
  padding: 12px 10px;
  border-bottom: 1px solid rgba(158,187,214,0.12);
  text-align: left;
  font-size: 13px;
}
.diagnostic-table th {
  color: var(--muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
.diag-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.diag-ok {
  background: rgba(102,187,106,0.18);
  color: var(--ok-text);
}
.diag-warn {
  background: rgba(251,113,133,0.16);
  color: var(--warn-text);
}
.mini-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.mini-card {
  border-radius: 18px;
  border: 1px solid rgba(158,187,214,0.12);
  background: rgba(255,255,255,0.03);
  padding: 14px;
  cursor: pointer;
}
.mini-card span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}
.mini-card strong {
  display: block;
  margin-top: 10px;
  font-size: 26px;
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
  background: conic-gradient(var(--accent-2) calc(var(--value) * 1%), rgba(255,255,255,0.08) 0);
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
  border: 1px solid rgba(158,187,214,0.14);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  padding: 16px;
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
  background: linear-gradient(90deg, #fb7185, #facc15, #4ade80);
}
.alarm-list {
  display: grid;
  gap: 12px;
}
.alarm-item {
  border-left: 4px solid var(--alert);
  border-radius: 12px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.04);
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
  width: min(920px, 100%);
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(158,187,214,0.22);
  background: var(--modal-surface);
  color: var(--text);
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
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
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text);
  background: rgba(255,255,255,0.08);
}
.trend-shell {
  border-radius: 20px;
  border: 1px solid rgba(158,187,214,0.14);
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
  stroke: rgba(158,187,214,0.12);
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
  .ops-panel {
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
  .hydraulic-page {
    padding: 16px;
  }
  .hero {
    flex-direction: column;
  }
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .mini-grid,
  .pill-grid {
    grid-template-columns: 1fr;
  }
  .bar-row {
    grid-template-columns: 1fr;
  }
}
  `;
}

function formatMetric(value) {
  if (value == null || value === "") return "NA";
  if (typeof value === "string") return value;
  return Number(value).toFixed(1);
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
  if (unit === "bar" && number > 220) return "High pressure";
  if (unit === "A" && number > 41) return "Load rising";
  if (unit === "deg C" && number > 60) return "Thermal watch";
  return "Within band";
}

function palette(index) {
  const colors = [
    "linear-gradient(90deg, #26c6da, #4dd0e1)",
    "linear-gradient(90deg, #66bb6a, #43a047)",
    "linear-gradient(90deg, #fbbf24, #f59e0b)",
    "linear-gradient(90deg, #fb7185, #ef4444)",
    "linear-gradient(90deg, #818cf8, #6366f1)"
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
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" role="img" aria-label="Hydraulic trend">
      <defs>
        <linearGradient id="hydraulicTrendFill" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(38,198,218,0.34)" />
          <stop offset="100%" stopColor="rgba(38,198,218,0.02)" />
        </linearGradient>
      </defs>
      <g className="trend-grid">
        {yTicks.map((tick) => {
          const y = height - padding - ((tick - min) / range) * (height - padding * 2);
          return <line key={tick} x1={padding} y1={y} x2={width - padding} y2={y} />;
        })}
      </g>
      <path d={area} fill="url(#hydraulicTrendFill)" />
      <path d={path} fill="none" stroke="#26c6da" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point) => (
        <circle key={point.label} cx={point.x} cy={point.y} r="5" fill="#66bb6a" stroke="var(--chart-point-stroke)" strokeWidth="3" />
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

export default function HydraulicView() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [dashboard, setDashboard] = useState(null);
  const [health, setHealth] = useState(null);
  const [alarms, setAlarms] = useState(null);
  const [equipmentAlerts, setEquipmentAlerts] = useState([]);
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
      const [dashboardData, healthData, alarmData, equipmentData, moData] = await Promise.all([
        fetchHydraulicDashboardMock(),
        fetchHydraulicHealthMock(),
        fetchHydraulicAlarmSummaryMock(),
        fetchHydraulicEquipmentAlertsMock(),
        fetchHydraulicMoComplianceMock()
      ]);

      setDashboard(dashboardData);
      setHealth(healthData);
      setAlarms(alarmData);
      setEquipmentAlerts(equipmentData);
      setMoCompliance(moData);
      setLastRefresh(new Date());
      hasLoadedRef.current = true;
    } catch (loadError) {
      setError(loadError?.message || "Unable to load hydraulic system dashboard.");
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
    fetchHydraulicTrendMock(selectedItem.id)
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
      <div className="hydraulic-page">
        <style>{styles}</style>
        <div className="hydraulic-shell">
          <div className="panel detail-panel">
            {error ? (
              <>
                <h2>Hydraulic dashboard unavailable</h2>
                <div className="legend-note">{error}</div>
                <button onClick={loadDashboard} style={{ marginTop: 14, border: 0, borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}>
                  Retry
                </button>
              </>
            ) : (
              "Loading hydraulic system dashboard..."
            )}
          </div>
        </div>
      </div>
    );
  }

  const alertMax = Math.max(...equipmentAlerts.map((item) => item.value), 1);
  const hydraulicPressure = findById(dashboard.headerMetrics, 2426);
  const pumpStatus = findById(dashboard.headerMetrics, "pump-status");
  const oilTemperature = findById(dashboard.operationalRight, 1046);
  const pump1RunHours = findById(dashboard.operationalLeft, 2427);
  const searchItems = [
    ...dashboard.headerMetrics.map((item) => ({ ...item, group: "Header KPIs" })),
    ...dashboard.operationalLeft.map((item) => ({ ...item, group: "Hydraulic sensors" })),
    { ...dashboard.pump2Discharge, group: "Hydraulic sensors" },
    ...dashboard.operationalRight.map((item) => ({ ...item, group: "Hydraulic sensors" })),
    { ...dashboard.oilTankLevel, group: "Hydraulic sensors" },
    ...dashboard.rockerTimes.map((item) => ({ ...item, group: "Cycle timing" })),
    ...dashboard.diagnostics.map((item) => ({ ...item, group: "Line diagnostics" })),
    ...dashboard.additionalSensors.map((item) => ({ ...item, group: "Additional sensors" })),
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
    selectedItem &&
    !selectedItem.detail &&
    selectedItem.id !== "pump-status" &&
    typeof selectedItem.value !== "string";

  return (
    <div className="hydraulic-page">
      <style>{styles}</style>
      <div className="hydraulic-shell">
        <BltDashboardToolbar
          title="Hydraulic System"
          breadcrumb="DAMS / BLT / Hydraulic"
          plantArea="BLT Hydraulic"
          alertsCount={alarms.OPEN}
          lastRefresh={lastRefresh}
          onRefresh={loadDashboard}
          searchItems={searchItems}
          onSearchSelect={handleItemSelect}
          userName="BLT Operator"
        />

        <header className="hero">
          <div>
            <h1>Hydraulic Operations Overview</h1>
            <p>
              This version keeps the original top KPIs, pump and oil condition indicators, hydraulic line diagnostics, equipment health, alarms, and maintenance compliance while presenting them in a modern operational dashboard.
            </p>
            <div className="tag-row">
              <span className="tag">Asset: BLT Hydraulic</span>
              {/* <span className="tag">Source: Mock API</span> */}
              <span className="tag">Refresh: 5 min</span>
            </div>
          </div>
        </header>

        <section className="metric-grid">
          {dashboard.headerMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} onSelect={setSelectedItem} />
          ))}
        </section>

        <section className="main-grid">
          <div className="detail-grid">
            <div className="panel ops-panel">
              <div className="column">
                {dashboard.operationalLeft.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} onSelect={setSelectedItem} />
                ))}
                <SensorCard sensor={dashboard.pump2Discharge} onSelect={setSelectedItem} />
              </div>

              <div className="schematic">
                <div className="schematic-title">Hydraulic process overview</div>
                <div className="hydraulic-core">
                  <div className="tank">
                    <img className="hydraulic-system-image" src={hydraulicSystemImage} alt="Hydraulic system overview" />
                  </div>

                  <div className="flow-grid">
                    <div className="flow-card">
                      <small>Hyd Pressure</small>
                      <strong>{formatMetric(hydraulicPressure?.value, "bar")} bar</strong>
                      <div className="track">
                        <div style={{ width: percentWidth(hydraulicPressure?.value, 1 / 2.2) }} />
                      </div>
                    </div>
                    <div className="flow-card">
                      <small>Oil Temperature</small>
                      <strong>{formatMetric(oilTemperature?.value, "deg C")} deg C</strong>
                      <div className="track">
                        <div style={{ width: percentWidth(oilTemperature?.value, 1.8) }} />
                      </div>
                    </div>
                    <div className="flow-card">
                      <small>Pump-1 Run Hrs</small>
                      <strong>{formatMetric(pump1RunHours?.value, "hrs")} hrs</strong>
                      <div className="track">
                        <div style={{ width: percentWidth(pump1RunHours?.value, 4.5) }} />
                      </div>
                    </div>
                    <div className="flow-card">
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
                {dashboard.operationalRight.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} onSelect={setSelectedItem} />
                ))}
                <SensorCard sensor={dashboard.oilTankLevel} onSelect={setSelectedItem} />
              </div>
            </div>

            <div className="panel detail-panel">
              <h2>Hydraulic Line Diagnostics</h2>
              <table className="diagnostic-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.diagnostics.map((item) => {
                    const warning = Number(item.value) > 220;
                    return (
                      <tr key={item.id}>
                        <td>
                          <button type="button" onClick={() => setSelectedItem(item)} style={{ background: "none", border: 0, color: "var(--text)", padding: 0, cursor: "pointer", textAlign: "left" }}>
                            {item.label}
                          </button>
                        </td>
                        <td>{formatMetric(item.value, item.unit)} {item.unit}</td>
                        <td>
                          <span className={`diag-pill ${warning ? "diag-warn" : "diag-ok"}`}>
                            {warning ? "Watch" : "Normal"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="panel detail-panel">
              <h2>Secondary Sensors</h2>
              <div className="mini-grid">
                {dashboard.additionalSensors.map((item) => (
                  <button key={item.id} type="button" className="mini-card" onClick={() => setSelectedItem(item)} style={{ textAlign: "left" }}>
                    <span>{item.label}</span>
                    <strong>{formatMetric(item.value, item.unit)} {item.unit}</strong>
                    {item.previousAverage != null ? (
                      <div className="metric-unit">Prev avg: {formatMetric(item.previousAverage, item.unit)} {item.unit}</div>
                    ) : null}
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
                  <p>Average of the legacy hydraulic health groups: USV, LSV, and instrument/electrical condition blocks.</p>
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
                <div className="pill" style={{ background: "#66bb6a" }}>
                  {alarms.TOTAL}
                  <small>Total Alerts</small>
                </div>
                <div className="pill" style={{ background: "#26c6da" }}>
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
              <h2>Equipment Alert Distribution</h2>
              <Bars rows={equipmentAlerts} max={alertMax} />
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
                    ? "Mock compliance drill-down matching the legacy equipment-health modal."
                    : selectedHasTrend
                      ? "Mock trend preview for the selected hydraulic metric."
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
                <div className="legend-note">Replace this with your real compliance detail payload later.</div>
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
                <div className="legend-note">Replace `fetchHydraulicTrendMock` with your live trend API when ready.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
