const topMetrics = [
  { id: 1084, label: "Rotation Angle", unit: "deg", value: 32.7, avg: 31.9, trend: [29.8, 30.4, 30.9, 31.3, 31.8, 32.2, 32.7] },
  { id: 1083, label: "Tilting Angle", unit: "deg", value: 14.1, avg: 13.5, trend: [11.9, 12.3, 12.8, 13.1, 13.5, 13.8, 14.1] },
  { id: 1091, label: "Gear Box Temp", unit: "deg C", value: 63.7, avg: 62.4, trend: [59.8, 60.4, 61.1, 61.8, 62.3, 63.0, 63.7] },
  { id: 1123, label: "Hopper-1 WT", unit: "t", value: 256.2, avg: 257.8, trend: [251.8, 252.9, 253.7, 254.3, 255.1, 255.7, 256.2] },
  { id: 1124, label: "Hopper-2 WT", unit: "t", value: 259.4, avg: 260.6, trend: [253.9, 254.6, 255.8, 256.9, 257.8, 258.6, 259.4] },
  { id: 1047, label: "Hyd. Pressure", unit: "bar", value: 171.6, avg: 169.2, trend: [164.3, 165.7, 167.1, 168.2, 169.1, 170.2, 171.6] }
];

const valveMatrix = [
  { key: "usv1", label: "USV-1", detailLabel: "USV-1", openTag: 1625, closeTag: 1626, open: 10.8, close: 11.4, health: 92.4 },
  { key: "usv2", label: "USV-2", detailLabel: "USV-2", openTag: 1627, closeTag: 1628, open: 12.1, close: 12.8, health: 90.7 },
  { key: "lsv1", label: "LSV-1", detailLabel: "LSV-1", openTag: 1599, closeTag: 1598, open: 9.7, close: 10.2, health: 89.8 },
  { key: "lsv2", label: "LSV-2", detailLabel: "LSV-2", openTag: 1601, closeTag: 1600, open: 10.4, close: 10.9, health: 88.9 },
  { key: "rv1", label: "RV-1", detailLabel: "RV-1", openTag: 1607, closeTag: 1606, open: 13.6, close: 14.1, health: 87.1 },
  { key: "rv2", label: "RV-2", detailLabel: "RV-2", openTag: 1609, closeTag: 1608, open: 12.9, close: 13.4, health: 86.5 },
  { key: "pev1", label: "PEV-1", detailLabel: "PEV-1", openTag: 1603, closeTag: 1602, open: 8.9, close: 9.5, health: 91.2 },
  { key: "pev2", label: "PEV-2", detailLabel: "PEV-2", openTag: 1605, closeTag: 1604, open: 9.4, close: 9.8, health: 90.2 },
  { key: "sev1", label: "SEV-1", detailLabel: "SEV-1", openTag: 1611, closeTag: 1610, open: 11.8, close: 12.1, health: 88.4 },
  { key: "sev2", label: "SEV-2", detailLabel: "SEV-2", openTag: 1402, closeTag: 1612, open: 12.7, close: 13.3, health: 87.6 }
];

const healthBreakdown = [
  { key: "usv", label: "USV", value: 92.4, detail: { alertComp: 94, moComp: 91, noComp: 92 } },
  { key: "lsv", label: "LSV", value: 89.6, detail: { alertComp: 90, moComp: 88, noComp: 91 } },
  { key: "reliefValve", label: "Relief Valve", value: 87.8, detail: { alertComp: 86, moComp: 89, noComp: 88 } },
  { key: "emergencyRelief", label: "Emergency Relief Valve", value: 86.9, detail: { alertComp: 85, moComp: 88, noComp: 88 } },
  { key: "pev", label: "PEV", value: 91.1, detail: { alertComp: 92, moComp: 90, noComp: 91 } },
  { key: "sev", label: "SEV", value: 88.7, detail: { alertComp: 88, moComp: 89, noComp: 89 } },
  { key: "instrument", label: "Instrument", value: 93.2, detail: { alertComp: 94, moComp: 92, noComp: 94 } }
];

const alarmSummary = {
  OPEN: 8,
  TOTAL: 63,
  CLOSE: 49,
  ACK: 44,
  recent: [
    "RV-1 close response time exceeded 14 seconds during the last charge cycle.",
    "SEV-2 opening response drifting upward against previous-day average."
  ]
};

const alertDistribution = [
  { label: "USV", value: 9 },
  { label: "LSV", value: 7 },
  { label: "Relief", value: 8 },
  { label: "PEV", value: 4 },
  { label: "SEV", value: 6 }
];

const moCompliance = [
  { label: "Planned", value: 93 },
  { label: "Released", value: 85 },
  { label: "Completed", value: 81 },
  { label: "Overdue", value: 19 }
];

function vary(value, spread = 0.04, digits = 1) {
  const next = value * (1 + (Math.random() - 0.5) * spread);
  return Number(next.toFixed(digits));
}

function wait(ms = 190) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findMetric(id) {
  return topMetrics.find((item) => String(item.id) === String(id));
}

function findValveTag(id) {
  const valve = valveMatrix.find(
    (item) => String(item.openTag) === String(id) || String(item.closeTag) === String(id)
  );
  if (!valve) return null;
  const isOpen = String(valve.openTag) === String(id);
  const base = isOpen ? valve.open : valve.close;
  return {
    label: `${valve.label} ${isOpen ? "Open" : "Close"} Response`,
    unit: "sec",
    trend: [base - 1.8, base - 1.4, base - 1.1, base - 0.8, base - 0.4, base - 0.2, base]
  };
}

export async function fetchValveDashboardMock() {
  await wait(180);
  const hyd1 = vary(findMetric(1047).value, 0.02, 1);
  const hyd2 = vary(findMetric(1047).value - 1.8, 0.02, 1);

  return {
    headerMetrics: [
      { id: 1084, label: "Rotation Angle", unit: "deg", value: vary(findMetric(1084).value, 0.02, 1) },
      { id: 1083, label: "Tilting Angle", unit: "deg", value: vary(findMetric(1083).value, 0.02, 1) },
      { id: 1091, label: "Gear Box Temp", unit: "deg C", value: vary(findMetric(1091).value, 0.02, 1) },
      { id: 1123, label: "Hopper-1 WT", unit: "t", value: vary(findMetric(1123).value, 0.015, 1) },
      { id: 1124, label: "Hopper-2 WT", unit: "t", value: vary(findMetric(1124).value, 0.015, 1) },
      { id: hyd1 > hyd2 ? 1047 : 1048, label: "Hyd. Pressure", unit: "bar", value: Math.max(hyd1, hyd2) },
      { id: "pump-status", label: "Pump Status", unit: "", value: hyd1 > hyd2 ? "PUMP-1" : "PUMP-2" }
    ],
    valveCards: valveMatrix.map((item) => ({
      ...item,
      open: vary(item.open, 0.05, 1),
      close: vary(item.close, 0.05, 1),
      status: Math.max(item.open, item.close) > 13.5 ? "Watch" : "Healthy"
    }))
  };
}

export async function fetchValveHealthMock() {
  await wait(190);
  return {
    items: healthBreakdown.map((item) => ({
      ...item,
      value: vary(item.value, 0.015, 1)
    })),
    overall: Number(
      (healthBreakdown.reduce((sum, item) => sum + item.value, 0) / healthBreakdown.length).toFixed(1)
    )
  };
}

export async function fetchValveAlarmSummaryMock() {
  await wait(160);
  return {
    ...alarmSummary,
    OPEN: Math.max(0, alarmSummary.OPEN + Math.round((Math.random() - 0.5) * 2)),
    TOTAL: alarmSummary.TOTAL + Math.round((Math.random() - 0.5) * 2),
    CLOSE: alarmSummary.CLOSE + Math.round((Math.random() - 0.5) * 2),
    ACK: alarmSummary.ACK + Math.round((Math.random() - 0.5) * 2)
  };
}

export async function fetchValveAlertDistributionMock() {
  await wait(170);
  return alertDistribution.map((item) => ({
    ...item,
    value: Math.max(0, item.value + Math.round((Math.random() - 0.5) * 2))
  }));
}

export async function fetchValveMoComplianceMock() {
  await wait(170);
  return moCompliance.map((item) => ({
    ...item,
    value: Math.min(100, Math.max(0, item.value + Math.round((Math.random() - 0.5) * 6)))
  }));
}

export async function fetchValveTrendMock(tagId) {
  await wait(140);
  const top = findMetric(tagId);
  if (top) {
    return top.trend.map((value, index) => ({
      label: `${index + 1}h`,
      value
    }));
  }

  const valve = findValveTag(tagId);
  if (!valve) return [];

  return valve.trend.map((value, index) => ({
    label: `${index + 1}h`,
    value
  }));
}
