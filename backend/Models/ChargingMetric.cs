namespace backend.Models;

public record ChargingMetric(object Id, string Label, string Unit, double Value, double[] Trend);
