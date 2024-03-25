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
    public class EmailsBookController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;
        public EmailsBookController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<EmailsBookController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;
        }

        [HttpPost("SubmitEmailBook")]
        public IActionResult SubmitEmailBook(EmailsBook Emailbook)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[2];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (Emailbook.ID > 0)
            {
                sql[0] = "Select * from EmailsBook where id = " + Emailbook.ID + " and Language = " + Emailbook.Language;
            }
            else
            {
                sql[0] = "Select top 1 * from EmailsBook order by id desc ";
            }
            sql[1] = "Select * from EmailsBook_Text where EmailBookID = " + Emailbook.ID + " and Language = " + Emailbook.Language;


            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            Decimal NewID = 1;
            string OperationType = "";
            if (Emailbook.ID > 0)
            {
                NewID = Emailbook.ID;

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
            dr["Language"] = Emailbook.Language;
            dr["Code"] = Emailbook.Code;
            dr["Subject"] = Emailbook.Subject;
            dr["Deleted"] = 0;
            if (OperationType == "edit")
            {
                dr["ModifiedBy"] = memberIdHeader;
                dr["ModificationDate"] = DateTime.UtcNow;
                
                _auditLogger.Add(memberIdHeader, "Emailsbook", NewID.ToString(), "EditOpr", "Edit existing record");
            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                ds.Tables[0].Rows.Add(dr);
            
                _auditLogger.Add(memberIdHeader, "Emailsbook", NewID.ToString(), "AddOpr", "Add new record");
            }

            for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
            {
                ds.Tables[1].Rows[i].Delete();
            }

            int Pat = 1;
            DataRow DRD;
            int LongTextSize = 3000;
            if (Emailbook.Body.Length > LongTextSize)
            {
                while (Pat - 1 < Emailbook.Body.Length / LongTextSize)
                {
                    DRD = ds.Tables[1].NewRow();
                    DRD["ID"] = Pat;
                    DRD["language"] = Emailbook.Language;
                    DRD["EmailBookID"] = NewID;

                    if (Pat >= Emailbook.Body.Length / LongTextSize)
                    {
                        DRD["Body"] = Emailbook.Body.Substring((Pat - 1) * LongTextSize);
                    }
                    else
                    {
                        DRD["Body"] = Emailbook.Body.Substring((Pat - 1) * LongTextSize, LongTextSize);
                    }

                    ds.Tables[1].Rows.Add(DRD);
                    Pat++;
                }
            }
            else
            {
                DRD = ds.Tables[1].NewRow();
                DRD["ID"] = 1;
                DRD["language"] = Emailbook.Language;
                DRD["EmailBookID"] = NewID;
                DRD["Body"] = Emailbook.Body;
                ds.Tables[1].Rows.Add(DRD);
            }


            var tmp = tb.commitChanges(ref da, ds, ref CN);
            decimal ID;
            if (tmp == null)
            {
                return new JsonResult(ID = NewID);
            }
            else
            {
                return BadRequest("Could not create EmailBook");
            }
        }


        [HttpPost("DeleteEmailbook/{EmailbookID}/{LanguageID}")]

        public IActionResult DeleteEmailBook(int EmailbookID, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (EmailbookID > 0)
            {

                var tmp = tb.Execute("update EmailsBook set  Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + " where ID = " + EmailbookID + " and Language = " + LanguageID, sqlDataSource);
               
                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Emailsbook", EmailbookID.ToString(), "DeleteOpr", "Delete existing record");
                    return new JsonResult(new Response("success"));
                }
                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("Emailbook Not Found");
            }
        }

        [HttpPost("DeleteManyEmailsBook/{LanguageID}")]
        public IActionResult DeleteManyEmailsBook([FromBody] int[] EmailsBooksIds, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec();
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int EmailbookId in EmailsBooksIds)
            {
                var tmp = tb.Execute("update EmailsBook set Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + "  where ID = " + EmailbookId + " and Language = " + LanguageID, sqlDataSource);
                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Emailsbook", EmailbookId.ToString(), "DeleteOpr", "Delete existing record");

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

        [HttpGet("GetEmailsbook/{EmailbookID}/{LanguageID}")]

        public IActionResult GetBankByID(int EmailbookID, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (EmailbookID > 0)
            {
                sql = "select U.*, (select Userid from Cufex_Users where id = U.ModifiedBy ) ModifiedByName, (select Name from language where Language.ID = U.Language) LanguageName,";
                sql += " (select Userid from Cufex_Users where id = U.CreatedBy ) CreatedByName";
                sql += " , STUFF((select PT.Body from EmailsBook_Text PT where PT.EmailBookID = " + EmailbookID + "  And PT.language = U.language order by PT.ID  FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 0, '') Body ";
                sql += " from EmailsBook U where isnull(Deleted, 0) = 0 and U.id = " + EmailbookID + " and U.Language = " + LanguageID;
            }
            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
                _auditLogger.Add(memberIdHeader, "Emailsbook", EmailbookID.ToString(), "ViewOpr", "View record");

                var bank = DAL.CreateItemFromRow<EmailsBook>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(bank));
            }
            else
            { return NotFound("Emailbook does not Exist"); }


        }

        [HttpGet("AllEmailsbooks")]
        public IActionResult AllEmailsbooks([FromQuery] PaginationFilter input)
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
            WhereCondidtion += " from EmailsBook U where isNull(Deleted , 0) = 0 ";
            if (input.language != 0) WhereCondidtion += "and  Language = " + input.language;
            WhereCondidtion += "  and ((code like N'%" + (input.SearchText ?? "") + "%' ";
            WhereCondidtion += " )) ";

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql = "select U.*,";
            sql += " (select Userid from Cufex_Users where id = U.CreatedBy ) CreatedByName";
            sql += " , STUFF((select PT.Body from EmailsBook_Text PT where PT.EmailBookID = U.id And PT.language = U.language order by PT.ID  FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 0, '') Body, ";
            sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(U.ModifiedBy,U.CreatedBy)) ModifiedByName, ";
            sql += "isnull(U.ModificationDate,U.CreationDate) LastModificationDate, ";
            sql += " case when(code = N'" + (input.SearchText ?? "") + "')  then 7";
            sql += " when (code like N'" + (input.SearchText ?? "") + "') then 6 ";
            sql += " when (code like N'" + (input.SearchText ?? "") + "%') then 5 ";
            sql += " when (code like N'%" + (input.SearchText ?? "") + "%') then 4 ";
            sql += " else difference('" + (input.SearchText ?? "") + "',code) end Dif ";
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
            var Emailsbooks = DAL.CreateListFromTable<EmailsBook>(ds.Tables[0]);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "Emailsbook", "0", "ViewOpr", "View records on the grid");

            return new JsonResult(Ok(new
            {
                Emailsbooks,
                Pagination = pagination
            })
            );
        }


    }
}
