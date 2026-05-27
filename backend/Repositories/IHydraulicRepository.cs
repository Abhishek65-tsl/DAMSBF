namespace backend.Repositories;

public interface IHydraulicRepository
{
    object GetDashboard();
    object GetHealth();
    object GetAlarm();
    object GetAlertDistribution();
    object GetCompliance();
    object GetTrend(string tagId);
}
