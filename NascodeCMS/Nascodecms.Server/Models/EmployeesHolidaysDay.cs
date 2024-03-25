using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesHolidaysDay
{
    public decimal ID { get; set; }

    public decimal HolidayID { get; set; }

    public decimal EmployeeID { get; set; }

    public decimal PublicHolidayID { get; set; }

    public short? NumberOfDays { get; set; }
}
