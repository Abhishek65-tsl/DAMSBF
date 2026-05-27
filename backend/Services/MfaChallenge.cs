namespace backend.Services;

public record MfaChallenge(string ChallengeId, string Username, string Code, DateTime ExpiresAt);
