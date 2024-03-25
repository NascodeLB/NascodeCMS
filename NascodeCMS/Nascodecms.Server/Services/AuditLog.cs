using NascodeCMS.Classes;
using System.Security.Policy;

namespace NascodeCMS.Server.Services
{
    public class AuditLog
    {
        private readonly string _connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditLog(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _httpContextAccessor = httpContextAccessor;
        }

        public void Add(string UserId, string RecType, string RecId, string OperationType, string info) {
            string ipAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress?.ToString();
            
            SQLExec tb = new SQLExec();
            string sql = "Insert into LogFile ([UserId],[RecType],[RecId],[LogDate],[OperationType],[Info],[MachineName],[IPAddress])" +
                " values('"+UserId+"', '"+RecType+"', "+ RecId +",'" + DateTime.UtcNow + "', '" + OperationType + "', '" + info + "'," +
                "'','"+ ipAddress + "')";
            var tmp = tb.Execute(sql, _connectionString);
        }
       
    }
}
