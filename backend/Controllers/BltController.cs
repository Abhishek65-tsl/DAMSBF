using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/blt")]
public class BltController : ControllerBase
{
    private readonly IBltDataService _bltDataService;

    public BltController(IBltDataService bltDataService)
    {
        _bltDataService = bltDataService;
    }

    [HttpGet("dashboard")]
    public IActionResult GetBltDashboard() => Ok(_bltDataService.GetBltDashboard());

    [HttpGet("section-health")]
    public IActionResult GetBltHealth() => Ok(_bltDataService.GetBltHealth());

    [HttpGet("alarm-summary")]
    public IActionResult GetBltAlarmSummary() => Ok(_bltDataService.GetBltAlarm());

    [HttpGet("alert-distribution")]
    public IActionResult GetBltAlertDistribution() => Ok(_bltDataService.GetBltAlertDistribution());

    [HttpGet("mo-compliance")]
    public IActionResult GetBltMoCompliance() => Ok(_bltDataService.GetBltCompliance());

    [HttpGet("gfc-details")]
    public IActionResult GetBltGfcDetails() => Ok(_bltDataService.GetBltGfcDetails());

    [HttpGet("trend/{tagId}")]
    public IActionResult GetBltTrend(string tagId) => Ok(_bltDataService.GetBltTrend(tagId));

    [HttpGet("charging/dashboard")]
    public IActionResult GetChargingDashboard() => Ok(_bltDataService.GetChargingDashboard());

    [HttpGet("charging/health")]
    public IActionResult GetChargingHealth() => Ok(_bltDataService.GetChargingHealth());

    [HttpGet("charging/alarm-summary")]
    public IActionResult GetChargingAlarmSummary() => Ok(_bltDataService.GetChargingAlarm());

    [HttpGet("charging/alert-distribution")]
    public IActionResult GetChargingAlertDistribution() => Ok(_bltDataService.GetChargingAlertDistribution());

    [HttpGet("charging/mo-compliance")]
    public IActionResult GetChargingMoCompliance() => Ok(_bltDataService.GetChargingCompliance());

    [HttpGet("charging/trend/{tagId}")]
    public IActionResult GetChargingTrend(string tagId) => Ok(_bltDataService.GetChargingTrend(tagId));

    [HttpGet("cooling/dashboard")]
    public IActionResult GetCoolingDashboard() => Ok(_bltDataService.GetCoolingDashboard());

    [HttpGet("cooling/health")]
    public IActionResult GetCoolingHealth() => Ok(_bltDataService.GetCoolingHealth());

    [HttpGet("cooling/alarm-summary")]
    public IActionResult GetCoolingAlarmSummary() => Ok(_bltDataService.GetCoolingAlarm());

    [HttpGet("cooling/alert-distribution")]
    public IActionResult GetCoolingAlertDistribution() => Ok(_bltDataService.GetCoolingAlertDistribution());

    [HttpGet("cooling/mo-compliance")]
    public IActionResult GetCoolingMoCompliance() => Ok(_bltDataService.GetCoolingCompliance());

    [HttpGet("cooling/trend/{tagId}")]
    public IActionResult GetCoolingTrend(string tagId) => Ok(_bltDataService.GetCoolingTrend(tagId));

    [HttpGet("valve/dashboard")]
    public IActionResult GetValveDashboard() => Ok(_bltDataService.GetValveDashboard());

    [HttpGet("valve/health")]
    public IActionResult GetValveHealth() => Ok(_bltDataService.GetValveHealth());

    [HttpGet("valve/alarm-summary")]
    public IActionResult GetValveAlarmSummary() => Ok(_bltDataService.GetValveAlarm());

    [HttpGet("valve/alert-distribution")]
    public IActionResult GetValveAlertDistribution() => Ok(_bltDataService.GetValveAlertDistribution());

    [HttpGet("valve/mo-compliance")]
    public IActionResult GetValveMoCompliance() => Ok(_bltDataService.GetValveCompliance());

    [HttpGet("valve/trend/{tagId}")]
    public IActionResult GetValveTrend(string tagId) => Ok(_bltDataService.GetValveTrend(tagId));

    [HttpGet("hydraulic/dashboard")]
    public IActionResult GetHydraulicDashboard() => Ok(_bltDataService.GetHydraulicDashboard());

    [HttpGet("hydraulic/health")]
    public IActionResult GetHydraulicHealth() => Ok(_bltDataService.GetHydraulicHealth());

    [HttpGet("hydraulic/alarm-summary")]
    public IActionResult GetHydraulicAlarmSummary() => Ok(_bltDataService.GetHydraulicAlarm());

    [HttpGet("hydraulic/alert-distribution")]
    public IActionResult GetHydraulicAlertDistribution() => Ok(_bltDataService.GetHydraulicAlertDistribution());

    [HttpGet("hydraulic/mo-compliance")]
    public IActionResult GetHydraulicMoCompliance() => Ok(_bltDataService.GetHydraulicCompliance());

    [HttpGet("hydraulic/trend/{tagId}")]
    public IActionResult GetHydraulicTrend(string tagId) => Ok(_bltDataService.GetHydraulicTrend(tagId));
}
