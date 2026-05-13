const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const shift = (value, variance = 1, min = 0, max = 100) =>
  clamp(value + (Math.random() * variance * 2 - variance), min, max);

const liveBase = {
  ladle1: 61.4,
  ladle2: 58.9,
  tundish1: 39.2,
  tundish2: 37.8,
  castingSpeed1: 1.26,
  castingSpeed2: 1.22,
  mouldLevel1: 82.4,
  mouldLevel2: 80.1,
  refillingValue: 4.8,
  refillingTime: 11.2,
  backlash: 1.6,
  tcm1: 5.7,
  tcm2: 5.4,
  deburrer1: 3.2,
  deburrer2: 3.1,
  ldFlow1: 34.6,
  ldFlow2: 35.1,
  amlc1: 91.2,
  amlc2: 88.7,
  hmo1: 84.6,
  hmo2: 82.9,
  hf1: 76.8,
  hf2: 79.2,
  ram1: 68.4,
  ram2: 70.1,
  cvHealth: 87.3,
  svHealth: 90.4,
};

const strandFacesBase = {
  strand1: [
    { face: "Face 1", status: "healthy", value: 82 },
    { face: "Face 2", status: "healthy", value: 80 },
    { face: "Face 3", status: "warning", value: 73 },
    { face: "Face 4", status: "healthy", value: 84 },
  ],
  strand2: [
    { face: "Face 1", status: "healthy", value: 81 },
    { face: "Face 2", status: "warning", value: 75 },
    { face: "Face 3", status: "healthy", value: 83 },
    { face: "Face 4", status: "healthy", value: 85 },
  ],
};

const subsystemBase = [
  { key: "AMLC_1", label: "AMLC S1", value: 91 },
  { key: "AMLC_2", label: "AMLC S2", value: 89 },
  { key: "HMO_1", label: "HMO S1", value: 85 },
  { key: "HMO_2", label: "HMO S2", value: 83 },
  { key: "RAM_1", label: "RAM S1", value: 78 },
  { key: "RAM_2", label: "RAM S2", value: 80 },
  { key: "BDS_1", label: "BDS S1", value: 88 },
  { key: "BDS_2", label: "BDS S2", value: 86 },
  { key: "CV", label: "Control Valve", value: 87 },
  { key: "SV", label: "Shutoff Valve", value: 90 },
];

const alarms = [
  "Strand 2 mould face 2 heat signature moved into warning band.",
  "Refilling time increased beyond recent caster average.",
  "Strand 1 RAM condition dipped below preferred operating band.",
  "Deburrer cycle variance detected during latest sequence.",
  "LD flow mismatch observed between strand circuits.",
];

const openAlertsBase = [
  { label: "AMLC", value: 3 },
  { label: "HMO", value: 2 },
  { label: "RAM", value: 4 },
  { label: "BDS", value: 2 },
  { label: "Cooling", value: 3 },
];

const complianceBase = [
  { label: "Planned", value: 95 },
  { label: "Executed", value: 90 },
  { label: "Closed", value: 86 },
  { label: "Pending", value: 10 },
];

const complianceDetails = {
  AMLC_1: { alertComp: 93, moComp: 91, noComp: 94 },
  AMLC_2: { alertComp: 90, moComp: 88, noComp: 92 },
  HMO_1: { alertComp: 86, moComp: 83, noComp: 88 },
  HMO_2: { alertComp: 84, moComp: 81, noComp: 86 },
  RAM_1: { alertComp: 80, moComp: 77, noComp: 82 },
  RAM_2: { alertComp: 82, moComp: 79, noComp: 84 },
  BDS_1: { alertComp: 89, moComp: 86, noComp: 90 },
  BDS_2: { alertComp: 87, moComp: 84, noComp: 88 },
  CV: { alertComp: 88, moComp: 85, noComp: 90 },
  SV: { alertComp: 91, moComp: 89, noComp: 93 },
};

const trendHistory = {
  ladle1: [59, 59.5, 60.1, 60.7, 61.1, 61.5, 61.2, 61.4],
  ladle2: [57, 57.4, 57.9, 58.1, 58.4, 58.7, 58.8, 58.9],
  tundish1: [37.5, 38.0, 38.2, 38.4, 38.7, 39.0, 39.1, 39.2],
  tundish2: [36.2, 36.5, 36.8, 37.0, 37.2, 37.4, 37.6, 37.8],
  castingSpeed1: [1.18, 1.19, 1.2, 1.22, 1.23, 1.24, 1.25, 1.26],
  castingSpeed2: [1.14, 1.15, 1.17, 1.18, 1.19, 1.2, 1.21, 1.22],
  mouldLevel1: [80, 80.4, 80.9, 81.2, 81.6, 82.0, 82.3, 82.4],
  mouldLevel2: [78.2, 78.8, 79.1, 79.4, 79.6, 79.8, 80.0, 80.1],
  refillingValue: [4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8],
  refillingTime: [9.8, 10.0, 10.2, 10.5, 10.7, 10.9, 11.1, 11.2],
  backlash: [1.2, 1.2, 1.3, 1.4, 1.4, 1.5, 1.5, 1.6],
  tcm1: [5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7],
  tcm2: [4.8, 4.9, 5.0, 5.1, 5.2, 5.2, 5.3, 5.4],
  deburrer1: [2.8, 2.9, 3.0, 3.0, 3.1, 3.1, 3.2, 3.2],
  deburrer2: [2.7, 2.8, 2.9, 2.9, 3.0, 3.0, 3.1, 3.1],
  ldFlow1: [32.1, 32.8, 33.2, 33.6, 34.0, 34.2, 34.4, 34.6],
  ldFlow2: [32.8, 33.0, 33.4, 33.8, 34.2, 34.5, 34.8, 35.1],
};

const wait = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(payload)), 180);
  });

export async function getNewMouldLiveData() {
  return wait({
    ladle1: shift(liveBase.ladle1, 1.2, 45, 75),
    ladle2: shift(liveBase.ladle2, 1.2, 45, 75),
    tundish1: shift(liveBase.tundish1, 1.1, 25, 50),
    tundish2: shift(liveBase.tundish2, 1.1, 25, 50),
    castingSpeed1: shift(liveBase.castingSpeed1, 0.05, 0.8, 1.8),
    castingSpeed2: shift(liveBase.castingSpeed2, 0.05, 0.8, 1.8),
    mouldLevel1: shift(liveBase.mouldLevel1, 1.8, 60, 100),
    mouldLevel2: shift(liveBase.mouldLevel2, 1.8, 60, 100),
    refillingValue: shift(liveBase.refillingValue, 0.4, 2, 8),
    refillingTime: shift(liveBase.refillingTime, 0.8, 5, 18),
    backlash: shift(liveBase.backlash, 0.2, 0.4, 3),
    tcm1: shift(liveBase.tcm1, 0.5, 2, 10),
    tcm2: shift(liveBase.tcm2, 0.5, 2, 10),
    deburrer1: shift(liveBase.deburrer1, 0.3, 1, 6),
    deburrer2: shift(liveBase.deburrer2, 0.3, 1, 6),
    ldFlow1: shift(liveBase.ldFlow1, 1, 20, 50),
    ldFlow2: shift(liveBase.ldFlow2, 1, 20, 50),
    amlc1: shift(liveBase.amlc1, 3, 60, 100),
    amlc2: shift(liveBase.amlc2, 3, 60, 100),
    hmo1: shift(liveBase.hmo1, 3, 55, 100),
    hmo2: shift(liveBase.hmo2, 3, 55, 100),
    hf1: shift(liveBase.hf1, 3, 50, 100),
    hf2: shift(liveBase.hf2, 3, 50, 100),
    ram1: shift(liveBase.ram1, 3, 45, 100),
    ram2: shift(liveBase.ram2, 3, 45, 100),
    cvHealth: shift(liveBase.cvHealth, 3, 50, 100),
    svHealth: shift(liveBase.svHealth, 3, 50, 100),
  });
}

export async function getNewMouldSubsystemHealth() {
  return wait(
    subsystemBase.map((item) => ({
      ...item,
      value: Math.round(shift(item.value, 4, 55, 98)),
    })),
  );
}

export async function getNewMouldFaceHealth() {
  const transformFaces = (items) =>
    items.map((item) => {
      const value = Math.round(shift(item.value, 6, 50, 98));
      return {
        ...item,
        value,
        status: value >= 80 ? "healthy" : value >= 68 ? "warning" : "critical",
      };
    });

  return wait({
    strand1: transformFaces(strandFacesBase.strand1),
    strand2: transformFaces(strandFacesBase.strand2),
  });
}

export async function getNewMouldAlarmCount() {
  return wait({ TOTAL: 18, OPEN: 7, CLOSE: 8, ACK: 3 });
}

export async function getNewMouldAlarmText() {
  const index = Math.floor(Math.random() * alarms.length);
  return wait([
    { AlarmText: alarms[index] },
    { AlarmText: alarms[(index + 1) % alarms.length] },
  ]);
}

export async function getNewMouldOpenAlerts() {
  return wait(
    openAlertsBase.map((item) => ({
      ...item,
      value: Math.max(0, Math.round(shift(item.value, 1.5, 0, 8))),
    })),
  );
}

export async function getNewMouldSapMoCompliance() {
  return wait(
    complianceBase.map((item) => ({
      ...item,
      value: Math.round(shift(item.value, 3, 0, 100)),
    })),
  );
}

export async function getNewMouldComplianceDetail(key) {
  return wait(complianceDetails[key] ?? { alertComp: 0, moComp: 0, noComp: 0 });
}

export async function getNewMouldTrendData(key) {
  const series = trendHistory[key] ?? [0, 0, 0, 0, 0, 0, 0, 0];
  return wait(
    series.map((value, index) => ({
      label: `T-${series.length - index - 1}`,
      value,
    })),
  );
}
