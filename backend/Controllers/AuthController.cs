using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[AllowAnonymous]
[EnableRateLimiting("auth")]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IMfaService _mfaService;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        IJwtTokenService jwtTokenService,
        IMfaService mfaService,
        IWebHostEnvironment environment)
    {
        _jwtTokenService = jwtTokenService;
        _mfaService = mfaService;
        _environment = environment;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        if (request.Username != "admin" || request.Password != "admin123")
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var challenge = _mfaService.CreateChallenge(request.Username);
        var developmentCode = _environment.IsDevelopment() ? challenge.Code : null;

        return Ok(new MfaChallengeResponse(
            MfaRequired: true,
            ChallengeId: challenge.ChallengeId,
            ExpiresAt: challenge.ExpiresAt,
            DevelopmentCode: developmentCode));
    }

    [HttpPost("verify-mfa")]
    public IActionResult VerifyMfa(VerifyMfaRequest request)
    {
        if (!_mfaService.TryVerifyChallenge(request.ChallengeId, request.Code, out var username))
        {
            return Unauthorized(new { message = "Invalid or expired MFA code." });
        }

        var (token, expiresAt) = _jwtTokenService.CreateToken(username);
        return Ok(new LoginResponse(token, expiresAt));
    }
}
