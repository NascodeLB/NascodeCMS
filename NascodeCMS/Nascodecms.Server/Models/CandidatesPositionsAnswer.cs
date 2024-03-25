using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CandidatesPositionsAnswer
{
    public decimal ID { get; set; }

    public decimal CandidateID { get; set; }

    public decimal PositionID { get; set; }

    public decimal QuestionID { get; set; }

    public string? Answer { get; set; }
}
