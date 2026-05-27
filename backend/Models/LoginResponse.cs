namespace backend.Models;

public record LoginResponse(string Token, DateTime ExpiresAt, string TokenType = "Bearer");
