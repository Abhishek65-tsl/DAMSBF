namespace backend.Services;

public interface IMfaService
{
    MfaChallenge CreateChallenge(string username);
    bool TryVerifyChallenge(string challengeId, string code, out string username);
}
