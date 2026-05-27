using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace backend.Services;

public class InMemoryMfaService : IMfaService
{
    private readonly ConcurrentDictionary<string, MfaChallenge> _challenges = new();
    private readonly IConfiguration _configuration;

    public InMemoryMfaService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public MfaChallenge CreateChallenge(string username)
    {
        RemoveExpiredChallenges();

        var challengeId = Guid.NewGuid().ToString("N");
        var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        var expiryMinutes = int.TryParse(_configuration["Mfa:CodeExpiryMinutes"], out var minutes) ? minutes : 5;
        var challenge = new MfaChallenge(
            challengeId,
            username,
            code,
            DateTime.UtcNow.AddMinutes(expiryMinutes));

        _challenges[challengeId] = challenge;
        return challenge;
    }

    public bool TryVerifyChallenge(string challengeId, string code, out string username)
    {
        username = string.Empty;

        if (!_challenges.TryGetValue(challengeId, out var challenge))
        {
            return false;
        }

        _challenges.TryRemove(challengeId, out _);

        if (challenge.ExpiresAt < DateTime.UtcNow || challenge.Code != code)
        {
            return false;
        }

        username = challenge.Username;
        return true;
    }

    private void RemoveExpiredChallenges()
    {
        foreach (var item in _challenges)
        {
            if (item.Value.ExpiresAt < DateTime.UtcNow)
            {
                _challenges.TryRemove(item.Key, out _);
            }
        }
    }
}
