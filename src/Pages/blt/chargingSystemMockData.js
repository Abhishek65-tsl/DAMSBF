const sensorCatalog = [
  { id: 1084, label: "Rotation Angle", unit: "deg", value: 33.2, avg: 32.4, trend: [30.2, 30.8, 31.3, 31.9, 32.4, 32.8, 33.2] },
  { id: 1083, label: "Tilting Angle", unit: "deg", value: 14.8, avg: 14.1, trend: [12.5, 12.9, 13.3, 13.9, 14.2, 14.5, 14.8] },
  { id: 1091, label: "Gear Box Temp", unit: "deg C", value: 65.4, avg: 63.8, trend: [60.3, 61.1, 61.9, 62.8, 63.9, 64.7, 65.4] },
  { id: 1123, label: "Hopper-1 WT", unit: "t", value: 258.4, avg: 260.2, trend: [252, 253.6, 254.4, 255.9, 257, 257.7, 258.4] },
  { id: 1124, label: "Hopper-2 WT", unit: "t", value: 261.7, avg: 263.1, trend: [255.2, 256.4, 257.8, 258.9, 259.8, 260.7, 261.7] },
  { id: 2406, label: "Hopper 1 Pre time", unit: "s", value: 12.4, avg: 11.9, trend: [10.2, 10.8, 11.1, 11.4, 11.7, 12.1, 12.4] },
  { id: 2407, label: "Hopper 1 de-Pre time", unit: "s", value: 9.3, avg: 8.8, trend: [7.2, 7.8, 8.1, 8.4, 8.7, 9.0, 9.3] },
  { id: 1117, label: "LMG Angle-1", unit: "deg", value: 26.8, avg: 25.9, trend: [24.2, 24.8, 25.2, 25.7, 26.0, 26.4, 26.8] },
  { id: 1408, label: "Furnace Top Temp", unit: "deg C", value: 312.6, avg: 305.4, trend: [294, 298, 301, 305, 307, 310, 312.6] },
  { id: 1407, label: "Furnace Top Pressure", unit: "bar", value: 1.8, avg: 1.7, trend: [1.5, 1.6, 1.6, 1.7, 1.7, 1.8, 1.8] },
  { id: 1023, label: "Tilting Motor Cur.", unit: "A", value: 37.2, avg: 35.8, trend: [31.2, 32.8, 33.9, 34.8, 35.6, 36.3, 37.2] },
  { id: 2404, label: "Hopper 2 Pre time", unit: "s", value: 13.1, avg: 12.4, trend: [11.1, 11.5, 11.9, 12.3, 12.6, 12.9, 13.1] },
  { id: 2405, label: "Hopper 2 de-Pre time", unit: "s", value: 10.2, avg: 9.6, trend: [8.2, 8.8, 9.0, 9.3, 9.6, 9.9, 10.2] },
  { id: 1120, label: "LMG Angle-2", unit: "deg", value: 28.3, avg: 27.2, trend: [25.5, 25.9, 26.4, 26.8, 27.2, 27.8, 28.3] },
  { id: 1021, label: "Rotating Motor Cur.", unit: "A", value: 34.1, avg: 33.2, trend: [29.1, 29.9, 30.7, 31.8, 32.9, 33.3, 34.1] },
  { id: 2434, label: "Rotation Motor Temperature-1", unit: "deg C", value: 56.1, avg: 55.4, trend: [52.2, 52.8, 53.7, 54.1, 54.8, 55.6, 56.1] },
  { id: 2435, label: "Rotation Motor Temperature-2", unit: "deg C", value: 57.4, avg: 56.6, trend: [53.4, 54.0, 54.8, 55.3, 55.9, 56.8, 57.4] },
  { id: 1047, label: "Hydraulic Pressure", unit: "bar", value: 168.7, avg: 165.2, trend: [158, 160.4, 162.1, 164.6, 166.2, 167.5, 168.7] }
];

const healthBreakdown = [
  { key: "weighingSystem", label: "Weighing System", value: 91.2, detail: { alertComp: 94, moComp: 89, noComp: 90 } },
  { key: "tiltingDrive", label: "Tilting Drive", value: 88.5, detail: { alertComp: 87, moComp: 90, noComp: 88 } },
  { key: "rotatingDrive", label: "Rotating Drive", value: 92.1, detail: { alertComp: 93, moComp: 91, noComp: 92 } },
  { key: "stockRod", label: "Stock Rod-1&2", value: 84.6, detail: { alertComp: 82, moComp: 86, noComp: 86 } },
  { key: "switchGear", label: "Switch Gear", value: 86.9, detail: { alertComp: 88, moComp: 84, noComp: 89 } },
  { key: "electrics", label: "Electrics", value: 89.8, detail: { alertComp: 91, moComp: 88, noComp: 90 } },
  { key: "instrument", label: "Instrument", value: 87.7, detail: { alertComp: 86, moComp: 89, noComp: 88 } }
];

const alarmSummary = {
  OPEN: 6,
  TOTAL: 71,
  CLOSE: 58,
  ACK: 49,
  recent: [
    "Hopper 2 pressurizing time exceeded rolling benchmark by 8%.",
    "Tilting motor current fluctuation detected during last charge cycle."
  ]
};

const alertDistribution = [
  { label: "Rotating Drive", value: 8 },
  { label: "Tilting Drive", value: 6 },
  { label: "Hopper System", value: 9 },
  { label: "Hydraulics", value: 4 },
  { label: "Switch Gear", value: 5 }
];

const moCompliance = [
  { label: "Planned", value: 95 },
  { label: "Released", value: 82 },
  { label: "Completed", value: 77 },
  { label: "Overdue", value: 18 }
];

function vary(value, spread = 0.04, digits = 1) {
  const next = value * (1 + (Math.random() - 0.5) * spread);
  return Number(next.toFixed(digits));
}

function wait(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSensor(id) {
  return sensorCatalog.find((item) => String(item.id) === String(id));
}

function buildDashboardPayload() {
  const hydPressure = vary(getSensor(1047).value, 0.02, 1);
  return {
    headerMetrics: [
      { id: 1084, label: "Rotation Angle", unit: "deg", value: vary(getSensor(1084).value, 0.02, 1) },
      { id: 1083, label: "Tilting Angle", unit: "deg", value: vary(getSensor(1083).value, 0.02, 1) },
      { id: 1091, label: "Gear Box Temp", unit: "deg C", value: vary(getSensor(1091).value, 0.02, 1) },
      { id: 1123, label: "Hopper-1 WT", unit: "t", value: vary(getSensor(1123).value, 0.015, 1) },
      { id: 1124, label: "Hopper-2 WT", unit: "t", value: vary(getSensor(1124).value, 0.015, 1) },
      { id: 1047, label: "Hyd. Pressure", unit: "bar", value: hydPressure },
      { id: "pump-status", label: "Pump Status", unit: "", value: hydPressure > 164 ? "PUMP-1" : "PUMP-2" }
    ],
    leftColumn: [
      { id: 2406, label: "Hopper 1 Pre time", unit: "s", value: vary(getSensor(2406).value, 0.03, 1) },
      { id: 2407, label: "Hopper 1 de-Pre time", unit: "s", value: vary(getSensor(2407).value, 0.03, 1) },
      { id: 1123, label: "Hopper 1 weight", unit: "t", value: vary(getSensor(1123).value, 0.015, 1) },
      { id: 1117, label: "LMG Angle-1", unit: "deg", value: vary(getSensor(1117).value, 0.03, 1) },
      { id: 1408, label: "Furnace Top Temp", unit: "deg C", value: vary(getSensor(1408).value, 0.025, 1) },
      { id: 1407, label: "Furnace Top Pressure", unit: "bar", value: vary(getSensor(1407).value, 0.02, 1) },
      { id: 1023, label: "Tilting Motor Cur.", unit: "A", value: vary(getSensor(1023).value, 0.025, 1) }
    ],
    rightColumn: [
      { id: 2404, label: "Hopper 2 Pre time", unit: "s", value: vary(getSensor(2404).value, 0.03, 1) },
      { id: 2405, label: "Hopper 2 de-Pre time", unit: "s", value: vary(getSensor(2405).value, 0.03, 1) },
      { id: 1124, label: "Hopper 2 weight", unit: "t", value: vary(getSensor(1124).value, 0.015, 1) },
      { id: 1120, label: "LMG Angle-2", unit: "deg", value: vary(getSensor(1120).value, 0.03, 1) },
      { id: 1083, label: "Chute Tilting Angle", unit: "deg", value: vary(getSensor(1083).value, 0.02, 1) },
      { id: 1084, label: "Chute Rotation Angle", unit: "deg", value: vary(getSensor(1084).value, 0.02, 1) },
      { id: 1021, label: "Rotating Motor Cur.", unit: "A", value: vary(getSensor(1021).value, 0.025, 1) }
    ],
    motorTemperature: [
      { id: 2434, label: "Rotation Motor Temperature-1", unit: "deg C", value: vary(getSensor(2434).value, 0.02, 1) },
      { id: 2435, label: "Rotation Motor Temperature-2", unit: "deg C", value: vary(getSensor(2435).value, 0.02, 1) }
    ]
  };
}

export async function fetchChargingDashboardMock() {
  await wait(180);
  return buildDashboardPayload();
}

export async function fetchChargingHealthMock() {
  await wait(200);
  return {
    items: healthBreakdown.map((item) => ({
      ...item,
      value: vary(item.value, 0.015, 1)
    })),
    overall: Number(
      (
        healthBreakdown.reduce((sum, item) => sum + item.value, 0) / healthBreakdown.length
      ).toFixed(1)
    )
  };
}

export async function fetchChargingAlarmSummaryMock() {
  await wait(160);
  return {
    ...alarmSummary,
    OPEN: Math.max(0, alarmSummary.OPEN + Math.round((Math.random() - 0.5) * 2)),
    TOTAL: alarmSummary.TOTAL + Math.round((Math.random() - 0.5) * 2),
    CLOSE: alarmSummary.CLOSE + Math.round((Math.random() - 0.5) * 2),
    ACK: alarmSummary.ACK + Math.round((Math.random() - 0.5) * 2)
  };
}

export async function fetchChargingAlertDistributionMock() {
  await wait(170);
  return alertDistribution.map((item) => ({
    ...item,
    value: Math.max(0, item.value + Math.round((Math.random() - 0.5) * 2))
  }));
}

export async function fetchChargingMoComplianceMock() {
  await wait(170);
  return moCompliance.map((item) => ({
    ...item,
    value: Math.min(100, Math.max(0, item.value + Math.round((Math.random() - 0.5) * 6)))
  }));
}

export async function fetchChargingTrendMock(tagId) {
  await wait(140);
  const source = getSensor(tagId);
  if (!source) return [];

  return source.trend.map((value, index) => ({
    label: `${index + 1}h`,
    value
  }));
}
