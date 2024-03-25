using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class TemplatesText
{
    public decimal Id { get; set; }

    public decimal TemplateId { get; set; }

    public decimal TemplateHistoryId { get; set; }

    public string? Body { get; set; }
}
