using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CandidatesPositionsText
{
    public decimal ID { get; set; }

    public decimal PositionID { get; set; }

    public string? Description { get; set; }
}
