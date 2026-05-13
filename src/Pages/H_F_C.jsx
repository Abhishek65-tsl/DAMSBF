import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactECharts from "echarts-for-react";
import { getCasterOverview, getFaceStatus, getHeatFluxCharts, getStrandConfig } from "../Services/hfc.mock";
import DamsCasterThemeSwitch from "../Components/DamsCasterThemeSwitch";
import useDamsCasterTheme from "../Components/useDamsCasterTheme";
import hfcProcessReference from "../assets/Images/hfc-process-reference.jpg";

const REFRESH_INTERVAL = 10000;
const HISTORY_LIMIT = 12;
const strands = getStrandConfig();
const statusTone = (value, lcl, ucl) => {
  if (value > lcl && value < ucl) return { solid: "#22c55e", soft: "rgba(34, 197, 94, 0.16)", text: "In Range" };
  if (value <= lcl + 5 || value >= ucl - 5) return { solid: "#f59e0b", soft: "rgba(245, 158, 11, 0.16)", text: "Near Limit" };
  return { solid: "#ef4444", soft: "rgba(239, 68, 68, 0.16)", text: "Out of Range" };
};

function AnimatedNumber({ value = 0, decimals = 1, duration = 600, prefix = "", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const targetValue = value;
    const startTime = performance.now();
    let rafId = null;

    const tick = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const nextValue = startValue + (targetValue - startValue) * eased;
      setDisplayValue(nextValue);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        previousValueRef.current = targetValue;
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  return `${prefix}${displayValue.toFixed(decimals)}${suffix}`;
}

function StatCard({ label, value, subtext }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      {subtext ? <div style={styles.statSubtext}>{subtext}</div> : null}
    </div>
  );
}

function FaceCard({ face, onSelect }) {
  const tone = statusTone(face.value, face.lcl, face.ucl);
  return (
    <button type="button" onClick={() => onSelect(face.faceId)} style={{ ...styles.faceCard, background: tone.soft }}>
      <div style={styles.faceTitle}>{face.label}</div>
      <div style={{ ...styles.faceValue, color: tone.solid }}>{face.value.toFixed(1)}</div>
      <div style={styles.faceMeta}>
        <span>{tone.text}</span>
        <span>
          LCL {face.lcl} / UCL {face.ucl}
        </span>
      </div>
    </button>
  );
}

function MiniLineChart({ title, chart }) {
  const allValues = [...chart.flux, ...chart.lcl, ...chart.ucl];
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = Math.max(max - min, 1);
  const toPoints = (series) =>
    series
      .map((value, index) => `${(index / Math.max(series.length - 1, 1)) * 320},${120 - ((value - min) / range) * 90}`)
      .join(" ");

  return (
    <div style={styles.chartCard}>
      <div style={styles.chartTitle}>{title}</div>
      <svg viewBox="0 0 320 150" style={styles.chartSvg}>
        <polyline fill="none" stroke="#c084fc" strokeWidth="4" points={toPoints(chart.flux)} />
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" points={toPoints(chart.lcl)} />
        <polyline fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="6 4" points={toPoints(chart.ucl)} />
      </svg>
      <div style={styles.chartLegend}>
        <span>Flux</span>
        <span>LCL</span>
        <span>UCL</span>
      </div>
      <div style={styles.chartAxis}>Casting Speed: {chart.castingSpeed.join(" / ")} m/min</div>
    </div>
  );
}

export default function HFC() {
  const theme = useDamsCasterTheme();
  const isLight = theme.isLight;
  const [selectedStrand, setSelectedStrand] = useState(1);
  const [overview, setOverview] = useState({});
  const [faceStatuses, setFaceStatuses] = useState([]);
  const [charts, setCharts] = useState([]);
  const [selectedFaceId, setSelectedFaceId] = useState(null);
  const [modalSection, setModalSection] = useState(null);
  const [liveHistory, setLiveHistory] = useState({
    timestamps: [],
    caster: [],
    faces: {},
    selectedFace: [],
  });

  useEffect(() => {
    setLiveHistory({
      timestamps: [],
      caster: [],
      faces: {},
      selectedFace: [],
    });
  }, [selectedStrand]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [overviewData, statusData, chartData] = await Promise.all([
        getCasterOverview(),
        getFaceStatus(),
        getHeatFluxCharts(selectedStrand),
      ]);

      if (!active) return;
      setOverview(overviewData);
      setFaceStatuses(statusData);
      setCharts(chartData);
      setSelectedFaceId((current) => {
        const nextFaceId = current ?? chartData[0]?.faceId ?? null;
        const timeLabel = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        setLiveHistory((previous) => {
          const timestamps = [...previous.timestamps, timeLabel].slice(-HISTORY_LIMIT);
          const casterSnapshot = {
            ladlePrimary: Number((overviewData.ladlePrimaryTons ?? 0).toFixed(1)),
            ladleSecondary: Number((overviewData.ladleSecondaryTons ?? 0).toFixed(1)),
            tundish: Number((overviewData.tundishTons ?? 0).toFixed(1)),
            mould1: Number((overviewData.mould1Level ?? 0).toFixed(1)),
            mould2: Number((overviewData.mould2Level ?? 0).toFixed(1)),
            castingSpeed: Number(
              (selectedStrand === 1 ? overviewData.strand1CastingSpeed ?? 0 : overviewData.strand2CastingSpeed ?? 0).toFixed(2),
            ),
          };

          const faceMap = { ...previous.faces };
          statusData.forEach((face) => {
            faceMap[face.id] = [...(faceMap[face.id] ?? []), Number((face.value ?? 0).toFixed(1))].slice(-HISTORY_LIMIT);
          });

          return {
            timestamps,
            caster: [...previous.caster, casterSnapshot].slice(-HISTORY_LIMIT),
            faces: faceMap,
            selectedFace: [...previous.selectedFace, Number((statusData.find((item) => item.id === nextFaceId)?.value ?? 0).toFixed(1))].slice(-HISTORY_LIMIT),
          };
        });

        return nextFaceId;
      });
    };

    load();
    const intervalId = window.setInterval(load, REFRESH_INTERVAL);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [selectedStrand]);

  const strandFaces = useMemo(
    () =>
      strands[selectedStrand].faces.map((face) => {
        const live = faceStatuses.find((item) => item.id === face.id);
        return {
          faceId: face.id,
          key: face.key,
          label: face.label,
          value: live?.value ?? 0,
          lcl: live?.lcl ?? 40,
          ucl: live?.ucl ?? 85,
        };
      }),
    [faceStatuses, selectedStrand],
  );

  const selectedFace = strandFaces.find((item) => item.faceId === selectedFaceId) ?? strandFaces[0];
  useEffect(() => {
    if (!selectedFaceId) return;
    setLiveHistory((previous) => ({
      ...previous,
      selectedFace: (previous.faces[selectedFaceId] ?? []).slice(-HISTORY_LIMIT),
    }));
  }, [selectedFaceId]);

  const modalConfig = useMemo(() => {
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
        iconStyle: {
          borderColor: chartMutedText,
        },
        emphasis: {
          iconStyle: {
            borderColor: chartText,
          },
        },
        feature: {
          dataZoom: {
            title: { zoom: "Zoom", back: "Reset Zoom" },
          },
          restore: { title: "Restore" },
          saveAsImage: { title: "Save As Image" },
        },
      },
      dataZoom: [{ type: "inside" }, { type: "slider", height: 18, bottom: 18 }],
      legend: {
        top: 30,
        textStyle: {
          color: chartMutedText,
        },
      },
    };

    const timestamps = liveHistory.timestamps;
    const activeChart = charts.find((chart) => chart.faceId === selectedFace?.faceId) ?? charts[0];
    const faceLabels = strandFaces.map((face) => face.label);
    const faceValues = strandFaces.map((face) => Number(face.value.toFixed(1)));

    const configs = {
      heatFlux: {
        title: "Heat Flux vs Casting Speed",
        subtitle: activeChart ? `${strands[selectedStrand].name} - ${activeChart.label}` : strands[selectedStrand].name,
        option: activeChart
          ? {
            ...baseModal,
            xAxis: {
              type: "category",
              name: "Casting Speed",
              data: activeChart.castingSpeed.map((value) => `${value} m/min`),
              nameTextStyle: { color: chartMutedText },
              axisLabel: { color: chartMutedText },
              axisLine: { lineStyle: { color: chartAxisLine } },
              splitLine: { show: false },
            },
            yAxis: {
              type: "value",
              name: "Heat Flux",
              nameTextStyle: { color: chartMutedText },
              axisLabel: { color: chartMutedText },
              splitLine: { lineStyle: { color: chartGrid } },
            },
            series: [
              { name: "Flux", type: "line", smooth: true, data: activeChart.flux, lineStyle: { width: 4, color: "#4f46e5" } },
              { name: "LCL", type: "line", data: activeChart.lcl, lineStyle: { type: "dashed", color: "#0ea5e9" } },
              { name: "UCL", type: "line", data: activeChart.ucl, lineStyle: { type: "dashed", color: "#f97316" } },
            ],
          }
          : null,
      },
      faceCondition: {
        title: "Face Condition",
        subtitle: `${strands[selectedStrand].name} live comparison`,
        option: {
          ...baseModal,
          tooltip: { trigger: "item" },
          dataZoom: [],
          xAxis: {
            type: "category",
            data: faceLabels,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { interval: 0, rotate: 12, color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Heat Flux",
            min: 0,
            max: 100,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: "Current Value",
              type: "bar",
              data: faceValues,
              itemStyle: {
                color: (params) => statusTone(faceValues[params.dataIndex], strandFaces[params.dataIndex].lcl, strandFaces[params.dataIndex].ucl).solid,
                borderRadius: [10, 10, 0, 0],
              },
              label: { show: true, position: "top", formatter: "{c}" },
            },
          ],
          visualMap: undefined,
        },
      },
      selectedFace: {
        title: "Selected Face",
        subtitle: selectedFace ? `${selectedFace.label} live trend` : "No face selected",
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: timestamps,
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Heat Flux",
            min: 0,
            max: 100,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            {
              name: selectedFace?.label ?? "Selected Face",
              type: "line",
              smooth: true,
              areaStyle: { color: "rgba(59, 130, 246, 0.12)" },
              lineStyle: { width: 4, color: "#2563eb" },
              data: liveHistory.selectedFace,
            },
            {
              name: "LCL",
              type: "line",
              symbol: "none",
              lineStyle: { type: "dashed", color: "#14b8a6" },
              data: timestamps.map(() => selectedFace?.lcl ?? 40),
            },
            {
              name: "UCL",
              type: "line",
              symbol: "none",
              lineStyle: { type: "dashed", color: "#f97316" },
              data: timestamps.map(() => selectedFace?.ucl ?? 85),
            },
          ],
        },
      },
      casterMimic: {
        title: "Caster Mimic",
        subtitle: `${strands[selectedStrand].name} live asset levels`,
        option: {
          ...baseModal,
          xAxis: {
            type: "category",
            data: timestamps,
            axisLabel: { color: chartMutedText },
            axisLine: { lineStyle: { color: chartAxisLine } },
          },
          yAxis: {
            type: "value",
            name: "Level / Tons",
            min: 0,
            nameTextStyle: { color: chartMutedText },
            axisLabel: { color: chartMutedText },
            splitLine: { lineStyle: { color: chartGrid } },
          },
          series: [
            { name: "Primary Ladle", type: "line", smooth: true, data: liveHistory.caster.map((item) => item.ladlePrimary), lineStyle: { width: 3, color: "#f97316" } },
            { name: "Secondary Ladle", type: "line", smooth: true, data: liveHistory.caster.map((item) => item.ladleSecondary), lineStyle: { width: 3, color: "#ea580c" } },
            { name: "Tundish", type: "line", smooth: true, data: liveHistory.caster.map((item) => item.tundish), lineStyle: { width: 3, color: "#2563eb" } },
            { name: "Mould 1 %", type: "line", smooth: true, data: liveHistory.caster.map((item) => item.mould1), lineStyle: { width: 3, color: "#22c55e" } },
            { name: "Mould 2 %", type: "line", smooth: true, data: liveHistory.caster.map((item) => item.mould2), lineStyle: { width: 3, color: "#14b8a6" } },
            { name: "Casting Speed", type: "line", smooth: true, yAxisIndex: 0, data: liveHistory.caster.map((item) => item.castingSpeed), lineStyle: { width: 3, type: "dashed", color: "#7c3aed" } },
          ],
        },
      },
    };

    return modalSection ? configs[modalSection] ?? null : null;
  }, [charts, isLight, liveHistory, modalSection, selectedFace, selectedStrand, strandFaces]);

  const ui = isLight
    ? {
      glowA: {
        background: "rgba(14, 165, 233, 0.12)",
      },
      glowB: {
        background: "rgba(249, 115, 22, 0.1)",
      },
      eyebrow: {
        color: "#0f5c96",
      },
      title: {
        color: "#11243b",
        textShadow: "0 1px 0 rgba(255,255,255,0.7)",
      },
      selectLabel: {
        color: "#1d4f7f",
      },
      select: {
        background: "rgba(255, 255, 255, 0.78)",
        color: "#10233c",
        border: "1px solid rgba(59, 130, 246, 0.14)",
        boxShadow: "0 10px 22px rgba(148, 163, 184, 0.16)",
      },
      statCard: {
        background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(240,246,255,0.9))",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 14px 28px rgba(148, 163, 184, 0.18)",
      },
      statLabel: {
        color: "#1d4f7f",
      },
      statValue: {
        color: "#0f172a",
      },
      schematicPanel: {
        background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 24px 60px rgba(148, 163, 184, 0.2)",
      },
      panel: {
        background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 14px 34px rgba(148, 163, 184, 0.18)",
      },
      panelTitle: {
        color: "#10233c",
      },
      schematic: {
        background:
          "linear-gradient(160deg, rgba(238,244,252,0.96), rgba(226,236,248,0.9)), radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 42%)",
        border: "1px solid rgba(148, 163, 184, 0.16)",
      },
      ladle: {
        background: "linear-gradient(180deg, #ffd166 0%, #ffb347 28%, #ff8f1f 62%, #f06a00 100%)",
        boxShadow: "0 18px 38px rgba(255, 145, 31, 0.28)",
      },
      assetLabel: {
        color: "#fff7ed",
        textShadow: "0 1px 2px rgba(124, 45, 18, 0.35)",
      },
      tundish: {
        boxShadow: "0 18px 32px rgba(37, 99, 235, 0.16)",
      },
      mouldHeader: {
        color: "#10233c",
      },
      mouldTank: {
        background: "rgba(255, 255, 255, 0.82)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
      },
      mouldFill: {
        background: "linear-gradient(180deg, #ffd76a 0%, #ffbb4d 26%, #ff9626 60%, #f06a00 100%)",
      },
      mouldLabel: {
        color: "#fffaf5",
        textShadow: "0 2px 8px rgba(124, 45, 18, 0.26)",
      },
      flowTrack: {
        boxShadow: "0 0 22px rgba(249, 115, 22, 0.18)",
      },
      processBadge: {
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        color: "#18324d",
      },
      stageBadge: {
        background: "rgba(255,255,255,0.84)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        color: "#0f2c49",
        boxShadow: "0 10px 24px rgba(148, 163, 184, 0.16)",
      },
      faceCard: {
        color: "#10233c",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)",
      },
      faceTitle: {
        color: "#26435f",
      },
      faceMeta: {
        color: "#26435f",
      },
      selectedFaceCard: {
        background: "rgba(56, 189, 248, 0.09)",
        border: "1px solid rgba(56, 189, 248, 0.18)",
      },
      selectedFaceTitle: {
        color: "#0f5c96",
      },
      selectedFaceValue: {
        color: "#10233c",
      },
      selectedFaceMeta: {
        color: "#38536d",
      },
      chartsPanel: {
        background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(239,245,252,0.92))",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 14px 34px rgba(148, 163, 184, 0.18)",
      },
      chartCard: {
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(148, 163, 184, 0.14)",
      },
      chartTitle: {
        color: "#10233c",
      },
      chartSvg: {
        background: "rgba(233, 241, 251, 0.9)",
      },
      chartLegend: {
        color: "#38536d",
      },
      chartAxis: {
        color: "#516b84",
      },
    }
    : {};

  return (
    <div style={{ ...styles.page, ...theme.pageStyle }}>
      <div style={{ ...styles.glowA, ...ui.glowA }} />
      <div style={{ ...styles.glowB, ...ui.glowB }} />
      <div style={styles.container}>
        <DamsCasterThemeSwitch mode={theme.mode} onToggle={theme.toggleMode} />
        <header style={styles.header}>
          <div>
            <div style={{ ...styles.eyebrow, ...ui.eyebrow }}>DAMS / Continuous Casting / Heat Flux Control</div>
            <h1 style={{ ...styles.title, ...ui.title }}>H_F_C</h1>
          </div>
          <div style={styles.selectWrap}>
            <label htmlFor="strand-select" style={{ ...styles.selectLabel, ...ui.selectLabel }}>
              Strand
            </label>
            <select id="strand-select" value={selectedStrand} onChange={(e) => setSelectedStrand(Number(e.target.value))} style={{ ...styles.select, ...ui.select }}>
              <option value={1}>Strand 1</option>
              <option value={2}>Strand 2</option>
            </select>
          </div>
        </header>
        <section style={styles.statsGrid}>
          <div style={{ ...styles.statCard, ...ui.statCard }}>
            <div style={{ ...styles.statLabel, ...ui.statLabel }}>Primary Ladle</div>
            <div style={{ ...styles.statValue, ...ui.statValue }}>
              <AnimatedNumber value={overview.ladlePrimaryTons ?? 0} decimals={1} suffix=" T" />
            </div>
          </div>
          <div style={{ ...styles.statCard, ...ui.statCard }}>
            <div style={{ ...styles.statLabel, ...ui.statLabel }}>Secondary Ladle</div>
            <div style={{ ...styles.statValue, ...ui.statValue }}>
              <AnimatedNumber value={overview.ladleSecondaryTons ?? 0} decimals={1} suffix=" T" />
            </div>
          </div>
          <div style={{ ...styles.statCard, ...ui.statCard }}>
            <div style={{ ...styles.statLabel, ...ui.statLabel }}>Tundish</div>
            <div style={{ ...styles.statValue, ...ui.statValue }}>
              <AnimatedNumber value={overview.tundishTons ?? 0} decimals={1} suffix=" T" />
            </div>
          </div>
          <div style={{ ...styles.statCard, ...ui.statCard }}>
            <div style={{ ...styles.statLabel, ...ui.statLabel }}>{`${strands[selectedStrand].name} Casting Speed`}</div>
            <div style={{ ...styles.statValue, ...ui.statValue }}>
              <AnimatedNumber value={selectedStrand === 1 ? overview.strand1CastingSpeed ?? 0 : overview.strand2CastingSpeed ?? 0} decimals={2} suffix=" m/min" />
            </div>
          </div>
        </section>

        <section style={styles.mainGrid}>
          <div style={{ ...styles.schematicPanel, ...ui.schematicPanel }}>
            <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("casterMimic")}>
              <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Caster Mimic</span>
              <span style={styles.sectionTriggerText}>Open graph</span>
            </button>
            <div style={{ ...styles.schematic, ...ui.schematic }} onClick={() => setModalSection("casterMimic")}>
              <div style={styles.referenceImageWrap}>
                <img src={hfcProcessReference} alt="HFC process reference" style={styles.referenceImage} />
              </div>
              <div style={styles.assetBadges}>
                <span style={{ ...styles.processBadge, ...styles.assetBadgeLadle }}>Ladle 1</span>
                <span style={{ ...styles.processBadge, ...styles.assetBadgeLadle }}>Ladle 2</span>
                <span style={{ ...styles.processBadge, ...styles.assetBadgeLadle }}>Mould 1</span>
                <span style={{ ...styles.processBadge, ...styles.assetBadgeLadle }}>Mould 2</span>
                <span style={{ ...styles.processBadge, ...styles.assetBadgeTundish }}>Tundish</span>
              </div>

              <div style={{ ...styles.flowTrack, ...ui.flowTrack }} />
              <div style={styles.processBadges}>
                <span style={{ ...styles.stageBadge, ...ui.stageBadge }}>Temp Slab</span>
                <span style={{ ...styles.stageBadge, ...ui.stageBadge }}>Cut Slab</span>
                <span style={{ ...styles.stageBadge, ...ui.stageBadge }}>Marking</span>
              </div>
            </div>
          </div>

          <aside style={styles.sidebar}>
            <div style={{ ...styles.panel, ...ui.panel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("faceCondition")}>
                <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Face Condition</span>
                <span style={styles.sectionTriggerText}>Open graph</span>
              </button>
              <div style={styles.faceGrid}>
                {strandFaces.map((face) => (
                  <button
                    key={face.faceId}
                    type="button"
                    onClick={() => {
                      setSelectedFaceId(face.faceId);
                      setModalSection("selectedFace");
                    }}
                    style={{ ...styles.faceCard, ...ui.faceCard, background: statusTone(face.value, face.lcl, face.ucl).soft }}
                  >
                    <div style={{ ...styles.faceTitle, ...ui.faceTitle }}>{face.label}</div>
                    <div style={{ ...styles.faceValue, color: statusTone(face.value, face.lcl, face.ucl).solid }}>
                      <AnimatedNumber value={face.value} decimals={1} />
                    </div>
                    <div style={{ ...styles.faceMeta, ...ui.faceMeta }}>
                      <span>{statusTone(face.value, face.lcl, face.ucl).text}</span>
                      <span>
                        LCL {face.lcl} / UCL {face.ucl}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...styles.panel, ...ui.panel }}>
              <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("selectedFace")}>
                <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Selected Face</span>
                <span style={styles.sectionTriggerText}>Open graph</span>
              </button>
              {selectedFace ? (
                <button type="button" style={{ ...styles.selectedFaceCard, ...ui.selectedFaceCard }} onClick={() => setModalSection("selectedFace")}>
                  <div style={{ ...styles.selectedFaceTitle, ...ui.selectedFaceTitle }}>{selectedFace.label}</div>
                  <div style={{ ...styles.selectedFaceValue, ...ui.selectedFaceValue }}>
                    <AnimatedNumber value={selectedFace.value} decimals={1} />
                  </div>
                  <div style={{ ...styles.selectedFaceMeta, ...ui.selectedFaceMeta }}>
                    Range: {selectedFace.lcl} to {selectedFace.ucl}
                  </div>
                </button>
              ) : null}
            </div>
          </aside>
        </section>

        <section style={{ ...styles.chartsPanel, ...ui.chartsPanel }}>
          <button type="button" style={styles.sectionTrigger} onClick={() => setModalSection("heatFlux")}>
            <span style={{ ...styles.panelTitle, ...ui.panelTitle, marginBottom: 0 }}>Heat Flux vs Casting Speed</span>
            <span style={styles.sectionTriggerText}>Open graph</span>
          </button>
          <div style={styles.chartsGrid}>
            {charts.map((chart) => (
              <button
                key={chart.faceId}
                type="button"
                style={{ ...styles.chartCard, ...ui.chartCard, ...styles.chartCardButton }}
                onClick={() => {
                  setSelectedFaceId(chart.faceId);
                  setModalSection("heatFlux");
                }}
              >
                <div style={{ ...styles.chartTitle, ...ui.chartTitle }}>{chart.label}</div>
                <svg viewBox="0 0 320 150" style={{ ...styles.chartSvg, ...ui.chartSvg }}>
                  <polyline
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="4"
                    points={chart.flux
                      .map((value, index) => {
                        const allValues = [...chart.flux, ...chart.lcl, ...chart.ucl];
                        const max = Math.max(...allValues, 1);
                        const min = Math.min(...allValues, 0);
                        const range = Math.max(max - min, 1);
                        return `${(index / Math.max(chart.flux.length - 1, 1)) * 320},${120 - ((value - min) / range) * 90}`;
                      })
                      .join(" ")}
                  />
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    points={chart.lcl
                      .map((value, index) => {
                        const allValues = [...chart.flux, ...chart.lcl, ...chart.ucl];
                        const max = Math.max(...allValues, 1);
                        const min = Math.min(...allValues, 0);
                        const range = Math.max(max - min, 1);
                        return `${(index / Math.max(chart.lcl.length - 1, 1)) * 320},${120 - ((value - min) / range) * 90}`;
                      })
                      .join(" ")}
                  />
                  <polyline
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    points={chart.ucl
                      .map((value, index) => {
                        const allValues = [...chart.flux, ...chart.lcl, ...chart.ucl];
                        const max = Math.max(...allValues, 1);
                        const min = Math.min(...allValues, 0);
                        const range = Math.max(max - min, 1);
                        return `${(index / Math.max(chart.ucl.length - 1, 1)) * 320},${120 - ((value - min) / range) * 90}`;
                      })
                      .join(" ")}
                  />
                </svg>
                <div style={{ ...styles.chartLegend, ...ui.chartLegend }}>
                  <span>Flux</span>
                  <span>LCL</span>
                  <span>UCL</span>
                </div>
                <div style={{ ...styles.chartAxis, ...ui.chartAxis }}>Casting Speed: {chart.castingSpeed.join(" / ")} m/min</div>
              </button>
            ))}
          </div>
        </section>
      </div>
      <SectionModal
        isOpen={Boolean(modalConfig?.option)}
        title={modalConfig?.title}
        subtitle={modalConfig?.subtitle}
        option={modalConfig?.option}
        onClose={() => setModalSection(null)}
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
            <div style={styles.modalTitle}>{title}</div>
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
      "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 28%), linear-gradient(145deg, #08111f 0%, #0f172a 48%, #020617 100%)",
    color: "#e2e8f0",
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
  container: { position: "relative", zIndex: 1, maxWidth: 1600, margin: "0 auto", padding: 24 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginBottom: 26 },
  eyebrow: { fontSize: 12, color: "#7dd3fc", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 },
  title: { margin: 0, fontSize: "clamp(2rem, 3vw, 3rem)", lineHeight: 1.05, fontWeight: 650 },
  selectWrap: { display: "grid", gap: 8 },
  selectLabel: { fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#93c5fd" },
  select: {
    minWidth: 180,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.72)",
    color: "#f8fafc",
    transition: "all 260ms ease",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18, marginBottom: 24 },
  statCard: {
    borderRadius: 18,
    padding: "16px 18px",
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 14px 34px rgba(2, 6, 23, 0.22)",
    transition: "all 280ms ease",
  },
  statLabel: { fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#93c5fd" },
  statValue: { marginTop: 10, fontSize: 28, fontWeight: 800, color: "#f8fafc" },
  statSubtext: { marginTop: 6, color: "#94a3b8" },
  mainGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, 0.85fr)", gap: 20, marginBottom: 24 },
  schematicPanel: {
    borderRadius: 24,
    padding: 20,
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 24px 60px rgba(2, 6, 23, 0.35)",
    transition: "all 280ms ease",
  },
  panel: {
    borderRadius: 24,
    padding: 18,
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 14px 34px rgba(2, 6, 23, 0.22)",
    transition: "all 280ms ease",
  },
  panelTitle: { fontSize: 16, fontWeight: 700, marginBottom: 14, color: "#f8fafc" },
  sectionTrigger: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textAlign: "left",
    marginBottom: 14,
  },
  sectionTriggerText: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  schematic: {
    minHeight: 710,
    borderRadius: 22,
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background:
      "linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.7)), radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 40%)",
    transition: "all 320ms ease",
  },
  referenceImageWrap: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    height: 480,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    zIndex: 1,
  },
  referenceImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    mixBlendMode: "multiply",
    background: "transparent",
  },
  ladle: {
    width: 170,
    height: 55,
    borderRadius: 20,
    background: "linear-gradient(180deg, #ffc94d 0%, #ffb347 24%, #ff8d1a 58%, #e76500 100%)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 10px 20px rgba(255, 140, 26, 0.25)",
    cursor: "pointer",
    zIndex: 4,
  },
  assetLabel: { fontSize: 16, fontWeight: 700, color: "#fff7ed" },
  tundish: {
    position: "absolute",
    top: 500,
    left: "50%",
    transform: "translateX(-50%)",
    width: 520,
    height: 72,
    borderRadius: 20,
    background: "linear-gradient(145deg, #1d4ed8, #38bdf8)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    zIndex: 2,
    transition: "all 260ms ease",
  },
  mouldRow: {
    position: "absolute",
    top: 360,
    left: "50%",
    width: 520,
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    zIndex: 4,
  },
  ladleRow: {
    position: "absolute",
    top: 280,
    left: "50%",
    width: 520,
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 4,
  },
  mouldCard: { width: 170, display: "grid", gap: 8, justifyItems: "center" },
  mouldHeader: { fontWeight: 700, color: "#e2e8f0" },
  mouldTank: {
    width: 170,
    height: 72,
    borderRadius: 20,
    background: "rgba(15, 23, 42, 0.88)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    position: "relative",
    overflow: "hidden",
    display: "grid",
    alignItems: "end",
    zIndex: 5,
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  mouldFill: {
    width: "100%",
    background: "linear-gradient(180deg, #ffd76a 0%, #ffb84a 28%, #ff9222 66%, #ef6c00 100%)",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    transition: "height 560ms cubic-bezier(0.22, 1, 0.36, 1), background 280ms ease",
  },
  mouldLabel: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    paddingTop: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "#f8fafc",
    zIndex: 4,
  },
  flowTrack: {
    position: "absolute",
    left: 96,
    right: 96,
    top: 600,
    height: 12,
    borderRadius: 999,
    background: "linear-gradient(90deg, #ef4444 0%, #f97316 35%, #f59e0b 62%, #22c55e 100%)",
    boxShadow: "0 0 30px rgba(249, 115, 22, 0.28)",
    zIndex: 2,
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  processBadges: {
    position: "absolute",
    left: 90,
    right: 90,
    top: 630,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
    zIndex: 3,
  },
  stageBadge: {
    padding: "13px 16px",
    borderRadius: 16,
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    textAlign: "center",
    fontWeight: 700,
    color: "#e2e8f0",
    boxShadow: "0 12px 26px rgba(2, 6, 23, 0.32)",
    transition: "all 260ms ease",
  },
  assetBadges: {
    position: "absolute",
    left: 90,
    right: 90,
    top: 520,
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 12,
    zIndex: 3,
  },
  assetBadgeLadle: {
    background: "linear-gradient(180deg, #ffd166 0%, #ffb347 28%, #ff8f1f 62%, #f06a00 100%)",
    color: "#fff7ed",
    textShadow: "0 1px 2px rgba(124, 45, 18, 0.35)",
  },
  assetBadgeTundish: {
    background: "linear-gradient(145deg, #1d4ed8, #38bdf8)",
    color: "#e0f2fe",
    textShadow: "0 1px 2px rgba(8, 47, 73, 0.4)",
  },
  processBadge: {
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(42, 17, 15, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    textAlign: "center",
    fontWeight: 700,
    boxShadow: "0 10px 24px rgba(148, 163, 184, 0.12)",
    transition: "all 260ms ease",
  },
  sidebar: { display: "grid", gap: 16, alignContent: "start" },
  faceGrid: { display: "grid", gap: 12 },
  faceCard: {
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(148, 163, 184, 0.16)",
    textAlign: "left",
    color: "#e2e8f0",
    cursor: "pointer",
    transition: "background 240ms ease, border-color 240ms ease, transform 220ms ease",
  },
  faceTitle: { fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#cbd5e1" },
  faceValue: { marginTop: 10, fontSize: 28, fontWeight: 800 },
  faceMeta: { marginTop: 8, display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12, color: "#cbd5e1" },
  selectedFaceCard: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(56, 189, 248, 0.08)",
    border: "1px solid rgba(56, 189, 248, 0.18)",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 260ms ease",
  },
  selectedFaceTitle: { fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7dd3fc" },
  selectedFaceValue: { marginTop: 10, fontSize: 34, fontWeight: 800, color: "#f8fafc" },
  selectedFaceMeta: { marginTop: 8, color: "#cbd5e1" },
  chartsPanel: {
    borderRadius: 24,
    padding: 20,
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 14px 34px rgba(2, 6, 23, 0.22)",
    transition: "all 280ms ease",
  },
  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 },
  chartCard: {
    borderRadius: 20,
    padding: 16,
    background: "rgba(2, 6, 23, 0.26)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    transition: "all 260ms ease",
  },
  chartCardButton: {
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    border: "none",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.42)",
    backdropFilter: "blur(6px)",
    display: "grid",
    placeItems: "center",
    zIndex: 1200,
    padding: 24,
    transition: "background 220ms ease",
  },
  modalCard: {
    width: "min(1080px, calc(100vw - 64px))",
    maxHeight: "calc(100vh - 64px)",
    overflow: "auto",
    background: "rgba(255,255,255,0.96)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 28px 80px rgba(15, 23, 42, 0.28)",
    transition: "all 260ms ease",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#10233c",
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#516b84",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "#ffffff",
    color: "#26435f",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
  },
  modalChart: {
    width: "100%",
    height: 460,
  },
  chartTitle: { fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 10 },
  chartSvg: { width: "100%", height: 190, background: "rgba(15, 23, 42, 0.72)", borderRadius: 16, padding: 10 },
  chartLegend: { marginTop: 10, display: "flex", gap: 16, color: "#cbd5e1", fontSize: 12 },
  chartAxis: { marginTop: 8, color: "#94a3b8", fontSize: 12 },
};
