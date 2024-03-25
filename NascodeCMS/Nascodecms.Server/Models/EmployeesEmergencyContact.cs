using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesEmergencyContact
{
    public decimal ID { get; set; }

    public decimal EmployeeID { get; set; }

    public string? FullName { get; set; }

    public string? Relationship { get; set; }

    public string? Mobile { get; set; }
}
