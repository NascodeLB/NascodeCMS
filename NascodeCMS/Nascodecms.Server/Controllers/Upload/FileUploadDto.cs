using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace NascodeCMS.Dtos
{
    public class FileUploadDto
    {
        public IFormFile[] UploadedFiles { get; set; }
        public string FolderPath { get; set; }
        public List<int> AcceptedFileSections { get; set; }
        public List<int> AcceptedFileTypes { get; set; }
        public int IdTenant { get; set; }
        public long IdUser { get; set; }
        public int FileSection { get; set; }
        public int ItemSectionId { get; set; }
        public int? MaxSize { get; set; }
    }
}