using backend.Services;

namespace backend.Repositories;

public class MockCoolingRepository : ICoolingRepository
{
    public object GetDashboard() => BltMockDataService.CoolingDashboard();
    public object GetHealth() => BltMockDataService.CoolingHealth();
    public object GetAlarm() => BltMockDataService.CoolingAlarm();
    public object GetAlertDistribution() => BltMockDataService.CoolingAlertDistribution();
    public object GetCompliance() => BltMockDataService.CoolingCompliance();
    public object GetTrend(string tagId) => BltMockDataService.CoolingTrend(tagId);
}
