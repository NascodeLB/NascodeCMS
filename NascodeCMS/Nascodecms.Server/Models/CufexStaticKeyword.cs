using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CufexStaticKeyword
{
    public decimal ID { get; set; }

    public decimal LanguageID { get; set; }

    public string? Code { get; set; }

    public string? Description { get; set; }

    public string? Value { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }
}
