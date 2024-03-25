using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using System.Data;
using System.Data.SqlClient;
using NascodeCMS.Server.Models;
using NascodeCMS.ResponseModels;
using NascodeCMS.Filter;
using System.Drawing.Printing;
using static NascodeCMS.Server.Controllers.UserPermissionController;
using NascodeCMS.Server.Services;
namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GlobalStaticKeywordsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;

        public GlobalStaticKeywordsController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<GlobalStaticKeywordsController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;
        }

        public class StaticKeywordsRequest
        {
           
            public required Global_Static_Keywords[] keyword { get; set; }

        }

        [HttpPost("GetPageFields/{PageId}/{LanguageId}")]

        public IActionResult GetPageFields(int PageId, int LanguageId, [FromBody] StaticKeywordsRequest keywords)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            DataRow dr;
            sql[0] = " select U.* ";
            sql[0] += " from Global_Static_Keywords U where CategoryID In (Select Id from Global_Static_Keywords_Categories where Parent = " + PageId + ")";
            sql[0] += " and Language = " + LanguageId + "  order by CategoryId asc, Priority asc";

            ds = tb.Cursor(ref sql, ref da!, ref CN!, _connectionString)!;


            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                ds.Tables[0].Rows[i].Delete();
            }

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            for (int i = 0; i < keywords.keyword.Length; i++)
            {
                dr = ds.Tables[0].NewRow();
                dr["ID"] = keywords.keyword[i].ID;
                dr["Language"] = keywords.keyword[i].Language; 
                dr["CategoryID"] = keywords.keyword[i].CategoryID;
                dr["Title"] = keywords.keyword[i].Title;
                dr["Code"] = keywords.keyword[i].Code;
                dr["Value"] = keywords.keyword[i].Value;
                dr["Type"] = keywords.keyword[i].Type;
                dr["MaxLength"] = keywords.keyword[i].MaxLength;
                dr["Priority"] = keywords.keyword[i].Priority;
                dr["ModificationDate"] = DateTime.UtcNow;
                dr["ModifiedBy"] = memberIdHeader;
                ds.Tables[0].Rows.Add(dr);
            }

            _auditLogger.Add(memberIdHeader, "StaticKeywords", PageId.ToString(), "EditOpr", "Edit records");
            var tmp = tb.commitChanges(ref da, ds, ref CN);
            
            if (tmp == null)
            {
                return new JsonResult(Ok());
            }
            else
            {
                return BadRequest("Could not create Group");
            }
        }


        [HttpGet("GetPageFields/{PageId}/{LanguageId}")]

        public IActionResult GetPageFields(int PageId, int LanguageId)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;


            sql = " select U.*, (Select Title from Global_Static_Keywords_Categories where id = U.CategoryId ) SectionName,";
            sql += " (select FullName from Cufex_Users where id = U.ModifiedBy) ModifiedByName ";
            sql += " from Global_Static_Keywords U where CategoryID In (Select Id from Global_Static_Keywords_Categories where Parent = " + PageId + ")";
                sql += " and Language = " + LanguageId + "  order by CategoryId asc, Priority asc";


            ds = DAL.GetDataSet(sqlDataSource, sql);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "StaticKeywords", PageId.ToString(), "ViewOpr", "View records");
            if (ds.Tables[0].Rows.Count > 0)
            {
                var pages = DAL.CreateListFromTable<Global_Static_Keywords>(ds.Tables[0]);
                return new JsonResult(Ok(pages));
            }
            return Ok();
        }

        [HttpGet("GetPages")]

        public IActionResult GetPages()
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;


            sql = "select U.* from Global_Static_Keywords_Categories U where Active = 1 and Parent = 0 order by id desc";


            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var pages = DAL.CreateListFromTable<Global_Static_Keywords_Categories>(ds.Tables[0]);
                return new JsonResult(Ok(pages));
            }
            return Ok();
        }




    }
}
