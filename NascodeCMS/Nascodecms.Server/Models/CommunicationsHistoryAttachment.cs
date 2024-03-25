using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CommunicationsHistoryAttachment
{
    public decimal ID { get; set; }

    public decimal CommunicationHistoryID { get; set; }

    public string? FileTitle { get; set; }

    public string? FileName { get; set; }
}
