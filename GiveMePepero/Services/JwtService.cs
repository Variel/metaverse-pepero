using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace GiveMePepero.Services
{
    public class JwtService
    {
        private readonly TokenValidationParameters _validationParameters;
        private readonly JwtSecurityTokenHandler _jwtHandler = new JwtSecurityTokenHandler();

        public JwtService(IConfiguration config)
        {
            _validationParameters = new TokenValidationParameters
            {
                ValidIssuer = config["Jwt:Issuer"],
                ValidAudience = config["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:SecretKey"]))
            };
        }

        public string GenerateToken(string subject, DateTime? expires = null)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, subject)
            };

            var token = new JwtSecurityToken(
                issuer: _validationParameters.ValidIssuer,
                audience: _validationParameters.ValidAudience,
                claims: claims,
                expires: expires ?? DateTime.UtcNow.AddHours(1),
                signingCredentials: new SigningCredentials(_validationParameters.IssuerSigningKey,
                    SecurityAlgorithms.HmacSha512));

            return _jwtHandler.WriteToken(token);
        }

        public string GetSubject(string token)
        {
            var principal = _jwtHandler.ValidateToken(token, _validationParameters, out var validated);

            return principal.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
