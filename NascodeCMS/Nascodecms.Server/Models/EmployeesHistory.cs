using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesHistory
{
    public decimal ID { get; set; }

    public decimal EmployeeID { get; set; }

    /// <summary>
    /// Created, Modified, Deleted, Restricted, On Probation, Employed, NDA, Internship, Resigned, Laid Off, Dead
    /// </summary>
    public string? Status { get; set; }

    public DateTime? StatusDate { get; set; }

    public decimal? StatusBy { get; set; }

    public decimal? Salary { get; set; }
}
