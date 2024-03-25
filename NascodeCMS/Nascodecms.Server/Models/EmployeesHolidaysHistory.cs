using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesHolidaysHistory
{
    public decimal ID { get; set; }

    public decimal HolidayID { get; set; }

    /// <summary>
    /// Created, Modified, Deleted, Submitted, Approved, Rejected
    /// </summary>
    public string? Status { get; set; }

    public DateTime? StatusDate { get; set; }

    public decimal? StatusBy { get; set; }

    public string? StatusReason { get; set; }
}
