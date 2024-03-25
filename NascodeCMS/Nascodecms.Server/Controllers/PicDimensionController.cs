using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NascodeCMS.Classes;
using NascodeCMS.Server.Models;

namespace NascodeCMS.Server.Controllers
{
    [Route("api/PicDimension")]
    [ApiController]
    public class PicDimensionController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        public PicDimensionController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<PicDimensionController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";

        }
        // GET: api/PicDimension/HomePage/txtPresentation
        [HttpGet("{section}/{imgTag}")]
        public async Task<ActionResult<PicDimension>> GetPicDimension(string section, string imgTag)
        {

            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet picdimension;

            sql = "select * from PicDimension where Section='"+ section +"' and ImgTag='"+ imgTag +"'";
           
            picdimension = DAL.GetDataSet(sqlDataSource, sql);

            
            if (picdimension == null)
            {
                return NotFound();
            }


            if (picdimension.Tables[0].Rows.Count > 0)
            {
                var dimension = DAL.CreateItemFromRow<PicDimension>(picdimension.Tables[0].Rows[0]);
                return new JsonResult(Ok(dimension));
            }
            else
            { return NotFound("Pic Dimension does not Exist"); }
        }


    }
}
