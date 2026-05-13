import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ReactECharts from "echarts-for-react";
import {
  getMouldStrand1AlarmCount,
  getMouldStrand1AlarmText,
  getMouldStrand1Compliance,
  getMouldStrand1LiveData,
  getMouldStrand1Overview,
  getMouldStrand1Trend,
} from "../Services/mouldStrand1.mock";
import DamsCasterThemeSwitch from "../Components/DamsCasterThemeSwitch";
import useDamsCasterTheme from "../Components/useDamsCasterTheme";
import AnimatedNumber from "../Components/AnimatedNumber";
import strand1CardMimicImage from "../assets/Images/strand1-card-mimic.jpg";

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

function ValueTable({ title, rows, trendMap, ui = {} }) {
  return (
    <div style={{ ...styles.tablePanel, ...ui.tablePanel }}>
      <div style={{ ...styles.panelTitle, ...ui.panelTitle }}>{title}</div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...ui.th }}>Parameter</th>
              <th style={{ ...styles.th, ...ui.th }}>Value</th>
              <th style={{ ...styles.th, ...ui.th }}>LCL</th>
              <th style={{ ...styles.th, ...ui.th }}>UCL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td style={{ ...styles.td, ...ui.td }}>{row.label}</td>
                <td style={{ ...styles.td, ...ui.td }}>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      trendMap(row.label);
                    }}
                    style={styles.tableButton}
                  >
                    {row.current.toFixed(2)}
                  </button>
                </td>
                <td style={{ ...styles.td, ...ui.td }}>{row.lcl.toFixed(2)}</td>
                <td style={{ ...styles.td, ...ui.td }}>{row.ucl.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrendModal({ title, data, onClose }) {
  if (!title) return null;
  const option = {
    backgroundColor: "transparent",
    animation: true,
    textStyle: { fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", color: "#e2e8f0" },
    title: {
      text: `${title} Trend`,
      left: "center",
      top: 10,
      textStyle: { color: "#10233c", fontSize: 18, fontWeight: 700 },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,0.96)",
      borderColor: "rgba(148, 163, 184, 0.3)",
      textStyle: { color: "#26435f" },
      axisPointer: {
        type: "cross",
        crossStyle: { color: "#94a3b8" },
        label: { backgroundColor: "#1e293b" },
      },
    },
    toolbox: {
      right: 10,
      top: 8,
      showTitle: true,
      tooltip: { show: true, position: "right" },
      iconStyle: { borderColor: "#516b84" },
      emphasis: { iconStyle: { borderColor: "#10233c" } },
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
      axisLabel: { color: "#516b84" },
      axisLine: { lineStyle: { color: "rgba(148, 163, 184, 0.55)" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#516b84" },
      splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.24)" } },
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

export default function MouldStrand1() {
  const theme = useDamsCasterTheme();
  const isLight = theme.isLight;
  const [range, setRange] = useState(initialRange);
  const [overview, setOverview] = useState({});
  const [live, setLive] = useState({ amlcRows: [], hmoRows: [], ramRows: [] });
  const [alarmCount, setAlarmCount] = useState({ TOTAL: 0, OPEN: 0, CLOSE: 0, ACK: 0 });
  const [alarmText, setAlarmText] = useState([]);
  const [trendState, setTrendState] = useState({ title: "", data: [] });
  const [complianceState, setComplianceState] = useState({ title: "", details: { alertComp: 0, moComp: 0, noComp: 0 } });
  const [modalSection, setModalSection] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const load = async () => {
    try {
      const [overviewData, liveData, alarmCountData, alarmTextData] = await Promise.all([
        getMouldStrand1Overview(),
        getMouldStrand1LiveData(),
        getMouldStrand1AlarmCount(),
        getMouldStrand1AlarmText(),
      ]);
      setErrorMessage("");
      setOverview(overviewData);
      setLive(liveData);
      setAlarmCount(alarmCountData);
      setAlarmText(alarmTextData);
    } catch (error) {
      console.error("MouldStrand1 load failed:", error);
      setErrorMessage("Live API refresh failed. Retrying...");
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  const openTrend = async (title, key) => {
    try {
      const data = await getMouldStrand1Trend(key);
      setTrendState({ title, data });
      setErrorMessage("");
    } catch (error) {
      console.error("MouldStrand1 trend load failed:", error);
      setErrorMessage("Unable to load trend data right now.");
    }
  };

  const openCompliance = async (title) => {
    try {
      const details = await getMouldStrand1Compliance(title);
      setComplianceState({ title, details });
      setErrorMessage("");
    } catch (error) {
      console.error("MouldStrand1 compliance load failed:", error);
      setErrorMessage("Unable to load compliance data right now.");
    }
  };

  const trendMap = (label) => {
    const mapping = {
      "Mould Level Deviation": ["Mould Level Deviation", "mouldLevel"],
      "Stopper Position Deviation": ["Stopper Position Deviation", "stopperDeviation"],
      "Stopper Rod Zeroing Value": ["Stopper Rod Zeroing Value", "stopperZeroing"],
      "HMO Cylinders Synchronisation": ["HMO Cylinders Synchronisation", "hmoCylinderSync"],
      "Pressure Chamber A Synchronization": ["Pressure Chamber A Synchronization", "chamberASync"],
      "Pressure Chamber B Synchronization": ["Pressure Chamber B Synchronization", "chamberBSync"],
      "Ram Position Deviation": ["Ram Position Deviation", "ramDeviation"],
      "Cooling Flow": ["Cooling Flow", "coolingFlow"],
    };
    const [title, key] = mapping[label] ?? [label, "mouldLevel"];
    openTrend(title, key);
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

    const buildSystemComparison = (title, rows) => ({
      title,
      subtitle: `${title} live comparison`,
      option: {
        ...baseModal,
        xAxis: {
          type: "category",
          data: rows.map((row) => row.label),
          axisLabel: { color: chartMutedText, interval: 0, rotate: 12 },
          axisLine: { lineStyle: { color: chartAxisLine } },
        },
        yAxis: {
          type: "value",
          axisLabel: { color: chartMutedText },
          splitLine: { lineStyle: { color: chartGrid } },
        },
        series: [
          { name: "Current", type: "bar", data: rows.map((row) => row.current), itemStyle: { color: "#2563eb", borderRadius: [10, 10, 0, 0] } },
          { name: "LCL", type: "line", data: rows.map((row) => row.lcl), lineStyle: { type: "dashed", color: "#14b8a6" } },
          { name: "UCL", type: "line", data: rows.map((row) => row.ucl), lineStyle: { type: "dashed", color: "#f97316" } },
        ],
      },
    });

    const configs = {
      casterMimic: {
        title: "Caster Mimic",
        subtitle: "Strand 1 live asset levels",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: ["Ladle-1", "Tundish", "Mould", "Cooling Flow", "Strand-1 Speed"],
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Value",
              type: "line",
              smooth: true,
              data: [live.ladle1Weight ?? 0, live.tundish1Weight ?? 0, live.mouldLevel ?? 0, live.coolingFlow ?? 0, live.strand1Speed ?? 0],
              lineStyle: { width: 4, color: "#2563eb" },
              areaStyle: { color: "rgba(37, 99, 235, 0.12)" },
            },
          ],
        },
      },
      amlc: buildSystemComparison("AMLC System", live.amlcRows ?? []),
      hmo: buildSystemComparison("HMO System", live.hmoRows ?? []),
      ram: buildSystemComparison("RAM / Cooling", [...(live.ramRows ?? []), { label: "Cooling Flow", current: live.coolingFlow ?? 0, lcl: 3.2, ucl: 4.6 }]),
      subsystemHealth: {
        title: "Subsystem Health",
        subtitle: "Subsystem performance comparison",
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: {
            type: "category",
            data: ["AMLC", "HMO", "RAM", "Cooling System"],
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
            { name: "Health", type: "bar", data: [overview.amlc ?? 0, overview.hmo ?? 0, overview.ram ?? 0, overview.coolingSystem ?? 0], itemStyle: { color: "#f59e0b", borderRadius: [10, 10, 0, 0] } },
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
          yAxis: { type: "value", axisLabel: { color: chartMutedText }, splitLine: { lineStyle: { color: chartGrid } } },
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
          yAxis: { type: "value", min: 0, max: 100, axisLabel: { color: chartMutedText, formatter: "{value}%" }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [{ name: "Compliance", type: "line", smooth: true, data: (overview.sapMo ?? []).map((item) => item.value), lineStyle: { width: 4, color: "#22c55e" }, areaStyle: { color: "rgba(34, 197, 94, 0.12)" } }],
        },
      },
    };

    return configs[modalSection] ?? null;
  }, [isLight, live, modalSection, overview]);

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
          background: "linear-gradient(90deg, #15b8e6 0%, #4aa9ff 22%, #22c55e 50%, #ffb347 78%, #f59e0b 100%)",
          boxShadow: "0 0 28px rgba(34, 197, 94, 0.22), 0 0 18px rgba(14, 165, 233, 0.18)",
        },
        assetCard: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(238,244,252,0.94))",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          color: "#18324d",
          boxShadow: "0 12px 28px rgba(148, 163, 184, 0.14)",
        },
        assetCardBlue: {
          background: "linear-gradient(145deg, #2563eb, #38bdf8)",
          color: "#ffffff",
          border: "1px solid rgba(56, 189, 248, 0.12)",
          boxShadow: "0 18px 32px rgba(37, 99, 235, 0.18)",
        },
        assetCardOrange: {
          background: "linear-gradient(180deg, #ffd166 0%, #ffb347 28%, #ff8f1f 62%, #f06a00 100%)",
          color: "#fff7ed",
          border: "1px solid rgba(249, 115, 22, 0.14)",
          boxShadow: "0 18px 38px rgba(255, 145, 31, 0.22)",
        },
        tablePanel: {
          background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow: "0 14px 34px rgba(148, 163, 184, 0.16)",
        },
        th: { color: "#1d4f7f", borderBottom: "1px solid rgba(148, 163, 184, 0.16)" },
        td: { color: "#18324d", borderBottom: "1px solid rgba(148, 163, 184, 0.12)" },
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
              <div style={{ ...styles.eyebrow, ...ui.eyebrow }}>DAMS / Caster / Mould Strand 1</div>
              <h1 style={{ ...styles.title, ...ui.title }}>Mould Strand 1</h1>
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
            <StatCard label="Strand-1 Speed" value={<AnimatedNumber value={live.strand1Speed ?? 0} decimals={2} suffix=" m/min" />} onClick={undefined} ui={ui} />
            <StatCard label="Strand-2 Speed" value={<AnimatedNumber value={live.strand2Speed ?? 0} decimals={2} suffix=" m/min" />} onClick={undefined} ui={ui} />
            <StatCard label="Tundish-1 Weight" value={<AnimatedNumber value={live.tundish1Weight ?? 0} decimals={1} suffix=" T" />} onClick={undefined} ui={ui} />
            <StatCard label="Tundish-2 Weight" value={<AnimatedNumber value={live.tundish2Weight ?? 0} decimals={1} suffix=" T" />} onClick={undefined} ui={ui} />
            <StatCard label="Ladle-1 Weight" value={<AnimatedNumber value={live.ladle1Weight ?? 0} decimals={1} suffix=" T" />} onClick={undefined} ui={ui} />
            <StatCard label="Ladle-2 Weight" value={<AnimatedNumber value={live.ladle2Weight ?? 0} decimals={1} suffix=" T" />} onClick={undefined} ui={ui} />
            <StatCard label="Mould Level" value={<AnimatedNumber value={live.mouldLevel ?? 0} decimals={1} suffix="%" />} onClick={() => openTrend("Mould Level", "mouldLevel")} ui={ui} />
            <StatCard label="Cooling Flow" value={<AnimatedNumber value={live.coolingFlow ?? 0} decimals={2} suffix=" m3/h" />} onClick={() => openTrend("Cooling Flow", "coolingFlow")} ui={ui} />
          </section>

          <section style={styles.mainGrid}>
            <div style={styles.processPanel}>
              <div style={{ ...styles.schematicPanel, ...ui.schematicPanel }}>
                <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("casterMimic")}>
                  <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Strand 1 Caster Mimic</span>
                  <span style={styles.sectionTriggerText}>Open graph</span>
                </button>
                <div style={{ ...styles.schematicFrame, ...ui.schematicFrame }}>
                  <div style={{ ...styles.centralNode, ...ui.centralNode }}>
                    <div style={{ ...styles.nodeTitle, ...ui.nodeTitle }}>Strand 1</div>
                    <div style={styles.nodeImageFrame}>
                      <img src={strand1CardMimicImage} alt="Strand 1 caster mimic" style={styles.nodeImage} />
                    </div>
                    <div style={{ ...styles.nodeText, ...ui.nodeText }}>Ladle, tundish, mould fill, and strand movement view for the Strand 1 page</div>
                  </div>
                  <div style={{ ...styles.flowBar, ...ui.flowBar }} />
                  <div style={styles.assetRow}>
                    <div style={{ ...styles.assetCard, ...ui.assetCard, ...ui.assetCardOrange }}>
                      Ladle-1 <AnimatedNumber value={live.ladle1Weight ?? 0} decimals={1} suffix=" T" />
                    </div>
                    <div style={{ ...styles.assetCard, ...ui.assetCard, ...ui.assetCardBlue }}>
                      Tundish <AnimatedNumber value={live.tundish1Weight ?? 0} decimals={1} suffix=" T" />
                    </div>
                    <div style={{ ...styles.assetCard, ...ui.assetCard, ...ui.assetCardOrange }}>
                      Mould <AnimatedNumber value={live.mouldLevel ?? 0} decimals={1} suffix="%" />
                    </div>
                  </div>
                </div>
              </div>

              <div onClick={() => setModalSection("amlc")} style={styles.clickablePanel}>
                <ValueTable title="AMLC System" rows={live.amlcRows ?? []} trendMap={trendMap} ui={ui} />
              </div>
              <div onClick={() => setModalSection("hmo")} style={styles.clickablePanel}>
                <ValueTable title="HMO System" rows={live.hmoRows ?? []} trendMap={trendMap} ui={ui} />
              </div>
              <div onClick={() => setModalSection("ram")} style={styles.clickablePanel}>
                <ValueTable title="RAM / Cooling" rows={[...(live.ramRows ?? []), { label: "Cooling Flow", current: live.coolingFlow ?? 0, lcl: 3.2, ucl: 4.6 }]} trendMap={trendMap} ui={ui} />
              </div>
            </div>

            <aside style={styles.sidebar}>
              <div style={{ ...styles.panel, ...ui.panel }}>
                <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("subsystemHealth")}>
                  <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Subsystem Health</span>
                  <span style={styles.sectionTriggerText}>Open graph</span>
                </button>
                <div style={styles.gaugeGrid}>
                  <GaugeCard label="AMLC" value={overview.amlc ?? 0} onClick={() => openCompliance("AMLC")} ui={ui} />
                  <GaugeCard label="HMO" value={overview.hmo ?? 0} onClick={() => openCompliance("HMO")} ui={ui} />
                  <GaugeCard label="RAM" value={overview.ram ?? 0} onClick={() => openCompliance("RAM")} ui={ui} />
                  <GaugeCard label="Cooling System" value={overview.coolingSystem ?? 0} onClick={() => openCompliance("COOLING SYSTEM")} ui={ui} />
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
  input: { padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(148, 163, 184, 0.18)", background: "rgba(15, 23, 42, 0.72)", color: "#f8fafc" },
  loadButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(56, 189, 248, 0.24)",
    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: 700,
    transition: "all 220ms ease",
  },
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
    minHeight: 420,
    borderRadius: 24,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.7)), radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 40%)",
    boxShadow: "0 24px 60px rgba(2, 6, 23, 0.35)",
    transition: "all 300ms ease",
  },
  centralNode: {
    margin: "0 auto",
    width: "74%",
    minHeight: 220,
    borderRadius: 26,
    display: "grid",
    placeItems: "center",
    gap: 14,
    textAlign: "center",
    background: "linear-gradient(145deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.96))",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    padding: 24,
    transition: "all 260ms ease",
  },
  nodeImageFrame: {
    width: "100%",
    maxWidth: 560,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(255,255,255,0.92)",
  },
  nodeImage: {
    width: "100%",
    height: "auto",
    maxHeight: 260,
    objectFit: "contain",
    display: "block",
  },
  nodeTitle: { fontSize: 28, fontWeight: 700, color: "#f8fafc" },
  nodeText: { color: "#94a3b8", fontSize: 14 },
  flowBar: { marginTop: 28, height: 10, borderRadius: 999, background: "linear-gradient(90deg, #06b6d4, #22c55e, #f59e0b)", boxShadow: "0 0 24px rgba(34, 197, 94, 0.28)", transition: "all 240ms ease" },
  assetRow: { marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 },
  assetCard: { padding: "14px 16px", borderRadius: 16, background: "rgba(15, 23, 42, 0.74)", border: "1px solid rgba(148, 163, 184, 0.16)", fontWeight: 600, transition: "all 240ms ease" },
  tablePanel: { borderRadius: 22, padding: 18, background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.18)", transition: "all 260ms ease" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 10px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#93c5fd", borderBottom: "1px solid rgba(148, 163, 184, 0.16)" },
  td: { padding: "12px 10px", borderBottom: "1px solid rgba(148, 163, 184, 0.12)", color: "#e2e8f0" },
  tableButton: { background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", padding: 0, fontWeight: 700 },
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
  trendSvg: { width: "100%", height: 220, background: "rgba(15, 23, 42, 0.72)", borderRadius: 18, padding: 14 },
  modalChart: { width: "100%", height: 420 },
  complianceGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, padding: 22 },
  clickablePanel: { cursor: "pointer" },
};
