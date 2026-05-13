import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactECharts from "echarts-for-react";
import {
  getNewMouldAlarmCount,
  getNewMouldAlarmText,
  getNewMouldComplianceDetail,
  getNewMouldFaceHealth,
  getNewMouldLiveData,
  getNewMouldOpenAlerts,
  getNewMouldSapMoCompliance,
  getNewMouldSubsystemHealth,
  getNewMouldTrendData,
} from "../Services/newMouldPage.mock";
import DamsCasterThemeSwitch from "../Components/DamsCasterThemeSwitch";
import useDamsCasterTheme from "../Components/useDamsCasterTheme";
import AnimatedNumber from "../Components/AnimatedNumber";
import casterProcessOverviewImage from "../assets/Images/caster-process-overview.png";

const REFRESH_INTERVAL = 10000;
const HISTORY_LIMIT = 12;

const topMetrics = [
  { label: "Ladle 1", key: "ladle1", suffix: " T" },
  { label: "Ladle 2", key: "ladle2", suffix: " T" },
  { label: "Tundish 1", key: "tundish1", suffix: " T" },
  { label: "Tundish 2", key: "tundish2", suffix: " T" },
  { label: "Casting Speed S1", key: "castingSpeed1", suffix: " m/min" },
  { label: "Casting Speed S2", key: "castingSpeed2", suffix: " m/min" },
  { label: "Mould Level S1", key: "mouldLevel1", suffix: " %" },
  { label: "Mould Level S2", key: "mouldLevel2", suffix: " %" },
];

const sideMetrics = [
  { label: "Refilling Value", key: "refillingValue", suffix: " T" },
  { label: "Refilling Time", key: "refillingTime", suffix: " min" },
  { label: "Backlash", key: "backlash", suffix: " deg" },
  { label: "TCM S1", key: "tcm1", suffix: " min" },
  { label: "TCM S2", key: "tcm2", suffix: " min" },
  { label: "Deburrer S1", key: "deburrer1", suffix: " s" },
  { label: "Deburrer S2", key: "deburrer2", suffix: " s" },
  { label: "LD Flow S1", key: "ldFlow1", suffix: " m3/h" },
  { label: "LD Flow S2", key: "ldFlow2", suffix: " m3/h" },
];

const mouldHealthCards = [
  { label: "AMLC S1", key: "amlc1" },
  { label: "AMLC S2", key: "amlc2" },
  { label: "HMO S1", key: "hmo1" },
  { label: "HMO S2", key: "hmo2" },
  { label: "Heat Flux S1", key: "hf1" },
  { label: "Heat Flux S2", key: "hf2" },
  { label: "RAM S1", key: "ram1" },
  { label: "RAM S2", key: "ram2" },
  { label: "Control Valve", key: "cvHealth" },
  { label: "Shutoff Valve", key: "svHealth" },
];

const trendTitles = {
  ladle1: "Ladle 1 Weight",
  ladle2: "Ladle 2 Weight",
  tundish1: "Tundish 1 Weight",
  tundish2: "Tundish 2 Weight",
  castingSpeed1: "Casting Speed Strand 1",
  castingSpeed2: "Casting Speed Strand 2",
  mouldLevel1: "Mould Level Strand 1",
  mouldLevel2: "Mould Level Strand 2",
  refillingValue: "Refilling Value",
  refillingTime: "Refilling Time",
  backlash: "Backlash",
  tcm1: "TCM Strand 1",
  tcm2: "TCM Strand 2",
  deburrer1: "Deburrer Strand 1",
  deburrer2: "Deburrer Strand 2",
  ldFlow1: "LD Flow Strand 1",
  ldFlow2: "LD Flow Strand 2",
};

const initialLive = {
  ladle1: 0,
  ladle2: 0,
  tundish1: 0,
  tundish2: 0,
  castingSpeed1: 0,
  castingSpeed2: 0,
  mouldLevel1: 0,
  mouldLevel2: 0,
  refillingValue: 0,
  refillingTime: 0,
  backlash: 0,
  tcm1: 0,
  tcm2: 0,
  deburrer1: 0,
  deburrer2: 0,
  ldFlow1: 0,
  ldFlow2: 0,
  amlc1: 0,
  amlc2: 0,
  hmo1: 0,
  hmo2: 0,
  hf1: 0,
  hf2: 0,
  ram1: 0,
  ram2: 0,
  cvHealth: 0,
  svHealth: 0,
};

const initialLiveHistory = {
  timestamps: [],
  process: [],
  faces: {},
  selectedFace: [],
};

const healthTone = (value) => {
  if (value >= 90) return { strong: "#22c55e", soft: "rgba(34, 197, 94, 0.16)" };
  if (value >= 75) return { strong: "#f59e0b", soft: "rgba(245, 158, 11, 0.18)" };
  return { strong: "#ef4444", soft: "rgba(239, 68, 68, 0.18)" };
};

const faceTone = {
  healthy: { bg: "rgba(34, 197, 94, 0.24)", color: "#14532d", valueColor: "#16a34a" },
  warning: { bg: "rgba(245, 158, 11, 0.24)", color: "#92400e", valueColor: "#d97706" },
  critical: { bg: "rgba(239, 68, 68, 0.24)", color: "#991b1b", valueColor: "#dc2626" },
};

const formatValue = (value, suffix = "") => `${Number(value).toFixed(1)}${suffix}`;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getFaceKey = (strandKey, faceLabel) => `${strandKey}:${faceLabel}`;

function MetricCard({ label, value, suffix = "", decimals = 1, onClick, ui = {} }) {
  return (
    <button
      type="button"
      style={{ ...styles.metricCard, ...ui.metricCard }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>{label}</span>
      <strong style={{ ...styles.metricValue, ...ui.metricValue }}>
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </strong>
    </button>
  );
}

function GaugeCard({ item, onOpen, ui = {} }) {
  const tone = healthTone(item.value);
  const radius = 50;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (item.value / 100) * circumference;

  return (
    <button type="button" style={{ ...styles.gaugeCard, ...ui.gaugeCard, background: tone.soft }} onClick={() => onOpen(item)}>
      <div style={{ ...styles.metricLabel, ...ui.metricLabel }}>{item.label}</div>
      <svg viewBox="0 0 120 72" style={styles.gaugeSvg}>
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <path
          d="M10 60 A50 50 0 0 1 110 60"
          fill="none"
          stroke={tone.strong}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <strong style={{ ...styles.metricValue, ...ui.metricValue, color: tone.strong }}>
        <AnimatedNumber value={item.value} decimals={1} suffix="%" />
      </strong>
    </button>
  );
}

function StrandFacePanel({ title, strandKey, faces, onSelectFace, onOpenGraph, selectedFaceKey, ui = {}, compact = false }) {
  return (
    <div style={{ ...styles.facePanel, ...(compact ? styles.facePanelFill : null), ...ui.facePanel }}>
      <button
        type="button"
        style={styles.sectionTrigger}
        onClick={(event) => {
          event.stopPropagation();
          onOpenGraph?.();
        }}
      >
        <span style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>{title}</span>
        <span style={styles.sectionTriggerText}>Open graph</span>
      </button>
      <div
        style={{
          ...styles.faceGrid,
          ...(compact ? styles.faceGridFill : null),
          ...(compact ? { gridTemplateRows: `repeat(${Math.max(faces.length, 1)}, minmax(0, 1fr))` } : null),
        }}
      >
        {faces.map((face) => (
          <button
            key={face.face}
            type="button"
            style={{
              ...styles.faceCard,
              ...(compact ? styles.faceCardCompact : null),
              ...(compact ? styles.faceCardFill : null),
              ...ui.faceCard,
              ...(selectedFaceKey === getFaceKey(strandKey, face.face) ? styles.faceCardSelected : null),
              background: (faceTone[face.status] ?? faceTone.healthy).bg,
            }}
            onClick={(event) => {
              event.stopPropagation();
              onSelectFace(strandKey, face);
            }}
          >
            <span style={{ ...styles.metricLabel, ...(compact ? styles.metricLabelCompact : null), ...ui.metricLabel }}>{face.face}</span>
            <strong
              style={{
                ...styles.metricValue,
                ...(compact ? styles.metricValueCompact : null),
                ...ui.metricValue,
                color: (faceTone[face.status] ?? faceTone.healthy).valueColor,
              }}
            >
              <AnimatedNumber value={face.value} decimals={1} suffix="%" />
            </strong>
            <span
              style={{
                color: (faceTone[face.status] ?? faceTone.healthy).color,
                fontSize: compact ? "11px" : "12px",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {face.status}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BarChart({ title, items, color, ui = {} }) {
  const max = useMemo(() => Math.max(...items.map((item) => item.value), 1), [items]);

  return (
    <div style={{ ...styles.panel, ...ui.panel }}>
      <div style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>{title}</div>
      <div style={styles.barStack}>
        {items.map((item) => (
          <div key={item.label} style={styles.barRow}>
            <span style={{ ...styles.barLabel, ...ui.barLabel }}>{item.label}</span>
            <div style={{ ...styles.barTrack, ...ui.barTrack }}>
              <div style={{ ...styles.barFill, width: `${(item.value / max) * 100}%`, background: color }} />
            </div>
            <strong style={{ color: ui.barValueColor ?? "#10233c" }}>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function MouldSystemRealtimeStrip({ live, ui = {} }) {
  const scaleMin = -0.15;
  const scaleMax = 1.4;
  const toDeviation = (value) => clamp((Number(value ?? 0) / 100) * 0.5, scaleMin, scaleMax);
  const toSync = (value) => clamp((Number(value ?? 0) / 100) * 0.5, scaleMin, scaleMax);
  const rows = [
    { label: "Mould Level Deviation", strand1: toDeviation(live.mouldLevel1), strand2: toDeviation(live.mouldLevel2), glow: "rgba(74,222,128,0.6)" },
    { label: "HMO Cylinders Sync", strand1: toSync(live.hmo1), strand2: toSync(live.hmo2), glow: "rgba(56,189,248,0.6)" },
  ];
  const markerPosition = (value) => `${((value - scaleMin) / (scaleMax - scaleMin)) * 100}%`;

  return (
    <div style={{ ...styles.mouldSystemStrip, ...ui.mouldSystemStrip }}>
      <div style={{ ...styles.mouldSystemHeader, ...ui.mouldSystemHeader }}>
        <span>MOULD SYSTEM</span>
        <span>Strand 1</span>
        <span>Strand 2</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} style={styles.mouldSystemRow}>
          <span style={{ ...styles.mouldSystemLabel, ...ui.mouldSystemLabel }}>{row.label}</span>
          {[row.strand1, row.strand2].map((value, index) => (
            <div key={`${row.label}-${index === 0 ? "s1" : "s2"}`} style={styles.mouldSystemCell}>
              <span style={{ ...styles.mouldSystemValue, ...ui.mouldSystemValue }}>
                <AnimatedNumber value={value} decimals={2} suffix="%" />
              </span>
              <div>
                <div style={{ ...styles.mouldSystemTrack, ...ui.mouldSystemTrack }}>
                  <div style={{ ...styles.mouldSystemMarker, ...ui.mouldSystemMarker, left: markerPosition(value), boxShadow: `0 0 14px ${row.glow}` }} />
                </div>
                <div style={{ ...styles.mouldSystemScale, ...ui.mouldSystemScale }}>
                  <span>{scaleMin.toFixed(2)}</span>
                  <span>-0.12</span>
                  <span>{value.toFixed(2)}%</span>
                  <span>0.18</span>
                  <span>{scaleMax.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TrendModal({ open, title, data, onClose, isLight, ui = {} }) {
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;
  const chartText = isLight ? "#26435f" : "#e2e8f0";
  const chartMutedText = isLight ? "#516b84" : "#cbd5e1";
  const chartGrid = isLight ? "rgba(148, 163, 184, 0.24)" : "rgba(148, 163, 184, 0.34)";
  const chartAxisLine = isLight ? "rgba(148, 163, 184, 0.55)" : "rgba(148, 163, 184, 0.7)";
  const chartTooltipBg = isLight ? "rgba(255,255,255,0.96)" : "rgba(15, 23, 42, 0.96)";

  const option = {
    backgroundColor: "transparent",
    textStyle: { fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", color: chartText },
    title: {
      text: `${title} Trend`,
      left: "center",
      top: 10,
      textStyle: { color: chartText, fontSize: 18, fontWeight: 700 },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: chartTooltipBg,
      borderColor: isLight ? "rgba(148, 163, 184, 0.3)" : "rgba(148, 163, 184, 0.24)",
      textStyle: { color: chartText },
      axisPointer: {
        type: "cross",
        crossStyle: { color: chartAxisLine },
        label: { backgroundColor: "#1e293b" },
      },
    },
    toolbox: {
      right: 10,
      top: 8,
      showTitle: true,
      tooltip: { show: true, position: "right" },
      iconStyle: { borderColor: chartMutedText },
      emphasis: { iconStyle: { borderColor: chartText } },
      feature: {
        dataZoom: { title: { zoom: "Zoom", back: "Reset Zoom" } },
        restore: { title: "Restore" },
        saveAsImage: { title: "Save As Image" },
      },
    },
    grid: { left: 48, right: 24, top: 64, bottom: 84 },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item, index) => item.label ?? `Point ${index + 1}`),
      axisLabel: { color: chartMutedText },
      axisLine: { lineStyle: { color: chartAxisLine } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: chartMutedText },
      splitLine: { lineStyle: { color: chartGrid } },
    },
    dataZoom: [{ type: "inside" }, { type: "slider", height: 18, bottom: 18 }],
    series: [
      {
        name: title,
        type: "line",
        smooth: false,
        symbol: "circle",
        symbolSize: 6,
        data: data.map((item) => Number(item.value ?? 0)),
        lineStyle: { width: 3, color: "#5b7be0" },
        itemStyle: { color: "#ffffff", borderColor: "#5b7be0", borderWidth: 2 },
        areaStyle: { color: "rgba(91, 123, 224, 0.12)" },
      },
    ],
  };

  const modalContent = (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modalCard, ...ui.modalCard }} onClick={(event) => event.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <div style={{ ...styles.modalEyebrowLight, ...ui.modalEyebrowLight }}>Digital Asset Management System</div>
            <div style={{ ...styles.sectionModalTitle, ...ui.sectionModalTitle }}>{title}</div>
          </div>
          <button type="button" style={{ ...styles.modalCloseButton, ...ui.modalCloseButton }} onClick={onClose}>
            x
          </button>
        </div>
        <div style={styles.modalBody}>
          <ReactECharts option={option} style={styles.modalChart} notMerge lazyUpdate />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function ComplianceModal({ open, title, detail, onClose, ui = {} }) {
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;
  const modalContent = (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modalCard, ...ui.modalCard, maxWidth: 620 }} onClick={(event) => event.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <div style={{ ...styles.modalEyebrowLight, ...ui.modalEyebrowLight }}>Equipment Health</div>
            <div style={{ ...styles.sectionModalTitle, ...ui.sectionModalTitle }}>{title}</div>
          </div>
          <button type="button" style={{ ...styles.modalCloseButton, ...ui.modalCloseButton }} onClick={onClose}>
            x
          </button>
        </div>
        <div style={styles.summaryGrid}>
          <div style={{ ...styles.summaryBox, ...ui.summaryBox }}>
            <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>Alert Comp.</span>
            <strong style={{ ...styles.metricValue, ...ui.metricValue }}>
              <AnimatedNumber value={detail.alertComp} decimals={1} suffix="%" />
            </strong>
          </div>
          <div style={{ ...styles.summaryBox, ...ui.summaryBox }}>
            <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>MO Comp.</span>
            <strong style={{ ...styles.metricValue, ...ui.metricValue }}>
              <AnimatedNumber value={detail.moComp} decimals={1} suffix="%" />
            </strong>
          </div>
          <div style={{ ...styles.summaryBox, ...ui.summaryBox }}>
            <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>NO Comp.</span>
            <strong style={{ ...styles.metricValue, ...ui.metricValue }}>
              <AnimatedNumber value={detail.noComp} decimals={1} suffix="%" />
            </strong>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default function NewMouldPage() {
  const theme = useDamsCasterTheme();
  const isLight = theme.isLight;
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const [fromDate, setFromDate] = useState(yesterday.toISOString().slice(0, 16));
  const [toDate, setToDate] = useState(now.toISOString().slice(0, 16));
  const [live, setLive] = useState(initialLive);
  const [subsystems, setSubsystems] = useState([]);
  const [faces, setFaces] = useState({ strand1: [], strand2: [] });
  const [alarmCount, setAlarmCount] = useState({ TOTAL: 0, OPEN: 0, CLOSE: 0, ACK: 0 });
  const [recentAlarms, setRecentAlarms] = useState([]);
  const [openAlerts, setOpenAlerts] = useState([]);
  const [sapMo, setSapMo] = useState([]);
  const [selectedFace, setSelectedFace] = useState(null);
  const [liveHistory, setLiveHistory] = useState(initialLiveHistory);
  const [trend, setTrend] = useState({ open: false, title: "", data: [] });
  const [compliance, setCompliance] = useState({ open: false, title: "", detail: { alertComp: 0, moComp: 0, noComp: 0 } });
  const [modalSection, setModalSection] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const selectedFaceRef = useRef(selectedFace);

  useEffect(() => {
    selectedFaceRef.current = selectedFace;
  }, [selectedFace]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [liveData, subsystemData, faceData, countData, alarmData, alertData, sapData] = await Promise.all([
          getNewMouldLiveData(),
          getNewMouldSubsystemHealth(),
          getNewMouldFaceHealth(),
          getNewMouldAlarmCount(),
          getNewMouldAlarmText(),
          getNewMouldOpenAlerts(),
          getNewMouldSapMoCompliance(),
        ]);

        if (!active) return;
        setErrorMessage("");
        setLive(liveData);
        setSubsystems(subsystemData);
        setFaces(faceData);
        setAlarmCount(countData);
        setRecentAlarms(alarmData);
        setOpenAlerts(alertData);
        setSapMo(sapData);

        const allFaceEntries = [
          ...(faceData.strand1 ?? []).map((face) => ({ strandKey: "strand1", ...face })),
          ...(faceData.strand2 ?? []).map((face) => ({ strandKey: "strand2", ...face })),
        ];

        const fallbackFace = allFaceEntries[0] ?? null;
        const activeFace = selectedFaceRef.current ?? (fallbackFace ? { strandKey: fallbackFace.strandKey, face: fallbackFace.face } : null);
        if (!selectedFaceRef.current && fallbackFace) {
          setSelectedFace({ strandKey: fallbackFace.strandKey, face: fallbackFace.face });
        }

        setLiveHistory((previous) => {
          const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          const nextFaces = { ...previous.faces };
          allFaceEntries.forEach((item) => {
            const key = getFaceKey(item.strandKey, item.face);
            nextFaces[key] = [...(nextFaces[key] ?? []), Number(item.value ?? 0)].slice(-HISTORY_LIMIT);
          });

          const activeFaceKey = activeFace ? getFaceKey(activeFace.strandKey, activeFace.face) : null;

          return {
            timestamps: [...previous.timestamps, timestamp].slice(-HISTORY_LIMIT),
            process: [
              ...previous.process,
              {
                ladle1: Number(liveData.ladle1 ?? 0),
                ladle2: Number(liveData.ladle2 ?? 0),
                tundish1: Number(liveData.tundish1 ?? 0),
                tundish2: Number(liveData.tundish2 ?? 0),
                castingSpeed1: Number(liveData.castingSpeed1 ?? 0),
                castingSpeed2: Number(liveData.castingSpeed2 ?? 0),
                mouldLevel1: Number(liveData.mouldLevel1 ?? 0),
                mouldLevel2: Number(liveData.mouldLevel2 ?? 0),
              },
            ].slice(-HISTORY_LIMIT),
            faces: nextFaces,
            selectedFace: activeFaceKey ? (nextFaces[activeFaceKey] ?? []).slice(-HISTORY_LIMIT) : [],
          };
        });
      } catch (error) {
        console.error("NewMouldPage load failed:", error);
        if (active) {
          setErrorMessage("Live API refresh failed. Retrying...");
        }
      }
    };

    load();
    const interval = setInterval(load, REFRESH_INTERVAL);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedFace) return;
    const selectedFaceKey = getFaceKey(selectedFace.strandKey, selectedFace.face);
    setLiveHistory((previous) => ({
      ...previous,
      selectedFace: (previous.faces[selectedFaceKey] ?? []).slice(-HISTORY_LIMIT),
    }));
  }, [selectedFace]);

  const overallHealth = useMemo(() => {
    if (!subsystems.length) return "Caster Health Loading";
    const avg = subsystems.reduce((sum, item) => sum + item.value, 0) / subsystems.length;
    return `Caster Health ${avg.toFixed(1)}%`;
  }, [subsystems]);

  const selectedFaceEntry = useMemo(() => {
    if (!selectedFace) return null;
    const faceList = faces[selectedFace.strandKey] ?? [];
    return faceList.find((face) => face.face === selectedFace.face) ?? null;
  }, [faces, selectedFace]);

  const openTrend = async (key) => {
    setModalSection(null);
    setCompliance({ open: false, title: "", detail: { alertComp: 0, moComp: 0, noComp: 0 } });
    try {
      const data = await getNewMouldTrendData(key);
      setTrend({ open: true, title: trendTitles[key] ?? key, data });
      setErrorMessage("");
    } catch (error) {
      console.error("NewMouldPage trend load failed:", error);
      setErrorMessage("Unable to load trend data right now.");
    }
  };

  const openCompliance = async (item) => {
    setModalSection(null);
    setTrend({ open: false, title: "", data: [] });
    try {
      const detail = await getNewMouldComplianceDetail(item.key);
      setCompliance({ open: true, title: item.label, detail });
      setErrorMessage("");
    } catch (error) {
      console.error("NewMouldPage compliance load failed:", error);
      setErrorMessage("Unable to load compliance data right now.");
    }
  };

  const openSectionGraph = (sectionKey) => {
    setTrend({ open: false, title: "", data: [] });
    setCompliance({ open: false, title: "", detail: { alertComp: 0, moComp: 0, noComp: 0 } });
    setModalSection(sectionKey);
  };

  const handleSelectFace = (strandKey, face) => {
    setTrend({ open: false, title: "", data: [] });
    setCompliance({ open: false, title: "", detail: { alertComp: 0, moComp: 0, noComp: 0 } });
    setSelectedFace({ strandKey, face: face.face });
    setModalSection("selectedFace");
  };

  const loadSelected = async () => {
    try {
      const liveData = await getNewMouldLiveData();
      setLive(liveData);
      setErrorMessage("");
    } catch (error) {
      console.error("NewMouldPage manual load failed:", error);
      setErrorMessage("Unable to load selected range right now.");
    }
  };

  const modalConfig = useMemo(() => {
    if (!modalSection) return null;

    const chartText = isLight ? "#26435f" : "#e2e8f0";
    const chartMutedText = isLight ? "#516b84" : "#cbd5e1";
    const chartGrid = isLight ? "rgba(148, 163, 184, 0.24)" : "rgba(148, 163, 184, 0.34)";
    const chartAxisLine = isLight ? "rgba(148, 163, 184, 0.55)" : "rgba(148, 163, 184, 0.7)";
    const chartTooltipBg = isLight ? "rgba(255,255,255,0.96)" : "rgba(15, 23, 42, 0.96)";

    const baseModal = {
      backgroundColor: isLight ? "#ffffff" : "#08111f",
      textStyle: { fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", color: chartText },
      grid: { left: 48, right: 24, top: 70, bottom: 84 },
      tooltip: {
        trigger: "axis",
        backgroundColor: chartTooltipBg,
        borderColor: isLight ? "rgba(148, 163, 184, 0.3)" : "rgba(148, 163, 184, 0.24)",
        textStyle: { color: chartText },
      },
      toolbox: {
        right: 10,
        showTitle: true,
        tooltip: { show: true, position: "right" },
        iconStyle: { borderColor: chartMutedText },
        emphasis: { iconStyle: { borderColor: chartText } },
        feature: {
          dataZoom: { title: { zoom: "Zoom", back: "Reset Zoom" } },
          restore: { title: "Restore" },
          saveAsImage: { title: "Save As Image" },
        },
      },
      dataZoom: [{ type: "inside" }, { type: "slider", height: 18, bottom: 18 }],
      legend: { top: 30, textStyle: { color: chartMutedText } },
    };

    const topValues = topMetrics.map((item) => Number(live[item.key] ?? 0));
    const sideValues = sideMetrics.map((item) => Number(live[item.key] ?? 0));
    const subsystemValues = subsystems.map((item) => Number(item.value ?? 0));
    const allFaces = [
      ...(faces.strand1 ?? []).map((face) => ({ strandKey: "strand1", ...face })),
      ...(faces.strand2 ?? []).map((face) => ({ strandKey: "strand2", ...face })),
    ];
    const strand1Faces = allFaces.filter((face) => face.strandKey === "strand1");
    const strand2Faces = allFaces.filter((face) => face.strandKey === "strand2");
    const selectedFaceKey = selectedFace ? getFaceKey(selectedFace.strandKey, selectedFace.face) : null;
    const configs = {
      topMetrics: {
        title: "Top Metrics",
        subtitle: "Caster weights, speeds, and mould levels",
        option: {
          ...baseModal,
          xAxis: { type: "category", data: topMetrics.map((item) => item.label), axisLabel: { color: chartMutedText, interval: 0, rotate: 12 }, axisLine: { lineStyle: { color: chartAxisLine } } },
          yAxis: { type: "value", axisLabel: { color: chartMutedText }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [{ name: "Value", type: "line", smooth: true, data: topValues, lineStyle: { width: 4, color: "#2563eb" }, areaStyle: { color: "rgba(37, 99, 235, 0.12)" } }],
        },
      },
      sideMetrics: {
        title: "Side Metrics",
        subtitle: "Refill, backlash, TCM, deburrer, and flow metrics",
        option: {
          ...baseModal,
          xAxis: { type: "category", data: sideMetrics.map((item) => item.label), axisLabel: { color: chartMutedText, interval: 0, rotate: 18 }, axisLine: { lineStyle: { color: chartAxisLine } } },
          yAxis: { type: "value", axisLabel: { color: chartMutedText }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [{ name: "Value", type: "bar", data: sideValues, itemStyle: { color: "#f59e0b", borderRadius: [10, 10, 0, 0] } }],
        },
      },
      processOverview: {
        title: "Caster Process Overview",
        subtitle: "Two-strand live trend",
        option: {
          ...baseModal,
          xAxis: { type: "category", data: liveHistory.timestamps, axisLabel: { color: chartMutedText }, axisLine: { lineStyle: { color: chartAxisLine } } },
          yAxis: { type: "value", axisLabel: { color: chartMutedText }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [
            { name: "Ladle 1", type: "line", smooth: true, data: liveHistory.process.map((item) => item.ladle1), lineStyle: { width: 3, color: "#f97316" } },
            { name: "Ladle 2", type: "line", smooth: true, data: liveHistory.process.map((item) => item.ladle2), lineStyle: { width: 3, color: "#ea580c" } },
            { name: "Tundish 1", type: "line", smooth: true, data: liveHistory.process.map((item) => item.tundish1), lineStyle: { width: 3, color: "#2563eb" } },
            { name: "Tundish 2", type: "line", smooth: true, data: liveHistory.process.map((item) => item.tundish2), lineStyle: { width: 3, color: "#1d4ed8" } },
            { name: "Speed S1", type: "line", smooth: true, data: liveHistory.process.map((item) => item.castingSpeed1), lineStyle: { width: 3, type: "dashed", color: "#14b8a6" } },
            { name: "Speed S2", type: "line", smooth: true, data: liveHistory.process.map((item) => item.castingSpeed2), lineStyle: { width: 3, type: "dashed", color: "#0ea5e9" } },
          ],
        },
      },
      mouldHealth: {
        title: "Mould Health",
        subtitle: "Subsystem metric snapshot",
        option: {
          ...baseModal,
          xAxis: { type: "category", data: mouldHealthCards.map((item) => item.label), axisLabel: { color: chartMutedText, interval: 0, rotate: 20 }, axisLine: { lineStyle: { color: chartAxisLine } } },
          yAxis: { type: "value", min: 0, max: 100, axisLabel: { color: chartMutedText, formatter: "{value}%" }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [{ name: "Health", type: "bar", data: mouldHealthCards.map((item) => Number(live[item.key] ?? 0)), itemStyle: { color: "#f97316", borderRadius: [10, 10, 0, 0] } }],
        },
      },
      subsystemHealth: {
        title: "Subsystem Health",
        subtitle: "Subsystem performance comparison",
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: { type: "category", data: subsystems.map((item) => item.label), axisLabel: { color: chartMutedText, interval: 0, rotate: 12 }, axisLine: { lineStyle: { color: chartAxisLine } } },
          yAxis: { type: "value", min: 0, max: 100, axisLabel: { color: chartMutedText, formatter: "{value}%" }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [
            {
              name: "Health",
              type: "bar",
              data: subsystemValues,
              itemStyle: {
                color: (params) => healthTone(Number(params.data ?? 0)).strong,
                borderRadius: [10, 10, 0, 0],
              },
              label: { show: true, position: "top", formatter: "{c}%" },
            },
          ],
        },
      },
      openAlerts: {
        title: "Open Alerts by Area",
        subtitle: "Active alert distribution",
        option: {
          ...baseModal,
          xAxis: { type: "category", data: openAlerts.map((item) => item.label), axisLabel: { color: chartMutedText, interval: 0, rotate: 12 }, axisLine: { lineStyle: { color: chartAxisLine } } },
          yAxis: { type: "value", axisLabel: { color: chartMutedText }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [{ name: "Alerts", type: "bar", data: openAlerts.map((item) => item.value), itemStyle: { color: "#f97316", borderRadius: [10, 10, 0, 0] } }],
        },
      },
      sapMo: {
        title: "SAP PM MO Compliance",
        subtitle: "Section wise compliance percentage",
        option: {
          ...baseModal,
          xAxis: { type: "category", data: sapMo.map((item) => item.label), axisLabel: { color: chartMutedText, interval: 0, rotate: 12 }, axisLine: { lineStyle: { color: chartAxisLine } } },
          yAxis: { type: "value", min: 0, max: 100, axisLabel: { color: chartMutedText, formatter: "{value}%" }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [{ name: "Compliance", type: "line", smooth: true, data: sapMo.map((item) => item.value), lineStyle: { width: 4, color: "#22c55e" }, areaStyle: { color: "rgba(34, 197, 94, 0.12)" } }],
        },
      },
      faceCondition: {
        title: "Face Condition",
        subtitle: "Strand-wise live face comparison",
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: {
            type: "category",
            data: allFaces.map((face) => `${face.strandKey === "strand1" ? "S1" : "S2"} - ${face.face}`),
            axisLabel: { color: chartMutedText, interval: 0, rotate: 12 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { color: chartMutedText, formatter: "{value}%" },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Face Health",
              type: "bar",
              data: allFaces.map((face) => Number(face.value ?? 0)),
              itemStyle: {
                color: (params) => {
                  const status = allFaces[params.dataIndex]?.status;
                  return (faceTone[status] ?? faceTone.healthy).valueColor;
                },
                borderRadius: [10, 10, 0, 0],
              },
              label: { show: true, position: "top", formatter: "{c}%" },
            },
          ],
        },
      },
      faceConditionStrand1: {
        title: "Strand 1 Face Condition",
        subtitle: "Strand 1 live face comparison",
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: {
            type: "category",
            data: strand1Faces.map((face) => face.face),
            axisLabel: { color: chartMutedText, interval: 0, rotate: 12 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { color: chartMutedText, formatter: "{value}%" },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Face Health",
              type: "bar",
              data: strand1Faces.map((face) => Number(face.value ?? 0)),
              itemStyle: {
                color: (params) => {
                  const status = strand1Faces[params.dataIndex]?.status;
                  return (faceTone[status] ?? faceTone.healthy).valueColor;
                },
                borderRadius: [10, 10, 0, 0],
              },
              label: { show: true, position: "top", formatter: "{c}%" },
            },
          ],
        },
      },
      faceConditionStrand2: {
        title: "Strand 2 Face Condition",
        subtitle: "Strand 2 live face comparison",
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: {
            type: "category",
            data: strand2Faces.map((face) => face.face),
            axisLabel: { color: chartMutedText, interval: 0, rotate: 12 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { color: chartMutedText, formatter: "{value}%" },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Face Health",
              type: "bar",
              data: strand2Faces.map((face) => Number(face.value ?? 0)),
              itemStyle: {
                color: (params) => {
                  const status = strand2Faces[params.dataIndex]?.status;
                  return (faceTone[status] ?? faceTone.healthy).valueColor;
                },
                borderRadius: [10, 10, 0, 0],
              },
              label: { show: true, position: "top", formatter: "{c}%" },
            },
          ],
        },
      },
      selectedFace: {
        title: "Selected Face",
        subtitle: selectedFaceEntry ? `${selectedFace?.strandKey === "strand1" ? "Strand 1" : "Strand 2"} - ${selectedFaceEntry.face}` : "No face selected",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: liveHistory.timestamps,
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { color: chartMutedText, formatter: "{value}%" },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: selectedFaceEntry?.face ?? "Face",
              type: "line",
              smooth: true,
              areaStyle: { color: "rgba(59, 130, 246, 0.12)" },
              lineStyle: { width: 4, color: "#2563eb" },
              data: selectedFaceKey ? liveHistory.selectedFace : [],
            },
          ],
        },
      },
    };

    return configs[modalSection] ?? null;
  }, [faces, isLight, live, liveHistory, modalSection, openAlerts, sapMo, selectedFace, selectedFaceEntry, subsystems]);

  const ui = isLight
    ? {
      eyebrow: { color: "#0f5c96" },
      title: { color: "#11243b", textShadow: "0 1px 0 rgba(255,255,255,0.72)" },
      heroPill: { color: "#10233c" },
      filterBar: { background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))", border: "1px solid rgba(148,163,184,0.18)" },
      input: { background: "rgba(255,255,255,0.78)", color: "#10233c", border: "1px solid rgba(59,130,246,0.14)" },
      metricCard: { background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(240,246,255,0.9))", color: "#10233c", border: "1px solid rgba(148,163,184,0.18)", boxShadow: "0 14px 34px rgba(148,163,184,0.16)" },
      metricLabel: { color: "#1d4f7f" },
      metricValue: { color: "#0f172a" },
      processPanel: { background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))", border: "1px solid rgba(148,163,184,0.18)", boxShadow: "0 20px 50px rgba(148,163,184,0.18)" },
      sectionTitle: { color: "#10233c" },
      processCanvas: { background: "transparent", border: "none", boxShadow: "none" },
      processLegendCard: { background: "rgba(248,250,252,0.92)", border: "1px solid rgba(148,163,184,0.35)", boxShadow: "10px 10px 0 rgba(15,23,42,0.2)" },
      processLegendLabel: { color: "#1e293b", textShadow: "0 0 8px rgba(56,189,248,0.22)" },
      processLegendLine: { boxShadow: "0 0 10px rgba(56,189,248,0.35)" },
      mouldSystemStrip: { background: "rgba(255,255,255,0.94)", border: "1px solid rgba(59,130,246,0.24)", boxShadow: "0 12px 26px rgba(148,163,184,0.24)" },
      mouldSystemHeader: { background: "linear-gradient(90deg, #3b82f6, #60a5fa)", color: "#eff6ff" },
      mouldSystemLabel: { color: "#1e3a5f" },
      mouldSystemValue: { color: "#15803d", background: "rgba(220,252,231,0.9)", border: "1px solid rgba(134,239,172,0.8)" },
      mouldSystemTrack: { border: "1px solid rgba(148,163,184,0.36)" },
      mouldSystemMarker: { background: "#0f172a", boxShadow: "0 0 14px rgba(56,189,248,0.45), 0 0 22px rgba(34,197,94,0.22)" },
      mouldSystemScale: { color: "#1d4f7f" },
      processNodeOrange: { background: "linear-gradient(180deg, #ffd166 0%, #ffb347 28%, #ff8f1f 62%, #f06a00 100%)", color: "#fff7ed", border: "1px solid rgba(249,115,22,0.14)", boxShadow: "0 18px 38px rgba(255,145,31,0.22)" },
      tundishNode: { background: "linear-gradient(145deg, #2563eb, #38bdf8)", color: "#ffffff", border: "1px solid rgba(56,189,248,0.12)", boxShadow: "0 18px 32px rgba(37,99,235,0.18)" },
      strandNode: { background: "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(235,243,252,0.94))", border: "1px solid rgba(96,165,250,0.18)", boxShadow: "0 16px 34px rgba(148,163,184,0.14)", color: "#10233c" },
      nodeSub: { color: "#516b84" },
      facePanel: { background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))", border: "1px solid rgba(148,163,184,0.18)" },
      panel: { background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))", border: "1px solid rgba(148,163,184,0.18)", boxShadow: "0 14px 34px rgba(148,163,184,0.18)" },
      gaugeCard: { border: "1px solid rgba(148,163,184,0.14)", boxShadow: "0 10px 24px rgba(148,163,184,0.12)" },
      faceCard: { color: "#10233c", border: "1px solid rgba(148,163,184,0.14)", boxShadow: "0 10px 24px rgba(148,163,184,0.12)" },
      selectedFaceCard: { background: "rgba(56, 189, 248, 0.09)", border: "1px solid rgba(56, 189, 248, 0.18)" },
      selectedFaceTitle: { color: "#0f5c96" },
      selectedFaceValue: { color: "#10233c" },
      selectedFaceMeta: { color: "#38536d" },
      alarmItem: { background: "rgba(254,226,226,0.72)", border: "1px solid rgba(248,113,113,0.18)", color: "#9f1239" },
      summaryTile: { background: "rgba(255,255,255,0.74)", color: "#10233c", border: "1px solid rgba(148,163,184,0.16)", boxShadow: "0 10px 24px rgba(148,163,184,0.12)" },
      barLabel: { color: "#38536d" },
      barTrack: { background: "rgba(148,163,184,0.16)" },
      barValueColor: "#10233c",
      modalCard: { background: "rgba(255,255,255,0.96)", boxShadow: "0 28px 80px rgba(15, 23, 42, 0.28)" },
      sectionModalTitle: { color: "#10233c" },
      modalSubtitle: { color: "#516b84" },
      modalEyebrowLight: { color: "#516b84" },
      modalCloseButton: { background: "#ffffff", color: "#26435f", border: "1px solid rgba(148, 163, 184, 0.24)" },
      summaryBox: { background: "rgba(255,255,255,0.74)", border: "1px solid rgba(148,163,184,0.16)" },
    }
    : {
      processLegendCard: { background: "rgba(15,23,42,0.9)", border: "1px solid rgba(56,189,248,0.24)", boxShadow: "0 16px 28px rgba(2,6,23,0.48)" },
      processLegendLabel: { color: "#dbeafe", textShadow: "0 0 10px rgba(56,189,248,0.35)" },
      processLegendLine: { boxShadow: "0 0 12px rgba(56,189,248,0.55)" },
      mouldSystemStrip: { background: "rgba(7,18,34,0.92)", border: "1px solid rgba(56,189,248,0.24)", boxShadow: "0 14px 30px rgba(2,6,23,0.5)" },
      mouldSystemHeader: { background: "linear-gradient(90deg, rgba(37,99,235,0.88), rgba(56,189,248,0.88))", color: "#dbeafe" },
      mouldSystemLabel: { color: "#cbd5e1" },
      mouldSystemValue: { color: "#86efac", background: "rgba(20,83,45,0.38)", border: "1px solid rgba(74,222,128,0.45)" },
      mouldSystemTrack: { border: "1px solid rgba(148,163,184,0.4)" },
      mouldSystemMarker: { background: "#dbeafe", boxShadow: "0 0 14px rgba(56,189,248,0.8), 0 0 22px rgba(34,197,94,0.5)" },
      mouldSystemScale: { color: "#bfdbfe" },
      modalCard: { background: "rgba(8,17,31,0.98)", boxShadow: "0 28px 80px rgba(2, 6, 23, 0.52)" },
      sectionModalTitle: { color: "#f8fafc" },
      modalSubtitle: { color: "#cbd5e1" },
      modalEyebrowLight: { color: "#cbd5e1" },
      modalCloseButton: { background: "rgba(15,23,42,0.88)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.24)" },
      selectedFaceCard: { background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.18)" },
      selectedFaceTitle: { color: "#7dd3fc" },
      selectedFaceValue: { color: "#f8fafc" },
      selectedFaceMeta: { color: "#cbd5e1" },
      processNodeOrange: { color: "#fff7ed" },
      tundishNode: { color: "#ffffff" },
      barValueColor: "#f8fafc",
    };

  return (
    <div style={{ ...styles.page, ...theme.pageStyle }}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />
      <div style={styles.container}>
        <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />
        <div style={styles.contentWrapper}>
          <section style={{ ...styles.hero, ...ui.hero }}>
            <div>
              <div style={{ ...styles.eyebrow, ...ui.eyebrow }}>DAMS / Continuous Casting / Heat Flux Control</div>
              <h1 style={{ ...styles.title, ...ui.title }}>New Mould</h1>
            </div>
            <div style={{ ...styles.heroPill, ...ui.heroPill }}>{overallHealth}</div>
          </section>
          {errorMessage ? <div style={{ color: "#ef4444", fontWeight: 600, marginBottom: 10 }}>{errorMessage}</div> : null}

          <section style={{ ...styles.filterBar, ...ui.filterBar }}>
            <label style={styles.filterField}>
              <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>From</span>
              <input style={{ ...styles.input, ...ui.input }} type="datetime-local" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </label>
            <label style={styles.filterField}>
              <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>To</span>
              <input style={{ ...styles.input, ...ui.input }} type="datetime-local" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </label>
            <button type="button" style={styles.loadButton} onClick={loadSelected}>
              Load
            </button>
          </section>

          <section style={styles.topMetricGrid} onClick={() => openSectionGraph("topMetrics")}>
            {topMetrics.map((item) => (
              <MetricCard key={item.key} label={item.label} value={live[item.key] ?? 0} suffix={item.suffix} onClick={() => openTrend(item.key)} ui={ui} />
            ))}
          </section>

          <section style={styles.mainGrid}>
            <div style={styles.sideRail} onClick={() => openSectionGraph("sideMetrics")}>
              {sideMetrics.slice(0, 5).map((item) => (
                <MetricCard key={item.key} label={item.label} value={live[item.key] ?? 0} suffix={item.suffix} onClick={() => openTrend(item.key)} ui={ui} />
              ))}
              <StrandFacePanel
                title="Strand 1 Face Health"
                strandKey="strand1"
                faces={faces.strand1}
                onSelectFace={handleSelectFace}
                onOpenGraph={() => openSectionGraph("faceConditionStrand1")}
                selectedFaceKey={selectedFace ? getFaceKey(selectedFace.strandKey, selectedFace.face) : null}
                ui={ui}
                compact
              />
            </div>

            <div style={{ ...styles.processPanel, ...ui.processPanel }}>
              <div style={styles.sectionTrigger}>
                <span style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>Caster Process Overview</span>
              </div>
              <div style={styles.processOverviewImageWrap}>
                <img src={casterProcessOverviewImage} alt="Caster process overview" style={styles.processOverviewImage} />
                <div style={{ ...styles.processLegendCard, ...ui.processLegendCard }}>
                  <div style={styles.processLegendRow}>
                    <span style={{ ...styles.processLegendLabel, ...ui.processLegendLabel }}>Torque:</span>
                    <span style={{ ...styles.processLegendLine, ...ui.processLegendLine, background: "#f97316" }} />
                  </div>
                  <div style={styles.processLegendRow}>
                    <span style={{ ...styles.processLegendLabel, ...ui.processLegendLabel }}>Pressure:</span>
                    <span style={{ ...styles.processLegendLine, ...ui.processLegendLine, background: "#86efac" }} />
                  </div>
                  <div style={styles.processLegendRow}>
                    <span style={{ ...styles.processLegendLabel, ...ui.processLegendLabel }}>Corrslip:</span>
                    <span style={{ ...styles.processLegendLine, ...ui.processLegendLine, background: "#38bdf8" }} />
                  </div>
                </div>
              </div>
              <MouldSystemRealtimeStrip live={live} ui={ui} />
              <div style={styles.processCanvasHeader}>
                <button type="button" style={styles.sectionTriggerTextButton} onClick={() => openSectionGraph("processOverview")}>
                  Open graph
                </button>
              </div>
              <div style={{ ...styles.processCanvas, ...ui.processCanvas }}>
                <div style={styles.processFlowTopRow}>
                  <button type="button" style={{ ...styles.processNode, ...styles.clickableProcessNode, ...ui.processNodeOrange }} onClick={() => openTrend("ladle1")} title="Open Ladle 1 graph">
                    <span style={{ ...styles.metricLabel, ...ui.metricLabel, color: ui.processNodeOrange ? "#fff7ed" : undefined }}>Ladle 1</span>
                    <strong style={{ ...styles.metricValue, color: ui.processNodeOrange ? "#fff7ed" : undefined }}>
                      <AnimatedNumber value={live.ladle1 ?? 0} decimals={1} suffix=" T" />
                    </strong>
                  </button>
                  <button type="button" style={{ ...styles.processNode, ...styles.clickableProcessNode, ...ui.processNodeOrange }} onClick={() => openTrend("ladle2")} title="Open Ladle 2 graph">
                    <span style={{ ...styles.metricLabel, ...ui.metricLabel, color: ui.processNodeOrange ? "#fff7ed" : undefined }}>Ladle 2</span>
                    <strong style={{ ...styles.metricValue, color: ui.processNodeOrange ? "#fff7ed" : undefined }}>
                      <AnimatedNumber value={live.ladle2 ?? 0} decimals={1} suffix=" T" />
                    </strong>
                  </button>
                </div>
                <button type="button" style={{ ...styles.tundishNode, ...styles.clickableProcessNode, ...ui.tundishNode }} onClick={() => openTrend("tundish1")} title="Open Tundish graph">
                  <span style={{ ...styles.metricLabel, ...ui.metricLabel, color: ui.tundishNode ? "#ffffff" : undefined }}>Tundish</span>
                  <strong style={{ ...styles.metricValue, color: ui.tundishNode ? "#ffffff" : undefined }}>
                    <AnimatedNumber value={(live.tundish1 + live.tundish2) / 2} decimals={1} suffix=" T" />
                  </strong>
                </button>
                <div style={styles.processFlowBottomRow}>
                  <div style={{ ...styles.strandNode, ...ui.strandNode }}>
                    <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>Strand 1</span>
                    <strong style={{ ...styles.metricValue, ...ui.metricValue }}>
                      <AnimatedNumber value={live.castingSpeed1 ?? 0} decimals={1} suffix=" m/min" />
                    </strong>
                    <span style={{ ...styles.nodeSub, ...ui.nodeSub }}>
                      Mould <AnimatedNumber value={live.mouldLevel1 ?? 0} decimals={1} suffix="%" />
                    </span>
                  </div>
                  <div style={{ ...styles.strandNode, ...ui.strandNode }}>
                    <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>Strand 2</span>
                    <strong style={{ ...styles.metricValue, ...ui.metricValue }}>
                      <AnimatedNumber value={live.castingSpeed2 ?? 0} decimals={1} suffix=" m/min" />
                    </strong>
                    <span style={{ ...styles.nodeSub, ...ui.nodeSub }}>
                      Mould <AnimatedNumber value={live.mouldLevel2 ?? 0} decimals={1} suffix="%" />
                    </span>
                  </div>
                </div>
              </div>
              <div style={styles.mouldHealthGrid} onClick={() => openSectionGraph("mouldHealth")}>
                {mouldHealthCards.map((item) => (
                  <MetricCard key={item.key} label={item.label} value={live[item.key] ?? 0} suffix="%" onClick={undefined} ui={ui} />
                ))}
              </div>
            </div>

            <div style={styles.sideRail} onClick={() => openSectionGraph("sideMetrics")}>
              {sideMetrics.slice(5).map((item) => (
                <MetricCard key={item.key} label={item.label} value={live[item.key] ?? 0} suffix={item.suffix} onClick={() => openTrend(item.key)} ui={ui} />
              ))}
              <StrandFacePanel
                title="Strand 2 Face Health"
                strandKey="strand2"
                faces={faces.strand2}
                onSelectFace={handleSelectFace}
                onOpenGraph={() => openSectionGraph("faceConditionStrand2")}
                selectedFaceKey={selectedFace ? getFaceKey(selectedFace.strandKey, selectedFace.face) : null}
                ui={ui}
                compact
              />
            </div>
          </section>

          <section style={styles.selectedFaceSection}>
            <div style={{ ...styles.panel, ...ui.panel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => openSectionGraph("selectedFace")}>
                <span style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>Selected Face</span>
                <span style={styles.sectionTriggerText}>Open graph</span>
              </button>
              {selectedFaceEntry ? (
                <button type="button" style={{ ...styles.selectedFaceCard, ...ui.selectedFaceCard }} onClick={() => openSectionGraph("selectedFace")}>
                  <div style={{ ...styles.selectedFaceTitle, ...ui.selectedFaceTitle }}>
                    {selectedFace?.strandKey === "strand1" ? "Strand 1" : "Strand 2"} - {selectedFaceEntry.face}
                  </div>
                  <div style={{ ...styles.selectedFaceValue, ...ui.selectedFaceValue }}>
                    <AnimatedNumber value={Number(selectedFaceEntry.value ?? 0)} decimals={1} suffix="%" />
                  </div>
                  <div style={{ ...styles.selectedFaceMeta, ...ui.selectedFaceMeta }}>Status: {selectedFaceEntry.status}</div>
                </button>
              ) : null}
            </div>
          </section>

          <section style={styles.lowerGrid}>
            <div style={{ ...styles.panel, ...ui.panel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => openSectionGraph("subsystemHealth")}>
                <span style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>Subsystem Health</span>
                <span style={styles.sectionTriggerText}>Open graph</span>
              </button>
              <div style={styles.gaugeGrid}>
                {subsystems.map((item) => (
                  <GaugeCard key={item.key} item={item} onOpen={openCompliance} ui={ui} />
                ))}
              </div>
            </div>

            <div style={styles.stackPanel}>
              <div style={{ ...styles.panel, ...ui.panel }}>
                <div style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>Recent Alarm</div>
                <div style={styles.alarmList}>
                  {recentAlarms.map((item, index) => (
                    <div key={`${item.AlarmText}-${index}`} style={{ ...styles.alarmItem, ...ui.alarmItem }}>
                      {item.AlarmText}
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.summaryGrid}>
                <div style={{ ...styles.summaryTile, ...ui.summaryTile, borderTopColor: "#22c55e" }}>
                  <strong>{alarmCount.TOTAL}</strong>
                  <span>Total Alerts</span>
                </div>
                <div style={{ ...styles.summaryTile, ...ui.summaryTile, borderTopColor: "#38bdf8" }}>
                  <strong>{alarmCount.OPEN}</strong>
                  <span>Open Alerts</span>
                </div>
                <div style={{ ...styles.summaryTile, ...ui.summaryTile, borderTopColor: "#f59e0b" }}>
                  <strong>{alarmCount.CLOSE}</strong>
                  <span>Closed Alerts</span>
                </div>
                <div style={{ ...styles.summaryTile, ...ui.summaryTile, borderTopColor: "#e879f9", background: "#f8fafc", color: "#0f172a" }}>
                  <strong>{alarmCount.ACK}</strong>
                  <span>Ack Alert</span>
                </div>
              </div>
            </div>
          </section>

          <section style={styles.chartGrid}>
            <div onClick={() => openSectionGraph("openAlerts")} style={styles.clickablePanel}>
              <BarChart title="Open Alerts by Area" items={openAlerts} color="linear-gradient(90deg, #ff9a3c, #f97316)" ui={ui} />
            </div>
            <div onClick={() => openSectionGraph("sapMo")} style={styles.clickablePanel}>
              <BarChart title="SAP PM MO Compliance" items={sapMo} color="linear-gradient(90deg, #34d399, #22c55e)" ui={ui} />
            </div>
          </section>
        </div>
      </div>

      <SectionModal
        isOpen={Boolean(modalConfig?.option)}
        title={modalConfig?.title}
        subtitle={modalConfig?.subtitle}
        option={modalConfig?.option}
        onClose={() => setModalSection(null)}
        ui={ui}
      />
      <TrendModal open={trend.open} title={trend.title} data={trend.data} onClose={() => setTrend({ open: false, title: "", data: [] })} isLight={isLight} ui={ui} />
      <ComplianceModal
        open={compliance.open}
        title={compliance.title}
        detail={compliance.detail}
        ui={ui}
        onClose={() => setCompliance({ open: false, title: "", detail: { alertComp: 0, moComp: 0, noComp: 0 } })}
      />
    </div>
  );
}

function SectionModal({ isOpen, title, subtitle, option, onClose, ui = {} }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modalCard, ...ui.modalCard }} onClick={(event) => event.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <div style={{ ...styles.sectionModalTitle, ...ui.sectionModalTitle }}>{title}</div>
            <div style={{ ...styles.modalSubtitle, ...ui.modalSubtitle }}>{subtitle}</div>
          </div>
          <button type="button" style={{ ...styles.modalCloseButton, ...ui.modalCloseButton }} onClick={onClose}>
            x
          </button>
        </div>
        <ReactECharts option={option} style={styles.modalChart} notMerge lazyUpdate />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    color: "#e2e8f0",
    background:
      "radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(249, 115, 22, 0.16), transparent 24%), linear-gradient(180deg, #07111f 0%, #10213a 52%, #0a1322 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  glowA: {
    position: "absolute",
    top: -120,
    left: -90,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(56, 189, 248, 0.09)",
    filter: "blur(10px)",
  },
  glowB: {
    position: "absolute",
    right: -80,
    bottom: -100,
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(244, 114, 182, 0.08)",
    filter: "blur(10px)",
  },
  container: { maxWidth: "1600px", margin: "0 auto", display: "grid", gap: "20px", position: "relative", zIndex: 1 },
  contentWrapper: { display: "flex", flexDirection: "column", gap: "24px" },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  eyebrow: { textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "12px", color: "#7dd3fc", marginBottom: 12 },
  title: { margin: 0, fontSize: "clamp(2rem, 3vw, 3rem)", color: "#f8fafc", lineHeight: 1.05, fontWeight: 650 },
  heroPill: {
    alignSelf: "end",
    color: "#bae6fd",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  filterBar: {
    display: "flex",
    gap: "14px",
    alignItems: "end",
    padding: "18px",
    borderRadius: "22px",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(148,163,184,0.16)",
    flexWrap: "wrap",
    marginBottom: "2px",
  },
  filterField: { display: "grid", gap: "8px", minWidth: "220px" },
  input: {
    background: "rgba(2,6,23,0.52)",
    color: "#e2e8f0",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "14px",
    padding: "12px 14px",
    transition: "all 240ms ease",
  },
  loadButton: {
    height: "46px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "1px solid rgba(37,99,235,0.22)",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#f8fafc",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37,99,235,0.18)",
    transition: "all 220ms ease",
  },
  topMetricGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "18px", marginBottom: "14px" },
  sectionTrigger: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left", marginBottom: "14px" },
  sectionTriggerText: { fontSize: "12px", fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em" },
  sectionTriggerTextButton: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  metricCard: {
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "16px",
    background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.74))",
    color: "#e2e8f0",
    padding: "16px",
    textAlign: "left",
    display: "grid",
    gap: "10px",
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  metricLabel: { fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" },
  metricValue: { fontSize: "18px", color: "#f8fafc" },
  mainGrid: { display: "grid", gridTemplateColumns: "260px minmax(360px, 1fr) 260px", gap: "18px", marginBottom: "2px" },
  sideRail: { display: "flex", flexDirection: "column", gap: "14px", minHeight: "100%" },
  processPanel: {
    borderRadius: "28px",
    background: "rgba(15,23,42,0.84)",
    border: "1px solid rgba(148,163,184,0.16)",
    padding: "20px",
    display: "grid",
    gap: "16px",
    transition: "all 280ms ease",
  },
  sectionTitle: { fontSize: "18px", fontWeight: 700, color: "#f8fafc" },
  processCanvas: {
    borderRadius: "24px",
    background: "transparent",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "16px",
    padding: "10px",
    transition: "all 320ms ease",
  },
  processCanvasHeader: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  processFlowTopRow: {
    display: "contents",
  },
  processFlowBottomRow: {
    display: "contents",
  },
  processOverviewImageWrap: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "rgba(248, 250, 252, 0.9)",
    boxShadow: "none",
    height: "480px",
    transition: "all 260ms ease",
  },
  processOverviewImage: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    mixBlendMode: "multiply",
  },
  processLegendCard: {
    position: "absolute",
    right: "32px",
    top: "18px",
    minWidth: "170px",
    padding: "14px 16px",
    borderRadius: "6px",
    background: "rgba(248, 250, 252, 0.92)",
    border: "1px solid rgba(148,163,184,0.35)",
    boxShadow: "10px 10px 0 rgba(15,23,42,0.2)",
    display: "grid",
    gap: "10px",
  },
  processLegendRow: {
    display: "grid",
    gridTemplateColumns: "70px 1fr",
    alignItems: "center",
    gap: "10px",
  },
  processLegendLabel: {
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: 700,
    textShadow: "0 0 8px rgba(56,189,248,0.22)",
  },
  processLegendLine: {
    height: "2px",
    borderRadius: "999px",
    boxShadow: "0 0 10px rgba(56,189,248,0.35)",
  },
  mouldSystemStrip: {
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "4px",
  },
  mouldSystemHeader: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    padding: "4px 10px",
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "0.01em",
  },
  mouldSystemRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    padding: "6px 10px",
    gap: "10px",
    alignItems: "center",
  },
  mouldSystemLabel: {
    fontSize: "13px",
    fontWeight: 700,
  },
  mouldSystemCell: {
    display: "grid",
    gridTemplateColumns: "68px 1fr",
    gap: "8px",
    alignItems: "center",
  },
  mouldSystemValue: {
    fontSize: "14px",
    fontWeight: 800,
    borderRadius: "4px",
    padding: "2px 6px",
    textAlign: "center",
    textShadow: "0 0 10px rgba(74,222,128,0.35)",
  },
  mouldSystemTrack: {
    height: "14px",
    borderRadius: "999px",
    position: "relative",
    background:
      "linear-gradient(90deg, #ef4444 0%, #ef4444 8%, #d1d5db 8%, #d1d5db 22%, #22c55e 22%, #22c55e 56%, #facc15 56%, #facc15 82%, #ef4444 82%, #ef4444 100%)",
    transition: "all 260ms ease",
  },
  mouldSystemMarker: {
    position: "absolute",
    top: "-3px",
    width: "4px",
    height: "20px",
    borderRadius: "999px",
    background: "#0f172a",
    transform: "translateX(-50%)",
    transition: "left 520ms cubic-bezier(0.22, 1, 0.36, 1)",
  },
  mouldSystemScale: {
    marginTop: "4px",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.01em",
  },
  processNode: {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #ffc94d 0%, #ffb347 24%, #ff8d1a 58%, #e76500 100%)",
    border: "1px solid rgba(249,115,22,0.14)",
    display: "grid",
    gap: "6px",
    textAlign: "center",
    boxShadow: "0 10px 20px rgba(255, 140, 26, 0.25)",
    transition: "all 240ms ease",
  },
  clickableProcessNode: {
    cursor: "pointer",
  },
  tundishNode: {
    justifySelf: "center",
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    background: "linear-gradient(145deg, #1d4ed8, #38bdf8)",
    border: "1px solid rgba(56,189,248,0.12)",
    boxShadow: "0 18px 32px rgba(37, 99, 235, 0.16)",
    textAlign: "center",
    display: "grid",
    gap: "6px",
    order: 5,
    transition: "all 240ms ease",
  },
  strandNode: {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(15, 23, 42, 0.88)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    textAlign: "center",
    display: "grid",
    gap: "6px",
    transition: "all 240ms ease",
  },
  nodeSub: { color: "#94a3b8", fontSize: "13px" },
  mouldHealthGrid: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "12px" },
  faceSection: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" },
  facePanel: {
    borderRadius: "24px",
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(148,163,184,0.16)",
    padding: "20px",
    display: "grid",
    gap: "16px",
    transition: "all 280ms ease",
  },
  facePanelFill: {
    flex: 1,
    minHeight: 0,
    gridTemplateRows: "auto 1fr",
  },
  faceGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "12px" },
  faceGridFill: {
    minHeight: 0,
  },
  faceCard: {
    borderRadius: "18px",
    padding: "16px",
    display: "grid",
    gap: "8px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 240ms ease, border-color 240ms ease, transform 220ms ease",
  },
  faceCardSelected: { outline: "2px solid rgba(37, 99, 235, 0.52)" },
  faceCardCompact: {
    borderRadius: "14px",
    padding: "10px",
    gap: "6px",
  },
  faceCardFill: {
    alignContent: "center",
  },
  metricLabelCompact: { fontSize: "10px" },
  metricValueCompact: { fontSize: "14px" },
  selectedFaceSection: { display: "grid" },
  selectedFaceCard: {
    borderRadius: "18px",
    padding: "16px",
    background: "rgba(56, 189, 248, 0.08)",
    border: "1px solid rgba(56, 189, 248, 0.18)",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all 260ms ease",
  },
  selectedFaceTitle: { fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#7dd3fc" },
  selectedFaceValue: { marginTop: "10px", fontSize: "34px", fontWeight: 800, color: "#f8fafc" },
  selectedFaceMeta: { marginTop: "8px", color: "#cbd5e1" },
  lowerGrid: { display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: "18px" },
  panel: {
    borderRadius: "24px",
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(148,163,184,0.16)",
    padding: "16px",
    transition: "all 280ms ease",
  },
  gaugeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: "14px", marginTop: "16px" },
  gaugeCard: { borderRadius: "20px", padding: "16px", border: "1px solid rgba(148,163,184,0.14)", display: "grid", gap: "8px", cursor: "pointer", transition: "all 240ms ease" },
  gaugeSvg: { width: "100%", height: "76px" },
  stackPanel: { display: "grid", gap: "14px" },
  alarmList: { display: "grid", gap: "10px", marginTop: "16px" },
  alarmItem: {
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(127,29,29,0.28)",
    border: "1px solid rgba(248,113,113,0.18)",
    color: "#fecaca",
    transition: "all 220ms ease",
  },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  summaryTile: {
    borderTop: "4px solid",
    borderRadius: "18px",
    padding: "16px",
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(148,163,184,0.14)",
    display: "grid",
    gap: "6px",
    transition: "all 240ms ease",
  },
  chartGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" },
  barStack: { display: "grid", gap: "12px", marginTop: "16px" },
  barRow: { display: "grid", gridTemplateColumns: "110px 1fr 40px", gap: "12px", alignItems: "center" },
  barLabel: { fontSize: "13px", color: "#cbd5e1" },
  barTrack: { height: "10px", background: "rgba(51,65,85,0.72)", borderRadius: "999px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "999px", transition: "width 420ms ease" },
  overlay: { position: "fixed", inset: 0, display: "grid", placeItems: "center", background: "rgba(15,23,42,0.42)", backdropFilter: "blur(6px)", padding: "20px", zIndex: 1200, transition: "background 220ms ease" },
  modal: { width: "min(760px, 100%)", borderRadius: "24px", background: "#0f172a", border: "1px solid rgba(148,163,184,0.18)" },
  summaryModal: { width: "min(620px, 100%)", borderRadius: "24px", background: "#0f172a", border: "1px solid rgba(148,163,184,0.18)" },
  modalCard: { width: "min(1080px, calc(100vw - 64px))", maxHeight: "calc(100vh - 64px)", overflow: "auto", background: "rgba(255,255,255,0.96)", borderRadius: "28px", padding: "24px", boxShadow: "0 28px 80px rgba(15,23,42,0.28)", transition: "all 260ms ease" },
  modalHeader: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", marginBottom: "14px" },
  modalTitle: { marginTop: "8px", fontSize: "22px", color: "#f8fafc", fontWeight: 700 },
  sectionModalTitle: { fontSize: "22px", color: "#10233c", fontWeight: 800 },
  modalSubtitle: { marginTop: "4px", fontSize: "13px", color: "#516b84" },
  modalEyebrowLight: { color: "#516b84", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" },
  closeButton: { border: "1px solid rgba(148,163,184,0.16)", borderRadius: "999px", padding: "10px 14px", background: "rgba(15,23,42,0.76)", color: "#e2e8f0", cursor: "pointer" },
  modalCloseButton: { width: "40px", height: "40px", borderRadius: "999px", border: "1px solid rgba(148,163,184,0.24)", background: "#ffffff", color: "#26435f", fontSize: "18px", fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  modalBody: { padding: "20px 22px 24px" },
  trendSvg: { width: "100%", height: "220px", padding: "10px", borderRadius: "18px", background: "linear-gradient(180deg, rgba(15,23,42,0.72), rgba(2,6,23,0.92))" },
  modalChart: { width: "100%", height: 420 },
  summaryBox: { borderRadius: "18px", padding: "18px", background: "rgba(15,23,42,0.82)", border: "1px solid rgba(148,163,184,0.14)", display: "grid", gap: "8px", transition: "all 240ms ease" },
  clickablePanel: { cursor: "pointer" },
};
