using NascodeCMS.Server.Services;

namespace NascodeCMS.Server.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ErrorLog _errorLogService;

        public ErrorHandlingMiddleware(RequestDelegate next, ErrorLog errorLogService)
        {
            _next = next;
            _errorLogService = errorLogService;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log the exception
                _errorLogService.LogError(ex.Message, context.Request.Path);

                // Optionally, you can return a custom error response here
                //context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                //await context.Response.WriteAsync("An unexpected error occurred.");
            }
        }
    }

   
}
