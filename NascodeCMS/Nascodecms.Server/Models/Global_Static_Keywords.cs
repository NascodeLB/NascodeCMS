using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Global_Static_Keywords
{
    public decimal ID { get; set; }

    public decimal Language { get; set; }

    public decimal CategoryID { get; set; }
    public string SectionName { get; set; }
    public string Title { get; set; }
    public string Code { get; set; }

    public string? Value { get; set; }

    public string Type { get; set; }
    public decimal MaxLength { get; set; }

    public byte Priority { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }
    public string? CreatedByName { get; set; }

    public DateTime? ModificationDate { get; set; }
    public DateTime? LastModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }
    public string? ModifiedByName { get; set; }

    
}
