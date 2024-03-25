using NascodeCMS.Controllers;
using NascodeCMS.Dtos;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace NascodeCMS.Classes
{
    public class FileUploadHelper
    {
         
         public async Task<List<string>> UploadFileToServer(FileUploadDto fileUploadDto)
        {
            List<string> FilesNames = new List<string>();

            string uniqueFileName = "";
            var acceptedTypes = GetAcceptedTypes(fileUploadDto.AcceptedFileTypes);//evaluate once and not inside foreach loop
            foreach (var file in fileUploadDto.UploadedFiles)
            {
                //if (file == null || file.Length == 0)
                //    return "error Please select a file";

                //if (file.Length > fileUploadDto.MaxSize)
                //    return "error File Size Limit Exceeded";

                ////save in database and in specific project accoridng to filesection and filetype
                //if (!acceptedTypes.Any(x => x.Equals(file.ContentType)))
                //{
                //    return "error The file you uploaded is not an accepted type";
                //}
                //if (fileUploadDto.FolderPath == null)
                //{
                //    return "error The folder path in not accepted";
                //}

               

                if (!Directory.Exists(fileUploadDto.FolderPath))
                {
                    Directory.CreateDirectory(fileUploadDto.FolderPath);
                }
                string ext = System.IO.Path.GetExtension(file.FileName);
                //  uniqueFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + ($"-{ext}");
                Random random = new Random();
                int randomNumber = random.Next(1, 10000);
                uniqueFileName = DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss") + ("-" + randomNumber.ToString()) + ($"{ext}");
                // using (var fileStream = new FileStream(Path.Combine(filePath, uniqueFileName), FileMode.Create))
                

                using (var fileStream = new FileStream(Path.Combine(fileUploadDto.FolderPath, uniqueFileName), FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                    FilesNames.Add(uniqueFileName);

                }
            }
            return FilesNames;
        }



        private List<Type> ReturnAcceptedFileTypes(List<int> fileType) // must return a list of types
        {
            var typeList = Enum.GetValues(typeof(FileEnums.FileType))
                           .Cast<FileEnums.FileType>()
                           .Select(t => new TypeViewModel
                           {
                               Id = ((int)t),
                               Name = t.ToString()
                           });

            var possibleTypesList = new List<TypeId>();
            possibleTypesList.Add(new TypeId { Id = 0, Type = typeof(FileConstants.Image) });///REFACTOR TO ONE FUNCTION
            possibleTypesList.Add(new TypeId { Id = 1, Type = typeof(FileConstants.Document) });
            //possibleTypesList.Add(new TypeId { Id = 3, Type = typeof(FileConstants.Excel) });
            var acceptedTypes = typeList
            .Where(t => fileType.Contains(t.Id));

            var listTypesToReturn = possibleTypesList
                   .Where(t => acceptedTypes.Select(x => x.Id).Contains(t.Id)).Select(x => x.Type);//list of accepted filetypes as strings

            return listTypesToReturn.ToList(); //returns the files as a c# type
        }

        private IEnumerable<string> GetAcceptedTypes(List<int> fileType) //gets all accepted mimetypes from constant class as string
        {
            var fileTypeConstant = ReturnAcceptedFileTypes(fileType);
            var values = new List<string>();
            foreach (var item in fileTypeConstant)
            {
                var soleValues = item.GetFields(BindingFlags.Static | BindingFlags.Public)
                .Where(x => x.IsLiteral && !x.IsInitOnly)
                .Select(x => x.GetValue(null)).Cast<string>();
                values.AddRange(soleValues);
            };
            return values;
        }


    }
}
