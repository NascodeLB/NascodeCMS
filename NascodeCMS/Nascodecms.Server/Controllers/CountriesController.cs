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
    public class CountriesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;
        public CountriesController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<CountriesController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;
        }


        [HttpPost("SubmitCountry")]
        public IActionResult SubmitCountry(Country Country)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (Country.ID > 0)
            {
                sql[0] = "Select * from Countries where id = " + Country.ID + " and Language = " + Country.Language;
            }
            else
            {
                sql[0] = "Select top 1 * from Countries order by id desc ";
            }
            

            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            Decimal NewID = 1;
            string OperationType = "";
            if (Country.ID > 0)
            {
                NewID = Country.ID;

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
            dr["Language"] = Country.Language;
            dr["CountryCode"] = Country.CountryCode;
            dr["Title"] = Country.Title;
            dr["Active"] = Country.Active;
            dr["Deleted"] = 0;
            if (OperationType == "edit")
            {
                dr["ModifiedBy"] = memberIdHeader;
                dr["ModificationDate"] = DateTime.UtcNow;

                _auditLogger.Add(memberIdHeader, "Countries", NewID.ToString(), "EditOpr", "Edit existing record");
            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                ds.Tables[0].Rows.Add(dr);

                _auditLogger.Add(memberIdHeader, "Countries", NewID.ToString(), "AddOpr", "Add new record");
            }

            var tmp = tb.commitChanges(ref da, ds, ref CN);
            decimal ID;
            if (tmp == null)
            {
                return new JsonResult(ID = NewID);
            }
            else
            {
                return BadRequest("Could not create Countries");
            }
        }


        [HttpPost("DeleteCountry/{CountryID}/{LanguageID}")]

        public IActionResult DeleteCountry(int CountryID, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (CountryID > 0)
            {

                var tmp = tb.Execute("update Countries set  Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + " where ID = " + CountryID + " and Language = " + LanguageID, sqlDataSource);

                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Countries", CountryID.ToString(), "DeleteOpr", "Delete existing record");
                    return new JsonResult(new Response("success"));
                }
                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("Country Not Found");
            }
        }

        [HttpPost("DeleteManyCountries/{LanguageID}")]
        public IActionResult DeleteManyCountries([FromBody] int[] CountriesIds, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec();
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int CountryId in CountriesIds)
            {
                var tmp = tb.Execute("update Countries set Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + "  where ID = " + CountryId + " and Language = " + LanguageID, sqlDataSource);
                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Countries", CountryId.ToString(), "DeleteOpr", "Delete existing record");

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

        [HttpGet("GetCountry/{CountryID}/{LanguageID}")]

        public IActionResult GetCountry(int CountryID, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (CountryID > 0)
            {
                sql = "select U.*, (select Userid from Cufex_Users where id = U.ModifiedBy ) ModifiedByName, (select Name from language where Language.ID = U.Language) LanguageName,";
                sql += " (select Userid from Cufex_Users where id = U.CreatedBy ) CreatedByName";
                sql += " from Countries U where isnull(Deleted, 0) = 0 and U.id = " + CountryID + " and U.Language = " + LanguageID;
            }
            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
                _auditLogger.Add(memberIdHeader, "Countries", CountryID.ToString(), "ViewOpr", "View record");

                var country = DAL.CreateItemFromRow<Country>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(country));
            }
            else
            { return NotFound("Country does not Exist"); }


        }

        [HttpGet("AllCountries")]
        public IActionResult AllCountries([FromQuery] PaginationFilter input)
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
            WhereCondidtion += " from Countries U where isNull(Deleted , 0) = 0 ";
            if (input.language != 0) WhereCondidtion += "and  Language = " + input.language;
            WhereCondidtion += "  and ((title like N'%" + (input.SearchText ?? "") + "%' ";
            WhereCondidtion += " )) ";

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql = "select U.*,";
            sql += " (select Userid from Cufex_Users where id = U.CreatedBy ) CreatedByName,";
             sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(U.ModifiedBy,U.CreatedBy)) ModifiedByName, ";
            sql += "isnull(U.ModificationDate,U.CreationDate) LastModificationDate, ";
            sql += " case when(title = N'" + (input.SearchText ?? "") + "')  then 7";
            sql += " when (title like N'" + (input.SearchText ?? "") + "') then 6 ";
            sql += " when (title like N'" + (input.SearchText ?? "") + "%') then 5 ";
            sql += " when (title like N'%" + (input.SearchText ?? "") + "%') then 4 ";
            sql += " else difference('" + (input.SearchText ?? "") + "',title) end Dif ";
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
            var Countries = DAL.CreateListFromTable<Country>(ds.Tables[0]);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "Countries", "0", "ViewOpr", "View records on the grid");

            return new JsonResult(Ok(new
            {
                Countries,
                Pagination = pagination
            })
            );
        }

        [HttpPost("UpdateCountryStatus/{Id}/{Status}/{Language}")]

        public IActionResult UpdateCountryStatus(int Id, int Status, int Language)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (Id > 0)
            {

                var tmp = tb.Execute("update Countries set active = " + Status + " , ModificationDate = '" + DateTime.UtcNow + "' , ModifiedBy = " + memberIdHeader + " where ID = " + Id + " and language = " + Language, sqlDataSource);

                if (tmp == null)
                {
                    return new JsonResult(new Response("success"));
                }
                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("Country Not Found");
            }
        }
    }
}
