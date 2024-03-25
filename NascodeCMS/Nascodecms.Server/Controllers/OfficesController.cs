using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using NascodeCMS.Filter;
using NascodeCMS.ResponseModels;
using NascodeCMS.Server.Models;
using System.Data;
using System.Data.SqlClient;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficesController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        public OfficesController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<BanksController> logger, PropertyHelper propertyHelper)
        {

            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        // GET: api/<OfficesController>
        [HttpGet("AllOffices")]
        public IActionResult getAllOffices([FromQuery] PaginationFilter input)
        {
            string sqlDataSource = _connectionString;

            var MySortBy = "";

            switch (input.Sorting.ToLower())
            {
                case "x":
                    MySortBy = "";
                    break;

                case "y":
                    MySortBy = " ";
                    break;

                default:
                    MySortBy = " id desc";
                    break;
            }

            var sql = " set dateformat dmy ";
            sql += "select *,";
            sql += " (select fullname from Cufex_Users where Cufex_Users.id = isnull(O.ModifiedBy,O.CreatedBy)) ModifiedByName,";
            sql += " isnull(O.ModificationDate,O.CreationDate) LastModificationDate";
            sql += " from Offices O where isNull(Deleted , 0) = 0 and  ";
            sql += "((Title like N'" + ((input.SearchText ?? "").Length > 2 ? "%" : "") + "" + (input.SearchText ?? "").Replace(" ", "%") + "%' ";
            sql += " )) ";
            sql += MySortBy.Trim() == "" ? (" order by " + MySortBy + ", id desc ") : (" order by id desc");
            sql += input.PageSize > 0 ? (" OFFSET " + input.After + " ROWS FETCH NEXT " + input.PageSize + " ROWS ONLY ") : "";

            var ds = DAL.GetDataSet(sqlDataSource, sql);
            var Offices = DAL.CreateListFromTable<Office>(ds.Tables[0]);
            return Ok(new
            {
                Offices
            });


        }

        // GET api/<OfficesController>/5
        [HttpGet("GetOffice/{OfficeID}")]
        public IActionResult getOfficeById(int OfficeID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            sql[0] = " select *,";
            sql[0] += " (select fullname from Cufex_Users where Cufex_Users.id = isnull(O.ModifiedBy,O.CreatedBy)) ModifiedByName,";
            sql[0] += " isnull(O.ModificationDate,O.CreationDate) LastModificationDate,";
            sql[0] += " ,(select FullName from Cufex_Users where id = O.CreatedBy) CreatedByName ";
            sql[0] += " from Offices O where isnull(Deleted,0) = 0 and id = " + OfficeID;
            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var Office = DAL.CreateItemFromRow<Office>(ds.Tables[0].Rows[0]);
            return new JsonResult(Office);
        }

        // POST api/<OfficesController>
        [HttpPost("SubmitOffice")]
        public IActionResult SubmitOffice(Office office)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (office.ID> 0)
            {
                sql[0] = "Select * from Offices where id = " + office.ID;
            }
            else
            {
                sql[0] = "Select top 1 * from Offices order by id desc ";
            }


            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            Decimal NewID = 1;

            if (office.ID> 0)
            {
                NewID = (Decimal)ds.Tables[0].Rows[0]["ID"];
                dr = ds.Tables[0].Rows[0];
            }
            else
            {
                NewID = (Decimal)ds.Tables[0].Rows[0]["ID"] + 1;

                dr = ds.Tables[0].NewRow();
            }

            dr["ID"] = NewID;
            dr["Title"] = office.Title;
            if (office.ID> 0)
            {
                dr["ModificationDate"] = DateTime.Now;
                dr["ModifiedBy"] = office.ModifiedBy;
            }
            else
            {
                dr["CreationDate"] = DateTime.Now;
                dr["CreatedBy"] = office.CreatedBy;
                dr["Deleted"] = 0;
                ds.Tables[0].Rows.Add(dr);
            }

            var tmp = tb.commitChanges(ref da, ds, ref CN);
            if (tmp == null)
            {
                return new JsonResult(new Response("success"));
            }
            else
            {
                return BadRequest("Could not create Office");
            }

        }



        // DELETE api/<OfficesController>/5
        [HttpPost("Delete/{OfficeID}")]
        public IActionResult DeleteOffice(int OfficeID)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet? ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            if (OfficeID > 0)
            {

                sql[0] = @" select ID from Candidates C where C.OfficeID = " + OfficeID + " and C.ID not in (select CandidateID from Candidates_History where CandidateID = C.ID and Status = 'Deleted') UNION ";
                sql[0] += @" select ID from Employees E where E.OfficeID = " + OfficeID + " and E.ID not in (select EmployeeID from Employees_History where EmployeeID = E.ID and Status = 'Deleted') UNION ";
                sql[0] += @" select ID from Employees_Departments D where isnull(deleted,0) = 0 and D.OfficeID = " + OfficeID;


                ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
                if (ds.Tables[0].Rows.Count > 0)
                {
                    return BadRequest("Could not Delete Office");
                }
                else
                {
                    
                    sql[0] = @" SELECT * from Offices where ID = " + OfficeID;
                    ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
                    DataRow dr = ds.Tables[0].Rows[0];
                    dr["Deleted"] = 1;
                    dr["DeletionDate"] = DateTime.Now;
                    dr["DeletedBy"] = 1;

                    var tmp = tb.commitChanges(ref da, ds, ref CN);
                    if (tmp == null)
                    {
                        return new JsonResult(new Response("success"));
                    }
                    return new JsonResult(new Response("failed"));
                }

            }
            else
            {
                return NotFound("Office Not Found");
            }
        }

    }
}
