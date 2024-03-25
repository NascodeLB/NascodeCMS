using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using System.Data;
using System.Data.SqlClient;
using NascodeCMS.Server.Models;
using NascodeCMS.ResponseModels;
using NascodeCMS.Filter;

namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BanksController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        public BanksController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<BanksController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";

        }

        [HttpPost("SubmitBank")]
        public IActionResult SubmitBank(Bank bank)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (bank.ID > 0)
            {
                sql[0] = "Select * from Banks where id = " + bank.ID + " and LanguageID = " + bank.LanguageID;

            }
            else
            {
                sql[0] = "Select top 1 * from Banks order by id desc ";
            }


            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            Decimal NewID = 1;
            string OperationType = "";
            if (bank.ID > 0 )
            {
                NewID = bank.ID;
               
                if (ds.Tables[0].Rows.Count > 0)
                {
                    dr = ds.Tables[0].Rows[0];
                    OperationType = "edit";
                }
                else {
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
            dr["LanguageID"] = bank.LanguageID;
            dr["BankName"] = bank.BankName;
            dr["AccountNumber"] = bank.AccountNumber;
            dr["IBAN"] = bank.IBAN;
            dr["BICSwiftCode"] = bank.BICSwiftCode;
            dr["CurrencyID"] = bank.CurrencyID;
            dr["Deleted"] = 0;
            if (OperationType == "edit")
            {
                dr["ModifiedBy"] = memberIdHeader;
                dr["ModificationDate"] = DateTime.UtcNow;
            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                
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
                return BadRequest("Could not create Bank");
            }
        }


        [HttpPost("DeleteBank/{BankID}/{LanguageID}")]

        public IActionResult DeleteBank(int BankID, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet? ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (BankID > 0)
            {
                sql[0] = @" select * from Employees E where E.BankID = " + BankID + " and E.ID not in (select EmployeeID from Employees_History where EmployeeID = E.ID and Status = 'Deleted') ";
                ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
                if (ds.Tables[0].Rows.Count > 0)
                {
                    return BadRequest("Could not Delete Bank");
                }
                else
                {
                    var tmp = tb.Execute("update Banks set  Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + " where ID = " + BankID + " and LanguageID = " + LanguageID, sqlDataSource);

                    if (tmp == null)
                    {
                        return new JsonResult(new Response("success"));
                    }
                    return new JsonResult(new Response("failed"));
                }

            }
            else
            {
                return NotFound("Bank Not Found");
            }
        }

        [HttpPost("DeleteManyBank/{LanguageID}")]
        public IActionResult DeleteManyBank([FromBody] int[] bankIds, int LanguageID)
        {
            string sqlDataSource = _connectionString; 
            string sql; 
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec(); 
            DataSet? ds;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int bankId in bankIds)
            {
                if (bankId > 0)
                {
                    sql = @"select BankName from Banks where ID = " + bankId +
                          " and ID  in (select BankID from Employees E where E.BankID = " + bankId +
                          " and E.ID not in (select EmployeeID from Employees_History where EmployeeID = E.ID and Status = 'Deleted'))";
                    ds = tb.Cursor(sql, sqlDataSource)!;

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        undeletedTitles.Add(ds.Tables[0].Rows[0]["BankName"].ToString()!);
                    }
                    else
                    {
                        var tmp = tb.Execute("update Banks set Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + "  where ID = " + bankId + " and LanguageID = " + LanguageID, sqlDataSource);
                        if (tmp == null)
                        {
                            deletedCount++;
                        }
                    }
                }
            }

            return new JsonResult(new
            {
                DeletedCount = deletedCount,
                UndeletedCount = undeletedTitles.Count,
                UndeletedTitles = undeletedTitles
            });
        }

        [HttpGet("GetBank/{BankID}/{LanguageID}")]

        public IActionResult GetBankByID(int BankID, int LanguageID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (BankID > 0)
            {
                sql = "select U.* ";
                sql += " ,(select name from language where id = U.LanguageID) LanguageName ";
                sql += " ,(select FullName from Cufex_Users where id = U.ModifiedBy) ModifiedByName ";
                sql += " ,(select FullName from Cufex_Users where id = U.CreatedBy) CreatedByName ";
                sql += " from Banks U where isnull(Deleted,0) = 0 and  U.id = " + BankID + " and U.LanguageID = " + LanguageID;

            }
            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var bank = DAL.CreateItemFromRow<Bank>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(bank));
            }
            else
            { return NotFound("Bank does not Exist"); }


        }

        [HttpGet("AllBanks")]
        public IActionResult GetBanks([FromQuery] PaginationFilter input)
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
            WhereCondidtion += " from Banks where isNull(Deleted , 0) = 0 ";
            if(input.language != 0) WhereCondidtion += "and  LanguageID = " + input.language;
            WhereCondidtion += "  and ((BankName like N'%" + (input.SearchText ?? "") + "%' ";
            WhereCondidtion += " )) ";

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql += "select ID, BankName ,IBAN, BICSwiftCode, AccountNumber,CreationDate,ModificationDate, CurrencyID, LanguageID,";
            sql += "(select name from language where id = Banks.LanguageID) LanguageName, ";
            sql += "(select Code from Currencies where id = Banks.CurrencyID) Currency, ";
            sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(Banks.ModifiedBy,Banks.CreatedBy)) ModifiedByName, ";
            sql += "isnull(Banks.ModificationDate,Banks.CreationDate) LastModificationDate, ";
            sql += " case when(BankName = N'" + (input.SearchText ?? "") + "')  then 7";
            sql += " when (BankName like N'" + (input.SearchText ?? "") + "') then 6 ";
            sql += " when (BankName like N'" + (input.SearchText ?? "") + "%') then 5 ";
            sql += " when (BankName like N'%" + (input.SearchText ?? "") + "%') then 4 ";
            sql += " else difference('" + (input.SearchText ?? "") + "',BankName) end Dif ";
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
            var Banks = DAL.CreateListFromTable<Bank>(ds.Tables[0]);
            return new JsonResult(Ok(new
            {
                Banks,
                Pagination = pagination
            })
            );
        }


    }
}
