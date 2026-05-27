namespace backend.Services;

public interface IHydraulicSystemService
{
    object GetDashboard();
    object GetHealth();
    object GetAlarm();
    object GetAlertDistribution();
    object GetCompliance();
    object GetTrend(string tagId);
}
