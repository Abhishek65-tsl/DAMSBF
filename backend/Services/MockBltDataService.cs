namespace backend.Services;

public class MockBltDataService : IBltDataService
{
    private readonly IOverviewSystemService _overviewSystemService;
    private readonly IChargingSystemService _chargingSystemService;
    private readonly ICoolingSystemService _coolingSystemService;
    private readonly IValveSystemService _valveSystemService;
    private readonly IHydraulicSystemService _hydraulicSystemService;

    public MockBltDataService(
        IOverviewSystemService overviewSystemService,
        IChargingSystemService chargingSystemService,
        ICoolingSystemService coolingSystemService,
        IValveSystemService valveSystemService,
        IHydraulicSystemService hydraulicSystemService)
    {
        _overviewSystemService = overviewSystemService;
        _chargingSystemService = chargingSystemService;
        _coolingSystemService = coolingSystemService;
        _valveSystemService = valveSystemService;
        _hydraulicSystemService = hydraulicSystemService;
    }

    public object GetBltDashboard() => _overviewSystemService.GetDashboard();
    public object GetBltHealth() => _overviewSystemService.GetHealth();
    public object GetBltAlarm() => _overviewSystemService.GetAlarm();
    public object GetBltAlertDistribution() => _overviewSystemService.GetAlertDistribution();
    public object GetBltCompliance() => _overviewSystemService.GetCompliance();
    public object GetBltGfcDetails() => _overviewSystemService.GetGfcDetails();
    public object GetBltTrend(string tagId) => _overviewSystemService.GetTrend(tagId);

    public object GetChargingDashboard() => _chargingSystemService.GetDashboard();
    public object GetChargingHealth() => _chargingSystemService.GetHealth();
    public object GetChargingAlarm() => _chargingSystemService.GetAlarm();
    public object GetChargingAlertDistribution() => _chargingSystemService.GetAlertDistribution();
    public object GetChargingCompliance() => _chargingSystemService.GetCompliance();
    public object GetChargingTrend(string tagId) => _chargingSystemService.GetTrend(tagId);

    public object GetCoolingDashboard() => _coolingSystemService.GetDashboard();
    public object GetCoolingHealth() => _coolingSystemService.GetHealth();
    public object GetCoolingAlarm() => _coolingSystemService.GetAlarm();
    public object GetCoolingAlertDistribution() => _coolingSystemService.GetAlertDistribution();
    public object GetCoolingCompliance() => _coolingSystemService.GetCompliance();
    public object GetCoolingTrend(string tagId) => _coolingSystemService.GetTrend(tagId);

    public object GetValveDashboard() => _valveSystemService.GetDashboard();
    public object GetValveHealth() => _valveSystemService.GetHealth();
    public object GetValveAlarm() => _valveSystemService.GetAlarm();
    public object GetValveAlertDistribution() => _valveSystemService.GetAlertDistribution();
    public object GetValveCompliance() => _valveSystemService.GetCompliance();
    public object GetValveTrend(string tagId) => _valveSystemService.GetTrend(tagId);

    public object GetHydraulicDashboard() => _hydraulicSystemService.GetDashboard();
    public object GetHydraulicHealth() => _hydraulicSystemService.GetHealth();
    public object GetHydraulicAlarm() => _hydraulicSystemService.GetAlarm();
    public object GetHydraulicAlertDistribution() => _hydraulicSystemService.GetAlertDistribution();
    public object GetHydraulicCompliance() => _hydraulicSystemService.GetCompliance();
    public object GetHydraulicTrend(string tagId) => _hydraulicSystemService.GetTrend(tagId);
}
