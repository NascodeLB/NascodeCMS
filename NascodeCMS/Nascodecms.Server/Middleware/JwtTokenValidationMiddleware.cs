namespace NascodeCMS.Server.Models

{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Http.HttpResults;
    using System.IdentityModel.Tokens.Jwt;
    using System.Threading.Tasks;
    public class JwtTokenValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public JwtTokenValidationMiddleware(IConfiguration configuration,RequestDelegate next)
        {
            _configuration = configuration;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ITokenService tokenService)
        {

            //list of bypassed API'S from Auth
            var pathsToExclude = new List<string>
            {
                 "/api/User/Login",
                 "/api/User/ResetCode",
                 "/api/User/ResetPassword",
                 "/api/User/CheckVerificationCode",
                 "/api/User/Refresh-Token" 
            };
             
            if (pathsToExclude.Any(path => context.Request.Path.StartsWithSegments(path, StringComparison.OrdinalIgnoreCase)))
            { 
                await _next(context);
                return;
            } 

            // Extract the token from the Authorization header
            string authHeader = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            // Validate the token and get the claims principal
            string jwtKey = _configuration["Jwt:Key"] ?? "";
            string jwtIssuer = _configuration["Jwt:Issuer"] ?? "";
            if (!string.IsNullOrEmpty(authHeader) && tokenService.IsTokenValid(jwtKey.ToString(), jwtIssuer.ToString(), authHeader))
            {
                try
                {
                    var principal = tokenService.GetPrincipalFromExpiredToken(authHeader, jwtIssuer.ToString(), jwtKey.ToString());

                    // Extract the custom member ID claim
                    var memberIdClaim = principal?.FindFirst("ID")?.Value;

                    if (!string.IsNullOrEmpty(memberIdClaim))
                    {
                        // Add the member ID to the request headers
                        context.Request.Headers["MemberID"] = memberIdClaim;
                    }

                }
                catch
                {
                    context.Response.StatusCode = 401; // Unauthorized
                    await context.Response.WriteAsync("Invalid token");
                    return;
                }

                // Continue processing the request
                await _next(context);
            }
            else
            {
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Unauthorized"); 
            }
        }

    }
}
