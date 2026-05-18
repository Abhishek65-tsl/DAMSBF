namespace backend.Services;

public class MockBltDataService : IBltDataService
{
    public object GetBltDashboard() => BltMockDataService.BltDashboard();
    public object GetBltHealth() => BltMockDataService.BltHealth();
    public object GetBltAlarm() => BltMockDataService.BltAlarm();
    public object GetBltAlertDistribution() => BltMockDataService.BltAlertDistribution();
    public object GetBltCompliance() => BltMockDataService.BltCompliance();
    public object GetBltGfcDetails() => BltMockDataService.BltGfcDetails();
    public object GetBltTrend(string tagId) => BltMockDataService.BltTrend(tagId);

    public object GetChargingDashboard() => BltMockDataService.ChargingDashboard();
    public object GetChargingHealth() => BltMockDataService.ChargingHealth();
    public object GetChargingAlarm() => BltMockDataService.ChargingAlarm();
    public object GetChargingAlertDistribution() => BltMockDataService.ChargingAlertDistribution();
    public object GetChargingCompliance() => BltMockDataService.ChargingCompliance();
    public object GetChargingTrend(string tagId) => BltMockDataService.ChargingTrend(tagId);

    public object GetCoolingDashboard() => BltMockDataService.CoolingDashboard();
    public object GetCoolingHealth() => BltMockDataService.CoolingHealth();
    public object GetCoolingAlarm() => BltMockDataService.CoolingAlarm();
    public object GetCoolingAlertDistribution() => BltMockDataService.CoolingAlertDistribution();
    public object GetCoolingCompliance() => BltMockDataService.CoolingCompliance();
    public object GetCoolingTrend(string tagId) => BltMockDataService.CoolingTrend(tagId);

    public object GetValveDashboard() => BltMockDataService.ValveDashboard();
    public object GetValveHealth() => BltMockDataService.ValveHealth();
    public object GetValveAlarm() => BltMockDataService.ValveAlarm();
    public object GetValveAlertDistribution() => BltMockDataService.ValveAlertDistribution();
    public object GetValveCompliance() => BltMockDataService.ValveCompliance();
    public object GetValveTrend(string tagId) => BltMockDataService.ValveTrend(tagId);

    public object GetHydraulicDashboard() => BltMockDataService.HydraulicDashboard();
    public object GetHydraulicHealth() => BltMockDataService.HydraulicHealth();
    public object GetHydraulicAlarm() => BltMockDataService.HydraulicAlarm();
    public object GetHydraulicAlertDistribution() => BltMockDataService.HydraulicAlertDistribution();
    public object GetHydraulicCompliance() => BltMockDataService.HydraulicCompliance();
    public object GetHydraulicTrend(string tagId) => BltMockDataService.HydraulicTrend(tagId);
}
