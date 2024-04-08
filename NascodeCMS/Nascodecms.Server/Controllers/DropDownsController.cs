using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using System.Data;
using System.Data.SqlClient;
using NascodeCMS.Server.Models;
using NascodeCMS.ResponseModels;
using NascodeCMS.Filter;
using System.Collections.Generic;

namespace NascodeCMS.Server.Controllers
{



    [Route("api/[controller]")]
    [ApiController]
    public class DropDownsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        public DropDownsController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<DropDownsController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";

        }


        [HttpPost("all")]
        public IActionResult all([FromBody] DropDownsPaginationFilter input)
        {

            var sql = "Select " + input.TitleField + " as Title, " + input.ValueField + " as Value";
            sql += " from " + input.TableName + " where 1=1 ";

            foreach (KeyValuePair<string, string> Item in input.WhereConditions)
            {
                sql += " and " + Item.Key + " " + Item.Value;
            }

            sql += " order by id desc";

            string sqlDataSource = _connectionString;


            var ds = DAL.GetDataSet(sqlDataSource, sql);
            if (ds != null)
            {
                var dropdown = DAL.CreateListFromTable<DropDown>(ds.Tables[0]);
                return new JsonResult(Ok(new
                {
                    dropdown
                })
                );
            }
            return BadRequest();
        }


    }

    public class DropDown
    {
        public decimal Value { get; set; }
        public string? Title { get; set; }
    }

    public class DropDownsPaginationFilter
    {

        public string TableName { get; set; }
        public string ValueField { get; set; }
        public string TitleField { get; set; }

        public Dictionary<string, string> WhereConditions { get; set; }
        public DropDownsPaginationFilter()
        {
            this.TableName = "";
            this.ValueField = "";
            this.TitleField = "";
           this.WhereConditions = new Dictionary<string, string>();
        }
        public DropDownsPaginationFilter(string TableName, string ValueField, string TitleField, Dictionary<string, string> WhereConditions)
        {
            this.TableName = TableName;
            this.ValueField = ValueField;
            this.TitleField = TitleField;
            this.WhereConditions = WhereConditions;
        }
    }



}


