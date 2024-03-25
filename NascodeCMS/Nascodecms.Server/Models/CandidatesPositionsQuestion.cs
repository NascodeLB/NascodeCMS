using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CandidatesPositionsQuestion
{
    public decimal ID { get; set; }

    public decimal PositionID { get; set; }

    /// <summary>
    /// Likes Lebanon, Share negative energy, Vision, Motivated, MS Office
    /// </summary>
    public string? Question { get; set; }

    /// <summary>
    /// Yes/No, Text
    /// </summary>
    public string? AnswerType { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }

    public byte? Deleted { get; set; }

    public DateTime? DeletionDate { get; set; }

    public decimal? DeletedBy { get; set; }
}
