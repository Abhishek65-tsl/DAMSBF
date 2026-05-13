const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const shift = (value, variance = 1, min = 0, max = 100) =>
  clamp(value + (Math.random() * variance * 2 - variance), min, max);

const segments = Array.from({ length: 16 }, (_, index) => index + 1);

const strandBase = {
  1: {
    timestamp: "2026-04-11 09:42:18",
    torqueRanks: [12, 9, 6],
    pressureRanks: [11, 8, 5],
    corrSlipRanks: [13, 10, 7],
    slipCountRanks: [12, 11, 8],
  },
  2: {
    timestamp: "2026-04-11 09:42:18",
    torqueRanks: [14, 10, 7],
    pressureRanks: [13, 9, 6],
    corrSlipRanks: [15, 11, 8],
    slipCountRanks: [14, 12, 9],
  },
};

const seriesBase = {
  torque: [42, 45, 47, 49, 52, 54, 57, 59, 61, 64, 66, 69, 72, 74, 76, 78],
  corrSlip: [0.8, 1.1, 1.3, 1.5, 1.8, 2.0, 2.1, 2.4, 2.7, 2.9, 3.0, 3.2, 3.4, 3.6, 3.9, 4.1],
  pressure: [92, 94, 95, 96, 98, 99, 101, 103, 104, 105, 107, 109, 111, 112, 114, 116],
};

const wait = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(payload)), 160);
  });

const segmentSeries = (strand, segment, type) => {
  const factor = strand === 1 ? 1 : 1.08;
  const selected = segment === 0 ? 15 : segment;
  const pivot = Math.max(1, Math.min(16, selected));

  return Array.from({ length: 12 }, (_, index) => {
    const base = seriesBase[type][Math.max(0, pivot - 1)];
    const drift = (index - 5) * (type === "corrSlip" ? 0.08 : 0.9);
    const variance = type === "corrSlip" ? 0.18 : 2;
    const raw = base * factor + drift + (Math.random() * variance * 2 - variance);
    return {
      label: `T-${11 - index}`,
      value: Number(raw.toFixed(type === "corrSlip" ? 2 : 1)),
    };
  });
};

export async function getSlabOverview(strand = 1) {
  const base = strandBase[strand] ?? strandBase[1];
  return wait({
    strand,
    timestamp: base.timestamp,
    torqueRanks: base.torqueRanks,
    pressureRanks: base.pressureRanks,
    corrSlipRanks: base.corrSlipRanks,
    slipCountRanks: base.slipCountRanks,
    segments,
  });
}

export async function getSlabTrendSeries({ strand = 1, segment = 15, type = "torque" }) {
  return wait(segmentSeries(strand, segment, type));
}

export async function getSlabSegmentTable(strand = 1) {
  return wait(
    segments.map((segment) => ({
      segment,
      torque: Number(shift(seriesBase.torque[segment - 1] * (strand === 1 ? 1 : 1.08), 3, 30, 120).toFixed(1)),
      pressure: Number(shift(seriesBase.pressure[segment - 1] * (strand === 1 ? 1 : 1.04), 3, 70, 140).toFixed(1)),
      corrSlip: Number(shift(seriesBase.corrSlip[segment - 1] * (strand === 1 ? 1 : 1.1), 0.25, 0, 8).toFixed(2)),
      slipCount: Math.round(shift(segment / 2 + (strand === 2 ? 1 : 0), 1.2, 0, 16)),
    })),
  );
}

export async function getSlabCsvData(strand = 1) {
  const rows = await getSlabSegmentTable(strand);
  return rows.map((row) => ({
    strand,
    segment: row.segment,
    torque: row.torque,
    pressure: row.pressure,
    corrSlip: row.corrSlip,
    slipCount: row.slipCount,
  }));
}
