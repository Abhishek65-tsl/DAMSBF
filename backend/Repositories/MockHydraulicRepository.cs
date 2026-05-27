using backend.Services;

namespace backend.Repositories;

public class MockHydraulicRepository : IHydraulicRepository
{
    public object GetDashboard() => BltMockDataService.HydraulicDashboard();
    public object GetHealth() => BltMockDataService.HydraulicHealth();
    public object GetAlarm() => BltMockDataService.HydraulicAlarm();
    public object GetAlertDistribution() => BltMockDataService.HydraulicAlertDistribution();
    public object GetCompliance() => BltMockDataService.HydraulicCompliance();
    public object GetTrend(string tagId) => BltMockDataService.HydraulicTrend(tagId);
}
