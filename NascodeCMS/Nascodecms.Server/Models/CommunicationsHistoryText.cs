using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CommunicationsHistoryText
{
    public decimal ID { get; set; }

    public decimal CommunicationHistoryId { get; set; }

    public string? Body { get; set; }
}
