namespace backend.Models;

public record VerifyMfaRequest(string ChallengeId, string Code);
