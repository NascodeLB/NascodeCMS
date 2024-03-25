using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class TemplatesAttachment
{
    public decimal Id { get; set; }

    public decimal TemplateId { get; set; }

    public decimal TemplateHistoryId { get; set; }

    public string? FileTitle { get; set; }

    public string? FileName { get; set; }
}
