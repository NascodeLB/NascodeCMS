using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesAttendance
{
    public decimal ID { get; set; }

    public decimal? EmployeeID { get; set; }

    public DateTime? DateIn { get; set; }

    public DateTime? DateOut { get; set; }

    public string? FileName { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }

    public byte? Deleted { get; set; }

    public DateTime? DeletionDate { get; set; }

    public decimal? DeletedBy { get; set; }
}
