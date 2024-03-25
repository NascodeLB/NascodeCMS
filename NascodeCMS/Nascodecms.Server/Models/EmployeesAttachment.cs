using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesAttachment
{
    public decimal ID { get; set; }

    public decimal EmployeeID { get; set; }

    public string? FileName { get; set; }

    public string? FileLink { get; set; }

    /// <summary>
    /// Photo, Resume, Portfolio, Test Submission, Certificate, Award, Others
    /// </summary>
    public string? FileType { get; set; }
}
