namespace backend.Services;

public interface ICoolingSystemService
{
    object GetDashboard();
    object GetHealth();
    object GetAlarm();
    object GetAlertDistribution();
    object GetCompliance();
    object GetTrend(string tagId);
}
