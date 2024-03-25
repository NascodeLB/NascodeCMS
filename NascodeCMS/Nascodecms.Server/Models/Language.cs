using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Language
{
    public decimal ID { get; set; }

    public string? Name { get; set; }

    public string? Resfilename { get; set; }

    public string? LangAbbreviation { get; set; }

    public decimal? Priority { get; set; }

    public string? Direction { get; set; }

    public DateTime? CreationDate { get; set; }

    public short? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public short? ModifiedBy { get; set; }
}
