namespace backend.Services;

public static class BltMockDataService
{
    private static readonly Random Random = new();

    private record Metric(object id, string label, string unit, double value, double[] trend);
    private record HealthItem(string key, string label, double value, int alertComp, int moComp, int noComp);

    private static double Vary(double value, double spread = 0.04, int digits = 1)
    {
        var next = value * (1 + (Random.NextDouble() - 0.5) * spread);
        return Math.Round(next, digits);
    }

    private static object[] Trend(double[] values) =>
        values.Select((value, index) => new { label = $"{index + 1}h", value }).ToArray<object>();

    private static object[] Health(IEnumerable<HealthItem> items) =>
        items.Select(item => new
        {
            item.key,
            item.label,
            value = Vary(item.value, 0.015),
            detail = new { item.alertComp, item.moComp, item.noComp }
        }).ToArray<object>();

    private static object HealthPayload(HealthItem[] items) => new
    {
        items = Health(items),
        overall = Math.Round(items.Average(item => item.value), 1)
    };

    private static object Alarm(int open, int total, int close, int ack, string[] recent) => new
    {
        OPEN = Math.Max(0, open + Random.Next(-1, 2)),
        TOTAL = total + Random.Next(-1, 2),
        CLOSE = close + Random.Next(-1, 2),
        ACK = ack + Random.Next(-1, 2),
        recent
    };

    private static object[] Bars(params (string label, int value)[] items) =>
        items.Select(item => new { item.label, value = Math.Max(0, item.value + Random.Next(-1, 2)) }).ToArray<object>();

    private static object[] Compliance(params (string label, int value)[] items) =>
        items.Select(item => new { item.label, value = Math.Clamp(item.value + Random.Next(-3, 4), 0, 100) }).ToArray<object>();

    private static Metric[] BltMetrics =
    [
        new(1711, "Wind Volume", "knm3/hr", 364.8, [351, 354, 356, 358, 360, 362, 364.8]),
        new(1407, "Top Gas Pressure", "bar", 1.9, [1.5, 1.6, 1.6, 1.7, 1.8, 1.8, 1.9]),
        new(1408, "Top Gas Temp", "deg C", 298.4, [281, 285, 288, 291, 294, 296, 298.4]),
        new(2958, "HBT", "deg C", 1147.2, [1124, 1128, 1133, 1137, 1140, 1144, 1147.2]),
        new(2950, "HBP", "bar", 3.6, [3.1, 3.2, 3.3, 3.4, 3.4, 3.5, 3.6]),
        new(1572, "PCI Rate", "Tons/Hr", 14.8, [12.6, 12.9, 13.3, 13.8, 14.1, 14.4, 14.8]),
        new(1573, "PCI Rate THM", "Kg/THM", 125.4, [116, 118, 119, 121, 122, 124, 125.4]),
        new(1084, "Rotation Angle", "deg", 33.1, [30.4, 30.9, 31.5, 31.9, 32.3, 32.7, 33.1]),
        new(1083, "Tilting Angle", "deg", 14.3, [12.0, 12.4, 12.8, 13.2, 13.6, 13.9, 14.3]),
        new(1091, "Gear Box Temp", "deg C", 63.8, [59.8, 60.5, 61.1, 61.9, 62.4, 63.0, 63.8]),
        new(1123, "Hopper-1 WT", "t", 258.3, [253.8, 254.9, 255.6, 256.3, 257.0, 257.6, 258.3]),
        new(1124, "Hopper-2 WT", "t", 261.5, [256.2, 257.0, 258.2, 259.1, 259.8, 260.7, 261.5]),
        new(2426, "Hyd. Pressure", "bar", 173.8, [166.4, 168.0, 169.1, 170.2, 171.4, 172.6, 173.8]),
        new(1717, "Oil particle counter-1", "ppm", 11.8, [9.6, 10.1, 10.4, 10.8, 11.0, 11.4, 11.8]),
        new(1718, "Oil particle counter-2", "ppm", 12.2, [10.0, 10.5, 10.8, 11.1, 11.5, 11.8, 12.2]),
        new(1719, "Oil particle counter-3", "ppm", 13.1, [10.8, 11.1, 11.5, 11.9, 12.2, 12.6, 13.1]),
        new(2424, "LMG-1 Operating Time", "s", 9.4, [7.8, 8.0, 8.3, 8.6, 8.9, 9.1, 9.4]),
        new(2425, "LMG-2 Operating Time", "s", 9.8, [8.1, 8.4, 8.7, 9.0, 9.2, 9.5, 9.8]),
        new(1095, "GB Oil Temp", "deg C", 58.4, [54.7, 55.2, 55.9, 56.3, 56.9, 57.6, 58.4]),
        new(1649, "Greasing Fast Cycle", "sec", 68.2, [54, 56, 58, 60, 62, 65, 68.2])
    ];

    private static Metric[] ChargingMetrics =
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

    private static Metric[] CoolingMetrics =
    [
        new(1084, "Rotation Angle", "deg", 34.8, [31, 32, 32.4, 33, 33.6, 34.1, 34.8]),
        new(1083, "Tilting Angle", "deg", 12.6, [10.4, 10.9, 11.2, 11.5, 11.9, 12.2, 12.6]),
        new(1091, "Gear Box Temp", "deg C", 63.4, [56, 57.2, 58.5, 60.3, 61.2, 62.5, 63.4]),
        new(1123, "Hopper-1 WT", "Tons", 21.8, [20.8, 21.1, 21.3, 21.7, 22.2, 22.1, 21.8]),
        new(1124, "Hopper-2 WT", "Tons", 18.4, [17.6, 17.9, 18.1, 18.8, 19.4, 18.9, 18.4]),
        new(1095, "Oil Temp. (Planetary - 1)", "deg C", 58.1, [54.1, 54.7, 55.3, 56.8, 57.1, 57.7, 58.1]),
        new(1097, "Barrier Water Level-1", "mm", 372, [350, 354, 359, 362, 366, 369, 372]),
        new(1098, "Barrier Water Level-2", "mm", 381, [360, 365, 367, 372, 376, 379, 381]),
        new(1092, "GB Casing Temp.-2", "deg C", 61.2, [57.3, 57.9, 58.4, 59.2, 60.3, 60.9, 61.2]),
        new(1172, "Make up Flow", "m3", 14.7, [11.1, 11.8, 12.6, 13.4, 13.8, 14.2, 14.7]),
        new(1645, "Water barrier make up time", "hrs", 4.6, [3.8, 4.0, 4.1, 4.2, 4.4, 4.5, 4.6]),
        new(1646, "Water barrier make up vol.", "m3", 8.3, [7.1, 7.3, 7.4, 7.7, 7.8, 8.1, 8.3]),
        new(1096, "Oil Temp. (Planetary - 2)", "deg C", 57.3, [53.4, 54.1, 54.8, 55.6, 56.1, 56.8, 57.3]),
        new(1099, "Barrier Water Level-3", "mm", 388, [365, 369, 373, 376, 381, 384, 388]),
        new(1100, "Barrier Water Level-4", "mm", 394, [371, 376, 381, 385, 388, 391, 394]),
        new(1093, "GB Casing Temp.-3", "deg C", 62.1, [57.9, 58.2, 59.1, 59.9, 60.7, 61.3, 62.1]),
        new(1094, "GB Casing Temp.-4", "deg C", 61.8, [57.1, 58.3, 58.9, 59.8, 60.4, 61.1, 61.8]),
        new(1647, "Labyrinth make up time", "hrs", 3.7, [2.9, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7]),
        new(1648, "Labyrinth make up vol.", "m3", 6.1, [5.0, 5.2, 5.4, 5.5, 5.7, 5.9, 6.1])
    ];

    private static Metric[] ValveMetrics =
    [
        new(1084, "Rotation Angle", "deg", 32.7, [29.8, 30.4, 30.9, 31.3, 31.8, 32.2, 32.7]),
        new(1083, "Tilting Angle", "deg", 14.1, [11.9, 12.3, 12.8, 13.1, 13.5, 13.8, 14.1]),
        new(1091, "Gear Box Temp", "deg C", 63.7, [59.8, 60.4, 61.1, 61.8, 62.3, 63.0, 63.7]),
        new(1123, "Hopper-1 WT", "t", 256.2, [251.8, 252.9, 253.7, 254.3, 255.1, 255.7, 256.2]),
        new(1124, "Hopper-2 WT", "t", 259.4, [253.9, 254.6, 255.8, 256.9, 257.8, 258.6, 259.4]),
        new(1047, "Hyd. Pressure", "bar", 171.6, [164.3, 165.7, 167.1, 168.2, 169.1, 170.2, 171.6])
    ];

    private static Metric[] HydraulicMetrics =
    [
        new(1084, "Rotation Angle", "deg", 31.4, [28.8, 29.2, 29.8, 30.1, 30.6, 31.0, 31.4]),
        new(1083, "Tilting Angle", "deg", 13.6, [11.2, 11.7, 12.1, 12.5, 12.9, 13.2, 13.6]),
        new(1091, "Gear Box Temp", "deg C", 64.2, [59.8, 60.9, 61.7, 62.5, 63.1, 63.6, 64.2]),
        new(1123, "Hopper-1 WT", "t", 247.8, [243.2, 244.4, 245.1, 246.0, 246.6, 247.2, 247.8]),
        new(1124, "Hopper-2 WT", "t", 251.6, [246.2, 247.4, 248.9, 249.8, 250.4, 251.0, 251.6]),
        new(2426, "Hyd. Pressure", "bar", 176.3, [168.6, 170.1, 171.9, 173.0, 174.1, 175.2, 176.3]),
        new(1046, "Hydraulic Oil Temperature", "deg C", 52.4, [48.5, 49.2, 49.9, 50.7, 51.3, 51.9, 52.4]),
        new(1045, "Oil Tank Level Decay", "mm/hr", 3.2, [2.2, 2.4, 2.6, 2.8, 2.9, 3.1, 3.2]),
        new(2427, "Hyd. Pump-1 run hrs", "hrs", 18.6, [16.1, 16.5, 16.9, 17.2, 17.8, 18.1, 18.6]),
        new(1004, "Hyd Motor-1 Current", "A", 42.8, [35.2, 36.8, 38.1, 39.9, 40.8, 41.6, 42.8]),
        new(1047, "Pump-1 Discharge Pressure", "bar", 182.5, [174.1, 176.3, 177.8, 179.2, 180.6, 181.4, 182.5]),
        new(1048, "Pump-2 Discharge Pressure", "bar", 179.2, [171.4, 172.8, 174.9, 176.2, 177.3, 178.1, 179.2]),
        new(2428, "Hyd. Pump-2 run hrs", "hrs", 17.3, [15.4, 15.8, 16.1, 16.5, 16.8, 17.0, 17.3]),
        new(1005, "Hyd Motor-2 Current", "A", 39.7, [33.8, 34.9, 35.6, 36.8, 37.7, 38.8, 39.7])
    ];

    private static object Card(Metric metric, double spread = 0.03) =>
        new { metric.id, metric.label, metric.unit, value = Vary(metric.value, spread) };

    private static Metric Find(Metric[] metrics, object id) =>
        metrics.First(item => item.id.ToString() == id.ToString());

    public static object BltDashboard() => new
    {
        operationsMetrics = BltMetrics.Take(7).Select(metric => Card(metric, 0.02)),
        maintenanceMetrics = BltMetrics.Skip(7).Take(6).Select(metric => Card(metric, 0.02))
            .Append(new { id = (object)"pump-status", label = "Pump Status", unit = "", value = (object)"PUMP-1" }),
        plantLeft = BltMetrics.Skip(13).Take(6).Select(metric => Card(metric)),
        plantRight = BltMetrics.Skip(18).Take(2).Select(metric => Card(metric))
            .Append(new { id = (object)"pump-status-lower", label = "Hyd Pump Status", unit = "", value = (object)"PUMP-1" })
    };

    public static object BltHealth() => HealthPayload([
        new("charging", "Charging System", 91.4, 93, 90, 91),
        new("valve", "Valve System", 88.9, 89, 88, 90),
        new("cooling", "Cooling System", 90.7, 92, 89, 91),
        new("hydraulic", "Hydraulic System", 87.6, 86, 88, 89)
    ]);

    public static object BltAlarm() => Alarm(6, 58, 45, 39, [
        "Greasing fast cycle exceeded the 60-second threshold in the last operating cycle.",
        "Hydraulic section health dipped due to line-pressure variance and recent open alerts."
    ]);

    public static object BltAlertDistribution() => Bars(("Charging", 8), ("Valve", 7), ("Cooling", 5), ("Hydraulic", 6), ("Common BLT", 4));
    public static object BltCompliance() => Compliance(("Planned", 94), ("Released", 86), ("Completed", 80), ("Overdue", 17));
    public static object BltGfcDetails() => new { lastCycle = "68.2 sec", maxValue = "72.4 sec", minValue = "49.8 sec", pointsMissed = "5" };
    public static object BltTrend(string tagId) => Trend(BltMetrics.FirstOrDefault(item => item.id.ToString() == tagId)?.trend ?? []);

    public static object ChargingDashboard() => new
    {
        headerMetrics = ChargingMetrics.Take(5).Select(metric => Card(metric))
            .Append(Card(Find(ChargingMetrics, 1047)))
            .Append(new { id = (object)"pump-status", label = "Pump Status", unit = "", value = (object)"PUMP-1" }),
        leftColumn = ChargingMetrics.Skip(5).Take(7).Select(metric => Card(metric)),
        rightColumn = ChargingMetrics.Skip(11).Take(7).Select(metric => Card(metric)),
        motorTemperature = ChargingMetrics.Skip(15).Take(2).Select(metric => Card(metric))
    };

    public static object ChargingHealth() => HealthPayload([
        new("weighingSystem", "Weighing System", 91.2, 94, 89, 90),
        new("tiltingDrive", "Tilting Drive", 88.5, 87, 90, 88),
        new("rotatingDrive", "Rotating Drive", 92.1, 93, 91, 92),
        new("stockRod", "Stock Rod-1&2", 84.6, 82, 86, 86),
        new("switchGear", "Switch Gear", 86.9, 88, 84, 89),
        new("electrics", "Electrics", 89.8, 91, 88, 90),
        new("instrument", "Instrument", 87.7, 86, 89, 88)
    ]);

    public static object ChargingAlarm() => Alarm(6, 71, 58, 49, [
        "Hopper 2 pressurizing time exceeded rolling benchmark by 8%.",
        "Tilting motor current fluctuation detected during last charge cycle."
    ]);

    public static object ChargingAlertDistribution() => Bars(("Rotating Drive", 8), ("Tilting Drive", 6), ("Hopper System", 9), ("Hydraulics", 4), ("Switch Gear", 5));
    public static object ChargingCompliance() => Compliance(("Planned", 95), ("Released", 82), ("Completed", 77), ("Overdue", 18));
    public static object ChargingTrend(string tagId) => Trend(ChargingMetrics.FirstOrDefault(item => item.id.ToString() == tagId)?.trend ?? []);

    public static object CoolingDashboard() => new
    {
        headerMetrics = CoolingMetrics.Take(5).Select(metric => Card(metric))
            .Append(new { id = (object)2426, label = "Hyd. Pressure", unit = "bar", value = (object)Vary(172.4, 0.025) })
            .Append(new { id = (object)"pump-status", label = "Hyd. Pump Status", unit = "", value = (object)"PUMP-1" }),
        leftColumn = CoolingMetrics.Skip(5).Take(8).Select(metric => Card(metric)),
        rightColumn = CoolingMetrics.Skip(12).Take(7).Select(metric => Card(metric)),
        comparisonRows = CoolingMetrics.Skip(10).Take(4).Select(metric => new { id = metric.id, parameter = metric.label, latest = Vary(metric.value), previousAverage = Vary(metric.value * 1.05), metric.unit })
    };

    public static object CoolingHealth() => HealthPayload([
        new("coolingSystemMotor", "Cooling System Motor", 93.8, 96, 92, 94),
        new("coolingSystemInstr", "Cooling System Instr", 89.6, 90, 88, 91),
        new("switchGear", "Switch Gear", 85.2, 84, 87, 85)
    ]);

    public static object CoolingAlarm() => Alarm(4, 56, 47, 41, [
        "Barrier water level-2 deviated above normal operating band.",
        "Gearbox casing temperature-4 drifting upward for the last 15 minutes."
    ]);

    public static object CoolingAlertDistribution() => Bars(("Cooling Motor", 9), ("Instr Panels", 5), ("Switch Gear", 7), ("Hyd. Station", 3), ("Barrier Line", 6));
    public static object CoolingCompliance() => Compliance(("Planned", 92), ("In Progress", 68), ("Closed", 84), ("Overdue", 21));
    public static object CoolingTrend(string tagId) => Trend(CoolingMetrics.FirstOrDefault(item => item.id.ToString() == tagId)?.trend ?? []);

    public static object ValveDashboard() => new
    {
        headerMetrics = ValveMetrics.Select(metric => Card(metric))
            .Append(new { id = (object)"pump-status", label = "Pump Status", unit = "", value = (object)"PUMP-1" }),
        valveCards = new[]
        {
            new { key = "usv1", label = "USV-1", detailLabel = "USV-1", openTag = 1625, closeTag = 1626, open = Vary(10.8), close = Vary(11.4), health = 92.4, status = "Healthy" },
            new { key = "usv2", label = "USV-2", detailLabel = "USV-2", openTag = 1627, closeTag = 1628, open = Vary(12.1), close = Vary(12.8), health = 90.7, status = "Healthy" },
            new { key = "lsv1", label = "LSV-1", detailLabel = "LSV-1", openTag = 1599, closeTag = 1598, open = Vary(9.7), close = Vary(10.2), health = 89.8, status = "Healthy" },
            new { key = "lsv2", label = "LSV-2", detailLabel = "LSV-2", openTag = 1601, closeTag = 1600, open = Vary(10.4), close = Vary(10.9), health = 88.9, status = "Healthy" },
            new { key = "rv1", label = "RV-1", detailLabel = "RV-1", openTag = 1607, closeTag = 1606, open = Vary(13.6), close = Vary(14.1), health = 87.1, status = "Watch" },
            new { key = "rv2", label = "RV-2", detailLabel = "RV-2", openTag = 1609, closeTag = 1608, open = Vary(12.9), close = Vary(13.4), health = 86.5, status = "Healthy" },
            new { key = "pev1", label = "PEV-1", detailLabel = "PEV-1", openTag = 1603, closeTag = 1602, open = Vary(8.9), close = Vary(9.5), health = 91.2, status = "Healthy" },
            new { key = "pev2", label = "PEV-2", detailLabel = "PEV-2", openTag = 1605, closeTag = 1604, open = Vary(9.4), close = Vary(9.8), health = 90.2, status = "Healthy" },
            new { key = "sev1", label = "SEV-1", detailLabel = "SEV-1", openTag = 1611, closeTag = 1610, open = Vary(11.8), close = Vary(12.1), health = 88.4, status = "Healthy" },
            new { key = "sev2", label = "SEV-2", detailLabel = "SEV-2", openTag = 1402, closeTag = 1612, open = Vary(12.7), close = Vary(13.3), health = 87.6, status = "Healthy" }
        }
    };

    public static object ValveHealth() => HealthPayload([
        new("usv", "USV", 92.4, 94, 91, 92),
        new("lsv", "LSV", 89.6, 90, 88, 91),
        new("reliefValve", "Relief Valve", 87.8, 86, 89, 88),
        new("emergencyRelief", "Emergency Relief Valve", 86.9, 85, 88, 88),
        new("pev", "PEV", 91.1, 92, 90, 91),
        new("sev", "SEV", 88.7, 88, 89, 89),
        new("instrument", "Instrument", 93.2, 94, 92, 94)
    ]);

    public static object ValveAlarm() => Alarm(8, 63, 49, 44, [
        "RV-1 close response time exceeded 14 seconds during the last charge cycle.",
        "SEV-2 opening response drifting upward against previous-day average."
    ]);

    public static object ValveAlertDistribution() => Bars(("USV", 9), ("LSV", 7), ("Relief", 8), ("PEV", 4), ("SEV", 6));
    public static object ValveCompliance() => Compliance(("Planned", 93), ("Released", 85), ("Completed", 81), ("Overdue", 19));
    public static object ValveTrend(string tagId) => Trend(ValveMetrics.FirstOrDefault(item => item.id.ToString() == tagId)?.trend ?? []);

    public static object HydraulicDashboard() => new
    {
        headerMetrics = HydraulicMetrics.Take(6).Select(metric => Card(metric))
            .Append(new { id = (object)"pump-status", label = "Pump Status", unit = "", value = (object)"PUMP-1" }),
        operationalLeft = HydraulicMetrics.Skip(8).Take(3).Select(metric => Card(metric)),
        operationalRight = new[] { Card(Find(HydraulicMetrics, 1046)), Card(Find(HydraulicMetrics, 2428)), Card(Find(HydraulicMetrics, 1005)) },
        pump2Discharge = Card(Find(HydraulicMetrics, 1048)),
        oilTankLevel = new { id = 1045, label = "Rate of descent of hydraulic oil tank level", unit = "mm/hr", value = Vary(3.2), previousAverage = Vary(2.8) },
        rockerTimes = new[]
        {
            new { id = 1405, label = "Tilting Rocker Hopper 2 Time", unit = "s", value = Vary(8.7), previousAverage = Vary(8.2) },
            new { id = 1406, label = "Tilting Rocker Hopper 1 Time", unit = "s", value = Vary(8.1), previousAverage = Vary(7.8) }
        },
        diagnostics = new[]
        {
            new { id = 1629, label = "USV1 Hydraulic Open Line PT", unit = "bar", value = Vary(214.2) },
            new { id = 1630, label = "USV1 Hydraulic Close Line PT", unit = "bar", value = Vary(222.6) },
            new { id = 1631, label = "LSV1 Hydraulic Open Line PT", unit = "bar", value = Vary(205.8) },
            new { id = 1632, label = "LSV1 Hydraulic Close Line PT", unit = "bar", value = Vary(211.5) }
        },
        additionalSensors = new[]
        {
            new { id = 1717, label = "LMG-1 Leakage Indicator", unit = "l/min", value = Vary(1.7), previousAverage = (double?)null },
            new { id = 1718, label = "LMG-2 Leakage Indicator", unit = "l/min", value = Vary(1.9), previousAverage = (double?)null },
            new { id = 1719, label = "Tank Oil Particle Counter", unit = "ppm", value = Vary(14.6), previousAverage = (double?)null }
        }
    };

    public static object HydraulicHealth() => HealthPayload([
        new("usv", "USV", 90.8, 92, 89, 91),
        new("lsv", "LSV", 87.9, 86, 89, 88),
        new("instrument", "Instrument", 92.4, 93, 91, 93)
    ]);

    public static object HydraulicAlarm() => Alarm(5, 48, 36, 31, [
        "USV2 close line pressure crossed the soft threshold during the last cycle.",
        "Hydraulic oil temperature trending upward faster than previous shift average."
    ]);

    public static object HydraulicAlertDistribution() => Bars(("USV", 7), ("LSV", 5), ("Hyd. Pumps", 4), ("Tank/Oil", 3), ("Instrumentation", 6));
    public static object HydraulicCompliance() => Compliance(("Planned", 91), ("Released", 84), ("Completed", 79), ("Overdue", 16));
    public static object HydraulicTrend(string tagId) => Trend(HydraulicMetrics.FirstOrDefault(item => item.id.ToString() == tagId)?.trend ?? []);
}
