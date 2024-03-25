using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesHoliday
{
    public decimal ID { get; set; }

    public short? Year { get; set; }

    public decimal? DepartmentID { get; set; }

    public decimal? WaitingApprovalFrom { get; set; }

    public byte? WaitingApprovalFromLevel { get; set; }
}
