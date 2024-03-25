using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using System.Data;
using System.Data.SqlClient;
using NascodeCMS.Server.Models;
using NascodeCMS.ResponseModels;
using NascodeCMS.Filter;
using System.Drawing.Printing;
using static NascodeCMS.Server.Controllers.UserPermissionController;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        public PropertyController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<PropertyController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";

        }


        [HttpPost("SubmitProperty")]

        public IActionResult GetPageFields([FromBody] Property[] properties)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            DataRow dr;
            sql[0] = " select * from Properties";
            

            ds = tb.Cursor(ref sql, ref da!, ref CN!, _connectionString)!;


            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                ds.Tables[0].Rows[i].Delete();
            }

          
            foreach(Property property in properties)
            {
                dr = ds.Tables[0].NewRow();
                dr["code"] = property.Code;
                dr["value"] = property.Value;
                ds.Tables[0].Rows.Add(dr);
            }
            


            var tmp = tb.commitChanges(ref da, ds, ref CN);
            
            if (tmp == null)
            {
                return new JsonResult(Ok());
            }
            else
            {
                return BadRequest("Could not create properties");
            }
        }


      
        [HttpGet("GetProperties")]

        public IActionResult GetProperties()
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;


            sql = "select * from Properties";


            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var property = DAL.CreateListFromTable<Property>(ds.Tables[0]);
                return new JsonResult(Ok(property));
            }
            return Ok();
        }




    }
}
