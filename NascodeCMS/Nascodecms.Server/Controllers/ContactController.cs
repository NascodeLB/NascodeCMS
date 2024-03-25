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
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        public ContactController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<BanksController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";

        }

        [HttpPost("SubmitContact")]
        public IActionResult SubmitContact(Contact contact)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;



            sql[0] = "Select top 1 * from Contact order by id desc ";



            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
           
            Decimal NewID = 1;

            if (ds.Tables[0].Rows.Count > 0)
            {
                NewID = (decimal)ds.Tables[0].Rows[0]["ID"] + 1;
            }



            dr = ds.Tables[0].NewRow();
            dr["ID"] = NewID;
            dr["PreferedLanguage"] = contact.PreferedLanguage;
            dr["FullName"] = contact.FullName;
            dr["Email"] = contact.Email;
            dr["Mobile"] = contact.Mobile;
            dr["CompanyName"] = contact.CompanyName;
            dr["Message"] = contact.Message;
            dr["Date"] = DateTime.UtcNow;
        
            ds.Tables[0].Rows.Add(dr);

            var tmp = tb.commitChanges(ref da, ds, ref CN);
            decimal ID;
            if (tmp == null)
            {
                return new JsonResult(ID = NewID);
            }
            else
            {
                return BadRequest("Could not create contact");
            }
        }


        [HttpGet("GetContact/{ID}")]

        public IActionResult GetContactByID(int ID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (ID > 0)
            {
                sql = "select C.* ";
                sql += " ,(select name from language where id = C.PreferedLanguage) LanguageName ";
                sql += " from Contact C where C.id = " +ID;

            }
            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var contact = DAL.CreateItemFromRow<Contact>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(contact));
            }
            else
            { return NotFound("Contact does not Exist"); }


        }

        [HttpGet("AllContacts")]
        public IActionResult AllContacts([FromQuery] PaginationFilter input)
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
            WhereCondidtion += " from Contact where 1=1 ";
            if (input.language != 0) WhereCondidtion += "and  PreferedLanguage = " + input.language;
            var datesql = "";
            if (input.Fromdate != "") datesql += "and  Date >= '" + input.Fromdate + "' ";
            if (input.Todate != "") datesql += "and  Date <= '" + input.Todate + "' ";
            if(input.Fromdate != "" && input.Fromdate == input.Todate)
            {
                datesql = "and  CONVERT(date, Date) = '" + input.Todate + "' ";
            }
            WhereCondidtion += datesql;
            WhereCondidtion += "  and ((Fullname like N'%" + (input.SearchText ?? "") + "%') or (email like N'%" + (input.SearchText ?? "") + "%') or (mobile like N'%" + (input.SearchText ?? "") + "%') )";

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql += "select * ,";
            sql += "(select name from language where id = Contact.PreferedLanguage) LanguageName ";
         
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
            var contacts = DAL.CreateListFromTable<Contact>(ds.Tables[0]);
            return new JsonResult(Ok(new
            {
                contacts,
                Pagination = pagination
            })
            );
        }


    }
}
