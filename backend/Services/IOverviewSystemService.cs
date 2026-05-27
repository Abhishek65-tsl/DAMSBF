namespace backend.Services;

public interface IOverviewSystemService
{
    object GetDashboard();
    object GetHealth();
    object GetAlarm();
    object GetAlertDistribution();
    object GetCompliance();
    object GetGfcDetails();
    object GetTrend(string tagId);
}
