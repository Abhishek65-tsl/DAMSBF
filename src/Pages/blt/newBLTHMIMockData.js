const operationsMetrics = [
  { id: 1711, label: "Wind Volume", unit: "knm3/hr", value: 364.8, trend: [351, 354, 356, 358, 360, 362, 364.8] },
  { id: 1407, label: "Top Gas Pressure", unit: "bar", value: 1.9, trend: [1.5, 1.6, 1.6, 1.7, 1.8, 1.8, 1.9] },
  { id: 1408, label: "Top Gas Temp", unit: "deg C", value: 298.4, trend: [281, 285, 288, 291, 294, 296, 298.4] },
  { id: 2958, label: "HBT", unit: "deg C", value: 1147.2, trend: [1124, 1128, 1133, 1137, 1140, 1144, 1147.2] },
  { id: 2950, label: "HBP", unit: "bar", value: 3.6, trend: [3.1, 3.2, 3.3, 3.4, 3.4, 3.5, 3.6] },
  { id: 1572, label: "PCI Rate", unit: "Tons/Hr", value: 14.8, trend: [12.6, 12.9, 13.3, 13.8, 14.1, 14.4, 14.8] },
  { id: 1573, label: "PCI Rate THM", unit: "Kg/THM", value: 125.4, trend: [116, 118, 119, 121, 122, 124, 125.4] }
];

const maintenanceMetrics = [
  { id: 1084, label: "Rotation Angle", unit: "deg", value: 33.1, trend: [30.4, 30.9, 31.5, 31.9, 32.3, 32.7, 33.1] },
  { id: 1083, label: "Tilting Angle", unit: "deg", value: 14.3, trend: [12.0, 12.4, 12.8, 13.2, 13.6, 13.9, 14.3] },
  { id: 1091, label: "Gear Box Temp", unit: "deg C", value: 63.8, trend: [59.8, 60.5, 61.1, 61.9, 62.4, 63.0, 63.8] },
  { id: 1123, label: "Hopper-1 WT", unit: "t", value: 258.3, trend: [253.8, 254.9, 255.6, 256.3, 257.0, 257.6, 258.3] },
  { id: 1124, label: "Hopper-2 WT", unit: "t", value: 261.5, trend: [256.2, 257.0, 258.2, 259.1, 259.8, 260.7, 261.5] },
  { id: 2426, label: "Hyd. Pressure", unit: "bar", value: 173.8, trend: [166.4, 168.0, 169.1, 170.2, 171.4, 172.6, 173.8] }
];

const plantSideMetrics = [
  { id: 1717, label: "Oil particle counter-1", unit: "ppm", value: 11.8, trend: [9.6, 10.1, 10.4, 10.8, 11.0, 11.4, 11.8] },
  { id: 1718, label: "Oil particle counter-2", unit: "ppm", value: 12.2, trend: [10.0, 10.5, 10.8, 11.1, 11.5, 11.8, 12.2] },
  { id: 1719, label: "Oil particle counter-3", unit: "ppm", value: 13.1, trend: [10.8, 11.1, 11.5, 11.9, 12.2, 12.6, 13.1] },
  { id: 2424, label: "LMG-1 Operating Time", unit: "s", value: 9.4, trend: [7.8, 8.0, 8.3, 8.6, 8.9, 9.1, 9.4] },
  { id: 2425, label: "LMG-2 Operating Time", unit: "s", value: 9.8, trend: [8.1, 8.4, 8.7, 9.0, 9.2, 9.5, 9.8] },
  { id: 1095, label: "GB Oil Temp", unit: "deg C", value: 58.4, trend: [54.7, 55.2, 55.9, 56.3, 56.9, 57.6, 58.4] },
  { id: 1649, label: "Greasing Fast Cycle", unit: "sec", value: 68.2, trend: [54, 56, 58, 60, 62, 65, 68.2] }
];

const sectionHealth = [
  { key: "charging", label: "Charging System", value: 91.4, detail: { alertComp: 93, moComp: 90, noComp: 91 } },
  { key: "valve", label: "Valve System", value: 88.9, detail: { alertComp: 89, moComp: 88, noComp: 90 } },
  { key: "cooling", label: "Cooling System", value: 90.7, detail: { alertComp: 92, moComp: 89, noComp: 91 } },
  { key: "hydraulic", label: "Hydraulic System", value: 87.6, detail: { alertComp: 86, moComp: 88, noComp: 89 } }
];

const alarmSummary = {
  OPEN: 6,
  TOTAL: 58,
  CLOSE: 45,
  ACK: 39,
  recent: [
    "Greasing fast cycle exceeded the 60-second threshold in the last operating cycle.",
    "Hydraulic section health dipped due to line-pressure variance and recent open alerts."
  ]
};

const alertDistribution = [
  { label: "Charging", value: 8 },
  { label: "Valve", value: 7 },
  { label: "Cooling", value: 5 },
  { label: "Hydraulic", value: 6 },
  { label: "Common BLT", value: 4 }
];

const moCompliance = [
  { label: "Planned", value: 94 },
  { label: "Released", value: 86 },
  { label: "Completed", value: 80 },
  { label: "Overdue", value: 17 }
];

const gfcInfo = {
  lastCycle: "68.2 sec",
  maxValue: "72.4 sec",
  minValue: "49.8 sec",
  pointsMissed: "5"
};

function vary(value, spread = 0.04, digits = 1) {
  const next = value * (1 + (Math.random() - 0.5) * spread);
  return Number(next.toFixed(digits));
}

function wait(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function allMetrics() {
  return [...operationsMetrics, ...maintenanceMetrics, ...plantSideMetrics];
}

function findMetric(id) {
  return allMetrics().find((item) => String(item.id) === String(id));
}

export async function fetchBLTDashboardMock() {
  await wait(180);
  const hydraulicPressure = vary(findMetric(2426).value, 0.02, 1);
  return {
    operationsMetrics: operationsMetrics.map((item) => ({
      ...item,
      value: vary(item.value, item.unit === "bar" ? 0.025 : 0.02, 1)
    })),
    maintenanceMetrics: [
      ...maintenanceMetrics.slice(0, 5).map((item) => ({
        ...item,
        value: vary(item.value, item.unit === "t" ? 0.015 : 0.02, 1)
      })),
      {
        ...maintenanceMetrics[5],
        value: hydraulicPressure
      },
      { id: "pump-status", label: "Pump Status", unit: "", value: hydraulicPressure > 171 ? "PUMP-1" : "PUMP-2" }
    ],
    plantLeft: [
      {
        id: "particle-counter",
        label: "Oil Tank Particle Counter",
        unit: "ppm",
        values: [
          vary(findMetric(1717).value, 0.04, 1),
          vary(findMetric(1718).value, 0.04, 1),
          vary(findMetric(1719).value, 0.04, 1)
        ]
      },
      { id: 2426, label: "Hydraulic Pressure", unit: "bar", value: hydraulicPressure },
      { id: 1123, label: "Hopper1 Weight", unit: "t", value: vary(findMetric(1123).value, 0.015, 1) },
      { id: 2424, label: "LMG-1 Operating Time", unit: "s", value: vary(findMetric(2424).value, 0.04, 1) },
      { id: "gb-casing", label: "GB Casing Temp", unit: "deg C", value: 61.6, tagId: "GB_DYNAMIC" },
      { id: 1084, label: "Chute Rotation Angle", unit: "deg", value: vary(findMetric(1084).value, 0.02, 1) }
    ],
    plantRight: [
      { id: 1649, label: "Greasing Fast Cycle", unit: "sec", value: vary(findMetric(1649).value, 0.05, 1) },
      { id: "pump-status-lower", label: "Hyd Pump Status", unit: "", value: hydraulicPressure > 171 ? "PUMP-1" : "PUMP-2" },
      { id: 1124, label: "Hopper2 Weight", unit: "t", value: vary(findMetric(1124).value, 0.015, 1) },
      { id: 2425, label: "LMG-2 Operating Time", unit: "s", value: vary(findMetric(2425).value, 0.04, 1) },
      { id: 1095, label: "GB Oil Temp", unit: "deg C", value: vary(findMetric(1095).value, 0.02, 1) },
      { id: 1083, label: "Chute Tilting Angle", unit: "deg", value: vary(findMetric(1083).value, 0.02, 1) }
    ]
  };
}

export async function fetchBLTSectionHealthMock() {
  await wait(190);
  return {
    items: sectionHealth.map((item) => ({
      ...item,
      value: vary(item.value, 0.015, 1)
    })),
    overall: Number((sectionHealth.reduce((sum, item) => sum + item.value, 0) / sectionHealth.length).toFixed(1))
  };
}

export async function fetchBLTAlarmSummaryMock() {
  await wait(160);
  return {
    ...alarmSummary,
    OPEN: Math.max(0, alarmSummary.OPEN + Math.round((Math.random() - 0.5) * 2)),
    TOTAL: alarmSummary.TOTAL + Math.round((Math.random() - 0.5) * 2),
    CLOSE: alarmSummary.CLOSE + Math.round((Math.random() - 0.5) * 2),
    ACK: alarmSummary.ACK + Math.round((Math.random() - 0.5) * 2)
  };
}

export async function fetchBLTAlertDistributionMock() {
  await wait(170);
  return alertDistribution.map((item) => ({
    ...item,
    value: Math.max(0, item.value + Math.round((Math.random() - 0.5) * 2))
  }));
}

export async function fetchBLTMoComplianceMock() {
  await wait(170);
  return moCompliance.map((item) => ({
    ...item,
    value: Math.min(100, Math.max(0, item.value + Math.round((Math.random() - 0.5) * 6)))
  }));
}

export async function fetchBLTGfcDetailsMock() {
  await wait(120);
  return gfcInfo;
}

export async function fetchBLTTrendMock(tagId) {
  await wait(140);
  const metric = findMetric(tagId);
  if (metric) {
    return metric.trend.map((value, index) => ({
      label: `${index + 1}h`,
      value
    }));
  }

  if (tagId === "GB_DYNAMIC") {
    return [57.1, 57.8, 58.3, 59.2, 60.1, 60.8, 61.6].map((value, index) => ({
      label: `${index + 1}h`,
      value
    }));
  }

  return [];
}
