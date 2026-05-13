import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import BltDashboardToolbar from "../../Components/BltDashboardToolbar";
import bltOverviewImage from "../../assets/Images/blt.png";
import {
  fetchBLTAlarmSummaryMock,
  fetchBLTAlertDistributionMock,
  fetchBLTDashboardMock,
  fetchBLTGfcDetailsMock,
  fetchBLTMoComplianceMock,
  fetchBLTSectionHealthMock,
  fetchBLTTrendMock
} from "./newBLTHMIMockData";

function getStyles(theme) {
  return `
.blt-page {
  --text: #eef7ff;
  --muted: #98aec2;
  --line: rgba(158, 187, 214, 0.14);
  --accent: #00c2ff;
  --accent-2: #f59e0b;
  --accent-3: #4ade80;
  --alert: #fb7185;
  --info-text: #8edfff;
  --title-accent: #c8f6ff;
  --inverse-text: #08111a;
  --inverse-muted: rgba(8,17,26,0.72);
  --modal-surface: linear-gradient(180deg, #102033, #08111a);
  --chart-axis: #b8cade;
  --chart-point-stroke: #08111a;
  --control-text: #072633;
  --control-surface: #ddf7ff;
  --score-core: #08111a;
  min-height: 100vh;
  position: relative;
  padding: 24px;
  color: var(--text);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(0,194,255,0.14), transparent 24%),
    radial-gradient(circle at top right, rgba(245,158,11,0.14), transparent 22%),
    linear-gradient(180deg, #071019, #03070d 100%);
}
html[data-blt-theme="light"] .blt-page {
  --text: ${theme.palette.text.primary};
  --muted: ${theme.palette.text.secondary};
  --info-text: ${theme.palette.info.dark};
  --title-accent: ${theme.palette.primary.dark};
  --modal-surface: linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default});
  --chart-axis: ${theme.palette.text.secondary};
  --chart-point-stroke: ${theme.palette.background.paper};
  --control-text: ${theme.palette.primary.contrastText};
  --control-surface: ${theme.palette.primary.main};
  --score-core: ${theme.palette.background.paper};
}
.blt-shell {
  max-width: 1680px;
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
  max-width: 820px;
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
  min-width: 250px;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(0,194,255,0.24);
  background: linear-gradient(135deg, rgba(0,194,255,0.16), rgba(20, 28, 44, 0.7));
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
.table-panel {
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(10, 24, 38, 0.96), rgba(5, 13, 21, 0.96));
  box-shadow: 0 20px 48px rgba(0,0,0,0.26);
  margin-bottom: 16px;
}
.table-title {
  padding: 16px 18px 0;
  font-size: 16px;
  font-weight: 700;
}
.metric-table {
  width: 100%;
  border-collapse: collapse;
}
.metric-table th,
.metric-table td {
  border-bottom: 1px solid rgba(158,187,214,0.12);
  padding: 14px 12px;
  text-align: center;
}
.metric-table th {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.metric-table td:first-child,
.metric-table th:first-child {
  text-align: left;
  padding-left: 18px;
}
.metric-button {
  background: none;
  border: 0;
  color: var(--text);
  cursor: pointer;
  font: inherit;
}
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.45fr) minmax(380px, 1fr);
  gap: 18px;
}
.center-panel {
  padding: 18px;
  border-radius: 22px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(10, 24, 38, 0.96), rgba(5, 13, 21, 0.96));
  box-shadow: 0 20px 48px rgba(0,0,0,0.26);
}
.plant-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(360px, 1.2fr) minmax(220px, 1fr);
  gap: 14px;
}
.metric-column {
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
}
.sensor-card:hover {
  border-color: rgba(0,194,255,0.32);
}
.sensor-card span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}
.sensor-card strong {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.sensor-note {
  margin-top: 8px;
  font-size: 12px;
  color: var(--info-text);
}
.three-chip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}
.three-chip div {
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  padding: 10px;
  text-align: center;
  font-weight: 700;
}
.center-graphic {
  min-height: 760px;
  border-radius: 28px;
  padding: 22px;
  border: 1px solid rgba(158,187,214,0.14);
  background:
    linear-gradient(160deg, rgba(0,194,255,0.08), transparent 36%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  position: relative;
  overflow: hidden;
}
.center-graphic::before {
  content: "";
  position: absolute;
  inset: 16px;
  border-radius: 22px;
  border: 1px dashed rgba(176, 201, 223, 0.12);
}
.graphic-title {
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--title-accent);
  font-size: 12px;
}
.graphic-shell {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  display: grid;
  gap: 18px;
}
.blt-visual {
  min-height: 320px;
  display: grid;
  place-items: center;
  border-radius: 30px;
  background: rgba(3, 7, 13, 0.78);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}
.blt-overview-image {
  width: auto;
  max-width: 100%;
  max-height: 560px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.section-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.section-card {
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(158,187,214,0.12);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  cursor: pointer;
}
.section-card small {
  display: block;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
.section-card strong {
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
  border-radius: 22px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(10, 24, 38, 0.96), rgba(5, 13, 21, 0.96));
  box-shadow: 0 20px 48px rgba(0,0,0,0.26);
}
.health-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}
.score {
  width: 142px;
  height: 142px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  background: conic-gradient(var(--accent-3) calc(var(--value) * 1%), rgba(255,255,255,0.08) 0);
}
.score::before {
  content: "";
  position: absolute;
  inset: 13px;
  border-radius: 50%;
  background: var(--score-core);
}
.score-value {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
  line-height: 1;
  font-size: 32px;
  font-weight: 700;
}
.score-unit {
  font-size: 18px;
  font-weight: 600;
  color: var(--muted);
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
  background: rgba(1, 7, 13, 0.72);
  backdrop-filter: blur(14px);
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
  box-shadow: 0 40px 120px rgba(0,0,0,0.5);
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
  .section-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .plant-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 1100px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .blt-page {
    padding: 16px;
  }
  .hero {
    flex-direction: column;
  }
  .pill-grid {
    grid-template-columns: 1fr;
  }
  .bar-row {
    grid-template-columns: 1fr;
  }
  .score {
    width: 124px;
    height: 124px;
  }
  .score-value {
    font-size: 34px;
  }
  .score-unit {
    font-size: 16px;
  }
}
  `;
}

function formatMetric(value) {
  if (value == null || value === "") return "NA";
  if (typeof value === "string") return value;
  return Number(value).toFixed(1);
}

function percentWidth(value, multiplier = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0%";
  return `${Math.min(Math.max(number * multiplier, 0), 100)}%`;
}

function palette(index) {
  const colors = [
    "linear-gradient(90deg, #00c2ff, #60a5fa)",
    "linear-gradient(90deg, #f59e0b, #fbbf24)",
    "linear-gradient(90deg, #4ade80, #22c55e)",
    "linear-gradient(90deg, #fb7185, #ef4444)",
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
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" role="img" aria-label="BLT trend">
      <defs>
        <linearGradient id="bltTrendFill" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,194,255,0.34)" />
          <stop offset="100%" stopColor="rgba(0,194,255,0.02)" />
        </linearGradient>
      </defs>
      <g className="trend-grid">
        {yTicks.map((tick) => {
          const y = height - padding - ((tick - min) / range) * (height - padding * 2);
          return <line key={tick} x1={padding} y1={y} x2={width - padding} y2={y} />;
        })}
      </g>
      <path d={area} fill="url(#bltTrendFill)" />
      <path d={path} fill="none" stroke="#00c2ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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

export default function NewBLTHMI() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [dashboard, setDashboard] = useState(null);
  const [sectionHealth, setSectionHealth] = useState(null);
  const [alarms, setAlarms] = useState(null);
  const [alertDistribution, setAlertDistribution] = useState([]);
  const [moCompliance, setMoCompliance] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalY, setModalY] = useState(100);
  const [trendData, setTrendData] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gfcDetails, setGfcDetails] = useState(null);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if ((selectedItem || gfcDetails) && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedItem, gfcDetails]);

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
        fetchBLTDashboardMock(),
        fetchBLTSectionHealthMock(),
        fetchBLTAlarmSummaryMock(),
        fetchBLTAlertDistributionMock(),
        fetchBLTMoComplianceMock()
      ]);

      setDashboard(dashboardData);
      setSectionHealth(healthData);
      setAlarms(alarmData);
      setAlertDistribution(distributionData);
      setMoCompliance(moData);
      setLastRefresh(new Date());
      hasLoadedRef.current = true;
    } catch (loadError) {
      setError(loadError?.message || "Unable to load BLT HMI dashboard.");
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
      selectedItem.id === "pump-status-lower" ||
      selectedItem.id === "particle-counter" ||
      selectedItem.detail ||
      typeof selectedItem.value === "string"
    ) {
      setTrendData([]);
      setLoadingTrend(false);
      return;
    }

    let active = true;
    setLoadingTrend(true);
    fetchBLTTrendMock(selectedItem.id)
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

  const openGfcModal = useCallback(async (event) => {
    let y = 100;
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      y = rect.top + window.pageYOffset;
    } else if (event && typeof event.pageY === "number") {
      y = event.pageY;
    }
    setModalY(Math.max(20, y));
    try {
      const data = await fetchBLTGfcDetailsMock();
      setGfcDetails(data);
    } catch {
      setGfcDetails({
        lastCycle: "Unavailable",
        maxValue: "Unavailable",
        minValue: "Unavailable",
        pointsMissed: "Unavailable"
      });
    }
  }, []);

  if (loading || !dashboard || !sectionHealth || !alarms) {
    return (
      <div className="blt-page">
        <style>{styles}</style>
        <div className="blt-shell">
          <div className="sidebar-panel">
            {error ? (
              <>
                <h2>BLT dashboard unavailable</h2>
                <div className="legend-note">{error}</div>
                <button onClick={loadDashboard} style={{ marginTop: 14, border: 0, borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}>
                  Retry
                </button>
              </>
            ) : (
              "Loading BLT HMI dashboard..."
            )}
          </div>
        </div>
      </div>
    );
  }

  const alertMax = Math.max(...alertDistribution.map((item) => item.value), 1);
  const searchItems = [
    ...dashboard.operationsMetrics.map((item) => ({ ...item, group: "Operations" })),
    ...dashboard.maintenanceMetrics.map((item) => ({ ...item, group: "Maintenance" })),
    ...dashboard.plantLeft.flatMap((item) =>
      item.id === "particle-counter"
        ? [{ id: 1717, label: "Oil Tank Particle Counter", unit: "ppm", value: item.values[2], group: "BLT sensors" }]
        : [{ ...item, group: "BLT sensors" }]
    ),
    ...dashboard.plantRight.map((item) => ({ ...item, group: "BLT sensors" })),
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
    ...sectionHealth.items.map((item) => ({
      id: item.key,
      label: item.label,
      value: item.value,
      unit: "%",
      detail: item.detail,
      group: "Subsystem health"
    }))
  ];
  const selectedHasTrend =
    selectedItem &&
    !selectedItem.detail &&
    selectedItem.id !== "pump-status" &&
    selectedItem.id !== "pump-status-lower" &&
    selectedItem.id !== "particle-counter" &&
    typeof selectedItem.value !== "string";

  return (
    <div className="blt-page">
      <style>{styles}</style>
      <div className="blt-shell">
        <BltDashboardToolbar
          title="Bell Less Top System"
          breadcrumb="DAMS / BLT / Overview"
          plantArea="BLT Overview"
          alertsCount={alarms.OPEN}
          lastRefresh={lastRefresh}
          onRefresh={loadDashboard}
          searchItems={searchItems}
          onSearchSelect={handleItemSelect}
          userName="BLT Operator"
        />

        <header className="hero">
          <div>
            <h1>Bell Less Top Overview</h1>
            <p>
              Live BLT overview with operations, maintenance, subsystem health, alarms, compliance, and key operating indicators in one monitoring screen for faster shift-level decisions.
            </p>
            <div className="tag-row">
              <span className="tag">Asset: BLT</span>
              <span className="tag">Source: Mock API</span>
              <span className="tag">Refresh: 5 min</span>
            </div>
          </div>
        </header>

        <section className="table-panel">
          <div className="table-title">Operations</div>
          <table className="metric-table">
            <thead>
              <tr>
                <th>Operation</th>
                {dashboard.operationsMetrics.map((item) => (
                  <th key={item.id}>{item.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Parameter</td>
                {dashboard.operationsMetrics.map((item) => (
                  <td key={item.id}>
                    <button className="metric-button" onClick={(e) => handleItemSelect(item, e)}>
                      {formatMetric(item.value, item.unit)} {item.unit}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        <section className="table-panel">
          <div className="table-title">Maintenance</div>
          <table className="metric-table">
            <thead>
              <tr>
                <th>Maintenance</th>
                {dashboard.maintenanceMetrics.map((item) => (
                  <th key={item.id}>{item.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Parameter</td>
                {dashboard.maintenanceMetrics.map((item) => (
                  <td key={item.id}>
                    <button className="metric-button" onClick={(e) => handleItemSelect(item, e)}>
                      {typeof item.value === "string"
                        ? item.value
                        : `${formatMetric(item.value, item.unit)} ${item.unit}`}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        <section className="main-grid">
          <div className="center-panel">
            <div className="plant-grid">
              <div className="metric-column">
                {dashboard.plantLeft.map((item) => (
                  item.id === "particle-counter" ? (
                    <button key={item.id} type="button" className="sensor-card" onClick={(e) => handleItemSelect({ id: 1717, label: "Oil Tank Particle Counter", unit: "ppm", value: item.values[2] }, e)} style={{ textAlign: "left" }}>
                      <span>{item.label}</span>
                      <div className="three-chip">
                        {item.values.map((value, index) => (
                          <div key={index}>{formatMetric(value, item.unit)}</div>
                        ))}
                      </div>
                      <div className="sensor-note">Three counter channels from the legacy panel</div>
                    </button>
                  ) : (
                    <button key={item.id} type="button" className="sensor-card" onClick={(e) => handleItemSelect(item, e)} style={{ textAlign: "left" }}>
                      <span>{item.label}</span>
                      <strong>{formatMetric(item.value, item.unit)} {item.unit}</strong>
                      <div className="sensor-note">Live BLT maintenance indicator</div>
                    </button>
                  )
                ))}
              </div>

              <div className="center-graphic">
                <div className="graphic-title">BLT overview</div>
                <div className="graphic-shell">
                  <div className="blt-visual">
                    <img className="blt-overview-image" src={bltOverviewImage} alt="Bell Less Top equipment overview" />
                  </div>

                  <div className="section-grid">
                    {sectionHealth.items.map((item) => (
                      <button key={item.key} type="button" className="section-card" onClick={(e) => handleItemSelect({ id: item.key, label: item.label, value: item.value, unit: "%", detail: item.detail }, e)} style={{ textAlign: "left" }}>
                        <small>{item.label}</small>
                        <strong>{item.value}%</strong>
                        <div className="track">
                          <div style={{ width: percentWidth(item.value) }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="metric-column">
                {dashboard.plantRight.map((item) => (
                  <button key={item.id} type="button" className="sensor-card" onClick={item.id === 1649 ? (e) => openGfcModal(e) : (e) => handleItemSelect(item, e)} style={{ textAlign: "left" }}>
                    <span>{item.label}</span>
                    <strong>
                      {typeof item.value === "string"
                        ? item.value
                        : `${formatMetric(item.value, item.unit)} ${item.unit}`}
                    </strong>
                    <div className="sensor-note">
                      {item.id === 1649 ? "Click to open greasing-cycle detail modal" : "Live BLT operating indicator"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="sidebar">
            <div className="sidebar-panel">
              <div className="health-header">
                <div className="score" style={{ "--value": sectionHealth.overall }}>
                  <div className="score-value">
                    {sectionHealth.overall}
                    <span className="score-unit">%</span>
                  </div>
                </div>
                <div className="health-copy">
                  <h2>Equipment Health</h2>
                  <p>Aggregated BLT section health across charging, valve, cooling, and hydraulic subsystems from the legacy HMI logic.</p>
                </div>
              </div>
              <div className="gauge-list">
                {sectionHealth.items.map((item) => (
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

            <div className="sidebar-panel">
              <h2>Recent Alarm</h2>
              <div className="alarm-list">
                {alarms.recent.map((item) => (
                  <div className="alarm-item" key={item}>{item}</div>
                ))}
              </div>
            </div>

            <div className="sidebar-panel">
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

            <div className="sidebar-panel">
              <h2>Open Alert Distribution</h2>
              <Bars rows={alertDistribution} max={alertMax} />
            </div>

            <div className="sidebar-panel">
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
                      ? "Mock trend preview for the selected BLT metric."
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
                <div className="legend-note">Replace this with your actual compliance detail API later.</div>
              </div>
            ) : (
              <div className="trend-shell">
                <div className="trend-meta">
                  <div>
                    <strong>Current Reading</strong>
                    <span>
                      {typeof selectedItem.value === "string"
                        ? selectedItem.value
                        : `${formatMetric(selectedItem.value, selectedItem.unit)} ${selectedItem.unit}`}
                    </span>
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
                <div className="legend-note">Replace `fetchBLTTrendMock` with your live trend endpoint when the backend is ready.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {gfcDetails && (
        <div className="modal-backdrop" onClick={() => setGfcDetails(null)}>
          <div ref={modalRef} className="modal-card" style={{ top: `${modalY}px` }} onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>Greased Points Status</h3>
                <p>Mock detail payload for the legacy greasing fast-cycle modal.</p>
              </div>
              <button className="modal-close" onClick={() => setGfcDetails(null)}>x</button>
            </div>
            <div className="trend-shell">
              <div className="trend-meta">
                <div>
                  <strong>Last Cycle</strong>
                  <span>{gfcDetails.lastCycle}</span>
                </div>
                <div>
                  <strong>24 Hrs. Max</strong>
                  <span>{gfcDetails.maxValue}</span>
                </div>
                <div>
                  <strong>24 Hrs. Min</strong>
                  <span>{gfcDetails.minValue}</span>
                </div>
                <div>
                  <strong>No. of Cycle</strong>
                  <span>{gfcDetails.pointsMissed}</span>
                </div>
              </div>
              <div className="legend-note">Replace `fetchBLTGfcDetailsMock` with your actual GFC API later.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
