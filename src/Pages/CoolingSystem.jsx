import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Paper, Grid, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import coolingSystemImage from "../assets/Images/CoolingSystem.png";

// API endpoints
const API = {
  coolingData: "/Home/GetCoolingData",
  commonTags: "/Home/GetCommonTags",
  alarmCount: "/Home/AlarmCount",
  equipmentHealth: "/Home/CoolingEquipmentHealth",
  modelAlarmText: "/Home/ModelAlarmText",
  modata: "/Home/Modata",
  openAlertEquip: "/Home/OpenAlertEquip",
};

// Top metrics configuration
const topMetricsConfig = [
  { title: "Rotation Angle", tagId: "1084", unit: "°" },
  { title: "Tilting Angle", tagId: "1083", unit: "°" },
  { title: "Gear Box Temp", tagId: "1091", unit: "°C" },
  { title: "Hopper-1 WT", tagId: "1123", unit: "Tons" },
  { title: "Hopper-2 WT", tagId: "1124", unit: "Tons" },
  { title: "Hyd.Pressure", id: "txthydPressure", unit: "" },
  { title: "Hyd. Pump status", id: "txthydpumpstatusCS", unit: "" },
];

// Left side metrics configuration
const leftMetricsConfig = [
  { title: "Oil Temp. (Planetary – 1)", tagId: "1095", unit: "°C" },
  { title: "Barrier Water Level-1", tagId: "1097", unit: "mm" },
  { title: "Barrier Water Level-2", tagId: "1098", unit: "mm" },
  { title: "GB Casing Temp.-1", tagId: "1091", unit: "°C" },
  { title: "GB Casing Temp.-2", tagId: "1092", unit: "°C" },
  { title: "Make up Flow", tagId: "1172", unit: "m³" },
  { title: "Water barrier make up time", tagId: "1645", unit: "hrs" },
  { title: "Water barrier make up vol.", tagId: "1646", unit: "m³" },
];

// Right side metrics configuration
const rightMetricsConfig = [
  { title: "Oil Temp. (Planetary – 2)", tagId: "1096", unit: "°C" },
  { title: "Barrier Water Level-3", tagId: "1099", unit: "mm" },
  { title: "Barrier Water Level-4", tagId: "1100", unit: "mm" },
  { title: "GB Casing Temp.-3", tagId: "1093", unit: "°C" },
  { title: "GB Casing Temp.-4", tagId: "1094", unit: "°C" },
  { title: "Labyrinth make up time", tagId: "1647", unit: "hrs" },
  { title: "Labyrinth make up vol.", tagId: "1648", unit: "m³" },
];

// Utility function
function formatNumber(value, digits = 1) {
  if (value === null || value === undefined || value === "") return "NA";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "NA";
  return num.toFixed(digits);
}

// Value Component
function Value({ value, unit, onClick, clickable = false }) {
  return (
    <Box
      onClick={clickable ? onClick : undefined}
      sx={{
        background: "gainsboro",
        color: "black",
        padding: "2px 5px",
        fontWeight: "bold",
        fontSize: 17,
        cursor: clickable ? "pointer" : "default",
        userSelect: "none",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <span>{value}</span>
      {unit ? <span>{unit}</span> : null}
    </Box>
  );
}



// Custom Modal Component using MUI Dialog
function CoolingModal({ open, title, children, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

export default function CoolingSystem() {
  const topMetrics = useMemo(() => topMetricsConfig, []);
  const leftSideMetrics = useMemo(() => leftMetricsConfig, []);
  const rightSideMetrics = useMemo(() => rightMetricsConfig, []);

  const [latestByTag, setLatestByTag] = useState({});
  const [avgByTag, setAvgByTag] = useState({});
  const [hydPressure, setHydPressure] = useState("NA");
  const [pumpStatus, setPumpStatus] = useState("PUMP-1");
  const [alarmCounts, setAlarmCounts] = useState({
    TOTAL: "NA",
    OPEN: "NA",
    CLOSE: "NA",
    ACK: "NA",
  });
  const [recentAlarms, setRecentAlarms] = useState({ first: "", second: "" });
  const [equipmentHealthText, setEquipmentHealthText] = useState("");
  const [selectedTagForTrend, setSelectedTagForTrend] = useState(null);
  const [selectedCompliance, setSelectedCompliance] = useState(null);

  const postJson = useCallback(async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  }, []);

  const showTrend = useCallback((tagId) => setSelectedTagForTrend(tagId), []);

  const fetchCoolingData = useCallback(async () => {
    try {
      const data = await postJson(API.coolingData);
      if (!Array.isArray(data)) return;
      setLatestByTag((prev) => {
        const next = { ...prev };
        for (const row of data) {
          if (row?.Tag_Id === undefined || row?.Tag_Id === null) continue;
          next[String(row.Tag_Id)] = formatNumber(row.Tag_Value, 1);
        }
        return next;
      });
      setAvgByTag((prev) => {
        const next = { ...prev };
        for (const row of data) {
          if (row?.Tag_Id === undefined || row?.Tag_Id === null) continue;
          next[String(row.Tag_Id)] = formatNumber(row.Tag_Avg_Value, 1);
        }
        return next;
      });
    } catch {
      // noop
    }
  }, [postJson]);

  const fetchCommonCoolingData = useCallback(async () => {
    try {
      const data = await postJson(API.commonTags);
      setHydPressure(`${formatNumber(data?.IdPlcSeq_2426_Value, 1)} bar`);
      setPumpStatus(String(data?.PumpStatus ?? "NA"));

      for (const id of ["1645", "1646", "1647", "1648"]) {
        const key = `IdPlcSeq_${id}_Value`;
        const v = data?.[key];
        if (v !== undefined && v !== null) {
          setLatestByTag((prev) => ({ ...prev, [id]: formatNumber(v, 1) }));
        }
      }
    } catch {
      // noop
    }
  }, [postJson]);

  const fetchAlarmCount = useCallback(async () => {
    try {
      const data = await postJson(API.alarmCount, { EQUIP_ID: "COOLING" });
      setAlarmCounts({
        TOTAL: String(data?.TOTAL ?? "NA"),
        OPEN: String(data?.OPEN ?? "NA"),
        CLOSE: String(data?.CLOSE ?? "NA"),
        ACK: String(data?.ACK ?? "NA"),
      });
    } catch {
      // noop
    }
  }, [postJson]);

  const fetchAlarmText = useCallback(async () => {
    try {
      const data = await postJson(API.modelAlarmText, { EQUIP_ID: "COOLING" });
      if (!Array.isArray(data) || data.length === 0) return;
      setRecentAlarms({
        first: String(data?.[0]?.AlarmText ?? ""),
        second: String(data?.[1]?.AlarmText ?? ""),
      });
    } catch {
      // noop
    }
  }, [postJson]);

  const fetchEquipmentHealth = useCallback(async () => {
    try {
      const data = await postJson(API.equipmentHealth, { EQUIP_ID: "COOLING" });
      const motor = Number(data?.CoolingSystemMotor_Value);
      const instr = Number(data?.CoolingSystemInstr_Value);
      const swg = Number(data?.SWITCHGEAR_Value);
      const vals = [motor, instr, swg].filter((n) => Number.isFinite(n));
      if (vals.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        setEquipmentHealthText(`Equipment Health : ${avg.toFixed(2)} %`);
      } else {
        setEquipmentHealthText("");
      }
    } catch {
      // noop
    }
  }, [postJson]);

  useEffect(() => {
    fetchCoolingData();
    fetchCommonCoolingData();
    fetchAlarmCount();
    fetchEquipmentHealth();
    fetchAlarmText();

    const interval = window.setInterval(() => {
      fetchCoolingData();
    }, 300000);

    return () => window.clearInterval(interval);
  }, [
    fetchAlarmCount,
    fetchAlarmText,
    fetchCommonCoolingData,
    fetchCoolingData,
    fetchEquipmentHealth,
  ]);

  return (
    <Box 
      sx={{ 
        backgroundColor: '#d0cccc', 
        minHeight: "110vh", 
        color: "white", 
        padding: 1.25 
      }}>
      {/* Header */}
      <Box
        sx={{
          background: "rgba(220,220,220,255)",
          color: "black",
          fontSize: 23,
          fontWeight: "bold",
          textAlign: "center",
          padding: "6px 0",
          marginBottom: 1.25,
        }}
      >
        COOLING SYSTEM
      </Box>

      {/* Top Metrics */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 1.25 }}>
        {topMetrics.map((m) => (
          <Box key={m.tagId ?? m.id} sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                background: "#558ed5",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "4px 6px",
                fontSize: 20,
              }}
            >
              {m.title}
            </Box>
            <Box sx={{ paddingTop: "2px" }}>
              <Value
                value={
                  m.id === "txthydPressure"
                    ? hydPressure
                    : m.id === "txthydpumpstatusCS"
                      ? pumpStatus
                      : latestByTag[m.tagId] ?? "NA"
                }
                unit={m.tagId ? m.unit : ""}
                onClick={m.tagId ? () => showTrend(m.tagId) : undefined}
                clickable
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Main Grid Layout */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" }, 
        gap: { xs: 1, md: 1 }, 
        marginBottom: 1.25,
        height: { xs: "auto", md: "75vh" }, // ✅ IMPORTANT
        alignItems: "stretch", // ✅ force equal height
      }}>
        {/* Left Side Metrics */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 1.75, 
            flex: { xs: "auto", md: 1 },
            width: { xs: "100%", md: "auto" },
            height: '100%',
          }}
          >
            {leftSideMetrics.map((m) => (
              <Box key={m.tagId} sx={{ flex: 1 }}>
                <Box
                  sx={{
                    background: "#558ed5",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "2px 4px",
                    fontSize: 14,
                  }}
                >
                  {m.title}
                </Box>
                <Box sx={{ marginTop: 0.25 }}>
                  <Value
                    value={latestByTag[m.tagId] ?? "NA"}
                    unit={m.unit}
                    onClick={() => showTrend(m.tagId)}
                    clickable
                  />
                </Box>
              </Box>
            ))}
        </Box>

        {/* Center Image Placeholder */}
        <Box
          sx={{
            flex: { xs: "auto", md: 2.5 },
            height: "100%",
            width: { xs: "100%", md: "auto" },
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.75)",
            fontWeight: 600,
            overflow: "auto",
          }}
        >
          <Box
            component="img"
            src={coolingSystemImage}
            alt="Cooling System Diagram"
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Right Side Metrics */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 1.75,
            flex: { xs: "auto", md: 1 },
            width: { xs: "100%", md: "auto" },
            height: "100%",
          }}
        >
          {rightSideMetrics.map((m) => (
            <Box key={m.tagId} sx={{ flex: 1 }}>
              <Box
                sx={{
                  background: "#558ed5",
                  color: "black",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: "2px 4px",
                  fontSize: 14,
                }}
              >
                {m.title}
              </Box>
              <Box sx={{ marginTop: 0.25 }}>
                <Value
                  value={latestByTag[m.tagId] ?? "NA"}
                  unit={m.unit}
                  onClick={() => showTrend(m.tagId)}
                  clickable
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Side Panels */}
        <Box sx={{ 
          flex: { xs: "auto", md: 2.5 },
          width: { xs: "100%", md: "auto" },
          height: "100%",
          display: "flex", 
          flexDirection: "column", 
          gap: 1 
        }}>
          {/* Equipment Health */}
          <Paper sx={{ border: "2px solid black", borderBottom: "none" }}>
            <Box
              sx={{
                background: "#558ed5",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "6px 8px",
              }}
            >
              <Typography variant="body2" id="txtCoolingPer">
                {equipmentHealthText}
              </Typography>
            </Box>
          </Paper>

          {/* Compliance Gauges */}
          <Paper sx={{ border: "2px solid black", p: 0.75 }}>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              {[
                { title: "COOLING SYSTEM MOTOR", key: "COOLINGSYSTEMMOTOR" },
                { title: "COOLING SYSTEM INSTR", key: "COOLSYSTEMINSTR" },
                { title: "SWITCH GEAR", key: "SWITCHGEAR" },
              ].map((x) => (
                <Box key={x.key} sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      fontSize: 12,
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#558ed5",
                      color: "black",
                      padding: "4px 6px",
                    }}
                  >
                    {x.title}
                  </Box>
                  <Box
                    id={
                      x.key === "COOLINGSYSTEMMOTOR"
                        ? "COOLINGSYSTEMMOTORchart-container1"
                        : x.key === "COOLSYSTEMINSTR"
                          ? "COOLSYSTEMINSTRchart-container2"
                          : "COOLSYSTEMINSTRchart-container3"
                    }
                    sx={{
                      height: 80,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 0.75,
                      marginTop: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedCompliance(x.title)}
                    role="button"
                    tabIndex={0}
                  >
                    <Typography variant="caption">Gauge placeholder</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Recent Alarm */}
          <Paper sx={{ border: "2px solid black", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Recent Alarm
              </Typography>
              <Box
                component="button"
                onClick={() => setSelectedCompliance("Alarm Details")}
                sx={{
                  background: "transparent",
                  border: "none",
                  color: "deepskyblue",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                View details
              </Box>
            </Box>
            <Typography variant="body2" id="txtCoolingFirstLine" sx={{ marginTop: 0.75, color: "white" }}>
              {recentAlarms.first}
            </Typography>
            <Typography variant="body2" id="txtCoolingSecondLine" sx={{ marginTop: 0.75, color: "white" }}>
              {recentAlarms.second}
            </Typography>
          </Paper>

          {/* Alert Counts */}
          <Paper sx={{ border: "2px solid black", p: 0 }}>
            <Grid container>
              <Grid item xs={3} sx={{ background: "#16a34a", padding: 1.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "black" }}>
                  <span id="txtCoolingTotalAlaert">{alarmCounts.TOTAL}</span> Total Alerts
                </Typography>
              </Grid>
              <Grid item xs={3} sx={{ background: "#0ea5e9", padding: 1.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "black" }}>
                  <span id="txtCoolingOpen">{alarmCounts.OPEN}</span> Open Alerts
                </Typography>
              </Grid>
              <Grid item xs={3} sx={{ background: "#f59e0b", padding: 1.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "black" }}>
                  <span id="txtCoolingClosed">{alarmCounts.CLOSE}</span> Closed Alert
                </Typography>
              </Grid>
              <Grid item xs={3} sx={{ background: "white", padding: 1.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "black" }}>
                  <span id="txtCoolingTotalAck">{alarmCounts.ACK}</span> Ack Alert
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Alerts Bar Chart */}
          <Paper sx={{ border: "2px solid black" }}>
            <Box
              id="Cooling-container"
              sx={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Typography variant="body2">Alerts bar chart placeholder</Typography>
            </Box>
          </Paper>

          {/* SAP PM MO Compliance */}
          <Paper sx={{ border: "2px solid black", borderBottom: "none" }}>
            <Box
              sx={{
                background: "#558ed5",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
                padding: "8px 10px",
              }}
            >
              <Typography variant="body2">SAP PM MO Compliance</Typography>
            </Box>
          </Paper>
          <Paper sx={{ border: "2px solid black" }}>
            <Box
              id="sap-pmo"
              sx={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Typography variant="body2">Compliance chart placeholder</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

    </Box>
  );
}