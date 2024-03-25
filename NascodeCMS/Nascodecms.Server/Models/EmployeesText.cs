using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesText
{
    public decimal ID { get; set; }

    public decimal EmployeeID { get; set; }

    public string? Notes { get; set; }
}
