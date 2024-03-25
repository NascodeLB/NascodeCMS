using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CandidatesRating
{
    public decimal ID { get; set; }

    public decimal CandidateID { get; set; }

    public byte? RatingOver10 { get; set; }

    public string? RatingDescription { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }

    public byte? Deleted { get; set; }

    public decimal? DeletedBy { get; set; }

    public DateTime? DeletionDate { get; set; }
}
