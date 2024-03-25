using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class PicDimension
{
    public string Section { get; set; } = null!;

    public string ImgTag { get; set; } = null!;

    public short? Width { get; set; }

    public short? Height { get; set; }

    public decimal? MaxSize { get; set; }

    public string? FolderPath { get; set; }

    public short? MaxWidth { get; set; }

    public short? MinWidth { get; set; }

    public short? MaxHeight { get; set; }

    public short? MinHeight { get; set; }

    public DateTime? CreationDate { get; set; }

    public short? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public short? ModifiedBy { get; set; }
}
