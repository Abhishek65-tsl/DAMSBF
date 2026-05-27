namespace backend.Models;

public record HealthItem(string Key, string Label, double Value, int AlertComp, int MoComp, int NoComp);
