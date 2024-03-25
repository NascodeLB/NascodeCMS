using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class LogFrontend
{
    public decimal ID { get; set; }

    public DateTime? Date { get; set; }

    public string? Message { get; set; }

    public string? Url { get; set; }
}
