using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class LogFile
{
    public decimal ID { get; set; }

    public string? UserID { get; set; }

    public string? RecType { get; set; }

    public decimal? RecID { get; set; }

    public DateTime? LogDate { get; set; }

    public string? OperationType { get; set; }

    public string? Info { get; set; }

    public string? MachineName { get; set; }

    public string? Ipaddress { get; set; }
}
