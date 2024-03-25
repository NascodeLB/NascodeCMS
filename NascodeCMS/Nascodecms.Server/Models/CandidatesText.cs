using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CandidatesText
{
    public decimal ID { get; set; }

    public decimal CandidateID { get; set; }

    public string? Notes { get; set; }
}
