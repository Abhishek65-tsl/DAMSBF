using backend.Services;

namespace backend.Repositories;

public class MockValveRepository : IValveRepository
{
    public object GetDashboard() => BltMockDataService.ValveDashboard();
    public object GetHealth() => BltMockDataService.ValveHealth();
    public object GetAlarm() => BltMockDataService.ValveAlarm();
    public object GetAlertDistribution() => BltMockDataService.ValveAlertDistribution();
    public object GetCompliance() => BltMockDataService.ValveCompliance();
    public object GetTrend(string tagId) => BltMockDataService.ValveTrend(tagId);
}
