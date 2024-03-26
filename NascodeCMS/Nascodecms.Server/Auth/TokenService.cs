
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using NascodeCMS.Server.Models;

namespace NascodeCMS
{
    public class TokenService : ITokenService
    {
        private const double EXPIRY_DURATION_MINUTES = 1; //half a day

        public string BuildToken(string key,
        string issuer, CufexUser user)
        {
            var claims = new[] {
                new Claim(type: "ID", value: user.ID.ToString() ?? "0"),  
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var tokenDescriptor = new JwtSecurityToken(issuer, issuer, claims,
                expires: DateTime.UtcNow.AddMinutes(EXPIRY_DURATION_MINUTES), signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
 
        public bool IsTokenValid(string key, string issuer, string token)
        {
            var mySecret = Encoding.UTF8.GetBytes(key);
            var mySecurityKey = new SymmetricSecurityKey(mySecret);

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidIssuer = issuer,
                ValidateIssuer = true,
                ValidateAudience = false, // Assuming you don't want to validate the audience
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = mySecurityKey,
                ClockSkew = TimeSpan.Zero // Optional: reduce or eliminate clock skew allowance
            };

            try
            {
                tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                // Additional manual validations can be done here if necessary
                return validatedToken != null;
            }
            catch (SecurityTokenExpiredException)
            {
                // Specific action for expired token
                Console.WriteLine("Token has expired");
                return false;
            }
            catch (SecurityTokenInvalidSignatureException)
            {
                // Specific action for invalid signature
                Console.WriteLine("Invalid token signature");
                return false;
            }
            catch (SecurityTokenException)
            {
                // General action for other token related issues
                Console.WriteLine("Token validation failed");
                return false;
            }
            catch (Exception)
            {
                // Optional: catch block for any other exception types not covered above
                // Console.WriteLine("An unexpected error occurred");
                return false;
            }
        }


        public string GetMemberIdFromRefreshToken(string token, string key)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero // Immediate expiry check
            };

            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
            var memberIdClaim = principal.Claims.FirstOrDefault(c => c.Type == "memberID");

            return memberIdClaim?.Value ?? ""; // This will return the member ID, or null if it's not found
        }

 
        public string BuildRefreshToken(string key, string issuer, CufexUser user)
        {
            var claims = new[]
            {
        new Claim(type: "memberID", value: user.ID.ToString()), 
    };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: issuer,
                audience: issuer,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Set a longer expiry for refresh tokens
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        ClaimsPrincipal ITokenService.GetPrincipalFromExpiredToken(string? token, string issuer, string jwtSecret)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = issuer,
                ValidateAudience = false,
                ValidateIssuer = false, //to be fixed
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ValidateLifetime = false
            };

            //if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            //    throw new SecurityTokenException("Invalid token");
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken = null;
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);
                return principal;
            }
            catch (SecurityTokenException)
            {
                return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }

    }
}