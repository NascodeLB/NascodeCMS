using System;

namespace NascodeCMS.Controllers
{
    public class TypeViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TypeId
    {
        public int Id { get; set; }
        public Type Type { get; set; }
    }

    public class FileEnums
    {
        public enum FileType
        {
            Images = 0,
            Documents = 1,
            Text = 2,
            Excel = 3
        }
    }

    public class FileConstants
    {
        public static class Document
        {
            public const string Docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            public const string Doc = "application/msword";
            public const string Xls = "application/vnd.ms-excel";
            public const string Xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            public const string Csv = "text/csv";
            public const string Pdf = "application/pdf";
            public const string Gif = "image/gif";
            public const string Jpeg = "image/jpeg";
            public const string Jpg = "image/jpg";
            public const string Png = "image/png";
            public const string Heic = "image/heic";
            public const string Heif = "image/heif";
            public const string Jif = "image/jif";
            public const string Webp = "image/webp";
            public const string Mp3 = "audio/mp3";
            public const string M4a = "audio/x-m4a";
            public const string M4a2 = "audio/mpeg";
            public const string Video = "video/mp4";
            public const string Video2 = "video/mp4";
            public const string Video3 = "video/quicktime";
        }

        public static class Excel
        {
            public const string Xls = "application/vnd.ms-excel";
            public const string Xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        public static class Image
        {
            public const string Bmp = "image/bmp";
            public const string Gif = "image/gif";
            public const string Jpeg = "image/jpeg";
            public const string Png = "image/png";
            public const string SvgXml = "image/svg+xml";
            public const string Tiff = "image/tiff";
            public const string Webp = "image/webp";
            public const string Heic = "image/heic";
            public const string Heif = "image/heif";
            public const string Jif = "image/jif";
        }

        public static class Text
        {
            public const string Plain = "text/plain";
            public const string RichText = "text/richtext";
        }
    }

    //[Route("api/UploadImage")]
    //[ApiController]
    //public class UploadImageController : ControllerBase
    //{
    //    [HttpPost("{folderPath}/{SectionName}")]
    //    public async Task<string> UploadFile(IFormFile[] uploadedFile, string folderPath, string SectionName)
    //    {
    //        var fileDto = new FileUploadDto
    //        {
    //           FolderPath = "DynamicImages/" + folderPath,
    //            UploadedFiles = uploadedFile,
    //            AcceptedFileTypes = new List<int>
    //            {
    //                (int) FileEnums.FileType.Images
    //            },
    //            //AcceptedFileSections = new List<int>
    //            //{
    //            //    (int) FileEnums.FileType.Excel
    //            //},

    //        };
    //        var filename = await UploadFileToServer(fileDto, SectionName);
    //        return filename;
    //    }

    //    private async Task<string> UploadFileToServer(FileUploadDto fileUploadDto, string SectionName )
    //    {
    //        string uniqueFileName = "";
    //        var acceptedTypes = GetAcceptedTypes(fileUploadDto.AcceptedFileTypes);//evaluate once and not inside foreach loop
    //        foreach (var file in fileUploadDto.UploadedFiles)
    //        {
    //            if (file == null || file.Length == 0)
    //                return "error Please select a file";

    //            if (file.Length > fileUploadDto.MaxSize)
    //                return "error File Size Limit Exceeded";

    //            //save in database and in specific project accoridng to filesection and filetype
    //            if (!acceptedTypes.Any(x => x.Equals(file.ContentType)))
    //            {
    //                return "error The file you uploaded is not an accepted type";
    //            }
    //            if (fileUploadDto.FolderPath == null)
    //            {
    //                return "error The folder path in not accepted";
    //            }

    //            //var filePath = CreateFilePath();

    //            //if (!Directory.Exists(filePath))
    //            //{
    //            //    Directory.CreateDirectory(filePath);
    //            //}
    //            string ext = System.IO.Path.GetExtension(file.FileName);
    //          //  uniqueFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + ($"-{ext}");
    //            uniqueFileName = SectionName+""+DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss")+ ($"{ext}");
    //            // using (var fileStream = new FileStream(Path.Combine(filePath, uniqueFileName), FileMode.Create))

    //            //var myfilepath = "C:\\inetpub\\wwwroot\\CCCL\\DynamicImages\\PagesImages\\" + uniqueFileName;

    //            //var myfilepath = "C:\\inetpub\\vhosts\\cccl.185-56-137-253.plesk.page\\new.CCCL.185-56-137-253.plesk.page\\DynamicImages\\PagesImages\\" + uniqueFileName;
    //            //using (var fileStream = new FileStream(myfilepath, FileMode.Create))
    //            //{
    //            //    await file.CopyToAsync(fileStream);
    //            //}

    //            using (var fileStream = new FileStream(Path.Combine(fileUploadDto.FolderPath, uniqueFileName), FileMode.Create))
    //            {
    //                await file.CopyToAsync(fileStream);
    //            }
    //        }
    //        return uniqueFileName;
    //    }

    //    private List<Type> ReturnAcceptedFileTypes(List<int> fileType) // must return a list of types
    //    {
    //        var typeList = Enum.GetValues(typeof(FileEnums.FileType))
    //                       .Cast<FileEnums.FileType>()
    //                       .Select(t => new TypeViewModel
    //                       {
    //                           Id = ((int)t),
    //                           Name = t.ToString()
    //                       });

    //        var possibleTypesList = new List<TypeId>();
    //        possibleTypesList.Add(new TypeId { Id = 0, Type = typeof(FileConstants.Image) });///REFACTOR TO ONE FUNCTION
    //        //possibleTypesList.Add(new TypeId { Id = 1, Type = typeof(FileConstants.Document) });
    //        //possibleTypesList.Add(new TypeId { Id = 3, Type = typeof(FileConstants.Excel) });
    //        var acceptedTypes = typeList
    //        .Where(t => fileType.Contains(t.Id));

    //        var listTypesToReturn = possibleTypesList
    //               .Where(t => acceptedTypes.Select(x => x.Id).Contains(t.Id)).Select(x => x.Type);//list of accepted filetypes as strings

    //        return listTypesToReturn.ToList(); //returns the files as a c# type
    //    }

    //    private IEnumerable<string> GetAcceptedTypes(List<int> fileType) //gets all accepted mimetypes from constant class as string
    //    {
    //        var fileTypeConstant = ReturnAcceptedFileTypes(fileType);
    //        var values = new List<string>();
    //        foreach (var item in fileTypeConstant)
    //        {
    //            var soleValues = item.GetFields(BindingFlags.Static | BindingFlags.Public)
    //            .Where(x => x.IsLiteral && !x.IsInitOnly)
    //            .Select(x => x.GetValue(null)).Cast<string>();
    //            values.AddRange(soleValues);
    //        };
    //        return values;
    //    }

    //    private string CreateFilePath()
    //    {
    //        string sectionFolder = "";
    //        //switch (section)
    //        //{
    //        //    case ImportSectionEnum.Leads:
    //        //        sectionFolder = "Leads";
    //        //        break;
    //        //    case ImportSectionEnum.AgenciesSystemUsers:
    //        //        sectionFolder = "AgenciesSystemUsers";
    //        //        break;
    //        //}
    //        var mainFolder = "Resources";
    //        var ImagesFolder = "DynamicImages";
    //        var subFolder = "StaticImages";
    //        var folderName = Path.Combine(mainFolder, ImagesFolder, subFolder, sectionFolder);
    //        var filePath = Path.Combine(Directory.GetCurrentDirectory(), folderName);
    //        return filePath;
    //    }

    //}
}