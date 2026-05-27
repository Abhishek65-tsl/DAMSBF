using backend.Models;

namespace backend.Data.Mock;

public static class ChargingMockData
{
    public static readonly ChargingMetric[] Metrics =
    [
        new(1084, "Rotation Angle", "deg", 33.2, [30.2, 30.8, 31.3, 31.9, 32.4, 32.8, 33.2]),
        new(1083, "Tilting Angle", "deg", 14.8, [12.5, 12.9, 13.3, 13.9, 14.2, 14.5, 14.8]),
        new(1091, "Gear Box Temp", "deg C", 65.4, [60.3, 61.1, 61.9, 62.8, 63.9, 64.7, 65.4]),
        new(1123, "Hopper-1 WT", "t", 258.4, [252, 253.6, 254.4, 255.9, 257, 257.7, 258.4]),
        new(1124, "Hopper-2 WT", "t", 261.7, [255.2, 256.4, 257.8, 258.9, 259.8, 260.7, 261.7]),
        new(2406, "Hopper 1 Pre time", "s", 12.4, [10.2, 10.8, 11.1, 11.4, 11.7, 12.1, 12.4]),
        new(2407, "Hopper 1 de-Pre time", "s", 9.3, [7.2, 7.8, 8.1, 8.4, 8.7, 9.0, 9.3]),
        new(1117, "LMG Angle-1", "deg", 26.8, [24.2, 24.8, 25.2, 25.7, 26.0, 26.4, 26.8]),
        new(1408, "Furnace Top Temp", "deg C", 312.6, [294, 298, 301, 305, 307, 310, 312.6]),
        new(1407, "Furnace Top Pressure", "bar", 1.8, [1.5, 1.6, 1.6, 1.7, 1.7, 1.8, 1.8]),
        new(1023, "Tilting Motor Cur.", "A", 37.2, [31.2, 32.8, 33.9, 34.8, 35.6, 36.3, 37.2]),
        new(2404, "Hopper 2 Pre time", "s", 13.1, [11.1, 11.5, 11.9, 12.3, 12.6, 12.9, 13.1]),
        new(2405, "Hopper 2 de-Pre time", "s", 10.2, [8.2, 8.8, 9.0, 9.3, 9.6, 9.9, 10.2]),
        new(1120, "LMG Angle-2", "deg", 28.3, [25.5, 25.9, 26.4, 26.8, 27.2, 27.8, 28.3]),
        new(1021, "Rotating Motor Cur.", "A", 34.1, [29.1, 29.9, 30.7, 31.8, 32.9, 33.3, 34.1]),
        new(2434, "Rotation Motor Temperature-1", "deg C", 56.1, [52.2, 52.8, 53.7, 54.1, 54.8, 55.6, 56.1]),
        new(2435, "Rotation Motor Temperature-2", "deg C", 57.4, [53.4, 54.0, 54.8, 55.3, 55.9, 56.8, 57.4]),
        new(1047, "Hydraulic Pressure", "bar", 168.7, [158, 160.4, 162.1, 164.6, 166.2, 167.5, 168.7])
    ];

    public static readonly HealthItem[] HealthItems =
    [
        new("weighingSystem", "Weighing System", 91.2, 94, 89, 90),
        new("tiltingDrive", "Tilting Drive", 88.5, 87, 90, 88),
        new("rotatingDrive", "Rotating Drive", 92.1, 93, 91, 92),
        new("stockRod", "Stock Rod-1&2", 84.6, 82, 86, 86),
        new("switchGear", "Switch Gear", 86.9, 88, 84, 89),
        new("electrics", "Electrics", 89.8, 91, 88, 90),
        new("instrument", "Instrument", 87.7, 86, 89, 88)
    ];

    public static readonly string[] RecentAlarms =
    [
        "Hopper 2 pressurizing time exceeded rolling benchmark by 8%.",
        "Tilting motor current fluctuation detected during last charge cycle."
    ];
}
