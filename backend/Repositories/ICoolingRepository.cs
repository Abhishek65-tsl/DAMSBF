namespace backend.Repositories;

public interface ICoolingRepository
{
    object GetDashboard();
    object GetHealth();
    object GetAlarm();
    object GetAlertDistribution();
    object GetCompliance();
    object GetTrend(string tagId);
}
