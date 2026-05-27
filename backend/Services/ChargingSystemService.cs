using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class ChargingSystemService : IChargingSystemService
{
    private static readonly Random Random = new();
    private readonly IChargingRepository _repository;

    public ChargingSystemService(IChargingRepository repository)
    {
        _repository = repository;
    }

    public object GetDashboard()
    {
        var metrics = _repository.GetMetrics();

        return new
        {
            headerMetrics = metrics.Take(5).Select(Card)
                .Append(Card(Find(metrics, 1047)))
                .Append(new { id = (object)"pump-status", label = "Pump Status", unit = "", value = (object)"PUMP-1" }),
            leftColumn = metrics.Skip(5).Take(7).Select(Card),
            rightColumn = metrics.Skip(11).Take(7).Select(Card),
            motorTemperature = metrics.Skip(15).Take(2).Select(Card)
        };
    }

    public object GetHealth()
    {
        var items = _repository.GetHealthItems();

        return new
        {
            items = items.Select(item => new
            {
                key = item.Key,
                label = item.Label,
                value = Vary(item.Value, 0.015),
                detail = new { alertComp = item.AlertComp, moComp = item.MoComp, noComp = item.NoComp }
            }),
            overall = Math.Round(items.Average(item => item.Value), 1)
        };
    }

    public object GetAlarm() => new
    {
        OPEN = Math.Max(0, 6 + Random.Next(-1, 2)),
        TOTAL = 71 + Random.Next(-1, 2),
        CLOSE = 58 + Random.Next(-1, 2),
        ACK = 49 + Random.Next(-1, 2),
        recent = _repository.GetRecentAlarms()
    };

    public object GetAlertDistribution() => Bars(
        ("Rotating Drive", 8),
        ("Tilting Drive", 6),
        ("Hopper System", 9),
        ("Hydraulics", 4),
        ("Switch Gear", 5)
    );

    public object GetCompliance() => Compliance(
        ("Planned", 95),
        ("Released", 82),
        ("Completed", 77),
        ("Overdue", 18)
    );

    public object GetTrend(string tagId)
    {
        var metric = _repository.GetMetrics().FirstOrDefault(item => item.Id.ToString() == tagId);

        return metric?.Trend.Select((value, index) => new { label = $"{index + 1}h", value }).ToArray()
            ?? [];
    }

    private static object Card(ChargingMetric metric) =>
        new { id = metric.Id, label = metric.Label, unit = metric.Unit, value = Vary(metric.Value, 0.03) };

    private static ChargingMetric Find(IReadOnlyList<ChargingMetric> metrics, object id) =>
        metrics.First(item => item.Id.ToString() == id.ToString());

    private static double Vary(double value, double spread = 0.04, int digits = 1)
    {
        var next = value * (1 + (Random.NextDouble() - 0.5) * spread);
        return Math.Round(next, digits);
    }

    private static object[] Bars(params (string label, int value)[] items) =>
        items.Select(item => new { item.label, value = Math.Max(0, item.value + Random.Next(-1, 2)) }).ToArray<object>();

    private static object[] Compliance(params (string label, int value)[] items) =>
        items.Select(item => new { item.label, value = Math.Clamp(item.value + Random.Next(-3, 4), 0, 100) }).ToArray<object>();
}
