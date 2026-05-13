import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ReactECharts from "echarts-for-react";
import {
  getMouldCoolingAlarmCount,
  getMouldCoolingAlarmText,
  getMouldCoolingCompliance,
  getMouldCoolingLiveData,
  getMouldCoolingOverview,
  getMouldCoolingTrend,
} from "../Services/mouldCooling.mock";
import DamsCasterThemeSwitch from "../Components/DamsCasterThemeSwitch";
import useDamsCasterTheme from "../Components/useDamsCasterTheme";
import AnimatedNumber from "../Components/AnimatedNumber";
import mouldCoolingCircuitImage from "../assets/Images/mould-cooling-circuit.png";

const REFRESH_INTERVAL = 10000;
const HISTORY_LIMIT = 24;
const RETURN_VALVE_DUMMY_FLOW_DIFF = { st1: 2.35, st2: 1.92 };
const parseNullableNumber = (raw) => {
  if (raw === null || raw === undefined || raw === "") return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
};
const nextSimulatedValue = (prev, base) => {
  const anchor = Number.isFinite(prev) ? prev : base;
  const drift = (Math.random() - 0.5) * 0.18;
  return Number(Math.max(0, anchor + drift).toFixed(2));
};

const initialRange = () => {
  const to = new Date();
  const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
  return {
    from: from.toISOString().slice(0, 16),
    to: to.toISOString().slice(0, 16),
  };
};

const formatValue = (value, unit = "", digits = 1) =>
  typeof value === "number" ? `${value.toFixed(digits)}${unit}` : "NA";

function StatCard({ label, value, onClick, ui = {} }) {
  return (
    <button type="button" onClick={onClick} style={{ ...styles.statCard, ...ui.statCard }}>
      <div style={{ ...styles.statLabel, ...ui.statLabel }}>{label}</div>
      <div style={{ ...styles.statValue, ...ui.statValue }}>{value}</div>
    </button>
  );
}

function GaugeCard({ label, value, onClick, ui = {} }) {
  const tone = value >= 90 ? "#22c55e" : value >= 75 ? "#f59e0b" : "#ef4444";
  const radius = 48;
  const circumference = Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <button type="button" onClick={onClick} style={{ ...styles.gaugeCard, ...ui.gaugeCard }}>
      <div style={{ ...styles.gaugeLabel, ...ui.gaugeLabel }}>{label}</div>
      <svg viewBox="0 0 120 70" style={styles.gaugeSvg}>
        <path d="M12 58 A48 48 0 0 1 108 58" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <path
          d="M12 58 A48 48 0 0 1 108 58"
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ ...styles.gaugeValue, color: tone }}>
        <AnimatedNumber value={value} decimals={1} suffix="%" />
      </div>
    </button>
  );
}

function SummaryCard({ label, value, accent, ui = {} }) {
  return (
    <div style={{ ...styles.summaryCard, ...ui.summaryCard, borderTop: `3px solid ${accent}` }}>
      <div style={{ ...styles.summaryValue, ...ui.summaryValue }}>{typeof value === "number" ? <AnimatedNumber value={value} decimals={0} /> : value}</div>
      <div style={{ ...styles.summaryLabel, ...ui.summaryLabel }}>{label}</div>
    </div>
  );
}

function TrendModal({ title, data, onClose }) {
  if (!title) return null;

  const option = {
    backgroundColor: "transparent",
    animation: true,
    textStyle: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      color: "#e2e8f0",
    },
    title: {
      text: `${title} Trend`,
      left: "center",
      top: 10,
      textStyle: {
        color: "#f8fafc",
        fontSize: 18,
        fontWeight: 700,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.96)",
      borderColor: "rgba(148, 163, 184, 0.24)",
      textStyle: { color: "#e2e8f0" },
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#94a3b8",
        },
        label: {
          backgroundColor: "#1e293b",
        },
      },
    },
    toolbox: {
      right: 10,
      top: 8,
      showTitle: true,
      tooltip: { show: true, position: "right" },
      iconStyle: {
        borderColor: "#cbd5e1",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#f8fafc",
        },
      },
      feature: {
        dataZoom: { title: { zoom: "Zoom", back: "Reset Zoom" } },
        restore: { title: "Restore" },
        saveAsImage: { title: "Save As Image" },
      },
    },
    grid: {
      left: 48,
      right: 24,
      top: 64,
      bottom: 84,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item, index) => item.label ?? `Point ${index + 1}`),
      axisLabel: {
        color: "#94a3b8",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(148, 163, 184, 0.55)",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#94a3b8",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(148, 163, 184, 0.55)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(148, 163, 184, 0.18)",
        },
      },
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
        lineStyle: {
          width: 3,
          color: "#5b7be0",
        },
        itemStyle: {
          color: "#ffffff",
          borderColor: "#5b7be0",
          borderWidth: 2,
        },
        areaStyle: {
          color: "rgba(91, 123, 224, 0.12)",
        },
      },
    ],
  };

  const modalContent = (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.modalEyebrowLight}>Digital Asset Management System</div>
            <div style={styles.sectionModalTitle}>{title}</div>
          </div>
          <button type="button" onClick={onClose} style={styles.modalCloseButton}>
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

function ComplianceModal({ title, details, onClose }) {
  if (!title) return null;
  const modalContent = (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalCard, maxWidth: 560 }}>
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.modalEyebrowLight}>Equipment Health</div>
            <div style={styles.sectionModalTitle}>{title}</div>
          </div>
          <button type="button" onClick={onClose} style={styles.modalCloseButton}>
            x
          </button>
        </div>
        <div style={styles.complianceGrid}>
          <SummaryCard label="Alert Comp." value={`${details.alertComp}%`} accent="#38bdf8" />
          <SummaryCard label="MO Comp." value={`${details.moComp}%`} accent="#f59e0b" />
          <SummaryCard label="NO Comp." value={`${details.noComp}%`} accent="#22c55e" />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function BarChart({ title, items, suffix = "", color = "#38bdf8", ui = {} }) {
  const max = useMemo(() => Math.max(...items.map((item) => item.value), 1), [items]);
  return (
    <div style={{ ...styles.panel, ...ui.panel }}>
      <div style={{ ...styles.panelTitle, ...ui.panelTitle }}>{title}</div>
      <div style={styles.chartBody}>
        {items.map((item) => (
          <div key={item.label} style={styles.chartRow}>
            <span style={{ ...styles.chartLabel, ...ui.chartLabel }}>{item.label}</span>
            <div style={{ ...styles.chartTrack, ...ui.chartTrack }}>
              <div style={{ ...styles.chartBar, width: `${(item.value / max) * 100}%`, background: color }} />
            </div>
            <span style={{ ...styles.chartValue, ...ui.chartValue }}>
              {item.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReturnLineValvePanel({ live, onOpenGraph, ui = {} }) {
  const rows = ["Broad Fix", "Broad Loose", "Narrow Left", "Narrow Right"];
  const formatOrNA = (value) => (Number.isFinite(value) ? value.toFixed(2) : "NA");
  const dummyLineOpening = {
    "Broad Fix": 68.2,
    "Broad Loose": 64.7,
    "Narrow Left": 59.4,
    "Narrow Right": 61.9,
  };
  const dummyFlowLimits = {
    "Broad Fix": { lsl: 52.0, usl: 74.0, actual: 66.5 },
    "Broad Loose": { lsl: 50.0, usl: 72.0, actual: 63.8 },
    "Narrow Left": { lsl: 46.0, usl: 68.0, actual: 58.9 },
    "Narrow Right": { lsl: 47.0, usl: 69.0, actual: 60.7 },
  };
  const getLineValue = (label) => {
    const match = (live.lineOpening ?? []).find((item) => String(item.label ?? "").toLowerCase().includes(label.toLowerCase()));
    const value = Number(match?.value);
    if (Number.isFinite(value)) return value;
    return dummyLineOpening[label] ?? null;
  };

  const getFlowLimit = (label, field) => {
    const match = (live.flowLimits ?? []).find((item) => String(item.label ?? "").toLowerCase().includes(label.toLowerCase().split(" ")[0]));
    const value = Number(match?.[field]);
    if (Number.isFinite(value)) return value;
    return dummyFlowLimits[label]?.[field] ?? null;
  };

  const sections = [
    {
      title: "ST#1:Return Line Valve",
      key: "st1",
      flowDiff: parseNullableNumber(live.flowDiff1) ?? RETURN_VALVE_DUMMY_FLOW_DIFF.st1,
    },
    {
      title: "ST#2:Return Line Valve",
      key: "st2",
      flowDiff: parseNullableNumber(live.flowDiff2) ?? RETURN_VALVE_DUMMY_FLOW_DIFF.st2,
    },
  ];

  return (
    <div style={{ ...styles.returnValveWrapper, ...ui.returnValveWrapper }}>
      <div style={styles.returnValveHeaderRow}>
        <div style={{ ...styles.returnValveSectionTitle, ...ui.returnValveSectionTitle }}>Return Line Valve</div>
        <button type="button" style={{ ...styles.returnValveOpenGraph, ...ui.returnValveOpenGraph }} onClick={onOpenGraph}>
          Open Graph
        </button>
      </div>
      <div style={styles.returnValveSectionsGrid}>
        {sections.map((section) => (
          <div key={section.title} style={{ ...styles.returnValveCard, ...ui.returnValveCard }}>
          <div style={{ ...styles.returnValveHeaderTop, ...ui.returnValveHeaderTop }}>
            <span />
            <span>Value</span>
            <span>Pred LSL</span>
            <span>Pred USL</span>
          </div>
          <div style={{ ...styles.returnValveFlowDiff, ...ui.returnValveFlowDiff }}>
            <span>Flow Diff(P-O/P)</span>
            <strong>{formatOrNA(section.flowDiff)}</strong>
          </div>
          <div style={{ ...styles.returnValveTitle, ...ui.returnValveTitle }}>
            <span>{section.title}</span>
            <button type="button" style={{ ...styles.returnValveMiniAction, ...ui.returnValveMiniAction }} onClick={() => onOpenGraph(section.key)}>
              Open Graph
            </button>
          </div>
          <table style={styles.returnValveTable}>
            <thead>
              <tr>
                <th style={{ ...styles.returnValveTh, ...ui.returnValveTh }} />
                <th style={{ ...styles.returnValveTh, ...ui.returnValveTh }}>ACT</th>
                <th style={{ ...styles.returnValveTh, ...ui.returnValveTh }}>LCL</th>
                <th style={{ ...styles.returnValveTh, ...ui.returnValveTh }}>UCL</th>
                <th style={{ ...styles.returnValveTh, ...ui.returnValveTh }}>FLOW</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${section.title}-${row}`}>
                  <td style={{ ...styles.returnValveTdLabel, ...ui.returnValveTdLabel }}>{row}</td>
                  <td style={{ ...styles.returnValveTd, ...ui.returnValveTd }}>{formatOrNA(getLineValue(row))}</td>
                  <td style={{ ...styles.returnValveTd, ...ui.returnValveTd }}>{formatOrNA(getFlowLimit(row, "lsl"))}</td>
                  <td style={{ ...styles.returnValveTd, ...ui.returnValveTd }}>{formatOrNA(getFlowLimit(row, "usl"))}</td>
                  <td style={{ ...styles.returnValveTd, ...ui.returnValveTd }}>{formatOrNA(getFlowLimit(row, "actual"))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ))}
      </div>
    </div>
  );
}

function ShutOffValvePanel({ live, ui = {}, onOpenGraph }) {
  const valves = [
    ["Emergency Cooling-YW03", "Shut Off Valve-YW04", "Shut Off Valve-YW07"],
    ["Shut Off Valve-YW37", "Shut Off Valve-YW06", "Shut Off Valve-YW35"],
  ];
  const fallback = { yw03: 66.5, yw04: 68.9, yw07: 70.3, yw37: 72.1, yw06: 75.4, yw35: 73.6 };
  const findValue = (code) => {
    const match = (live.lineOpening ?? []).find((item) => String(item.label ?? "").toLowerCase() === code.toLowerCase());
    const n = parseNullableNumber(match?.value);
    return n ?? fallback[code.toLowerCase()] ?? null;
  };

  return (
    <div style={{ ...styles.sovCard, ...ui.sovCard }}>
      <div style={{ ...styles.sovHeader, ...ui.sovHeader }}>
        <div style={{ ...styles.sovTitle, ...ui.sovTitle }}>Shut Off Valve</div>
        <button type="button" style={{ ...styles.sovOpenGraph, ...ui.sovOpenGraph }} onClick={onOpenGraph}>
          Open Graph
        </button>
      </div>
      <div style={{ ...styles.sovGrid, ...ui.sovGrid }}>
        {valves.map((row, rIdx) =>
          row.map((name, cIdx) => {
            const code = name.split("-").at(-1) ?? "";
            const value = findValue(code);
            return (
              <React.Fragment key={`${name}-${rIdx}-${cIdx}`}>
                <div style={{ ...styles.sovLabel, ...ui.sovLabel }}>{name}</div>
                <div style={{ ...styles.sovValue, ...ui.sovValue }}>{Number.isFinite(value) ? value.toFixed(1) : "NA"}</div>
                <div style={{ ...styles.sovValue, ...ui.sovValue }}>NA</div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}

function MouldStrandStatusPanel({ live, ui = {}, onOpenGraph }) {
  const s1 = parseNullableNumber(live.mould1Level);
  const s2 = parseNullableNumber(live.mould2Level);
  const getStatus = (value) => (Number.isFinite(value) && value >= 70 ? "NORMAL" : "ALERT");
  const cards = [
    { title: "MOULD STRAND#1 MODEL STATUS", subtitle: "LEAKAGE DETECTION IN MOULD", value: getStatus(s1) },
    { title: "MOULD STRAND#2 MODEL STATUS", subtitle: "LEAKAGE DETECTION IN MOULD", value: getStatus(s2) },
  ];
  return (
    <div style={{ ...styles.strandStatusWrap, ...ui.strandStatusWrap }}>
      <button type="button" style={{ ...styles.strandStatusTrigger, ...ui.strandStatusTrigger }} onClick={onOpenGraph}>
        <span style={{ ...styles.strandStatusTriggerTitle, ...ui.strandStatusTriggerTitle }}>Mould Strand Model Status</span>
        <span style={{ ...styles.strandStatusTriggerText, ...ui.strandStatusTriggerText }}>Open Graph</span>
      </button>
      {cards.map((card) => (
        <div key={card.title} style={{ ...styles.strandStatusCard, ...ui.strandStatusCard }}>
          <div style={{ ...styles.strandStatusTitle, ...ui.strandStatusTitle }}>{card.title}</div>
          <div style={{ ...styles.strandStatusRow, ...ui.strandStatusRow }}>
            <span style={{ ...styles.strandStatusLabel, ...ui.strandStatusLabel }}>{card.subtitle}</span>
            <span style={{ ...styles.strandStatusValue, ...ui.strandStatusValue }}>{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MouldCooling() {
  const theme = useDamsCasterTheme();
  const isLight = theme.isLight;
  const [range, setRange] = useState(initialRange);
  const [overview, setOverview] = useState({});
  const [live, setLive] = useState({ lineOpening: [], flowLimits: [] });
  const [alarmCount, setAlarmCount] = useState({ TOTAL: 0, OPEN: 0, CLOSE: 0, ACK: 0 });
  const [alarmText, setAlarmText] = useState([]);
  const [trendState, setTrendState] = useState({ title: "", data: [] });
  const [complianceState, setComplianceState] = useState({ title: "", details: { alertComp: 0, moComp: 0, noComp: 0 } });
  const [modalSection, setModalSection] = useState(null);
  const [returnValveHistory, setReturnValveHistory] = useState({ timestamps: [], st1: [], st2: [] });
  const [errorMessage, setErrorMessage] = useState("");

  const load = async () => {
    try {
      const [overviewData, liveData, alarmCountData, alarmTextData] = await Promise.all([
        getMouldCoolingOverview(),
        getMouldCoolingLiveData(),
        getMouldCoolingAlarmCount(),
        getMouldCoolingAlarmText(),
      ]);
      setErrorMessage("");
      setOverview(overviewData);
      setLive(liveData);
      setAlarmCount(alarmCountData);
      setAlarmText(alarmTextData);
      const nowLabel = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const flowDiff1 = parseNullableNumber(liveData.flowDiff1);
      const flowDiff2 = parseNullableNumber(liveData.flowDiff2);
      setReturnValveHistory((prev) => ({
        timestamps: [...prev.timestamps, nowLabel].slice(-HISTORY_LIMIT),
        st1: [...prev.st1, Number.isFinite(flowDiff1) ? flowDiff1 : nextSimulatedValue(prev.st1.at(-1), RETURN_VALVE_DUMMY_FLOW_DIFF.st1)].slice(-HISTORY_LIMIT),
        st2: [...prev.st2, Number.isFinite(flowDiff2) ? flowDiff2 : nextSimulatedValue(prev.st2.at(-1), RETURN_VALVE_DUMMY_FLOW_DIFF.st2)].slice(-HISTORY_LIMIT),
      }));
    } catch (error) {
      console.error("MouldCooling load failed:", error);
      setErrorMessage("Live API refresh failed. Retrying...");
    }
  };

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await load();
    };
    run();
    const timer = setInterval(run, REFRESH_INTERVAL);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const openTrend = async (title, key) => {
    try {
      const data = await getMouldCoolingTrend(key);
      setTrendState({ title, data });
      setErrorMessage("");
    } catch (error) {
      console.error("MouldCooling trend load failed:", error);
      setErrorMessage("Unable to load trend data right now.");
    }
  };

  const openCompliance = async (title) => {
    try {
      const details = await getMouldCoolingCompliance(title);
      setComplianceState({ title, details });
      setErrorMessage("");
    } catch (error) {
      console.error("MouldCooling compliance load failed:", error);
      setErrorMessage("Unable to load compliance data right now.");
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
      legend: {
        top: 30,
        textStyle: { color: chartMutedText },
      },
    };

    const configs = {
      processMimic: {
        title: "Process Mimic",
        subtitle: "Zone and machine cooling overview",
        option: {
          ...baseModal,
          tooltip: { ...baseModal.tooltip, trigger: "item" },
          dataZoom: [],
          xAxis: {
            type: "category",
            data: ["Zone A", "Zone B", "Zone C", "Zone D", "Heat Exchanger", "Machine-1", "Machine-2"],
            axisLabel: { color: chartMutedText, interval: 0, rotate: 10 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Opening %",
            min: 0,
            max: 100,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Opening",
              type: "bar",
              data: [
                live.zoneA ?? 0,
                live.zoneB ?? 0,
                live.zoneC ?? 0,
                live.zoneD ?? 0,
                live.heatExchanger ?? 0,
                live.machineCooling1 ?? 0,
                live.machineCooling2 ?? 0,
              ],
              itemStyle: {
                color: "#38bdf8",
                borderRadius: [10, 10, 0, 0],
              },
              label: { show: true, position: "top", formatter: "{c}%" },
            },
          ],
        },
      },
      lineOpenings: {
        title: "Line Openings",
        subtitle: "All line opening percentages",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: (live.lineOpening ?? []).map((item) => item.label),
            axisLabel: { color: chartMutedText, interval: 0, rotate: 12 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Opening %",
            min: 0,
            max: 100,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Opening",
              type: "line",
              smooth: true,
              data: (live.lineOpening ?? []).map((item) => Number(item.value ?? 0)),
              lineStyle: { width: 4, color: "#4f46e5" },
              itemStyle: { color: "#ffffff", borderColor: "#4f46e5", borderWidth: 2 },
              areaStyle: { color: "rgba(79, 70, 229, 0.12)" },
            },
          ],
        },
      },
      flowLimits: {
        title: "Flow Limits",
        subtitle: "Actual vs LSL and USL comparison",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: (live.flowLimits ?? []).map((item) => item.label),
            axisLabel: { color: chartMutedText, interval: 0, rotate: 10 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "m3/h",
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            { name: "LSL", type: "bar", data: (live.flowLimits ?? []).map((item) => Number(item.lsl ?? 0)), itemStyle: { color: "#0ea5e9", borderRadius: [8, 8, 0, 0] } },
            { name: "USL", type: "bar", data: (live.flowLimits ?? []).map((item) => Number(item.usl ?? 0)), itemStyle: { color: "#f97316", borderRadius: [8, 8, 0, 0] } },
            { name: "Actual", type: "line", smooth: true, data: (live.flowLimits ?? []).map((item) => Number(item.actual ?? 0)), lineStyle: { width: 4, color: "#22c55e" }, itemStyle: { color: "#22c55e" } },
          ],
        },
      },
      returnValveRealtime: {
        title: "Return Line Valve Realtime",
        subtitle: "Flow Diff(P-O/P) Realtime Trend",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: returnValveHistory.timestamps,
            axisLabel: { color: chartMutedText, interval: 0, rotate: 20 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Flow Diff",
            min: (value) => Number((value.min - Math.max(Math.abs(value.min * 0.12), 0.2)).toFixed(2)),
            max: (value) => Number((value.max + Math.max(Math.abs(value.max * 0.12), 0.2)).toFixed(2)),
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "ST#1",
              type: "line",
              smooth: true,
              data: returnValveHistory.st1,
              symbol: "circle",
              symbolSize: 8,
              lineStyle: { width: 3, color: "#2563eb" },
              itemStyle: { color: "#60a5fa" },
              areaStyle: { color: "rgba(37, 99, 235, 0.14)" },
            },
            {
              name: "ST#2",
              type: "line",
              smooth: true,
              data: returnValveHistory.st2,
              symbol: "circle",
              symbolSize: 8,
              lineStyle: { width: 3, color: "#22c55e" },
              itemStyle: { color: "#4ade80" },
              areaStyle: { color: "rgba(34, 197, 94, 0.12)" },
            },
          ],
        },
      },
      returnValveRealtimeSt1: {
        title: "Return Line Valve Realtime - ST#1",
        subtitle: "Flow Diff(P-O/P) Realtime Trend",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: returnValveHistory.timestamps,
            axisLabel: { color: chartMutedText, interval: 0, rotate: 20 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Flow Diff",
            min: (value) => Number((value.min - Math.max(Math.abs(value.min * 0.12), 0.2)).toFixed(2)),
            max: (value) => Number((value.max + Math.max(Math.abs(value.max * 0.12), 0.2)).toFixed(2)),
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "ST#1",
              type: "line",
              smooth: true,
              data: returnValveHistory.st1,
              symbol: "circle",
              symbolSize: 8,
              lineStyle: { width: 3, color: "#2563eb" },
              itemStyle: { color: "#60a5fa" },
              areaStyle: { color: "rgba(37, 99, 235, 0.14)" },
            },
          ],
        },
      },
      returnValveRealtimeSt2: {
        title: "Return Line Valve Realtime - ST#2",
        subtitle: "Flow Diff(P-O/P) Realtime Trend",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: returnValveHistory.timestamps,
            axisLabel: { color: chartMutedText, interval: 0, rotate: 20 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Flow Diff",
            min: (value) => Number((value.min - Math.max(Math.abs(value.min * 0.12), 0.2)).toFixed(2)),
            max: (value) => Number((value.max + Math.max(Math.abs(value.max * 0.12), 0.2)).toFixed(2)),
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "ST#2",
              type: "line",
              smooth: true,
              data: returnValveHistory.st2,
              symbol: "circle",
              symbolSize: 8,
              lineStyle: { width: 3, color: "#22c55e" },
              itemStyle: { color: "#4ade80" },
              areaStyle: { color: "rgba(34, 197, 94, 0.12)" },
            },
          ],
        },
      },
      shutOffValveOpenings: {
        title: "Shut Off Valve Openings",
        subtitle: "Valve-wise opening % (Realtime)",
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: {
            type: "category",
            data: ["YW03", "YW04", "YW07", "YW37", "YW06", "YW35"],
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Opening %",
            min: 0,
            max: 100,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Opening",
              type: "bar",
              data: ["yw03", "yw04", "yw07", "yw37", "yw06", "yw35"].map((code) => {
                const match = (live.lineOpening ?? []).find((item) => String(item.label ?? "").toLowerCase() === code);
                const fallback = { yw03: 66.5, yw04: 68.9, yw07: 70.3, yw37: 72.1, yw06: 75.4, yw35: 73.6 };
                return parseNullableNumber(match?.value) ?? fallback[code] ?? 0;
              }),
              itemStyle: { color: "#3b82f6", borderRadius: [8, 8, 0, 0] },
              label: { show: true, position: "top", formatter: "{c}%" },
            },
          ],
        },
      },
      mouldStrandStatus: {
        title: "Mould Strand Model Status",
        subtitle: "Leakage detection level overview (Realtime)",
        option: {
          ...baseModal,
          dataZoom: [],
          legend: {
            top: 30,
            textStyle: { color: chartMutedText },
            data: ["Normal (>=70%)", "Alert (<70%)"],
          },
          xAxis: {
            type: "category",
            data: ["Strand #1", "Strand #2"],
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Mould Level %",
            min: 0,
            max: 100,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Normal (>=70%)",
              type: "bar",
              stack: "status",
              data: [parseNullableNumber(live.mould1Level) ?? 78.4, parseNullableNumber(live.mould2Level) ?? 74.2].map((v) => (v >= 70 ? v : 0)),
              itemStyle: {
                color: "#22c55e",
                borderRadius: [8, 8, 0, 0],
              },
              label: { show: true, position: "top", formatter: (params) => (params.value > 0 ? `${params.value}%` : "") },
            },
            {
              name: "Alert (<70%)",
              type: "bar",
              stack: "status",
              data: [parseNullableNumber(live.mould1Level) ?? 78.4, parseNullableNumber(live.mould2Level) ?? 74.2].map((v) => (v < 70 ? v : 0)),
              itemStyle: { color: "#ef4444", borderRadius: [8, 8, 0, 0] },
              label: { show: true, position: "top", formatter: (params) => (params.value > 0 ? `${params.value}%` : "") },
            },
          ],
        },
      },
      strandHealth: {
        title: "Strand CV Health",
        subtitle: "Strand cooling subsystem health comparison",
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: {
            type: "category",
            data: ["Strand 1", "Strand 2"],
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Health %",
            min: 0,
            max: 100,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Health",
              type: "bar",
              data: [overview.strand1Cv ?? 0, overview.strand2Cv ?? 0],
              itemStyle: {
                color: (params) => (params.data >= 90 ? "#22c55e" : params.data >= 75 ? "#f59e0b" : "#ef4444"),
                borderRadius: [10, 10, 0, 0],
              },
              label: { show: true, position: "top", formatter: "{c}%" },
            },
          ],
        },
      },
      openAlerts: {
        title: "Open Alerts by Section",
        subtitle: "Active alert distribution",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: (overview.openAlerts ?? []).map((item) => item.label),
            axisLabel: { color: chartMutedText, interval: 0, rotate: 12 },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [{ name: "Alerts", type: "bar", data: (overview.openAlerts ?? []).map((item) => item.value), itemStyle: { color: "#f97316", borderRadius: [10, 10, 0, 0] } }],
        },
      },
      sapMo: {
        title: "SAP PM MO Compliance",
        subtitle: "Section wise compliance percentage",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: (overview.sapMo ?? []).map((item) => item.label),
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
          series: [{ name: "Compliance", type: "line", smooth: true, data: (overview.sapMo ?? []).map((item) => item.value), lineStyle: { width: 4, color: "#22c55e" }, areaStyle: { color: "rgba(34, 197, 94, 0.12)" } }],
        },
      },
    };

    return configs[modalSection] ?? null;
  }, [isLight, live, modalSection, overview, returnValveHistory]);

  const ui = isLight
    ? {
        bgGlowOne: { background: "rgba(14, 165, 233, 0.12)" },
        bgGlowTwo: { background: "rgba(249, 115, 22, 0.08)" },
        eyebrow: { color: "#0f5c96" },
        title: { color: "#11243b", textShadow: "0 1px 0 rgba(255,255,255,0.72)" },
        healthBadge: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.94))",
          color: "#10233c",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow: "0 12px 30px rgba(148, 163, 184, 0.16)",
        },
        filterLabel: { color: "#1d4f7f" },
        input: {
          background: "rgba(255, 255, 255, 0.78)",
          color: "#10233c",
          border: "1px solid rgba(59, 130, 246, 0.14)",
          boxShadow: "0 10px 22px rgba(148, 163, 184, 0.12)",
        },
        statCard: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(240,246,255,0.9))",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          color: "#10233c",
          boxShadow: "0 16px 34px rgba(148, 163, 184, 0.16)",
        },
        statLabel: { color: "#1d4f7f" },
        statValue: { color: "#0f172a" },
        panel: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow: "0 14px 34px rgba(148, 163, 184, 0.18)",
        },
        panelTitle: { color: "#10233c" },
        schematicPanel: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow: "0 24px 60px rgba(148, 163, 184, 0.2)",
        },
        schematicFrame: {
          background:
            "linear-gradient(160deg, rgba(238,244,252,0.96), rgba(226,236,248,0.9)), radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 42%)",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          boxShadow: "0 20px 50px rgba(148, 163, 184, 0.18)",
        },
        centralNode: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(235,243,252,0.94))",
          border: "1px solid rgba(96, 165, 250, 0.18)",
          boxShadow: "0 16px 34px rgba(148, 163, 184, 0.14)",
        },
        nodeTitle: { color: "#0f172a" },
        nodeText: { color: "#516b84" },
        flowBar: {
          background: "linear-gradient(90deg, #15b8e6 0%, #22c55e 48%, #f59e0b 100%)",
          boxShadow: "0 0 28px rgba(34, 197, 94, 0.22), 0 0 18px rgba(14, 165, 233, 0.18)",
        },
        zoneCard: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(238,244,252,0.92))",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          color: "#18324d",
          boxShadow: "0 12px 28px rgba(148, 163, 184, 0.14)",
        },
        limitCard: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(238,244,252,0.92))",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          color: "#18324d",
          boxShadow: "0 12px 28px rgba(148, 163, 184, 0.14)",
        },
        limitTitle: { color: "#1d4f7f" },
        limitRow: { color: "#38536d" },
        limitValueButton: {
          background: "linear-gradient(135deg, #1d4ed8, #38bdf8)",
          color: "#ffffff",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          boxShadow: "0 12px 24px rgba(37, 99, 235, 0.18)",
        },
        gaugeCard: {
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(148, 163, 184, 0.14)",
          color: "#10233c",
          boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)",
        },
        gaugeLabel: { color: "#516b84" },
        alarmCard: {
          background: "rgba(254, 226, 226, 0.72)",
          border: "1px solid rgba(248, 113, 113, 0.18)",
          color: "#9f1239",
        },
        summaryCard: {
          background: "rgba(255,255,255,0.74)",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)",
        },
        summaryValue: { color: "#10233c" },
        summaryLabel: { color: "#516b84" },
        chartLabel: { color: "#38536d" },
        chartTrack: { background: "rgba(148, 163, 184, 0.16)" },
        chartValue: { color: "#10233c" },
        returnValveSectionTitle: { color: "#10233c", textShadow: "none" },
        returnValveOpenGraph: {
          border: "none",
          background: "transparent",
          color: "#2563eb",
          boxShadow: "none",
        },
        returnValveCard: {
          border: "1px solid rgba(148, 163, 184, 0.16)",
          background: "rgba(255,255,255,0.74)",
          boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)",
        },
        returnValveHeaderTop: {
          background: "transparent",
          color: "rgba(81, 107, 132, 0.88)",
          textShadow: "none",
        },
        returnValveFlowDiff: {
          color: "rgba(15, 35, 60, 0.92)",
          background: "transparent",
          borderTop: "1px solid rgba(148,163,184,0.24)",
          borderBottom: "1px solid rgba(148,163,184,0.24)",
        },
        returnValveTitle: {
          color: "rgba(15, 35, 60, 0.96)",
          background: "transparent",
          borderBottom: "1px solid rgba(148,163,184,0.24)",
          textShadow: "none",
        },
        returnValveMiniAction: {
          border: "none",
          background: "transparent",
          color: "#2563eb",
          boxShadow: "none",
        },
        returnValveTh: {
          border: "1px solid rgba(148,163,184,0.24)",
          color: "rgba(81, 107, 132, 0.9)",
          background: "transparent",
        },
        returnValveTdLabel: {
          border: "1px solid rgba(148,163,184,0.24)",
          color: "rgba(15, 35, 60, 0.95)",
          background: "transparent",
        },
        returnValveTd: {
          border: "1px solid rgba(148,163,184,0.24)",
          color: "rgba(15, 35, 60, 0.9)",
          background: "transparent",
        },
        sovCard: { background: "rgba(255,255,255,0.74)", border: "1px solid rgba(148, 163, 184, 0.16)", boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)" },
        sovOpenGraph: {
          border: "none",
          background: "transparent",
          color: "#2563eb",
          boxShadow: "none",
        },
        sovTitle: { color: "#10233c", background: "transparent" },
        sovHeader: { background: "transparent", padding: "0 0 10px 0" },
        sovGrid: { borderColor: "rgba(148,163,184,0.26)" },
        sovLabel: { color: "#38536d", background: "transparent", borderColor: "rgba(148,163,184,0.24)" },
        sovValue: { color: "#10233c", background: "transparent", borderColor: "rgba(148,163,184,0.24)" },
        strandStatusCard: { background: "rgba(255,255,255,0.74)", border: "1px solid rgba(148, 163, 184, 0.16)", boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)" },
        strandStatusTitle: { color: "#38536d", background: "transparent" },
        strandStatusTrigger: {
          background: "rgba(255,255,255,0.74)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
        },
        strandStatusTriggerTitle: { color: "#10233c" },
        strandStatusTriggerText: { color: "#2563eb" },
        strandStatusRow: { borderColor: "rgba(148,163,184,0.24)" },
        strandStatusLabel: { color: "#38536d", background: "transparent", borderColor: "rgba(148,163,184,0.24)" },
        strandStatusValue: { color: "#10233c", background: "transparent" },
      }
    : {};

  return (
    <div style={{ ...styles.page, ...theme.pageStyle }}>
      <div style={{ ...styles.bgGlowOne, ...ui.bgGlowOne }} />
      <div style={{ ...styles.bgGlowTwo, ...ui.bgGlowTwo }} />
      <div style={styles.container}>
        <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />
        <div>
        <header style={styles.header}>
          <div>
            <div style={{ ...styles.eyebrow, ...ui.eyebrow }}>DAMS / Caster / Mould Cooling</div>
            <h1 style={{ ...styles.title, ...ui.title }}>Mould Cooling</h1>
          </div>
          <div style={{ ...styles.healthBadge, ...ui.healthBadge }}>
            Equipment Health: <AnimatedNumber value={overview.equipmentHealth ?? 0} decimals={1} suffix="%" />
          </div>
        </header>
        {errorMessage ? <div style={{ color: "#ef4444", fontWeight: 600, marginBottom: 10 }}>{errorMessage}</div> : null}

        <section style={styles.filterBar}>
          <label style={{ ...styles.filterLabel, ...ui.filterLabel }}>
            From
            <input type="datetime-local" value={range.from} onChange={(e) => setRange((prev) => ({ ...prev, from: e.target.value }))} style={{ ...styles.input, ...ui.input }} />
          </label>
          <label style={{ ...styles.filterLabel, ...ui.filterLabel }}>
            To
            <input type="datetime-local" value={range.to} onChange={(e) => setRange((prev) => ({ ...prev, to: e.target.value }))} style={{ ...styles.input, ...ui.input }} />
          </label>
          <button type="button" onClick={load} style={styles.loadButton}>
            Load
          </button>
        </section>

        <section style={styles.topGrid}>
          <StatCard label="Strand-1 Speed" value={<AnimatedNumber value={live.strand1Speed ?? 0} decimals={2} suffix=" m/min" />} ui={ui} />
          <StatCard label="Strand-2 Speed" value={<AnimatedNumber value={live.strand2Speed ?? 0} decimals={2} suffix=" m/min" />} ui={ui} />
          <StatCard label="Tundish-1 Weight" value={<AnimatedNumber value={live.tundish1Weight ?? 0} decimals={1} suffix=" T" />} ui={ui} />
          <StatCard label="Tundish-2 Weight" value={<AnimatedNumber value={live.tundish2Weight ?? 0} decimals={1} suffix=" T" />} ui={ui} />
          <StatCard label="Ladle-1 Weight" value={<AnimatedNumber value={live.ladle1Weight ?? 0} decimals={1} suffix=" T" />} ui={ui} />
          <StatCard label="Ladle-2 Weight" value={<AnimatedNumber value={live.ladle2Weight ?? 0} decimals={1} suffix=" T" />} ui={ui} />
          <StatCard label="Mould-1 Level" value={<AnimatedNumber value={live.mould1Level ?? 0} decimals={1} suffix="%" />} onClick={() => openTrend("Mould-1 Level", "mould1Level")} ui={ui} />
          <StatCard label="Mould-2 Level" value={<AnimatedNumber value={live.mould2Level ?? 0} decimals={1} suffix="%" />} onClick={() => openTrend("Mould-2 Level", "mould2Level")} ui={ui} />
        </section>

        <section style={styles.mainGrid}>
          <div style={styles.processPanel}>
            <div style={{ ...styles.schematicPanel, ...ui.schematicPanel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("processMimic")}>
                <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Process Mimic</span>
                <span style={styles.sectionTriggerText}>Open Graph</span>
              </button>
              <div style={{ ...styles.schematicFrame, ...ui.schematicFrame }} onClick={() => setModalSection("processMimic")}>
                <div style={{ ...styles.centralNode, ...ui.centralNode }}>
                  <div style={{ ...styles.nodeTitle, ...ui.nodeTitle }}>Mould Cooling Circuit</div>
                  <div style={styles.nodeImageFrame}>
                    <img src={mouldCoolingCircuitImage} alt="Mould cooling circuit" style={styles.nodeImage} />
                  </div>
                  <div style={{ ...styles.nodeText, ...ui.nodeText }}>Heat exchanger, machine loop, and line-opening overview for mould cooling</div>
                </div>
                <div style={{ ...styles.flowBar, ...ui.flowBar }} />
                <div style={styles.zoneGrid}>
                  <div style={{ ...styles.zoneCard, ...ui.zoneCard }}>Zone A <AnimatedNumber value={live.zoneA ?? 0} decimals={1} suffix="%" /></div>
                  <div style={{ ...styles.zoneCard, ...ui.zoneCard }}>Zone B <AnimatedNumber value={live.zoneB ?? 0} decimals={1} suffix="%" /></div>
                  <div style={{ ...styles.zoneCard, ...ui.zoneCard }}>Zone C <AnimatedNumber value={live.zoneC ?? 0} decimals={1} suffix="%" /></div>
                  <div style={{ ...styles.zoneCard, ...ui.zoneCard }}>Zone D <AnimatedNumber value={live.zoneD ?? 0} decimals={1} suffix="%" /></div>
                  <div style={{ ...styles.zoneCard, ...ui.zoneCard }}>Heat Exchanger <AnimatedNumber value={live.heatExchanger ?? 0} decimals={1} suffix="%" /></div>
                  <div style={{ ...styles.zoneCard, ...ui.zoneCard }}>Machine-1 <AnimatedNumber value={live.machineCooling1 ?? 0} decimals={1} suffix="%" /></div>
                  <div style={{ ...styles.zoneCard, ...ui.zoneCard }}>Machine-2 <AnimatedNumber value={live.machineCooling2 ?? 0} decimals={1} suffix="%" /></div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.panel, ...ui.panel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("lineOpenings")}>
                <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Line Openings</span>
                <span style={styles.sectionTriggerText}>Open Graph</span>
              </button>
              <div style={styles.lineGrid}>
                {live.lineOpening?.map((item) => (
                  <StatCard key={item.label} label={item.label} value={formatValue(item.value, "%")} ui={ui} />
                ))}
              </div>
            </div>

            <div style={{ ...styles.panel, ...ui.panel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("flowLimits")}>
                <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Flow Limits</span>
                <span style={styles.sectionTriggerText}>Open Graph</span>
              </button>
              <div style={styles.limitGrid}>
                {live.flowLimits?.map((item) => (
                  <div key={item.label} style={{ ...styles.limitCard, ...ui.limitCard }}>
                    <div style={{ ...styles.limitTitle, ...ui.limitTitle }}>{item.label}</div>
                    <div style={{ ...styles.limitRow, ...ui.limitRow }}>LSL {item.lsl.toFixed(2)} m3/h</div>
                    <div style={{ ...styles.limitRow, ...ui.limitRow }}>USL {item.usl.toFixed(2)} m3/h</div>
                    <button type="button" style={{ ...styles.limitValueButton, ...ui.limitValueButton }} onClick={() => openTrend(item.label, item.label === "Front Face 1" ? "frontalFlow1" : item.label === "Thin Face 1" ? "thinFlow1" : item.label === "Front Face 2" ? "frontalFlow2" : "thinFlow2")}>
                      Actual {item.actual.toFixed(2)} m3/h
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <ShutOffValvePanel live={live} ui={ui} onOpenGraph={() => setModalSection("shutOffValveOpenings")} />
            <MouldStrandStatusPanel live={live} ui={ui} onOpenGraph={() => setModalSection("mouldStrandStatus")} />
          </div>

          <aside style={styles.sidebar}>
            <div style={{ ...styles.panel, ...ui.panel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("strandHealth")}>
                <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Strand CV Health</span>
                <span style={styles.sectionTriggerText}>Open Graph</span>
              </button>
              <div style={styles.gaugeGrid}>
                <GaugeCard label="Mould Cooling Strand1" value={overview.strand1Cv ?? 0} onClick={() => openCompliance("MOULD COOLING STRAND1")} ui={ui} />
                <GaugeCard label="Mould Cooling Strand2" value={overview.strand2Cv ?? 0} onClick={() => openCompliance("MOULD COOLING STRAND2")} ui={ui} />
              </div>
            </div>

            <div style={{ ...styles.panel, ...ui.panel }}>
              <div style={{ ...styles.panelTitle, ...ui.panelTitle }}>Recent Alarm</div>
              <div style={styles.alarmStack}>
                {alarmText.map((item) => (
                  <div key={item.AlarmText} style={{ ...styles.alarmCard, ...ui.alarmCard }}>
                    {item.AlarmText}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.summaryGrid}>
              <SummaryCard label="Total Alerts" value={alarmCount.TOTAL} accent="#22c55e" ui={ui} />
              <SummaryCard label="Open Alerts" value={alarmCount.OPEN} accent="#38bdf8" ui={ui} />
              <SummaryCard label="Closed Alerts" value={alarmCount.CLOSE} accent="#f59e0b" ui={ui} />
              <SummaryCard label="Ack Alert" value={alarmCount.ACK} accent="#e879f9" ui={ui} />
            </div>

            <div onClick={() => setModalSection("openAlerts")} style={styles.clickablePanel}>
              <BarChart title="Open Alerts by Section" items={overview.openAlerts ?? []} color="#f97316" ui={ui} />
            </div>
            <div onClick={() => setModalSection("sapMo")} style={styles.clickablePanel}>
              <BarChart title="SAP PM MO Compliance" items={overview.sapMo ?? []} suffix="%" color="#22c55e" ui={ui} />
            </div>
            <ReturnLineValvePanel
              live={live}
              ui={ui}
              onOpenGraph={(key) => {
                if (key === "st1") {
                  setModalSection("returnValveRealtimeSt1");
                  return;
                }
                if (key === "st2") {
                  setModalSection("returnValveRealtimeSt2");
                  return;
                }
                setModalSection("returnValveRealtime");
              }}
            />
          </aside>
        </section>
        </div>
      </div>

      <SectionModal
        isOpen={Boolean(modalConfig?.option)}
        title={modalConfig?.title}
        subtitle={modalConfig?.subtitle}
        option={modalConfig?.option}
        onClose={() => setModalSection(null)}
      />
      <TrendModal title={trendState.title} data={trendState.data} onClose={() => setTrendState({ title: "", data: [] })} />
      <ComplianceModal
        title={complianceState.title}
        details={complianceState.details}
        onClose={() => setComplianceState({ title: "", details: { alertComp: 0, moComp: 0, noComp: 0 } })}
      />
    </div>
  );
}

function SectionModal({ isOpen, title, subtitle, option, onClose }) {
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
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(event) => event.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.sectionModalTitle}>{title}</div>
            <div style={styles.modalSubtitle}>{subtitle}</div>
          </div>
          <button type="button" style={styles.modalCloseButton} onClick={onClose}>
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
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top left, rgba(14, 165, 233, 0.14), transparent 28%), linear-gradient(150deg, #071019 0%, #0f172a 48%, #020617 100%)",
    color: "#e2e8f0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  bgGlowOne: { position: "absolute", width: 340, height: 340, borderRadius: "50%", background: "rgba(56, 189, 248, 0.08)", filter: "blur(10px)", top: -120, left: -110 },
  bgGlowTwo: { position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(34, 197, 94, 0.07)", filter: "blur(10px)", bottom: -100, right: -100 },
  container: { position: "relative", zIndex: 1, maxWidth: 1600, margin: "0 auto", padding: 24 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginBottom: 26 },
  eyebrow: { color: "#7dd3fc", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 },
  title: { margin: 0, fontSize: "clamp(2rem, 3vw, 3rem)", lineHeight: 1.05, fontWeight: 650 },
  healthBadge: { padding: "14px 18px", borderRadius: 16, background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.18)", fontWeight: 700, alignSelf: "end" },
  filterBar: { display: "flex", gap: 14, alignItems: "end", flexWrap: "wrap", marginBottom: 24 },
  filterLabel: { display: "grid", gap: 8, fontSize: 12, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.08em" },
  input: { padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(148, 163, 184, 0.18)", background: "rgba(15, 23, 42, 0.72)", color: "#f8fafc", transition: "all 240ms ease" },
  loadButton: { padding: "12px 18px", borderRadius: 14, border: "1px solid rgba(56, 189, 248, 0.24)", background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "#f8fafc", cursor: "pointer", fontWeight: 700, transition: "all 220ms ease" },
  topGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 18, marginBottom: 24 },
  statCard: { border: "1px solid rgba(148, 163, 184, 0.18)", background: "rgba(15, 23, 42, 0.72)", padding: "14px 16px", borderRadius: 18, display: "grid", gap: 10, textAlign: "left", color: "#e2e8f0", cursor: "pointer", boxShadow: "0 16px 34px rgba(2, 6, 23, 0.22)", transition: "all 260ms ease" },
  statLabel: { fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd" },
  statValue: { fontSize: 23, fontWeight: 700, color: "#f8fafc" },
  mainGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.75fr) minmax(360px, 0.95fr)", gap: 20, marginBottom: 24 },
  processPanel: { display: "grid", gap: 16 },
  panel: { borderRadius: 22, padding: 18, background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.18)", boxShadow: "0 14px 34px rgba(2, 6, 23, 0.22)", transition: "all 280ms ease" },
  panelTitle: { fontSize: 16, fontWeight: 700, marginBottom: 14, color: "#f8fafc" },
  sectionTrigger: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left", marginBottom: 14 },
  sectionTriggerText: { fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em" },
  schematicPanel: { borderRadius: 22, padding: 18, background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.18)", transition: "all 280ms ease" },
  schematicFrame: {
    minHeight: 520,
    borderRadius: 24,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background:
      "linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.7)), radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 40%)",
    boxShadow: "0 24px 60px rgba(2, 6, 23, 0.35)",
    cursor: "pointer",
    transition: "all 300ms ease",
  },
  centralNode: { margin: "0 auto", width: "74%", minHeight: 220, borderRadius: 26, display: "grid", placeItems: "center", gap: 14, textAlign: "center", background: "linear-gradient(145deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.96))", border: "1px solid rgba(125, 211, 252, 0.18)", padding: 24 },
  nodeImageFrame: {
    width: "100%",
    maxWidth: 620,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(255,255,255,0.92)",
  },
  nodeImage: {
    width: "100%",
    height: "auto",
    maxHeight: 300,
    objectFit: "contain",
    display: "block",
  },
  nodeTitle: { fontSize: 28, fontWeight: 700, color: "#f8fafc" },
  nodeText: { color: "#94a3b8", fontSize: 14 },
  flowBar: { marginTop: 28, height: 10, borderRadius: 999, background: "linear-gradient(90deg, #06b6d4, #22c55e, #f59e0b)", boxShadow: "0 0 24px rgba(34, 197, 94, 0.28)", transition: "all 240ms ease" },
  zoneGrid: { marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 },
  zoneCard: { padding: "14px 16px", borderRadius: 16, background: "rgba(15, 23, 42, 0.74)", border: "1px solid rgba(148, 163, 184, 0.16)", fontWeight: 600, transition: "all 240ms ease" },
  lineGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 },
  limitGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 },
  returnValveWrapper: { display: "grid", gap: 12 },
  returnValveSectionsGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  returnValveHeaderRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 2 },
  returnValveSectionTitle: { color: "#e2e8f0", fontWeight: 800, fontSize: 18, letterSpacing: "0.01em", textShadow: "none" },
  returnValveOpenGraph: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    borderRadius: 0,
    padding: 0,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer",
    boxShadow: "none",
  },
  returnValveCard: {
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15,23,42,0.74)",
    boxShadow: "0 10px 24px rgba(2,6,23,0.22)",
    transition: "all 240ms ease",
  },
  returnValveHeaderTop: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
    background: "transparent",
    color: "rgba(81, 107, 132, 0.88)",
    fontWeight: 600,
    fontSize: 10.5,
    padding: "6px 10px",
    textAlign: "center",
    textShadow: "none",
  },
  returnValveFlowDiff: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#cbd5e1",
    fontWeight: 700,
    background: "transparent",
    borderTop: "1px solid rgba(148,163,184,0.24)",
    borderBottom: "1px solid rgba(148,163,184,0.24)",
    padding: "8px 10px",
  },
  returnValveTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    fontWeight: 800,
    fontSize: 15,
    color: "#e2e8f0",
    background: "transparent",
    padding: "8px 10px",
    borderBottom: "1px solid rgba(148,163,184,0.24)",
    textShadow: "none",
  },
  returnValveMiniAction: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    borderRadius: 0,
    padding: 0,
    fontSize: 11.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer",
    boxShadow: "none",
  },
  returnValveTable: { width: "100%", borderCollapse: "collapse" },
  returnValveTh: {
    border: "1px solid rgba(148,163,184,0.24)",
    color: "rgba(81, 107, 132, 0.9)",
    padding: "6px 8px",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "center",
    background: "transparent",
  },
  returnValveTdLabel: {
    border: "1px solid rgba(148,163,184,0.24)",
    color: "#e2e8f0",
    padding: "6px 8px",
    textAlign: "left",
    fontWeight: 700,
    background: "transparent",
  },
  returnValveTd: {
    border: "1px solid rgba(148,163,184,0.24)",
    color: "#cbd5e1",
    padding: "6px 8px",
    textAlign: "center",
    fontWeight: 600,
    background: "transparent",
  },
  sovCard: {
    borderRadius: 22,
    overflowX: "auto",
    overflowY: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(15,23,42,0.82)",
    boxShadow: "0 10px 24px rgba(2,6,23,0.28)",
    padding: 14,
    transition: "all 240ms ease",
  },
  sovHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "0 0 10px 0",
    background: "transparent",
  },
  sovTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: "#f8fafc",
  },
  sovOpenGraph: {
    border: "none",
    background: "transparent",
    color: "#60a5fa",
    borderRadius: 0,
    padding: 0,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer",
    boxShadow: "none",
  },
  sovGrid: {
    display: "grid",
    minWidth: 860,
    gridTemplateColumns: "2.1fr 0.8fr 0.8fr 2.1fr 0.8fr 0.8fr 2.1fr 0.8fr 0.8fr",
    borderTop: "1px solid rgba(15,23,42,0.35)",
  },
  sovLabel: {
    padding: "6px 8px",
    border: "1px solid rgba(148,163,184,0.26)",
    background: "transparent",
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "center",
  },
  sovValue: {
    padding: "6px 8px",
    border: "1px solid rgba(148,163,184,0.26)",
    background: "transparent",
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
  },
  strandStatusWrap: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, alignContent: "start" },
  strandStatusTrigger: {
    gridColumn: "1 / -1",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 12,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.72)",
    padding: "10px 12px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 220ms ease",
  },
  strandStatusTriggerTitle: { color: "#e2e8f0", fontSize: 14, fontWeight: 800 },
  strandStatusTriggerText: { fontSize: 12, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.05em" },
  strandStatusCard: {
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(15,23,42,0.82)",
    boxShadow: "0 10px 24px rgba(2,6,23,0.28)",
    padding: 12,
    transition: "all 240ms ease",
  },
  strandStatusTitle: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.02em",
    padding: "0 0 8px 0",
    color: "#cbd5e1",
    background: "transparent",
  },
  strandStatusRow: {
    display: "grid",
    gridTemplateColumns: "1.8fr 1fr",
    borderTop: "1px solid rgba(148,163,184,0.26)",
  },
  strandStatusLabel: {
    padding: "6px 8px",
    borderRight: "1px solid rgba(148,163,184,0.26)",
    background: "transparent",
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "center",
  },
  strandStatusValue: {
    padding: "6px 8px",
    background: "transparent",
    color: "#22c55e",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
  },
  limitCard: { padding: "14px 16px", borderRadius: 16, background: "rgba(15, 23, 42, 0.74)", border: "1px solid rgba(148, 163, 184, 0.16)" },
  limitTitle: { fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7dd3fc", marginBottom: 8 },
  limitRow: { color: "#cbd5e1", marginBottom: 6 },
  limitValueButton: { marginTop: 8, borderRadius: 12, padding: "10px 12px", background: "rgba(14, 165, 233, 0.14)", color: "#bae6fd", border: "1px solid rgba(56, 189, 248, 0.22)", cursor: "pointer" },
  sidebar: { display: "grid", gap: 16, alignContent: "start" },
  gaugeGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
  gaugeCard: { borderRadius: 18, padding: 12, border: "1px solid rgba(148, 163, 184, 0.14)", color: "#e2e8f0", cursor: "pointer", background: "rgba(15, 23, 42, 0.8)", transition: "all 240ms ease" },
  gaugeLabel: { minHeight: 34, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#cbd5e1" },
  gaugeSvg: { width: "100%", height: 72, display: "block" },
  gaugeValue: { fontSize: 22, fontWeight: 700, textAlign: "center" },
  alarmStack: { display: "grid", gap: 10 },
  alarmCard: { padding: "12px 14px", borderRadius: 14, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(248, 113, 113, 0.18)", color: "#fee2e2", transition: "all 220ms ease" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
  summaryCard: { background: "rgba(15, 23, 42, 0.72)", borderRadius: 18, padding: "16px 14px", border: "1px solid rgba(148, 163, 184, 0.18)", transition: "all 240ms ease" },
  summaryValue: { fontSize: 28, fontWeight: 800, color: "#f8fafc" },
  summaryLabel: { marginTop: 4, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#cbd5e1" },
  chartBody: { display: "grid", gap: 12 },
  chartRow: { display: "grid", gridTemplateColumns: "90px minmax(0, 1fr) 48px", gap: 10, alignItems: "center" },
  chartLabel: { color: "#cbd5e1", fontSize: 13 },
  chartTrack: { height: 12, borderRadius: 999, background: "rgba(148, 163, 184, 0.12)", overflow: "hidden" },
  chartBar: { height: "100%", borderRadius: 999, transition: "width 420ms ease" },
  chartValue: { textAlign: "right", color: "#f8fafc", fontWeight: 700 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.42)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24, zIndex: 1200, transition: "background 220ms ease" },
  modal: { width: "100%", maxWidth: 820, background: "linear-gradient(180deg, #0f172a, #020617)", borderRadius: 24, border: "1px solid rgba(148, 163, 184, 0.18)", overflow: "hidden" },
  modalCard: { width: "min(1080px, calc(100vw - 64px))", maxHeight: "calc(100vh - 64px)", overflow: "auto", background: "rgba(255,255,255,0.96)", borderRadius: 28, padding: 24, boxShadow: "0 28px 80px rgba(15, 23, 42, 0.28)", transition: "all 260ms ease" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 },
  modalEyebrow: { color: "#7dd3fc", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },
  modalEyebrowLight: { color: "#516b84", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },
  modalTitle: { fontSize: 24, fontWeight: 700, color: "#f8fafc" },
  sectionModalTitle: { fontSize: 22, fontWeight: 800, color: "#10233c" },
  modalSubtitle: { marginTop: 4, fontSize: 13, color: "#516b84" },
  closeButton: { borderRadius: 12, padding: "10px 14px", background: "rgba(239, 68, 68, 0.14)", color: "#fecaca", border: "1px solid rgba(248, 113, 113, 0.22)", cursor: "pointer" },
  modalCloseButton: { width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(148, 163, 184, 0.24)", background: "#ffffff", color: "#26435f", fontSize: 18, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  modalBody: { padding: 22 },
  modalChart: { width: "100%", height: 420 },
  complianceGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, padding: 22 },
  clickablePanel: { cursor: "pointer" },
};
