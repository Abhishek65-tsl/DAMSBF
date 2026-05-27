using backend.Services;
using backend.Repositories;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing.");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddSingleton<IBltDataService, MockBltDataService>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<IMfaService, InMemoryMfaService>();
builder.Services.AddSingleton<IChargingRepository, MockChargingRepository>();
builder.Services.AddSingleton<IChargingSystemService, ChargingSystemService>();
builder.Services.AddSingleton<IOverviewRepository, MockOverviewRepository>();
builder.Services.AddSingleton<IOverviewSystemService, OverviewSystemService>();
builder.Services.AddSingleton<ICoolingRepository, MockCoolingRepository>();
builder.Services.AddSingleton<ICoolingSystemService, CoolingSystemService>();
builder.Services.AddSingleton<IValveRepository, MockValveRepository>();
builder.Services.AddSingleton<IValveSystemService, ValveSystemService>();
builder.Services.AddSingleton<IHydraulicRepository, MockHydraulicRepository>();
builder.Services.AddSingleton<IHydraulicSystemService, HydraulicSystemService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
