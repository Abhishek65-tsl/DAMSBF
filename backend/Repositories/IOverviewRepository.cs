namespace backend.Repositories;

public interface IOverviewRepository
{
    object GetDashboard();
    object GetHealth();
    object GetAlarm();
    object GetAlertDistribution();
    object GetCompliance();
    object GetGfcDetails();
    object GetTrend(string tagId);
}
