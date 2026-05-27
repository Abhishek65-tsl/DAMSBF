namespace backend.Models;

public record MfaChallengeResponse(
    bool MfaRequired,
    string ChallengeId,
    DateTime ExpiresAt,
    string? DevelopmentCode = null);
