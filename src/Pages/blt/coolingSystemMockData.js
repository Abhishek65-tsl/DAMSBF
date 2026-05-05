const sensorCatalog = [
  { id: 1084, label: "Rotation Angle", unit: "deg", value: 34.8, avg: 33.9, trend: [31, 32, 32.4, 33, 33.6, 34.1, 34.8] },
  { id: 1083, label: "Tilting Angle", unit: "deg", value: 12.6, avg: 11.8, trend: [10.4, 10.9, 11.2, 11.5, 11.9, 12.2, 12.6] },
  { id: 1091, label: "Gear Box Temp", unit: "deg C", value: 63.4, avg: 61.7, trend: [56, 57.2, 58.5, 60.3, 61.2, 62.5, 63.4] },
  { id: 1123, label: "Hopper-1 WT", unit: "Tons", value: 21.8, avg: 22.1, trend: [20.8, 21.1, 21.3, 21.7, 22.2, 22.1, 21.8] },
  { id: 1124, label: "Hopper-2 WT", unit: "Tons", value: 18.4, avg: 19.1, trend: [17.6, 17.9, 18.1, 18.8, 19.4, 18.9, 18.4] },
  { id: 1095, label: "Oil Temp. (Planetary - 1)", unit: "deg C", value: 58.1, avg: 57.2, trend: [54.1, 54.7, 55.3, 56.8, 57.1, 57.7, 58.1] },
  { id: 1097, label: "Barrier Water Level-1", unit: "mm", value: 372, avg: 365, trend: [350, 354, 359, 362, 366, 369, 372] },
  { id: 1098, label: "Barrier Water Level-2", unit: "mm", value: 381, avg: 376, trend: [360, 365, 367, 372, 376, 379, 381] },
  { id: 1092, label: "GB Casing Temp.-2", unit: "deg C", value: 61.2, avg: 60.1, trend: [57.3, 57.9, 58.4, 59.2, 60.3, 60.9, 61.2] },
  { id: 1172, label: "Make up Flow", unit: "m3", value: 14.7, avg: 13.9, trend: [11.1, 11.8, 12.6, 13.4, 13.8, 14.2, 14.7] },
  { id: 1645, label: "Water barrier make up time", unit: "hrs", value: 4.6, avg: 4.3, trend: [3.8, 4.0, 4.1, 4.2, 4.4, 4.5, 4.6] },
  { id: 1646, label: "Water barrier make up vol.", unit: "m3", value: 8.3, avg: 7.9, trend: [7.1, 7.3, 7.4, 7.7, 7.8, 8.1, 8.3] },
  { id: 1096, label: "Oil Temp. (Planetary - 2)", unit: "deg C", value: 57.3, avg: 56.5, trend: [53.4, 54.1, 54.8, 55.6, 56.1, 56.8, 57.3] },
  { id: 1099, label: "Barrier Water Level-3", unit: "mm", value: 388, avg: 380, trend: [365, 369, 373, 376, 381, 384, 388] },
  { id: 1100, label: "Barrier Water Level-4", unit: "mm", value: 394, avg: 389, trend: [371, 376, 381, 385, 388, 391, 394] },
  { id: 1093, label: "GB Casing Temp.-3", unit: "deg C", value: 62.1, avg: 60.8, trend: [57.9, 58.2, 59.1, 59.9, 60.7, 61.3, 62.1] },
  { id: 1094, label: "GB Casing Temp.-4", unit: "deg C", value: 61.8, avg: 60.6, trend: [57.1, 58.3, 58.9, 59.8, 60.4, 61.1, 61.8] },
  { id: 1647, label: "Labyrinth make up time", unit: "hrs", value: 3.7, avg: 3.4, trend: [2.9, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7] },
  { id: 1648, label: "Labyrinth make up vol.", unit: "m3", value: 6.1, avg: 5.8, trend: [5.0, 5.2, 5.4, 5.5, 5.7, 5.9, 6.1] }
];

const healthBreakdown = [
  { key: "coolingSystemMotor", label: "Cooling System Motor", value: 93.8, detail: { alertComp: 96, moComp: 92, noComp: 94 } },
  { key: "coolingSystemInstr", label: "Cooling System Instr", value: 89.6, detail: { alertComp: 90, moComp: 88, noComp: 91 } },
  { key: "switchGear", label: "Switch Gear", value: 85.2, detail: { alertComp: 84, moComp: 87, noComp: 85 } }
];

const alarms = {
  OPEN: 4,
  TOTAL: 56,
  CLOSE: 47,
  ACK: 41,
  recent: [
    "Barrier water level-2 deviated above normal operating band.",
    "Gearbox casing temperature-4 drifting upward for the last 15 minutes."
  ]
};

const equipmentAlerts = [
  { label: "Cooling Motor", value: 9 },
  { label: "Instr Panels", value: 5 },
  { label: "Switch Gear", value: 7 },
  { label: "Hyd. Station", value: 3 },
  { label: "Barrier Line", value: 6 }
];

const moCompliance = [
  { label: "Planned", value: 92 },
  { label: "In Progress", value: 68 },
  { label: "Closed", value: 84 },
  { label: "Overdue", value: 21 }
];

const commonTags = {
  hydraulicPressure: { tagId: 2426, value: 172.4, unit: "bar" },
  pumpStatus: "PUMP-1",
  waterBarrierTimeMax: 4.9,
  waterBarrierVolumeMax: 8.8,
  labyrinthTimeMax: 3.9,
  labyrinthVolumeMax: 6.5
};

function vary(value, spread = 0.04, digits = 1) {
  const next = value * (1 + (Math.random() - 0.5) * spread);
  return Number(next.toFixed(digits));
}

function buildTagPayload() {
  return sensorCatalog.map((item) => ({
    Tag_Id: String(item.id),
    Tag_Value: vary(item.value, 0.03, item.unit === "mm" ? 0 : 1),
    Tag_Avg_Value: vary(item.avg, 0.02, item.unit === "mm" ? 0 : 1)
  }));
}

function buildDashboardPayload() {
  const tags = buildTagPayload();
  const latestMap = Object.fromEntries(tags.map((item) => [String(item.Tag_Id), item]));

  return {
    headerMetrics: [
      { id: 1084, label: "Rotation Angle", unit: "deg", value: latestMap["1084"]?.Tag_Value },
      { id: 1083, label: "Tilting Angle", unit: "deg", value: latestMap["1083"]?.Tag_Value },
      { id: 1091, label: "Gear Box Temp", unit: "deg C", value: latestMap["1091"]?.Tag_Value },
      { id: 1123, label: "Hopper-1 WT", unit: "Tons", value: latestMap["1123"]?.Tag_Value },
      { id: 1124, label: "Hopper-2 WT", unit: "Tons", value: latestMap["1124"]?.Tag_Value },
      {
        id: commonTags.hydraulicPressure.tagId,
        label: "Hyd. Pressure",
        unit: commonTags.hydraulicPressure.unit,
        value: vary(commonTags.hydraulicPressure.value, 0.025, 1)
      },
      { id: "pump-status", label: "Hyd. Pump Status", unit: "", value: commonTags.pumpStatus }
    ],
    leftColumn: [
      { id: 1095, label: "Oil Temp. (Planetary - 1)", unit: "deg C", value: latestMap["1095"]?.Tag_Value },
      { id: 1097, label: "Barrier Water Level-1", unit: "mm", value: latestMap["1097"]?.Tag_Value },
      { id: 1098, label: "Barrier Water Level-2", unit: "mm", value: latestMap["1098"]?.Tag_Value },
      { id: 1091, label: "GB Casing Temp.-1", unit: "deg C", value: latestMap["1091"]?.Tag_Value },
      { id: 1092, label: "GB Casing Temp.-2", unit: "deg C", value: latestMap["1092"]?.Tag_Value },
      { id: 1172, label: "Make up Flow", unit: "m3", value: latestMap["1172"]?.Tag_Value },
      { id: 1645, label: "Water barrier make up time", unit: "hrs", value: latestMap["1645"]?.Tag_Value },
      { id: 1646, label: "Water barrier make up vol.", unit: "m3", value: latestMap["1646"]?.Tag_Value }
    ],
    rightColumn: [
      { id: 1096, label: "Oil Temp. (Planetary - 2)", unit: "deg C", value: latestMap["1096"]?.Tag_Value },
      { id: 1099, label: "Barrier Water Level-3", unit: "mm", value: latestMap["1099"]?.Tag_Value },
      { id: 1100, label: "Barrier Water Level-4", unit: "mm", value: latestMap["1100"]?.Tag_Value },
      { id: 1093, label: "GB Casing Temp.-3", unit: "deg C", value: latestMap["1093"]?.Tag_Value },
      { id: 1094, label: "GB Casing Temp.-4", unit: "deg C", value: latestMap["1094"]?.Tag_Value },
      { id: 1647, label: "Labyrinth make up time", unit: "hrs", value: latestMap["1647"]?.Tag_Value },
      { id: 1648, label: "Labyrinth make up vol.", unit: "m3", value: latestMap["1648"]?.Tag_Value }
    ],
    comparisonRows: [
      {
        id: 1645,
        parameter: "Water barrier make up time",
        latest: latestMap["1645"]?.Tag_Value,
        previousAverage: commonTags.waterBarrierTimeMax,
        unit: "hrs"
      },
      {
        id: 1646,
        parameter: "Water barrier make up volume",
        latest: latestMap["1646"]?.Tag_Value,
        previousAverage: commonTags.waterBarrierVolumeMax,
        unit: "m3"
      },
      {
        id: 1647,
        parameter: "Labyrinth make up time",
        latest: latestMap["1647"]?.Tag_Value,
        previousAverage: commonTags.labyrinthTimeMax,
        unit: "hrs"
      },
      {
        id: 1648,
        parameter: "Labyrinth make up volume",
        latest: latestMap["1648"]?.Tag_Value,
        previousAverage: commonTags.labyrinthVolumeMax,
        unit: "m3"
      }
    ]
  };
}

function wait(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCoolingDashboardMock() {
  await wait(220);
  return buildDashboardPayload();
}

export async function fetchCoolingLatestTagsMock() {
  await wait(180);
  return buildTagPayload();
}

export async function fetchCoolingHealthMock() {
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

export async function fetchCoolingAlarmSummaryMock() {
  await wait(160);
  return {
    ...alarms,
    OPEN: Math.max(0, alarms.OPEN + Math.round((Math.random() - 0.5) * 2)),
    TOTAL: alarms.TOTAL + Math.round((Math.random() - 0.5) * 2),
    CLOSE: alarms.CLOSE + Math.round((Math.random() - 0.5) * 2),
    ACK: alarms.ACK + Math.round((Math.random() - 0.5) * 2)
  };
}

export async function fetchCoolingEquipmentAlertsMock() {
  await wait(170);
  return equipmentAlerts.map((item) => ({
    ...item,
    value: Math.max(0, item.value + Math.round((Math.random() - 0.5) * 2))
  }));
}

export async function fetchCoolingMoComplianceMock() {
  await wait(170);
  return moCompliance.map((item) => ({
    ...item,
    value: Math.min(100, Math.max(0, item.value + Math.round((Math.random() - 0.5) * 6)))
  }));
}

export async function fetchCoolingTrendMock(tagId) {
  await wait(140);
  const source = sensorCatalog.find((item) => String(item.id) === String(tagId));
  if (!source) return [];

  return source.trend.map((value, index) => ({
    label: `${index + 1}h`,
    value
  }));
}
