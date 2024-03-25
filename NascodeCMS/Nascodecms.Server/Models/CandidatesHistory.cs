using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CandidatesHistory
{
    public decimal ID { get; set; }

    public decimal CandidateID { get; set; }

    /// <summary>
    /// Created, Modified, Deleted, Ignored, First Interview Scheduled, First Interview Done, Test Requested, Test Submitted, Second Interview Scheduled, Second Interview done, Offer Sent, Offer Rejected, Employed, Short listed, Rated, Not Selected
    /// </summary>
    public string? Status { get; set; }

    public DateTime? StatusDate { get; set; }

    public decimal? StatusBy { get; set; }
}
