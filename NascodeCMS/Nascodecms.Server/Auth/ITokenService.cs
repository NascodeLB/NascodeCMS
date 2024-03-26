
using NascodeCMS.Server.Models;
using System.Security.Claims;

namespace NascodeCMS
{
    public interface ITokenService
    {
        string BuildToken(string key, string issuer, CufexUser user);

        //string GenerateJSONWebToken(string key, string issuer, UserDTO user);
        bool IsTokenValid(string key, string issuer, string token);
        string GetMemberIdFromRefreshToken(string key,  string token);

   
        string BuildRefreshToken(string key, string issuer, CufexUser user);

        ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token, string issuer, string jwtSecret);
    }
}