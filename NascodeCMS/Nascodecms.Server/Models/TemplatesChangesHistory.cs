using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class TemplatesChangesHistory
{
    public decimal Id { get; set; }

    public decimal TemplateId { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }

    /// <summary>
    /// Saved, Submitted, Approved, Rejected
    /// </summary>
    public string? Status { get; set; }

    public DateTime? StatusDate { get; set; }

    public decimal? StatusBy { get; set; }

    public string? StatusReason { get; set; }

    public byte? IsLatest { get; set; }
}
