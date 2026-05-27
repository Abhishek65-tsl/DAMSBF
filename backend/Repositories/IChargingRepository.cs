using backend.Models;

namespace backend.Repositories;

public interface IChargingRepository
{
    IReadOnlyList<ChargingMetric> GetMetrics();
    IReadOnlyList<HealthItem> GetHealthItems();
    IReadOnlyList<string> GetRecentAlarms();
}
