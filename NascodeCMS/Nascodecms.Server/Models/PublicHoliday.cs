using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class PublicHoliday
{
    public decimal Id { get; set; }

    public short? Year { get; set; }

    public string? Title { get; set; }

    public DateTime? DefaultDate { get; set; }

    public short? NumberOfDays { get; set; }

    public string? Type { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }

    public byte? Deleted { get; set; }

    public decimal? DeletedBy { get; set; }

    public DateTime? DeletionDate { get; set; }
}
