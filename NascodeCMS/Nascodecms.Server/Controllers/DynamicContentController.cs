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
    public class DynamicContentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;

        public DynamicContentController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<DynamicContentController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;

        }


        [HttpPost("SubmitContent/{CategoryId}/{LanguageId}")]

        public IActionResult SubmitPageContent(int CategoryId, int LanguageId, [FromBody] Dynamic_Content Content)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (Content.ID > 0)
            {
                sql[0] = "Select * from Dynamic_Content where id = " + Content.ID + " and Language = " + LanguageId + " and CategoryId = " + CategoryId;

            }
            else
            {
                sql[0] = "Select top 1 * from Dynamic_Content where CategoryId= " + CategoryId + " and Language = " + LanguageId + " order by id desc ";
            }


            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            Decimal NewID = 1;
            string OperationType = "";
            if (Content.ID > 0)
            {
                NewID = Content.ID;

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
            dr["Language"] = LanguageId;
            dr["CategoryId"] = CategoryId;
            dr["title"] = Content.Title;
            dr["subtitle"] = Content.Subtitle;
            dr["description"] = Content.Description;
            dr["buttontext"] = Content.ButtonText;
            dr["buttonlink"] = Content.ButtonLink;
            dr["picture"] = Content.Picture;
            dr["active"] = Content.Active;
            dr["priority"] = Content.Priority;
            dr["Deleted"] = 0;
            if (OperationType == "edit")
            {
                dr["ModifiedBy"] = memberIdHeader;
                dr["ModificationDate"] = DateTime.UtcNow;
                _auditLogger.Add(memberIdHeader, "DynamicContent", NewID.ToString(), "EditOpr", "Edit record");
            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                _auditLogger.Add(memberIdHeader, "DynamicContent", NewID.ToString(), "AddOpr", "Add record");
                ds.Tables[0].Rows.Add(dr);
            }

            var tmp = tb.commitChanges(ref da, ds, ref CN);
            decimal ID;
            if (tmp == null)
            {
                return new JsonResult(ID = NewID);
            }
            else
            {
                return BadRequest("Could not create content");
            }
        }

        [HttpPost("UpdateRecordStatus/{CategoryId}/{LanguageId}/{RecordId}/{Status}")]

        public IActionResult UpdateRecordStatus(int CategoryId, int LanguageId, int RecordId, int Status)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet? ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (RecordId > 0)
            {

                var tmp = tb.Execute("update Dynamic_Content set active = " + Status + " , ModificationDate = '" + DateTime.UtcNow + "' , ModifiedBy = " + memberIdHeader + " where ID = " + RecordId + " and Language = " + LanguageId + " and CategoryID=" + CategoryId, sqlDataSource);

                if (tmp == null)
                {
                    return new JsonResult(new Response("success"));
                }
                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("Content Not Found");
            }
        }


        [HttpGet("GetPages")]

        public IActionResult GetPages()
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;


            sql = "select U.* from Dynamic_Content_Categories U where Active = 1 order by id asc";


            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var pages = DAL.CreateListFromTable<Dynamic_Content_Categories>(ds.Tables[0]);
                return new JsonResult(Ok(pages));
            }
            return Ok();
        }


        [HttpPost("DeleteContent/{CategoryId}/{LanguageID}/{ContentId}")]

        public IActionResult DeleteContent(int CategoryId, int LanguageID, int ContentId)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet? ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (ContentId > 0)
            {
                _auditLogger.Add(memberIdHeader, "DynamicContent", ContentId.ToString(), "DeleteOpr", "Delete record");
                var tmp = tb.Execute("update Dynamic_Content set Deleted = 1 , DeletedDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + " where ID = " + ContentId + " and Language = " + LanguageID + " and CategoryID=" + CategoryId, sqlDataSource);

                if (tmp == null)
                {
                    return new JsonResult(new Response("success"));
                }

                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("Content Not Found");
            }
        }

        [HttpPost("DeleteManyContent/{LanguageID}/{CategoryId}")]
        public IActionResult DeleteManyContent([FromBody] int[] ContentIds, int LanguageID, int CategoryId)
        {
            string sqlDataSource = _connectionString;
            string sql;
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec();
            DataSet? ds;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int ContentId in ContentIds)
            {
                if (ContentId > 0)
                {

                    var tmp = tb.Execute("update Dynamic_Content set Deleted = 1 , DeletedDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + " where ID = " + ContentId + " and Language = " + LanguageID + " and CategoryId=" + CategoryId, sqlDataSource);
                    if (tmp == null)
                    {
                        deletedCount++;
                    }

                    _auditLogger.Add(memberIdHeader, "DynamicContent", ContentId.ToString(), "DeleteOpr", "Delete record");

                }
            }

            return new JsonResult(new
            {
                DeletedCount = deletedCount,
                UndeletedCount = undeletedTitles.Count,
                UndeletedTitles = undeletedTitles
            });
        }

        [HttpGet("GetContent/{CategoryId}/{LanguageID}/{ContentId}")]

        public IActionResult GetContentByID(int ContentId, int LanguageID, int CategoryId)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (ContentId > 0)
            {
                sql = "select U.* ";
                sql += " ,(select name from language where id = U.Language) LanguageName ";
                sql += " ,(select FullName from Cufex_Users where id = U.ModifiedBy) ModifiedByName ";
                sql += " ,(select FullName from Cufex_Users where id = U.CreatedBy) CreatedByName ";
                sql += " from Dynamic_Content U where isnull(Deleted,0) = 0 and  U.id = " + ContentId + " and U.Language = " + LanguageID + " and CategoryId=" + CategoryId;

            }
            ds = DAL.GetDataSet(sqlDataSource, sql);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "DynamicContent", ContentId.ToString(), "ViewOpr", "Display record details");
            if (ds.Tables[0].Rows.Count > 0)
            {
                var content = DAL.CreateItemFromRow<Dynamic_Content>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(content));
            }
            else
            { return NotFound("content does not Exist"); }


        }

        [HttpGet("AllContent/{CategoryId}")]
        public IActionResult GetAllContent([FromQuery] PaginationFilter input, int CategoryId)
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
            WhereCondidtion += " from Dynamic_Content DC where isNull(Deleted , 0) = 0 and CategoryId=" + CategoryId;
            if (input.language != 0) WhereCondidtion += "and  Language = " + input.language;
            if ((input.SearchText ?? "") != "") WhereCondidtion += "  and ((title like N'%" + (input.SearchText ?? "") + "%' ))";


            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql += "select dc.*, CreationDate, ModificationDate, language,";
            sql += "(select name from language where id = DC.Language) LanguageName, ";
            sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(DC.ModifiedBy,DC.CreatedBy)) ModifiedByName, ";
            sql += "isnull(DC.ModificationDate,DC.CreationDate) LastModificationDate, ";
            sql += " case when(title = N'" + (input.SearchText ?? "") + "')  then 7";
            sql += " when (title like N'" + (input.SearchText ?? "") + "') then 6 ";
            sql += " when (title like N'" + (input.SearchText ?? "") + "%') then 5 ";
            sql += " when (title like N'%" + (input.SearchText ?? "") + "%') then 4 ";
            sql += " else difference('" + (input.SearchText ?? "") + "',title) end Dif ";
            sql += WhereCondidtion;
            sql += MySortBy.Trim(); ;
            sql += input.PageSize > 0 ? (" OFFSET " + input.After + " ROWS FETCH NEXT " + input.PageSize + " ROWS ONLY ") : "";
            // table 2
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
            var Content = DAL.CreateListFromTable<Dynamic_Content>(ds.Tables[0]);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "DynamicContent", "0", "ViewOpr", "Display records on grid");
            return new JsonResult(Ok(new
            {
                Content,
                Pagination = pagination
            })
            );
        }



    }
}
