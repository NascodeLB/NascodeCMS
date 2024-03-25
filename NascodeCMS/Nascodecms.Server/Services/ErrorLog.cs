using Google;
using Microsoft.EntityFrameworkCore;
using NascodeCMS.Classes;
using System.Configuration;

namespace NascodeCMS.Server.Services
{
    public class ErrorLog
    {

        private string _connectionString;
        public ErrorLog(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public void LogError(string errorMessage, string url)
        {
            SQLExec tb = new SQLExec();
            string sql = "Insert into LogFrontend (Date,Message,Url) values('" + DateTime.UtcNow + "', '" + errorMessage + "', '" + url + "')";
            var tmp = tb.Execute(sql,_connectionString);

        }
    }
}
