using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CommunicationsHistory
{
    public decimal ID { get; set; }

    public string? RecType { get; set; }

    public decimal? RecID { get; set; }

    public decimal? TemplateID { get; set; }

    public string? Subject { get; set; }

    public string? CommunicationType { get; set; }

    public string? UsersToEmails { get; set; }

    public string? UsersCcEmails { get; set; }

    public decimal? WaitingApprovalFrom { get; set; }

    public byte? WaitingApprovalFromLevel { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? CreationDate { get; set; }

    /// <summary>
    /// Submitted, Approved, Rejected
    /// </summary>
    public string? Status { get; set; }

    public DateTime? StatusDate { get; set; }

    public decimal? StatusBy { get; set; }

    public string? StatusReason { get; set; }
}
