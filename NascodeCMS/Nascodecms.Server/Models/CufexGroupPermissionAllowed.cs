using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CufexGroupPermissionAllowed
{
    public decimal ID { get; set; }

    public decimal GroupID { get; set; }

    public string? FileName { get; set; }

    public string? Name { get; set; }

    public byte? AddOpr { get; set; }

    public byte? EditOpr { get; set; }

    public byte? DeleteOpr { get; set; }

    public byte? ViewOpr { get; set; }

    public byte? PrintOpr { get; set; }

    public byte? CloneOpr { get; set; }

    public byte? ExportOpr { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }
}
