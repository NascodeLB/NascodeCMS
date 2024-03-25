using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using System.Data;
using System.Data.SqlClient;
using NascodeCMS.Server.Models;
using NascodeCMS.ResponseModels;
using NascodeCMS.Filter;
using NascodeCMS.Server.Services;

namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogFrontendController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;
        public LogFrontendController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<LogFrontendController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;
        }

        [HttpGet("GetFrontendLogs")]
        public IActionResult GetFrontendLog([FromQuery] PaginationFilter input)
        {
            

            var MySortBy = "";
            var WhereCondidtion = "";


            if (input.Sorting != "")
            {
                MySortBy = " order by " + input.Sorting.ToLower();
            }
            else
            {
                MySortBy = " order by id desc";
            }
            WhereCondidtion += " from LogFrontend where 1=1 ";
            var datesql = "";
            if (input.Fromdate != "") datesql += "and  Date >= '" + input.Fromdate + "' ";
            if (input.Todate != "") datesql += "and  Date <= '" + input.Todate + "' ";
            if (input.Fromdate != "" && input.Fromdate == input.Todate)
            {
                datesql = "and  CONVERT(date, Date) = '" + input.Fromdate + "' ";
            }
            WhereCondidtion += datesql;

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql += "Select *";
            
            sql += WhereCondidtion;
            sql += MySortBy.Trim(); ;
            sql += input.PageSize > 0 ? (" OFFSET " + input.After + " ROWS FETCH NEXT " + input.PageSize + " ROWS ONLY ") : "";

            sql += "select count (*)  as TotalCount " + WhereCondidtion;
            var ds = DAL.GetDataSet(sqlDataSource, sql);
            var TotalCount = System.Convert.ToInt32(ds.Tables[1].Rows[0]["TotalCount"].ToString());
            int[] pageNumbers = clsGlobals.CalculatePagination(TotalCount, input.PageSize, input.PageNumber);
            int lastPage = clsGlobals.CalculateLastPageNumber(TotalCount, input.PageSize);

            Pagination pagination = new Pagination
            {
                CurrentPage = input.PageNumber,
                FirstPage = 1,
                LastPage = lastPage,
                TotalCount = TotalCount,
                Pages = pageNumbers.ToList()
            };
            var Logs = DAL.CreateListFromTable<LogFrontend>(ds.Tables[0]);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "LogFrontend", "0", "ViewOpr", "View records on the grid");

            return new JsonResult(Ok(new
            {
                Logs,
                Pagination = pagination
            })
            );
        }

        [HttpGet("GetAuditLogs")]
        public IActionResult GetAuditLogs([FromQuery] PaginationFilter input)
        {
            var MySortBy = "";
            var WhereCondidtion = "";


            if (input.Sorting != "")
            {
                MySortBy = " order by " + input.Sorting.ToLower();
            }
            else
            {
                MySortBy = " order by id desc";
            }
            WhereCondidtion += " from LogFile Lg where 1=1 ";
            var datesql = "";
            if (input.Fromdate != "") datesql += "and  LogDate >= '" + input.Fromdate + "' ";
            if (input.Todate != "") datesql += "and  LogDate <= '" + input.Todate + "' ";
            if (input.Fromdate != "" && input.Fromdate == input.Todate)
            {
                datesql = "and  CONVERT(date, LogDate) = '" + input.Fromdate + "' ";
            }
            WhereCondidtion += datesql;
            if (input.operations != "") WhereCondidtion += " and OperationType In ("+ input.operations + ")";
            if (input.usersid != "") WhereCondidtion += " and UserID In (" + input.usersid + ")";


            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql += "Select (Select UserID from cufex_users where id = lg.userid) UserID, lg.*";

            sql += WhereCondidtion;
            sql += MySortBy.Trim(); ;
            sql += input.PageSize > 0 ? (" OFFSET " + input.After + " ROWS FETCH NEXT " + input.PageSize + " ROWS ONLY ") : "";

            sql += "select count (*)  as TotalCount " + WhereCondidtion;
            var ds = DAL.GetDataSet(sqlDataSource, sql);
            var TotalCount = System.Convert.ToInt32(ds.Tables[1].Rows[0]["TotalCount"].ToString());
            int[] pageNumbers = clsGlobals.CalculatePagination(TotalCount, input.PageSize, input.PageNumber);
            int lastPage = clsGlobals.CalculateLastPageNumber(TotalCount, input.PageSize);

            Pagination pagination = new Pagination
            {
                CurrentPage = input.PageNumber,
                FirstPage = 1,
                LastPage = lastPage,
                TotalCount = TotalCount,
                Pages = pageNumbers.ToList()
            };
            var Logs = DAL.CreateListFromTable<LogFile>(ds.Tables[0]);
           
            return new JsonResult(Ok(new
            {
                Logs,
                Pagination = pagination
            })
            );
        }

    }
}
