const strandConfig = {
  1: {
    name: "Strand 1",
    castSpeedTag: "41407",
    faces: [
      { id: "41127", key: "broadFixed", label: "Broadface Fixed Side" },
      { id: "41129", key: "narrowLeft", label: "Narrowface Left Side" },
      { id: "41128", key: "broadLoose", label: "Broadface Loose Side" },
      { id: "41130", key: "narrowRight", label: "Narrowface Right Side" },
    ],
  },
  2: {
    name: "Strand 2",
    castSpeedTag: "41415",
    faces: [
      { id: "41135", key: "broadFixed", label: "Broadface Fixed Side" },
      { id: "41137", key: "narrowLeft", label: "Narrowface Left Side" },
      { id: "41136", key: "broadLoose", label: "Broadface Loose Side" },
      { id: "41138", key: "narrowRight", label: "Narrowface Right Side" },
    ],
  },
};

const baseCasterData = {
  ladlePrimaryTons: 286,
  ladleSecondaryTons: 244,
  tundishTons: 61.5,
  mould1Level: 78.4,
  mould2Level: 74.2,
  strand1CastingSpeed: 1.42,
  strand2CastingSpeed: 1.35,
};

const baseFaceStatus = {
  "41127": { value: 62, lcl: 40, ucl: 85 },
  "41129": { value: 68, lcl: 40, ucl: 85 },
  "41128": { value: 58, lcl: 40, ucl: 85 },
  "41130": { value: 81, lcl: 40, ucl: 85 },
  "41135": { value: 74, lcl: 40, ucl: 85 },
  "41137": { value: 63, lcl: 40, ucl: 85 },
  "41136": { value: 51, lcl: 40, ucl: 85 },
  "41138": { value: 88, lcl: 40, ucl: 85 },
};

const heatFluxByFace = {
  broadFixed: [52, 56, 59, 63, 67, 70, 72, 74],
  narrowLeft: [49, 51, 54, 58, 61, 64, 66, 68],
  broadLoose: [46, 48, 52, 55, 57, 60, 61, 63],
  narrowRight: [54, 57, 61, 65, 69, 73, 77, 81],
};

const lclSeries = [40, 40, 40, 40, 40, 40, 40, 40];
const uclSeries = [85, 85, 85, 85, 85, 85, 85, 85];

const jitter = (value, delta, min = 0, max = 1000) =>
  Math.min(max, Math.max(min, value + (Math.random() * delta * 2 - delta)));

const delay = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(payload)), 180);
  });

export function getStrandConfig() {
  return strandConfig;
}

export async function getCasterOverview() {
  return delay({
    ladlePrimaryTons: jitter(baseCasterData.ladlePrimaryTons, 8, 0, 320),
    ladleSecondaryTons: jitter(baseCasterData.ladleSecondaryTons, 8, 0, 320),
    tundishTons: jitter(baseCasterData.tundishTons, 2.2, 0, 80),
    mould1Level: jitter(baseCasterData.mould1Level, 3.2, 0, 100),
    mould2Level: jitter(baseCasterData.mould2Level, 3.2, 0, 100),
    strand1CastingSpeed: jitter(baseCasterData.strand1CastingSpeed, 0.08, 0.2, 2.5),
    strand2CastingSpeed: jitter(baseCasterData.strand2CastingSpeed, 0.08, 0.2, 2.5),
  });
}

export async function getFaceStatus() {
  return delay(
    Object.entries(baseFaceStatus).map(([id, item]) => ({
      id,
      value: jitter(item.value, 6, 0, 100),
      lcl: item.lcl,
      ucl: item.ucl,
    })),
  );
}

export async function getHeatFluxCharts(strandNumber) {
  const strand = strandConfig[strandNumber];
  const castingSpeeds =
    strandNumber === 1
      ? [0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6]
      : [0.85, 0.95, 1.05, 1.15, 1.25, 1.35, 1.45, 1.55];

  return delay(
    strand.faces.map((face) => ({
      faceId: face.id,
      faceKey: face.key,
      label: face.label,
      castingSpeed: castingSpeeds,
      flux: heatFluxByFace[face.key].map((value) => jitter(value, 3, 0, 120)),
      lcl: lclSeries,
      ucl: uclSeries,
    })),
  );
}
