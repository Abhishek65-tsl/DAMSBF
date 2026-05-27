namespace backend.Services;

public interface IChargingSystemService
{
    object GetDashboard();
    object GetHealth();
    object GetAlarm();
    object GetAlertDistribution();
    object GetCompliance();
    object GetTrend(string tagId);
}
