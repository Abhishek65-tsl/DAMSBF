using backend.Data.Mock;
using backend.Models;

namespace backend.Repositories;

public class MockChargingRepository : IChargingRepository
{
    public IReadOnlyList<ChargingMetric> GetMetrics() => ChargingMockData.Metrics;
    public IReadOnlyList<HealthItem> GetHealthItems() => ChargingMockData.HealthItems;
    public IReadOnlyList<string> GetRecentAlarms() => ChargingMockData.RecentAlarms;
}
