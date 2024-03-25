using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Template
{
    public decimal Id { get; set; }

    public string? Code { get; set; }

    public string? Subject { get; set; }

    public string? Section { get; set; }

    public string? TableName { get; set; }

    public byte? Active { get; set; }

    public byte? IsEditable { get; set; }

    public decimal? WaitingApprovalFrom { get; set; }

    public byte? WaitingApprovalFromLevel { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public byte? Deleted { get; set; }

    public DateTime? DeletionDate { get; set; }

    public decimal? DeletedBy { get; set; }
}
