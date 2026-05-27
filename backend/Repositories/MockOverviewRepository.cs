using backend.Services;

namespace backend.Repositories;

public class MockOverviewRepository : IOverviewRepository
{
    public object GetDashboard() => BltMockDataService.BltDashboard();
    public object GetHealth() => BltMockDataService.BltHealth();
    public object GetAlarm() => BltMockDataService.BltAlarm();
    public object GetAlertDistribution() => BltMockDataService.BltAlertDistribution();
    public object GetCompliance() => BltMockDataService.BltCompliance();
    public object GetGfcDetails() => BltMockDataService.BltGfcDetails();
    public object GetTrend(string tagId) => BltMockDataService.BltTrend(tagId);
}
