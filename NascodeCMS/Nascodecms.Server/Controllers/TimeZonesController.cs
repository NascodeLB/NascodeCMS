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
    public class TimeZonesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;
        public TimeZonesController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<TimeZonesController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;
        }

        [HttpPost("SubmitTimeZone")]
        public IActionResult SubmitTimeZones(Timezone Timezone)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (Timezone.ID > 0)
            {
                sql[0] = "Select * from Timezones where id = " + Timezone.ID ;
            }
            else
            {
                sql[0] = "Select top 1 * from Timezones order by id desc ";
            }
         
            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            Decimal NewID = 1;
            string OperationType = "";
            if (Timezone.ID > 0)
            {
                NewID = Timezone.ID;

                if (ds.Tables[0].Rows.Count > 0)
                {
                    dr = ds.Tables[0].Rows[0];
                    OperationType = "edit";
                }
                else
                {
                    dr = ds.Tables[0].NewRow();
                    OperationType = "new";
                }

            }
            else
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    NewID = (decimal)ds.Tables[0].Rows[0]["ID"] + 1;
                }

                dr = ds.Tables[0].NewRow();
                OperationType = "new";
            }


            dr["ID"] = NewID;
            dr["Code"] = Timezone.Code;
            dr["Title"] = Timezone.Title;
            dr["UTCOffset"] = Timezone.UTCOffset;
            
            if (OperationType == "edit")
            {
                dr["ModifiedBy"] = memberIdHeader;
                dr["ModificationDate"] = DateTime.UtcNow;
                _auditLogger.Add(memberIdHeader, "Timezones", NewID.ToString(), "EditOpr", "Edit existing record");
            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                ds.Tables[0].Rows.Add(dr);
            
                _auditLogger.Add(memberIdHeader, "Timezones", NewID.ToString(), "AddOpr", "Add new record");
            }

            

            var tmp = tb.commitChanges(ref da, ds, ref CN);
            decimal ID;
            if (tmp == null)
            {
                return new JsonResult(ID = NewID);
            }
            else
            {
                return BadRequest("Could not create Timezones");
            }
        }


        [HttpPost("DeleteTimezone/{ID}")]

        public IActionResult DeleteTimezone(int ID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (ID > 0)
            {

                var tmp = tb.Execute("delete from Timezones where  ID = " + ID , sqlDataSource);
               
                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Timezone", ID.ToString(), "DeleteOpr", "Delete existing record");
                    return new JsonResult(new Response("success"));
                }
                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("Timezone Not Found");
            }
        }

        [HttpPost("DeleteManyTimezones")]
        public IActionResult DeleteManyTimezones([FromBody] int[] TimezonesIds)
        {
            string sqlDataSource = _connectionString;
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec();
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int TimezonesId in TimezonesIds)
            {
                var tmp = tb.Execute("delete from Timezones where  ID = " + TimezonesId, sqlDataSource);
                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Timezone", TimezonesId.ToString(), "DeleteOpr", "Delete existing record");

                    deletedCount++;
                }

            }

            return new JsonResult(new
            {
                DeletedCount = deletedCount,
                UndeletedCount = undeletedTitles.Count,
                UndeletedTitles = undeletedTitles
            });
        }

        [HttpGet("GetTimezone/{ID}")]

        public IActionResult GetTimezonekByID(int ID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (ID > 0)
            {
                sql = "select U.*, (select Userid from Cufex_Users where id = U.ModifiedBy ) ModifiedByName,";
                sql += " (select Userid from Cufex_Users where id = U.CreatedBy ) CreatedByName";
                sql += " from Timezones U where  U.id = " + ID ;
            }
            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
                _auditLogger.Add(memberIdHeader, "Timezone", ID.ToString(), "ViewOpr", "View record");

                var Timezone = DAL.CreateItemFromRow<Timezone>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(Timezone));
            }
            else
            { return NotFound("Timezone does not Exist"); }


        }

        [HttpGet("AllTimezones")]
        public IActionResult AllTimezones([FromQuery] PaginationFilter input)
        {
            var MySortBy = "";
            var WhereCondidtion = "";


            if (input.Sorting != "")
            {
                MySortBy = " order by dif desc," + input.Sorting.ToLower();
            }
            else
            {
                MySortBy = " order by dif desc, id desc";
            }
            WhereCondidtion += " from Timezones U where 1=1 ";
            WhereCondidtion += "  and ((Title like N'%" + (input.SearchText ?? "") + "%' ";
            WhereCondidtion += " )) ";

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql = "select U.*,";
            sql += " (select Userid from Cufex_Users where id = U.CreatedBy ) CreatedByName,";
            sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(U.ModifiedBy,U.CreatedBy)) ModifiedByName, ";
            sql += "isnull(U.ModificationDate,U.CreationDate) LastModificationDate, ";
            sql += " case when(Title = N'" + (input.SearchText ?? "") + "')  then 7";
            sql += " when (Title like N'" + (input.SearchText ?? "") + "') then 6 ";
            sql += " when (Title like N'" + (input.SearchText ?? "") + "%') then 5 ";
            sql += " when (Title like N'%" + (input.SearchText ?? "") + "%') then 4 ";
            sql += " else difference('" + (input.SearchText ?? "") + "',Title) end Dif ";
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
            var Timezones = DAL.CreateListFromTable<Timezone>(ds.Tables[0]);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "Timezones", "0", "ViewOpr", "View records on the grid");

            return new JsonResult(Ok(new
            {
                Timezones,
                Pagination = pagination
            })
            );
        }


    }
}
