const jitter = (value, delta, min = 0, max = 1000) =>
  Math.min(max, Math.max(min, value + (Math.random() * delta * 2 - delta)));

const baseOverview = {
  equipmentHealth: 83.4,
  strand1Cv: 81.2,
  strand2Cv: 85.7,
  elapsedDistribution: [
    { label: "<1", value: 20 },
    { label: "1-2", value: 25 },
    { label: "2-5", value: 6 },
    { label: "7+", value: 60 },
  ],
  donutBreakdown: [{ label: "BP", value: 100 }],
  openAlerts: [
    { label: "RAM", value: 2 },
    { label: "AMLC", value: 3 },
    { label: "Cooling", value: 5 },
  ],
  sapMo: [
    { label: "Planned", value: 93 },
    { label: "Executed", value: 88 },
    { label: "Closed", value: 84 },
    { label: "Pending", value: 16 },
  ],
};

const liveMouldData = {
  strand1Speed: 1.42,
  strand2Speed: 1.35,
  tundish1Weight: 62.1,
  tundish2Weight: 60.7,
  ladle1Weight: 288.2,
  ladle2Weight: 244.8,
  mould1Level: 78.4,
  mould2Level: 74.2,
  frontalFlow1: 3.82,
  thinFlow1: 1.88,
  frontalFlow2: 3.95,
  thinFlow2: 1.92,
  zoneA: 81.4,
  zoneB: 84.7,
  zoneC: 79.3,
  zoneD: 86.1,
  heatExchanger: 76.6,
  machineCooling1: 82.3,
  machineCooling2: 80.8,
};

const lineOpening = [
  { label: "YW37", value: 72.1 },
  { label: "YW38", value: 69.8 },
  { label: "YW06", value: 75.4 },
  { label: "YW07", value: 70.3 },
  { label: "YW41", value: 74.7 },
  { label: "YW04", value: 68.9 },
  { label: "YW03", value: 66.5 },
  { label: "YD35", value: 73.6 },
];

const flowLimits = [
  { label: "Front Face 1", lsl: 3.16, usl: 4.73, actual: 3.82 },
  { label: "Thin Face 1", lsl: 1.34, usl: 2.43, actual: 1.88 },
  { label: "Front Face 2", lsl: 3.16, usl: 4.73, actual: 3.95 },
  { label: "Thin Face 2", lsl: 1.34, usl: 2.43, actual: 1.92 },
];

const alarms = [
  "Mould cooling strand-2 CV drifted beyond preferred baseline.",
  "Cooling water flow at YW37 trending near lower specification limit.",
  "Heat exchanger outlet stability reduced during the latest caster cycle.",
  "Machine cooling branch-2 variability increased over last interval.",
];

const compliance = {
  "MOULD COOLING STRAND1": { alertComp: 84, moComp: 80, noComp: 88 },
  "MOULD COOLING STRAND2": { alertComp: 88, moComp: 83, noComp: 90 },
};

const trendSeries = {
  mould1Level: [72, 73.1, 74.6, 75.8, 76.9, 77.5, 78.0, 78.4],
  mould2Level: [69, 70.2, 71.4, 72.6, 73.2, 73.8, 74.0, 74.2],
  frontalFlow1: [3.61, 3.66, 3.71, 3.75, 3.78, 3.80, 3.81, 3.82],
  thinFlow1: [1.72, 1.75, 1.79, 1.82, 1.84, 1.86, 1.87, 1.88],
  frontalFlow2: [3.70, 3.75, 3.80, 3.84, 3.88, 3.91, 3.93, 3.95],
  thinFlow2: [1.76, 1.79, 1.82, 1.86, 1.88, 1.89, 1.91, 1.92],
};

const delay = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(payload)), 180);
  });

export async function getMouldCoolingOverview() {
  return delay({
    equipmentHealth: jitter(baseOverview.equipmentHealth, 1.5, 0, 100),
    strand1Cv: jitter(baseOverview.strand1Cv, 2.2, 0, 100),
    strand2Cv: jitter(baseOverview.strand2Cv, 2.2, 0, 100),
    elapsedDistribution: baseOverview.elapsedDistribution,
    donutBreakdown: baseOverview.donutBreakdown,
    openAlerts: baseOverview.openAlerts.map((item) => ({ ...item, value: Math.round(jitter(item.value, 1.2, 0, 10)) })),
    sapMo: baseOverview.sapMo.map((item) => ({ ...item, value: Math.round(jitter(item.value, 2.3, 0, 100)) })),
  });
}

export async function getMouldCoolingLiveData() {
  return delay({
    ...Object.fromEntries(Object.entries(liveMouldData).map(([key, value]) => [key, jitter(value, 2.4, 0, 400)])),
    lineOpening: lineOpening.map((item) => ({ ...item, value: jitter(item.value, 3, 0, 100) })),
    flowLimits: flowLimits.map((item) => ({ ...item, actual: jitter(item.actual, 0.12, 0, 8) })),
  });
}

export async function getMouldCoolingAlarmCount() {
  return delay({ TOTAL: 14, OPEN: 5, CLOSE: 7, ACK: 2 });
}

export async function getMouldCoolingAlarmText() {
  const first = Math.floor(Math.random() * alarms.length);
  return delay([{ AlarmText: alarms[first] }, { AlarmText: alarms[(first + 1) % alarms.length] }]);
}

export async function getMouldCoolingCompliance(section) {
  return delay(compliance[section] ?? { alertComp: 0, moComp: 0, noComp: 0 });
}

export async function getMouldCoolingTrend(key) {
  const values = trendSeries[key] ?? [0, 0, 0, 0, 0, 0, 0, 0];
  return delay(values.map((value, index) => ({ label: `T-${values.length - index - 1}`, value })));
}
