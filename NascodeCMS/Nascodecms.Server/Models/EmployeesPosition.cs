﻿using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class EmployeesPosition
{
    public decimal ID { get; set; }

    public string? Title { get; set; }

    public string? ArabicTitle { get; set; }

    public decimal? DepartmentID { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }

    public byte? Deleted { get; set; }

    public DateTime? DeletionDate { get; set; }

    public decimal? DeletedBy { get; set; }
}
