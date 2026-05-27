using backend.Repositories;

namespace backend.Services;

public class ValveSystemService : IValveSystemService
{
    private readonly IValveRepository _repository;

    public ValveSystemService(IValveRepository repository)
    {
        _repository = repository;
    }

    public object GetDashboard() => _repository.GetDashboard();
    public object GetHealth() => _repository.GetHealth();
    public object GetAlarm() => _repository.GetAlarm();
    public object GetAlertDistribution() => _repository.GetAlertDistribution();
    public object GetCompliance() => _repository.GetCompliance();
    public object GetTrend(string tagId) => _repository.GetTrend(tagId);
}
