import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ReactECharts from "echarts-for-react";
import {
  getSlabCsvData,
  getSlabOverview,
  getSlabSegmentTable,
  getSlabTrendSeries,
} from "../Services/slabStuck.mock";
import DamsCasterThemeSwitch from "../Components/DamsCasterThemeSwitch";
import useDamsCasterTheme from "../Components/useDamsCasterTheme";
import AnimatedNumber from "../Components/AnimatedNumber";

const REFRESH_INTERVAL = 10000;
const segmentOptions = Array.from({ length: 16 }, (_, index) => index + 1);
const severityColors = ["#ef4444", "#f97316", "#facc15"];

const trendConfig = [
  { key: "torque", label: "Torque Trend", accent: "#38bdf8" },
  { key: "corrSlip", label: "Corr. Slip Trend", accent: "#f97316" },
  { key: "pressure", label: "Pressure Trend", accent: "#22c55e" },
];

function metricToCsv(rows) {
  const headers = Object.keys(rows[0] ?? {});
  const body = rows.map((row) => headers.map((header) => row[header]).join(","));
  return [headers.join(","), ...body].join("\n");
}

function SegmentTower({ title, activeRanks, onOpen, ui = {} }) {
  return (
    <button type="button" style={{ ...styles.tower, ...ui.tower }} onClick={onOpen}>
      <div style={styles.sectionRow}>
        <div style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>{title}</div>
        <span style={styles.sectionAction}>OPEN GRAPH</span>
      </div>
      <div style={styles.segmentStack}>
        {segmentOptions.map((segment) => {
          const rankIndex = activeRanks.indexOf(segment);
          const color = rankIndex >= 0 ? severityColors[rankIndex] : "#27aae1";
          return (
            <div key={segment} style={styles.segmentRow}>
              <div style={{ ...styles.segmentTop, background: color }} />
              <div style={{ ...styles.segmentBody, background: rankIndex >= 0 ? `${color}99` : "#8fbfe0" }}>{segment}</div>
            </div>
          );
        })}
      </div>
    </button>
  );
}

function TrendChart({ title, accent, data, onOpen, ui = {} }) {
  if (!data.length) {
    return (
      <button type="button" style={{ ...styles.chartPanel, ...ui.chartPanel }} onClick={onOpen}>
        <div style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>{title}</div>
        <div style={{ ...styles.emptyChart, ...ui.emptyChart }}>Loading trend...</div>
      </button>
    );
  }

  const max = Math.max(...data.map((item) => item.value), 1);
  const min = Math.min(...data.map((item) => item.value), 0);
  const range = Math.max(max - min, 1);
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 320;
      const y = 130 - ((item.value - min) / range) * 104;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <button type="button" style={{ ...styles.chartPanel, ...ui.chartPanel }} onClick={onOpen}>
      <div style={styles.sectionRow}>
        <div style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>{title}</div>
        <span style={styles.sectionAction}>OPEN GRAPH</span>
      </div>
      <svg viewBox="0 0 320 150" style={{ ...styles.chartSvg, ...ui.chartSvg }}>
        <polyline fill="none" stroke={accent} strokeWidth="4" points={points} />
      </svg>
      <div style={styles.chartLegend}>
        {data.slice(-4).map((item) => (
          <div key={item.label} style={{ ...styles.legendItem, ...ui.legendItem }}>
            <span style={ui.legendText}>{item.label}</span>
            <strong style={ui.legendStrong}>
              <AnimatedNumber value={item.value} decimals={1} />
            </strong>
          </div>
        ))}
      </div>
    </button>
  );
}

function SummaryCard({ label, value, ui = {} }) {
  return (
    <div style={{ ...styles.summaryCard, ...ui.summaryCard }}>
      <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>{label}</span>
      <strong style={{ ...styles.metricValue, ...ui.metricValue }}>
        <AnimatedNumber value={value} decimals={Number.isInteger(Number(value)) ? 0 : 1} />
      </strong>
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
    <div style={styles.modalOverlay} onClick={onClose}>
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

export default function Slabstuck() {
  const theme = useDamsCasterTheme();
  const isLight = theme.isLight;
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const [fromDate, setFromDate] = useState(yesterday.toISOString().slice(0, 16));
  const [toDate, setToDate] = useState(now.toISOString().slice(0, 16));
  const [strand, setStrand] = useState(1);
  const [segment, setSegment] = useState(0);
  const [overview, setOverview] = useState({ segments: [], torqueRanks: [], pressureRanks: [], corrSlipRanks: [], slipCountRanks: [], timestamp: "" });
  const [tableRows, setTableRows] = useState([]);
  const [trends, setTrends] = useState({ torque: [], corrSlip: [], pressure: [] });
  const [loading, setLoading] = useState(false);
  const [modalSection, setModalSection] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async ({ strandValue = strand, segmentValue = segment, showLoader = true } = {}) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const selectedSegment = segmentValue === 0 ? 15 : segmentValue;
      const [overviewData, tableData, torqueData, corrSlipData, pressureData] = await Promise.all([
        getSlabOverview(strandValue),
        getSlabSegmentTable(strandValue),
        getSlabTrendSeries({ strand: strandValue, segment: selectedSegment, type: "torque" }),
        getSlabTrendSeries({ strand: strandValue, segment: selectedSegment, type: "corrSlip" }),
        getSlabTrendSeries({ strand: strandValue, segment: selectedSegment, type: "pressure" }),
      ]);

      setOverview(overviewData);
      setTableRows(tableData);
      setTrends({ torque: torqueData, corrSlip: corrSlipData, pressure: pressureData });
      setErrorMessage("");
    } catch (error) {
      console.error("Slabstuck load failed:", error);
      setErrorMessage("Live API refresh failed. Retrying...");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [segment, strand]);

  useEffect(() => {
    loadData({ showLoader: false });
    const interval = setInterval(() => loadData({ showLoader: false }), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleLoad = () => {
    loadData({ strandValue: strand, segmentValue: segment });
  };

  const handleDownload = async () => {
    try {
      const rows = await getSlabCsvData(strand);
      const csv = metricToCsv(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `slab-stuck-strand-${strand}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setErrorMessage("");
    } catch (error) {
      console.error("Slabstuck CSV download failed:", error);
      setErrorMessage("Unable to download CSV right now.");
    }
  };

  const selectedSummary = useMemo(() => {
    const candidate = tableRows.find((row) => row.segment === (segment === 0 ? 15 : segment));
    return candidate ?? { torque: 0, pressure: 0, corrSlip: 0, slipCount: 0, segment: segment === 0 ? 15 : segment };
  }, [tableRows, segment]);

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

    const towerOption = (title, ranks) => ({
      title,
      subtitle: `${title} critical segments`,
      option: {
        ...baseModal,
        dataZoom: [],
        xAxis: {
          type: "category",
          data: segmentOptions.map((item) => `S${item}`),
          axisLabel: { color: chartMutedText, interval: 1 },
          axisLine: { lineStyle: { color: chartAxisLine } },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 3,
          axisLabel: { color: chartMutedText },
          splitLine: { lineStyle: { color: chartGrid } },
        },
        series: [
          {
            name: "Severity Rank",
            type: "bar",
            data: segmentOptions.map((item) => {
              const idx = ranks.indexOf(item);
              return idx >= 0 ? 3 - idx : 0.8;
            }),
            itemStyle: {
              color: (params) => {
                const segmentNumber = segmentOptions[params.dataIndex];
                const idx = ranks.indexOf(segmentNumber);
                return idx >= 0 ? severityColors[idx] : "#27aae1";
              },
              borderRadius: [8, 8, 0, 0],
            },
          },
        ],
      },
    });

    const trendOption = (item) => ({
      title: item.label,
      subtitle: `Segment ${segment === 0 ? 15 : segment} live trend`,
      option: {
        ...baseModal,
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: (trends[item.key] ?? []).map((point) => point.label),
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
            name: item.label,
            type: "line",
            smooth: false,
            data: (trends[item.key] ?? []).map((point) => point.value),
            lineStyle: { width: 4, color: item.accent },
            itemStyle: { color: "#ffffff", borderColor: item.accent, borderWidth: 2 },
            areaStyle: { color: `${item.accent}22` },
          },
        ],
      },
    });

    const configs = {
      summary: {
        title: "Selected Segment Summary",
        subtitle: `Segment ${selectedSummary.segment} snapshot`,
        option: {
          ...baseModal,
          dataZoom: [],
          xAxis: {
            type: "category",
            data: ["Torque", "Pressure", "Corr. Slip", "Slip Count"],
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: { type: "value", axisLabel: { color: chartMutedText }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [{ name: "Value", type: "bar", data: [selectedSummary.torque, selectedSummary.pressure, selectedSummary.corrSlip, selectedSummary.slipCount], itemStyle: { color: "#2563eb", borderRadius: [10, 10, 0, 0] } }],
        },
      },
      torqueTower: towerOption("Torque", overview.torqueRanks ?? []),
      pressureTower: towerOption("Pressure", overview.pressureRanks ?? []),
      corrSlipTower: towerOption("Corr. Slip", overview.corrSlipRanks ?? []),
      slipCountTower: towerOption("Slip Count", overview.slipCountRanks ?? []),
      torqueTrend: trendOption(trendConfig[0]),
      corrSlipTrend: trendOption(trendConfig[1]),
      pressureTrend: trendOption(trendConfig[2]),
      table: {
        title: "Segment Detail Table",
        subtitle: `Strand ${strand} detailed metrics`,
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: tableRows.map((row) => `S${row.segment}`),
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: { type: "value", axisLabel: { color: chartMutedText }, splitLine: { lineStyle: { color: chartGrid } } },
          series: [
            { name: "Torque", type: "line", data: tableRows.map((row) => row.torque), lineStyle: { color: "#38bdf8", width: 3 } },
            { name: "Pressure", type: "line", data: tableRows.map((row) => row.pressure), lineStyle: { color: "#22c55e", width: 3 } },
            { name: "Corr. Slip", type: "line", data: tableRows.map((row) => row.corrSlip), lineStyle: { color: "#f97316", width: 3 } },
            { name: "Slip Count", type: "line", data: tableRows.map((row) => row.slipCount), lineStyle: { color: "#ef4444", width: 3 } },
          ],
        },
      },
    };

    return configs[modalSection] ?? null;
  }, [isLight, modalSection, overview, selectedSummary, segment, strand, tableRows, trends]);

  const ui = isLight
    ? {
        eyebrow: { color: "#0f5c96" },
        title: { color: "#11243b", textShadow: "0 1px 0 rgba(255,255,255,0.72)" },
        subtitle: { color: "#516b84" },
        heroPill: { color: "#10233c" },
        filterBar: { background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))", border: "1px solid rgba(148,163,184,0.18)" },
        metricLabel: { color: "#1d4f7f" },
        metricValue: { color: "#0f172a" },
        input: { background: "rgba(255,255,255,0.78)", color: "#10233c", border: "1px solid rgba(59,130,246,0.14)" },
        actionButton: { background: "linear-gradient(135deg, #2563eb, #38bdf8)", border: "1px solid rgba(37,99,235,0.22)", boxShadow: "0 12px 24px rgba(37,99,235,0.18)" },
        secondaryButton: { background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(240,246,255,0.9))", color: "#10233c", border: "1px solid rgba(148,163,184,0.18)" },
        summaryCard: { background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(240,246,255,0.9))", border: "1px solid rgba(148,163,184,0.18)", boxShadow: "0 14px 34px rgba(148,163,184,0.16)" },
        tower: { background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))", border: "1px solid rgba(148,163,184,0.18)", boxShadow: "0 14px 34px rgba(148,163,184,0.18)" },
        sectionTitle: { color: "#10233c" },
        chartPanel: { background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))", border: "1px solid rgba(148,163,184,0.18)", boxShadow: "0 14px 34px rgba(148,163,184,0.18)" },
        emptyChart: { background: "rgba(233,241,251,0.9)", color: "#516b84" },
        chartSvg: { background: "rgba(233,241,251,0.9)" },
        legendItem: { background: "rgba(255,255,255,0.72)", border: "1px solid rgba(148,163,184,0.14)" },
        legendText: { color: "#516b84" },
        legendStrong: { color: "#10233c" },
        modalCard: { background: "rgba(255,255,255,0.96)", boxShadow: "0 28px 80px rgba(15, 23, 42, 0.28)" },
        sectionModalTitle: { color: "#10233c" },
        modalSubtitle: { color: "#516b84" },
        modalCloseButton: { background: "#ffffff", color: "#26435f", border: "1px solid rgba(148, 163, 184, 0.24)" },
      }
    : {
        modalCard: { background: "rgba(8,17,31,0.98)", boxShadow: "0 28px 80px rgba(2, 6, 23, 0.52)" },
        sectionModalTitle: { color: "#f8fafc" },
        modalSubtitle: { color: "#cbd5e1" },
        modalCloseButton: { background: "rgba(15,23,42,0.88)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.24)" },
      };

  return (
    <div style={{ ...styles.page, ...theme.pageStyle }}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />
      <div style={styles.container}>
        <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />

        <section style={styles.hero}>
          <div>
            <div style={{ ...styles.eyebrow, ...ui.eyebrow }}>DAMS / Continuous Casting / Heat Flux Control</div>
            <h1 style={{ ...styles.title, ...ui.title }}>Slab Stuck Analysis</h1>
            <p style={{ ...styles.subtitle, ...ui.subtitle }}>
              Segment-based torque, pressure, correlation slip, and slip-count view for rapid strand diagnosis and export.
            </p>
          </div>
          <div style={{ ...styles.heroPill, ...ui.heroPill }}>{`Strand ${strand} - ${overview.timestamp || "Loading"}`}</div>
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
          <label style={styles.filterField}>
            <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>Select Strand</span>
            <select style={{ ...styles.input, ...ui.input }} value={strand} onChange={(event) => setStrand(Number(event.target.value))}>
              <option value={1}>Strand 1</option>
              <option value={2}>Strand 2</option>
            </select>
          </label>
          <label style={styles.filterField}>
            <span style={{ ...styles.metricLabel, ...ui.metricLabel }}>Segment</span>
            <select style={{ ...styles.input, ...ui.input }} value={segment} onChange={(event) => setSegment(Number(event.target.value))}>
              <option value={0}>Default 15</option>
              {segmentOptions.map((item) => (
                <option key={item} value={item}>
                  Segment {item}
                </option>
              ))}
            </select>
          </label>
          <button type="button" style={{ ...styles.actionButton, ...ui.actionButton }} onClick={handleLoad}>
            Submit
          </button>
          <button type="button" style={{ ...styles.secondaryButton, ...ui.secondaryButton }} onClick={handleDownload}>
            Excel Download
          </button>
        </section>

        <section style={styles.summaryGrid} onClick={() => setModalSection("summary")}>
          <SummaryCard label="Selected Segment" value={selectedSummary.segment} ui={ui} />
          <SummaryCard label="Torque" value={selectedSummary.torque} ui={ui} />
          <SummaryCard label="Pressure" value={selectedSummary.pressure} ui={ui} />
          <SummaryCard label="Corr. Slip" value={selectedSummary.corrSlip} ui={ui} />
          <SummaryCard label="Slip Count" value={selectedSummary.slipCount} ui={ui} />
        </section>

        <section style={styles.mainGrid}>
          <SegmentTower title="Torque" activeRanks={overview.torqueRanks ?? []} onOpen={() => setModalSection("torqueTower")} ui={ui} />
          <SegmentTower title="Pressure" activeRanks={overview.pressureRanks ?? []} onOpen={() => setModalSection("pressureTower")} ui={ui} />
          <SegmentTower title="Corr. Slip" activeRanks={overview.corrSlipRanks ?? []} onOpen={() => setModalSection("corrSlipTower")} ui={ui} />
          <SegmentTower title="Slip Count" activeRanks={overview.slipCountRanks ?? []} onOpen={() => setModalSection("slipCountTower")} ui={ui} />
        </section>

        <section style={styles.chartGrid}>
          {trendConfig.map((item) => (
            <TrendChart key={item.key} title={item.label} accent={item.accent} data={trends[item.key] ?? []} onOpen={() => setModalSection(`${item.key}Trend`)} ui={ui} />
          ))}
        </section>

        <section style={{ ...styles.tablePanel, ...(ui.chartPanel ?? {}) }} onClick={() => setModalSection("table")}>
          <div style={styles.sectionRow}>
            <div style={{ ...styles.sectionTitle, ...ui.sectionTitle }}>Segment Detail Table</div>
            <span style={styles.sectionAction}>OPEN GRAPH</span>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Segment</th>
                  <th style={styles.th}>Torque</th>
                  <th style={styles.th}>Pressure</th>
                  <th style={styles.th}>Corr. Slip</th>
                  <th style={styles.th}>Slip Count</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.segment} style={row.segment === selectedSummary.segment ? styles.activeRow : undefined}>
                    <td style={styles.td}>{row.segment}</td>
                    <td style={styles.td}>{row.torque}</td>
                    <td style={styles.td}>{row.pressure}</td>
                    <td style={styles.td}>{row.corrSlip}</td>
                    <td style={styles.td}>{row.slipCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <SectionModal
        isOpen={Boolean(modalConfig?.option)}
        title={modalConfig?.title}
        subtitle={modalConfig?.subtitle}
        option={modalConfig?.option}
        onClose={() => setModalSection(null)}
        ui={ui}
      />

      {loading ? (
        <div style={styles.loaderOverlay}>
          <div style={styles.loaderRing} />
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    color: "#e2e8f0",
    background:
      "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 28%), linear-gradient(145deg, #08111f 0%, #0f172a 48%, #020617 100%)",
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
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "2px",
  },
  eyebrow: { textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "12px", color: "#7dd3fc", marginBottom: 8 },
  title: { margin: 0, fontSize: "clamp(2rem, 3vw, 3rem)", color: "#f8fafc", lineHeight: 1.05, fontWeight: 650 },
  subtitle: { margin: "10px 0 0", maxWidth: "760px", color: "#cbd5e1", lineHeight: 1.5 },
  heroPill: {
    alignSelf: "end",
    color: "#bae6fd",
    whiteSpace: "nowrap",
    fontWeight: 700,
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
  filterField: { display: "grid", gap: "8px", minWidth: "190px" },
  metricLabel: { fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" },
  metricValue: { fontSize: "22px", color: "#f8fafc" },
  input: {
    background: "rgba(2,6,23,0.52)",
    color: "#e2e8f0",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "14px",
    padding: "12px 14px",
    transition: "all 240ms ease",
  },
  actionButton: {
    height: "46px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "1px solid rgba(56,189,248,0.2)",
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    color: "#f8fafc",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 220ms ease",
  },
  secondaryButton: {
    height: "46px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    color: "#e2e8f0",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 220ms ease",
  },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "18px", cursor: "pointer", marginBottom: "2px" },
  summaryCard: {
    borderRadius: "20px",
    padding: "16px",
    background: "rgba(15,23,42,0.84)",
    border: "1px solid rgba(148,163,184,0.16)",
    display: "grid",
    gap: "8px",
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "18px", marginBottom: "2px" },
  tower: {
    border: "none",
    borderRadius: "24px",
    background: "rgba(15,23,42,0.82)",
    borderColor: "rgba(148,163,184,0.16)",
    padding: "20px",
    display: "grid",
    gap: "16px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  sectionTitle: { fontSize: "18px", fontWeight: 700, color: "#f8fafc" },
  sectionRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  sectionAction: { fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em" },
  segmentStack: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" },
  segmentRow: { display: "grid", justifyItems: "center", gap: "4px" },
  segmentTop: { width: "44px", height: "10px", borderRadius: "999px" },
  segmentBody: {
    width: "44px",
    height: "58px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    color: "#0f172a",
    fontWeight: 700,
    transition: "background 260ms ease",
  },
  chartGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "18px" },
  chartPanel: {
    border: "none",
    borderRadius: "24px",
    background: "rgba(15,23,42,0.82)",
    borderColor: "rgba(148,163,184,0.16)",
    padding: "20px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  emptyChart: {
    marginTop: "16px",
    minHeight: "220px",
    borderRadius: "18px",
    background: "rgba(2,6,23,0.55)",
    display: "grid",
    placeItems: "center",
    color: "#94a3b8",
    transition: "all 240ms ease",
  },
  chartSvg: { width: "100%", height: "220px", padding: "10px", borderRadius: "18px", background: "linear-gradient(180deg, rgba(15,23,42,0.72), rgba(2,6,23,0.92))", transition: "all 240ms ease" },
  chartLegend: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px", marginTop: "12px" },
  legendItem: { padding: "10px", borderRadius: "14px", background: "rgba(15,23,42,0.76)", border: "1px solid rgba(148,163,184,0.12)", display: "grid", gap: "6px", transition: "all 220ms ease" },
  tablePanel: {
    borderRadius: "24px",
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(148,163,184,0.16)",
    padding: "20px",
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  tableWrap: { overflowX: "auto", marginTop: "16px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px", color: "#93c5fd", borderBottom: "1px solid rgba(148,163,184,0.16)" },
  td: { padding: "12px", borderBottom: "1px solid rgba(148,163,184,0.1)" },
  activeRow: { background: "rgba(59,130,246,0.12)", transition: "background 220ms ease" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.42)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24, zIndex: 1200, transition: "background 220ms ease" },
  modalCard: { width: "min(1080px, calc(100vw - 64px))", maxHeight: "calc(100vh - 64px)", overflow: "auto", background: "rgba(8,17,31,0.98)", borderRadius: 28, padding: 24, boxShadow: "0 28px 80px rgba(2, 6, 23, 0.52)", transition: "all 260ms ease" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 },
  sectionModalTitle: { fontSize: 22, fontWeight: 800, color: "#f8fafc" },
  modalSubtitle: { marginTop: 4, fontSize: 13, color: "#cbd5e1" },
  modalCloseButton: { width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(148, 163, 184, 0.24)", background: "rgba(15,23,42,0.88)", color: "#e2e8f0", fontSize: 18, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  modalChart: { width: "100%", height: 420 },
  loaderOverlay: { position: "fixed", inset: 0, background: "rgba(2,6,23,0.56)", display: "grid", placeItems: "center", zIndex: 20, transition: "opacity 220ms ease" },
  loaderRing: {
    width: "90px",
    height: "90px",
    borderRadius: "999px",
    border: "10px solid rgba(59,130,246,0.25)",
    borderTopColor: "#ef4444",
  },
};
