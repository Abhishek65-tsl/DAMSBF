import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import BltDashboardToolbar from "../../Components/BltDashboardToolbar";
import valveSystemImage from "../../assets/Images/valveSystem.png";
import {
  fetchValveAlarmSummaryMock,
  fetchValveAlertDistributionMock,
  fetchValveDashboardMock,
  fetchValveHealthMock,
  fetchValveMoComplianceMock,
  fetchValveTrendMock
} from "./valveSystemMockData";

function getStyles(theme) {
  return `
.valve-page {
  --text: #eef4ff;
  --muted: #9cb0c5;
  --line: rgba(170, 186, 214, 0.14);
  --accent: #ff6b6b;
  --accent-2: #f59e0b;
  --accent-3: #4ade80;
  --alert: #fb7185;
  --title-accent: #ffd9d9;
  --inverse-text: #08111a;
  --inverse-muted: rgba(8,17,26,0.72);
  --modal-surface: linear-gradient(180deg, #102033, #08111a);
  --chart-axis: #b8cade;
  --chart-point-stroke: #08111a;
  --control-text: #281313;
  --control-surface: #fff0f0;
  --score-core: #08111a;
  --ok-text: #8be59a;
  --warn-text: #ffb0b0;
  min-height: 100vh;
  position: relative;
  padding: 24px;
  color: var(--text);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(255,107,107,0.14), transparent 24%),
    radial-gradient(circle at top right, rgba(245,158,11,0.14), transparent 22%),
    linear-gradient(180deg, #071019, #03070d 100%);
}
html[data-blt-theme="light"] .valve-page {
  --text: ${theme.palette.text.primary};
  --muted: ${theme.palette.text.secondary};
  --title-accent: ${theme.palette.error.dark};
  --modal-surface: linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default});
  --chart-axis: ${theme.palette.text.secondary};
  --chart-point-stroke: ${theme.palette.background.paper};
  --control-text: ${theme.palette.error.contrastText};
  --control-surface: ${theme.palette.error.main};
  --score-core: ${theme.palette.background.paper};
  --ok-text: ${theme.palette.success.dark};
  --warn-text: ${theme.palette.error.dark};
}
.valve-shell {
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
  border: 1px solid rgba(255,107,107,0.24);
  background: linear-gradient(135deg, rgba(255,107,107,0.16), rgba(20, 28, 44, 0.7));
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
.valve-overview-panel {
  margin-bottom: 18px;
  padding: 22px;
}
.valve-overview-title {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--title-accent);
  font-size: 12px;
}
.valve-overview-layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(180px, 0.8fr) minmax(320px, 1.35fr) minmax(180px, 0.8fr);
  gap: 16px;
  align-items: center;
}
.valve-overview-column {
  display: grid;
  gap: 16px;
}
.valve-overview-visual {
  min-height: 320px;
  display: grid;
  place-items: center;
  border-radius: 30px;
  background: rgba(3, 7, 13, 0.78);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}
.valve-system-image {
  width: auto;
  max-width: 100%;
  max-height: 560px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.overview-valve-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(170,186,214,0.14);
  background: rgba(255,255,255,0.04);
}
.overview-valve-title {
  padding: 8px 12px;
  text-align: center;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--inverse-text);
  background: #5b9be7;
}
.overview-valve-values {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 10px;
  background: rgba(255,255,255,0.08);
}
.overview-valve-values button {
  border: 0;
  border-radius: 4px;
  padding: 10px 6px;
  cursor: pointer;
  color: var(--inverse-text);
  background: rgba(255,255,255,0.86);
  font-weight: 800;
  font-size: 16px;
}
.matrix-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 16px;
}
.matrix-head h2 {
  margin: 0;
  font-size: 18px;
}
.matrix-head p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}
.legend {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
}
.legend i {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.valve-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.valve-card {
  border-radius: 20px;
  border: 1px solid rgba(170,186,214,0.12);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  padding: 16px;
}
.valve-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}
.valve-title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.valve-title strong {
  font-size: 17px;
}
.valve-title small {
  color: var(--muted);
  font-size: 12px;
}
.status-pill {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.status-ok {
  color: var(--ok-text);
  background: rgba(74,222,128,0.16);
}
.status-watch {
  color: var(--warn-text);
  background: rgba(251,113,133,0.16);
}
.response-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.response-box {
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(170,186,214,0.12);
  background: rgba(255,255,255,0.03);
  cursor: pointer;
}
.response-box span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}
.response-box strong {
  display: block;
  margin-top: 8px;
  font-size: 26px;
}
.response-track {
  margin-top: 10px;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
}
.response-track > div {
  height: 100%;
  border-radius: inherit;
}
.flow-summary {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.flow-card {
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(170,186,214,0.12);
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
  background: conic-gradient(var(--accent-3) calc(var(--value) * 1%), rgba(255,255,255,0.08) 0);
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
.health-copy h2,
.sidebar-panel h2 {
  margin: 0 0 16px;
  font-size: 16px;
  letter-spacing: 0.02em;
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
  border: 1px solid rgba(170,186,214,0.12);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  padding: 14px;
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
  width: min(900px, 100%);
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(170,186,214,0.22);
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
  border: 1px solid rgba(170,186,214,0.14);
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
  stroke: rgba(170,186,214,0.12);
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
  .valve-overview-layout {
    grid-template-columns: 1fr;
  }
  .valve-grid,
  .flow-summary {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 1100px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .valve-page {
    padding: 16px;
  }
  .hero {
    flex-direction: column;
  }
  .metric-grid,
  .response-grid,
  .pill-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

function palette(index) {
  const colors = [
    "linear-gradient(90deg, #ff6b6b, #fb7185)",
    "linear-gradient(90deg, #f59e0b, #fbbf24)",
    "linear-gradient(90deg, #4ade80, #22c55e)",
    "linear-gradient(90deg, #60a5fa, #3b82f6)",
    "linear-gradient(90deg, #a78bfa, #8b5cf6)"
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
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" role="img" aria-label="Valve trend">
      <defs>
        <linearGradient id="valveTrendFill" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,107,107,0.34)" />
          <stop offset="100%" stopColor="rgba(255,107,107,0.02)" />
        </linearGradient>
      </defs>
      <g className="trend-grid">
        {yTicks.map((tick) => {
          const y = height - padding - ((tick - min) / range) * (height - padding * 2);
          return <line key={tick} x1={padding} y1={y} x2={width - padding} y2={y} />;
        })}
      </g>
      <path d={area} fill="url(#valveTrendFill)" />
      <path d={path} fill="none" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point) => (
        <circle key={point.label} cx={point.x} cy={point.y} r="5" fill="#f59e0b" stroke="var(--chart-point-stroke)" strokeWidth="3" />
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

export default function ValveSystem() {
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
        fetchValveDashboardMock(),
        fetchValveHealthMock(),
        fetchValveAlarmSummaryMock(),
        fetchValveAlertDistributionMock(),
        fetchValveMoComplianceMock()
      ]);

      setDashboard(dashboardData);
      setHealth(healthData);
      setAlarms(alarmData);
      setAlertDistribution(distributionData);
      setMoCompliance(moData);
      setLastRefresh(new Date());
      hasLoadedRef.current = true;
    } catch (loadError) {
      setError(loadError?.message || "Unable to load valve system dashboard.");
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
    fetchValveTrendMock(selectedItem.id)
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
      <div className="valve-page">
        <style>{styles}</style>
        <div className="valve-shell">
          <div className="panel sidebar-panel">
            {error ? (
              <>
                <h2>Valve dashboard unavailable</h2>
                <div className="legend-note">{error}</div>
                <button onClick={loadDashboard} style={{ marginTop: 14, border: 0, borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}>
                  Retry
                </button>
              </>
            ) : (
              "Loading valve system dashboard..."
            )}
          </div>
        </div>
      </div>
    );
  }

  const alertMax = Math.max(...alertDistribution.map((item) => item.value), 1);
  const searchItems = [
    ...dashboard.headerMetrics.map((item) => ({ ...item, group: "Header KPIs" })),
    ...dashboard.valveCards.flatMap((item) => [
      {
        id: item.openTag,
        label: `${item.label} Open Response`,
        value: item.open,
        unit: "sec",
        group: "Valve response"
      },
      {
        id: item.closeTag,
        label: `${item.label} Close Response`,
        value: item.close,
        unit: "sec",
        group: "Valve response"
      }
    ]),
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
  const leftValveCards = dashboard.valveCards.filter((item) => item.label.endsWith("-1"));
  const rightValveCards = dashboard.valveCards.filter((item) => item.label.endsWith("-2"));

  return (
    <div className="valve-page">
      <style>{styles}</style>
      <div className="valve-shell">
        <BltDashboardToolbar
          title="Valve System"
          breadcrumb="DAMS / BLT / Valve"
          plantArea="BLT Valve"
          alertsCount={alarms.OPEN}
          lastRefresh={lastRefresh}
          onRefresh={loadDashboard}
          searchItems={searchItems}
          onSearchSelect={handleItemSelect}
          userName="BLT Operator"
        />

        <header className="hero">
          <div>
            <h1>Valve Response Overview</h1>
            <p>
              This version keeps the original top KPIs, per-valve open and close response timings, equipment health, alarms, and maintenance compliance in a more modern operations dashboard.
            </p>
            <div className="tag-row">
              <span className="tag">Asset: BLT Valve</span>
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
          <div>
            <div className="panel valve-overview-panel">
              <div className="valve-overview-title">Valve system overview</div>
              <div className="valve-overview-layout">
                <div className="valve-overview-column">
                  {leftValveCards.map((item) => (
                    <div className="overview-valve-card" key={item.key}>
                      <div className="overview-valve-title">{item.label}</div>
                      <div className="overview-valve-values">
                        <button type="button" onClick={() => setSelectedItem({ id: item.openTag, label: `${item.label} Open Response`, unit: "sec", value: item.open })}>
                          {formatMetric(item.open, "sec")} sec
                        </button>
                        <button type="button" onClick={() => setSelectedItem({ id: item.closeTag, label: `${item.label} Close Response`, unit: "sec", value: item.close })}>
                          {formatMetric(item.close, "sec")} sec
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="valve-overview-visual">
                  <img className="valve-system-image" src={valveSystemImage} alt="Valve system overview" />
                </div>

                <div className="valve-overview-column">
                  {rightValveCards.map((item) => (
                    <div className="overview-valve-card" key={item.key}>
                      <div className="overview-valve-title">{item.label}</div>
                      <div className="overview-valve-values">
                        <button type="button" onClick={() => setSelectedItem({ id: item.openTag, label: `${item.label} Open Response`, unit: "sec", value: item.open })}>
                          {formatMetric(item.open, "sec")} sec
                        </button>
                        <button type="button" onClick={() => setSelectedItem({ id: item.closeTag, label: `${item.label} Close Response`, unit: "sec", value: item.close })}>
                          {formatMetric(item.close, "sec")} sec
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <p>Average of the legacy valve health groups: USV, LSV, relief valves, emergency relief, PEV, SEV, and instrument systems.</p>
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
                <div className="pill" style={{ background: "#60a5fa" }}>
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
                    ? "Mock compliance drill-down matching the legacy equipment-health modal."
                    : selectedHasTrend
                      ? "Mock trend preview for the selected valve-system metric."
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
                <div className="legend-note">Replace this with your actual compliance-detail API later.</div>
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
                <div className="legend-note">Replace `fetchValveTrendMock` with your live trend endpoint when the backend is ready.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
