namespace backend.Services;

public interface IBltDataService
{
    object GetBltDashboard();
    object GetBltHealth();
    object GetBltAlarm();
    object GetBltAlertDistribution();
    object GetBltCompliance();
    object GetBltGfcDetails();
    object GetBltTrend(string tagId);

    object GetChargingDashboard();
    object GetChargingHealth();
    object GetChargingAlarm();
    object GetChargingAlertDistribution();
    object GetChargingCompliance();
    object GetChargingTrend(string tagId);

    object GetCoolingDashboard();
    object GetCoolingHealth();
    object GetCoolingAlarm();
    object GetCoolingAlertDistribution();
    object GetCoolingCompliance();
    object GetCoolingTrend(string tagId);

    object GetValveDashboard();
    object GetValveHealth();
    object GetValveAlarm();
    object GetValveAlertDistribution();
    object GetValveCompliance();
    object GetValveTrend(string tagId);

    object GetHydraulicDashboard();
    object GetHydraulicHealth();
    object GetHydraulicAlarm();
    object GetHydraulicAlertDistribution();
    object GetHydraulicCompliance();
    object GetHydraulicTrend(string tagId);
}
