const primarySensors = [
  { id: 1084, label: "Rotation Angle", unit: "deg", value: 31.4, avg: 30.7, trend: [28.8, 29.2, 29.8, 30.1, 30.6, 31.0, 31.4] },
  { id: 1083, label: "Tilting Angle", unit: "deg", value: 13.6, avg: 12.9, trend: [11.2, 11.7, 12.1, 12.5, 12.9, 13.2, 13.6] },
  { id: 1091, label: "Gear Box Temp", unit: "deg C", value: 64.2, avg: 63.1, trend: [59.8, 60.9, 61.7, 62.5, 63.1, 63.6, 64.2] },
  { id: 1123, label: "Hopper-1 WT", unit: "t", value: 247.8, avg: 249.4, trend: [243.2, 244.4, 245.1, 246.0, 246.6, 247.2, 247.8] },
  { id: 1124, label: "Hopper-2 WT", unit: "t", value: 251.6, avg: 252.7, trend: [246.2, 247.4, 248.9, 249.8, 250.4, 251.0, 251.6] },
  { id: 2426, label: "Hyd. Pressure", unit: "bar", value: 176.3, avg: 173.8, trend: [168.6, 170.1, 171.9, 173.0, 174.1, 175.2, 176.3] },
  { id: 1046, label: "Hydraulic Oil Temperature", unit: "deg C", value: 52.4, avg: 51.2, trend: [48.5, 49.2, 49.9, 50.7, 51.3, 51.9, 52.4] },
  { id: 1045, label: "Oil Tank Level Decay", unit: "mm/hr", value: 3.2, avg: 2.8, trend: [2.2, 2.4, 2.6, 2.8, 2.9, 3.1, 3.2] }
];

const operationalSensors = [
  { id: 2427, label: "Hyd. Pump-1 run hrs", unit: "hrs", value: 18.6, avg: 17.8, trend: [16.1, 16.5, 16.9, 17.2, 17.8, 18.1, 18.6] },
  { id: 1004, label: "Hyd Motor-1 Current", unit: "A", value: 42.8, avg: 40.9, trend: [35.2, 36.8, 38.1, 39.9, 40.8, 41.6, 42.8] },
  { id: 1047, label: "Pump-1 Discharge Pressure", unit: "bar", value: 182.5, avg: 180.7, trend: [174.1, 176.3, 177.8, 179.2, 180.6, 181.4, 182.5] },
  { id: 1048, label: "Pump-2 Discharge Pressure", unit: "bar", value: 179.2, avg: 178.4, trend: [171.4, 172.8, 174.9, 176.2, 177.3, 178.1, 179.2] },
  { id: 2428, label: "Hyd. Pump-2 run hrs", unit: "hrs", value: 17.3, avg: 16.9, trend: [15.4, 15.8, 16.1, 16.5, 16.8, 17.0, 17.3] },
  { id: 1005, label: "Hyd Motor-2 Current", unit: "A", value: 39.7, avg: 38.6, trend: [33.8, 34.9, 35.6, 36.8, 37.7, 38.8, 39.7] }
];

const diagnostics = [
  { id: 1629, label: "USV1 Hydraulic Open Line PT", unit: "bar", value: 214.2, trend: [198, 201, 205, 208, 210, 212, 214.2] },
  { id: 1630, label: "USV1 Hydraulic Close Line PT", unit: "bar", value: 222.6, trend: [201, 205, 209, 213, 216, 219, 222.6] },
  { id: 1631, label: "LSV1 Hydraulic Open Line PT", unit: "bar", value: 205.8, trend: [191, 194, 197, 200, 202, 204, 205.8] },
  { id: 1632, label: "LSV1 Hydraulic Close Line PT", unit: "bar", value: 211.5, trend: [194, 197, 201, 204, 207, 209, 211.5] },
  { id: 1633, label: "USV2 Hydraulic Open Line PT", unit: "bar", value: 218.1, trend: [199, 203, 206, 210, 213, 216, 218.1] },
  { id: 1634, label: "USV2 Hydraulic Close Line PT", unit: "bar", value: 223.4, trend: [202, 206, 209, 214, 217, 220, 223.4] },
  { id: 1635, label: "LSV2 Hydraulic Open Line PT", unit: "bar", value: 207.4, trend: [191, 194, 198, 200, 203, 205, 207.4] },
  { id: 1636, label: "LSV2 Hydraulic Close Line PT", unit: "bar", value: 212.3, trend: [194, 198, 201, 205, 208, 210, 212.3] },
  { id: 1637, label: "LMG2 Hydraulic Open Line PT", unit: "bar", value: 219.8, trend: [202, 205, 208, 212, 215, 218, 219.8] },
  { id: 1638, label: "LMG2 Hydraulic Close Line PT", unit: "bar", value: 225.1, trend: [205, 208, 212, 216, 220, 223, 225.1] },
  { id: 1405, label: "Tilting Rocker Hopper 2 Time", unit: "s", value: 8.7, avg: 8.2, trend: [7.1, 7.4, 7.7, 8.0, 8.2, 8.5, 8.7] },
  { id: 1406, label: "Tilting Rocker Hopper 1 Time", unit: "s", value: 8.1, avg: 7.8, trend: [6.8, 7.1, 7.3, 7.5, 7.7, 7.9, 8.1] },
  { id: 1717, label: "LMG-1 Leakage Indicator", unit: "l/min", value: 1.7, trend: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7] },
  { id: 1718, label: "LMG-2 Leakage Indicator", unit: "l/min", value: 1.9, trend: [1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 1.9] },
  { id: 1719, label: "Tank Oil Particle Counter", unit: "ppm", value: 14.6, trend: [11.1, 11.8, 12.4, 12.9, 13.4, 13.9, 14.6] }
];

const healthBreakdown = [
  { key: "usv", label: "USV", value: 90.8, detail: { alertComp: 92, moComp: 89, noComp: 91 } },
  { key: "lsv", label: "LSV", value: 87.9, detail: { alertComp: 86, moComp: 89, noComp: 88 } },
  { key: "instrument", label: "Instrument", value: 92.4, detail: { alertComp: 93, moComp: 91, noComp: 93 } }
];

const alarmSummary = {
  OPEN: 5,
  TOTAL: 48,
  CLOSE: 36,
  ACK: 31,
  recent: [
    "USV2 close line pressure crossed the soft threshold during the last cycle.",
    "Hydraulic oil temperature trending upward faster than previous shift average."
  ]
};

const equipmentAlerts = [
  { label: "USV", value: 7 },
  { label: "LSV", value: 5 },
  { label: "Hyd. Pumps", value: 4 },
  { label: "Tank/Oil", value: 3 },
  { label: "Instrumentation", value: 6 }
];

const moCompliance = [
  { label: "Planned", value: 91 },
  { label: "Released", value: 84 },
  { label: "Completed", value: 79 },
  { label: "Overdue", value: 16 }
];

function vary(value, spread = 0.04, digits = 1) {
  const next = value * (1 + (Math.random() - 0.5) * spread);
  return Number(next.toFixed(digits));
}

function wait(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findSensor(id) {
  return [...primarySensors, ...operationalSensors, ...diagnostics].find(
    (item) => String(item.id) === String(id)
  );
}

export async function fetchHydraulicDashboardMock() {
  await wait(180);
  const hydPressure = vary(findSensor(2426).value, 0.02, 1);
  const motor1Current = vary(findSensor(1004).value, 0.03, 1);
  const motor2Current = vary(findSensor(1005).value, 0.03, 1);

  return {
    headerMetrics: [
      { id: 1084, label: "Rotation Angle", unit: "deg", value: vary(findSensor(1084).value, 0.02, 1) },
      { id: 1083, label: "Tilting Angle", unit: "deg", value: vary(findSensor(1083).value, 0.02, 1) },
      { id: 1091, label: "Gear Box Temp", unit: "deg C", value: vary(findSensor(1091).value, 0.02, 1) },
      { id: 1123, label: "Hopper-1 WT", unit: "t", value: vary(findSensor(1123).value, 0.015, 1) },
      { id: 1124, label: "Hopper-2 WT", unit: "t", value: vary(findSensor(1124).value, 0.015, 1) },
      { id: 2426, label: "Hyd. Pressure", unit: "bar", value: hydPressure },
      { id: "pump-status", label: "Pump Status", unit: "", value: motor1Current > motor2Current ? "PUMP-1" : "PUMP-2" }
    ],
    operationalLeft: [
      { id: 2427, label: "Hyd. Pump-1 run hrs", unit: "hrs", value: vary(findSensor(2427).value, 0.03, 1) },
      { id: 1004, label: "Hyd Motor-1 Current", unit: "A", value: motor1Current },
      { id: 1047, label: "Pump-1 Discharge Pressure", unit: "bar", value: vary(findSensor(1047).value, 0.02, 1) }
    ],
    operationalRight: [
      { id: 1046, label: "Hydraulic Oil Temperature", unit: "deg C", value: vary(findSensor(1046).value, 0.02, 1) },
      { id: 2428, label: "Hyd. Pump-2 run hrs", unit: "hrs", value: vary(findSensor(2428).value, 0.03, 1) },
      { id: 1005, label: "Hyd Motor-2 Current", unit: "A", value: motor2Current }
    ],
    pump2Discharge: { id: 1048, label: "Pump-2 Discharge Pressure", unit: "bar", value: vary(findSensor(1048).value, 0.02, 1) },
    oilTankLevel: {
      id: 1045,
      label: "Rate of descent of hydraulic oil tank level",
      unit: "mm/hr",
      value: vary(findSensor(1045).value, 0.03, 1),
      previousAverage: vary(findSensor(1045).avg, 0.02, 1)
    },
    rockerTimes: [
      {
        id: 1405,
        label: "Tilting Rocker Hopper 2 Time",
        unit: "s",
        value: vary(findSensor(1405).value, 0.03, 1),
        previousAverage: vary(findSensor(1405).avg, 0.02, 1)
      },
      {
        id: 1406,
        label: "Tilting Rocker Hopper 1 Time",
        unit: "s",
        value: vary(findSensor(1406).value, 0.03, 1),
        previousAverage: vary(findSensor(1406).avg, 0.02, 1)
      }
    ],
    diagnostics: diagnostics.slice(0, 10).map((item) => ({
      id: item.id,
      label: item.label,
      unit: item.unit,
      value: vary(item.value, item.unit === "bar" ? 0.03 : 0.05, 1)
    })),
    additionalSensors: diagnostics.slice(10).map((item) => ({
      id: item.id,
      label: item.label,
      unit: item.unit,
      value: vary(item.value, 0.04, 1),
      previousAverage: item.avg != null ? vary(item.avg, 0.02, 1) : null
    }))
  };
}

export async function fetchHydraulicHealthMock() {
  await wait(190);
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

export async function fetchHydraulicAlarmSummaryMock() {
  await wait(160);
  return {
    ...alarmSummary,
    OPEN: Math.max(0, alarmSummary.OPEN + Math.round((Math.random() - 0.5) * 2)),
    TOTAL: alarmSummary.TOTAL + Math.round((Math.random() - 0.5) * 2),
    CLOSE: alarmSummary.CLOSE + Math.round((Math.random() - 0.5) * 2),
    ACK: alarmSummary.ACK + Math.round((Math.random() - 0.5) * 2)
  };
}

export async function fetchHydraulicEquipmentAlertsMock() {
  await wait(170);
  return equipmentAlerts.map((item) => ({
    ...item,
    value: Math.max(0, item.value + Math.round((Math.random() - 0.5) * 2))
  }));
}

export async function fetchHydraulicMoComplianceMock() {
  await wait(170);
  return moCompliance.map((item) => ({
    ...item,
    value: Math.min(100, Math.max(0, item.value + Math.round((Math.random() - 0.5) * 6)))
  }));
}

export async function fetchHydraulicTrendMock(tagId) {
  await wait(140);
  const source = findSensor(tagId);
  if (!source) return [];

  return source.trend.map((value, index) => ({
    label: `${index + 1}h`,
    value
  }));
}
