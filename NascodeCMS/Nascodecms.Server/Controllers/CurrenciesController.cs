using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using System.Data;
using System.Data.SqlClient;
using NascodeCMS.Server.Models;
using NascodeCMS.ResponseModels;
using NascodeCMS.Filter;
using System.Drawing.Printing;
namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrenciesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        public CurrenciesController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<CurrenciesController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";

        }

        [HttpPost("SubmitCurrency")]
        public IActionResult SubmitCurrency(Currency currency)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (currency.ID > 0)
            {
                sql[0] = "Select * from Currencies where id = " + currency.ID;

            }
            else
            {
                sql[0] = "Select top 1 * from Currencies order by id desc ";
            }


            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            Decimal NewID = 1;

            if (currency.ID > 0)
            {
                NewID = (Decimal)ds.Tables[0].Rows[0]["ID"];
                dr = ds.Tables[0].Rows[0];
            }
            else
            {
                NewID = (decimal)ds.Tables[0].Rows[0]["ID"] + 1;

                dr = ds.Tables[0].NewRow();
            }



            dr["ID"] = NewID;
            dr["Name"] = currency.Name;
            dr["Code"] = currency.Code;
            dr["Name"] = currency.Symbol; 
            if (currency.ID > 0)
            {
                dr["ModifiedBy"] = 1;
                dr["ModificationDate"] = DateTime.UtcNow;
            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = 1;
                dr["Deleted"] = 0;
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
                return BadRequest("Could not create Currency");
            }
        }


        [HttpPost("DeleteCurrency/{CurrencyID}")]

        public IActionResult DeleteCurrency(int CurrencyID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet? ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (CurrencyID > 0)
            {
                sql[0] = @" select * from Banks where isnull(deleted,0) = 0 and CurrencyID = " + CurrencyID;

                ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
                if (ds.Tables[0].Rows.Count > 0)
                {
                    return BadRequest("Could not Delete Currency");
                }
                else
                {
                    var tmp = tb.Execute("update Currencies set  Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + 1 + " where ID = " + CurrencyID, sqlDataSource);

                    if (tmp == null)
                    {
                        return new JsonResult(new Response("success"));
                    }
                    return new JsonResult(new Response("failed"));
                }

            }
            else
            {
                return NotFound("Currency Not Found");
            }
        }

        [HttpPost("DeleteManyCurrencies")]
        public IActionResult DeleteManyCurrencies([FromBody] int[] currencyIds)
        {
            string sqlDataSource = _connectionString;
            string sql;
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec();
            DataSet? ds;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int currencyId in currencyIds)
            {
                if (currencyId > 0)
                { 
                    sql = @"select  Name from Currencies where ID = " + currencyId +
                        " and ID  in (select CurrencyID from Banks B where isNull(deleted , 0 ) = 0 and  B.CurrencyID = " + currencyId + ")";

                    ds = tb.Cursor(sql, sqlDataSource)!;

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        undeletedTitles.Add(ds.Tables[0].Rows[0]["Name"].ToString()!);
                    }
                    else
                    {
                        var tmp = tb.Execute("update Currencies set Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + 1 + "  where ID = " + currencyId, sqlDataSource);
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

        [HttpGet("GetCurrency/{CurrencyID}")]

        public IActionResult GetCurrencyByID(int CurrencyID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (CurrencyID > 0)
            {
                sql = "select U.* ";
                sql += " ,(select FullName from Cufex_Users where id = U.ModifiedBy) ModifiedByName ";
                sql += " ,(select FullName from Cufex_Users where id = U.CreatedBy) CreatedByName ";
                sql += " from Currencies U where isnull(Deleted,0) = 0 and  U.id = " + CurrencyID;

            }
            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var currency = DAL.CreateItemFromRow<Currency>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(currency));
            }
            else
            { return NotFound("Currency does not Exist"); }


        }

        [HttpGet("AllCurrencies")]
        public IActionResult GetCurrencies([FromQuery] PaginationFilter input)
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
            WhereCondidtion += " from Currencies where isNull(Deleted , 0) = 0 and  ";
            WhereCondidtion += "  ((Name like N'" + ((input.SearchText ?? "").Length > 2 ? "%" : "") + "" + (input.SearchText ?? "").Replace(" ", "%") + "%' ";
            WhereCondidtion += " )) ";

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql += "select ID, Name , Code, Symbol,CreationDate,ModificationDate, "; 
            sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(Currencies.ModifiedBy,Currencies.CreatedBy)) ModifiedByName, ";
            sql += "isnull(Currencies.ModificationDate,Currencies.CreationDate) LastModificationDate, ";
            sql += " case when(Name = N'" + (input.SearchText ?? "") + "')  then 7";
            sql += " when (Name like N'" + (input.SearchText ?? "") + "') then 6 ";
            sql += " when (Name like N'" + (input.SearchText ?? "") + "%') then 5 ";
            sql += " when (Name like N'%" + (input.SearchText ?? "") + "%') then 4 ";
            sql += " else difference('" + (input.SearchText ?? "") + "',Name) end Dif ";
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
            var Currencies = DAL.CreateListFromTable<Currency>(ds.Tables[0]);
            return new JsonResult(Ok(new
            {
                Currencies,
                Pagination = pagination
            })
            );
        }


    }
}
