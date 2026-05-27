namespace backend.Services;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAt) CreateToken(string username);
}
