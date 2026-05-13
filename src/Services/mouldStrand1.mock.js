const jitter = (value, delta, min = 0, max = 1000) =>
  Math.min(max, Math.max(min, value + (Math.random() * delta * 2 - delta)));

const baseOverview = {
  equipmentHealth: 84.6,
  amlc: 82.1,
  hmo: 79.8,
  ram: 86.4,
  coolingSystem: 88.2,
  openAlerts: [
    { label: "AMLC", value: 2 },
    { label: "HMO", value: 3 },
    { label: "RAM", value: 1 },
    { label: "Cooling", value: 4 },
  ],
  sapMo: [
    { label: "Planned", value: 92 },
    { label: "Executed", value: 87 },
    { label: "Closed", value: 83 },
    { label: "Pending", value: 17 },
  ],
};

const baseLive = {
  strand1Speed: 1.42,
  strand2Speed: 1.35,
  tundish1Weight: 62.1,
  tundish2Weight: 60.7,
  ladle1Weight: 288.2,
  ladle2Weight: 244.8,
  mouldLevel: 78.4,
  stopperDeviation: 2.7,
  stopperZeroing: 6.2,
  hmoCylinderSync: 1.8,
  chamberASync: 1.5,
  chamberBSync: 1.9,
  ramDeviation: 2.4,
  coolingFlow: 3.84,
};

const amlcRows = [
  { label: "Mould Level Deviation", current: 78.4, lcl: 72.0, ucl: 85.0 },
  { label: "Stopper Position Deviation", current: 2.7, lcl: 1.8, ucl: 4.2 },
  { label: "Stopper Rod Zeroing Value", current: 6.2, lcl: 4.5, ucl: 7.5 },
];

const hmoRows = [
  { label: "HMO Cylinders Synchronisation", current: 1.8, lcl: 1.2, ucl: 2.8 },
  { label: "Pressure Chamber A Synchronization", current: 1.5, lcl: 1.0, ucl: 2.4 },
  { label: "Pressure Chamber B Synchronization", current: 1.9, lcl: 1.1, ucl: 2.7 },
];

const ramRows = [
  { label: "Ram Position Deviation", current: 2.4, lcl: 1.2, ucl: 3.8 },
  { label: "Oscillation Stroke Stability", current: 88.1, lcl: 80.0, ucl: 96.0 },
];

const alarms = [
  "AMLC mould level deviation approaching upper control band.",
  "HMO synchronization spread increased during the latest cycle.",
  "Cooling-system flow variability detected on Strand 1 circuit.",
  "Stopper rod zeroing deviation observed outside learned baseline.",
];

const trendSeries = {
  mouldLevel: [73, 74.2, 75.6, 76.8, 77.4, 77.9, 78.1, 78.4],
  stopperDeviation: [2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.7],
  stopperZeroing: [5.4, 5.5, 5.7, 5.8, 6.0, 6.0, 6.1, 6.2],
  hmoCylinderSync: [1.3, 1.4, 1.5, 1.6, 1.7, 1.7, 1.8, 1.8],
  chamberASync: [1.1, 1.2, 1.3, 1.3, 1.4, 1.4, 1.5, 1.5],
  chamberBSync: [1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.8, 1.9],
  ramDeviation: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.4],
  coolingFlow: [3.52, 3.58, 3.63, 3.70, 3.75, 3.79, 3.82, 3.84],
};

const compliance = {
  AMLC: { alertComp: 84, moComp: 80, noComp: 88 },
  HMO: { alertComp: 81, moComp: 77, noComp: 86 },
  RAM: { alertComp: 89, moComp: 85, noComp: 91 },
  "COOLING SYSTEM": { alertComp: 92, moComp: 88, noComp: 94 },
};

const delay = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(payload)), 180);
  });

export async function getMouldStrand1Overview() {
  return delay({
    equipmentHealth: jitter(baseOverview.equipmentHealth, 1.6, 0, 100),
    amlc: jitter(baseOverview.amlc, 2.2, 0, 100),
    hmo: jitter(baseOverview.hmo, 2.2, 0, 100),
    ram: jitter(baseOverview.ram, 1.8, 0, 100),
    coolingSystem: jitter(baseOverview.coolingSystem, 1.8, 0, 100),
    openAlerts: baseOverview.openAlerts.map((item) => ({ ...item, value: Math.round(jitter(item.value, 1.2, 0, 10)) })),
    sapMo: baseOverview.sapMo.map((item) => ({ ...item, value: Math.round(jitter(item.value, 2.3, 0, 100)) })),
  });
}

export async function getMouldStrand1LiveData() {
  return delay({
    ...Object.fromEntries(Object.entries(baseLive).map(([key, value]) => [key, jitter(value, 2.5, 0, 400)])),
    amlcRows: amlcRows.map((item) => ({ ...item, current: jitter(item.current, 1.2, 0, 100) })),
    hmoRows: hmoRows.map((item) => ({ ...item, current: jitter(item.current, 0.3, 0, 10) })),
    ramRows: ramRows.map((item) => ({ ...item, current: jitter(item.current, item.current > 10 ? 2 : 0.4, 0, 100) })),
  });
}

export async function getMouldStrand1AlarmCount() {
  return delay({ TOTAL: 12, OPEN: 4, CLOSE: 6, ACK: 2 });
}

export async function getMouldStrand1AlarmText() {
  const first = Math.floor(Math.random() * alarms.length);
  return delay([{ AlarmText: alarms[first] }, { AlarmText: alarms[(first + 1) % alarms.length] }]);
}

export async function getMouldStrand1Compliance(section) {
  return delay(compliance[section] ?? { alertComp: 0, moComp: 0, noComp: 0 });
}

export async function getMouldStrand1Trend(key) {
  const values = trendSeries[key] ?? [0, 0, 0, 0, 0, 0, 0, 0];
  return delay(values.map((value, index) => ({ label: `T-${values.length - index - 1}`, value })));
}
