using NascodeCMS.Classes;
using NascodeCMS.Dtos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NascodeCMS.Controllers
{
    [Route("api/UploadFile")]
    [ApiController]
    public class UploadFileController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService; 
        private readonly ILogger _logger; 
        private readonly FileUploadHelper _fileUploadHelper;

        public UploadFileController(IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<UploadFileController> logger, FileUploadHelper fileUploadHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _logger = logger;
            _fileUploadHelper = fileUploadHelper;
        }

        [HttpPost("{path}")]
        public async Task<IActionResult> UploadFile(string path, IFormFile[] uploadedFile)
        {
          

            var saveToFilePath = path.Replace("_","/");
           
            var fileDto = new FileUploadDto
            {
                FolderPath = saveToFilePath, //"DynamicImages/" + path, //"DynamicFiles",
                UploadedFiles = uploadedFile,
                AcceptedFileTypes = new List<int>
                {
                    (int) FileEnums.FileType.Documents
                },
                //AcceptedFileSections = new List<int>
                //{
                //    (int) FileEnums.FileType.Excel
                //},
            };

           

            var filesnames = await _fileUploadHelper.UploadFileToServer(fileDto);
            return new JsonResult(filesnames);
        }
         

        //[HttpPost("XML")]
        //public Task<bool> UploadXML()
        //{
        //    //var rawRequestBody = new StreamReader(Request.Body).ReadToEnd();

        //    //var request = HttpContext.Request;
        //    //var stream = new StreamReader(request.Body);
        //    //var body = stream.ReadToEnd();

        //    try
        //    {
        //        using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
        //        {
        //            var strXML = reader.ReadToEndAsync();
        //            XmlDocument empDoc = new XmlDocument();
        //            empDoc.LoadXml(strXML.Result);
        //           // empDoc.Save(@"C:\inetpub\wwwroot\CCCL\DynamicImages\descImages\sitemap.xml");

        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        Console.WriteLine(ex.StackTrace);
        //        throw ex;
        //    }

        //    //var iLinksCount = 57;

        //    //var strXML = "";

        //    //strXML += "<?xml version='1.0' encoding='UTF-8'?>";
        //    //strXML += "<br/>" + "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>";

        //    //strXML +=  ReturnXMLstructure("", "", 0);
        //    //strXML +=  ReturnXMLstructure("", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("home", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("AreebaPayment", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("AreebaResult", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("about-us'", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("international-presence", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("medicalcare", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("cancer-cooperation", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("careers", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("register", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("contact-us", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("login", "monthly", 1);
        //    //strXML +=  ReturnXMLstructure("verifyAccount", "monthly", 1);
        //    //strXML +=  ReturnXMLstructure("donateblood", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("forgotPassword", "monthly", 1);
        //    //strXML +=  ReturnXMLstructure("faq", "weekly", 1);
        //    //strXML +=  ReturnXMLstructure("my-account", "weekly", 1);
        //    //strXML += "<br/>" + "</urlset>";
        //    //try
        //    //{
        //    //    using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
        //    //    {
        //    //         Beaut.Beautify(reader.ReadToEnd());
        //    //    }

        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    Console.WriteLine(ex.Message);
        //    //    Console.WriteLine(ex.StackTrace);
        //    //    throw ex;
        //    //}

        //    return Task.FromResult(true);
        //}

        //      private string ReturnXMLstructure(string Url, string ChangeFreq, int Priority)
        //      {
        //          var domainname = "http://localhost:4200/";
        //          var myReturn = "";

        //          myReturn += "<br/>" + "<url>";
        //          myReturn += "<br/>" + "<loc>http://localhost:4200/" + Url + "</loc>";
        //          myReturn += "<br/>" + "<lastmod>" + DateTime.Now + "</lastmod>";
        //          myReturn += "<br/>" + "<changefreq>" + ChangeFreq + "</changefreq>";
        //          myReturn += "<br/>" + "<priority>" + Priority + "</priority>";
        //          myReturn += "<br/>" + "</url>";

        //          return myReturn;

        //}
 
        private string CreateFilePath(string path)
        {
            string sectionFolder = "";
            //switch (section)
            //{
            //    case ImportSectionEnum.Leads:
            //        sectionFolder = "Leads";
            //        break;
            //    case ImportSectionEnum.AgenciesSystemUsers:
            //        sectionFolder = "AgenciesSystemUsers";
            //        break;
            //}
            var mainFolder = "Resources";
            var ImagesFolder = "DynamicImages";
            var subFolder = "StaticImages";
            var folderName = Path.Combine(mainFolder, ImagesFolder, subFolder, sectionFolder);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            return filePath;
        }


      
    }
}