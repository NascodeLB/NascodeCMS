using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Dynamic_Content
{
    public decimal ID { get; set; }

    public decimal Language { get; set; }

    public decimal CategoryID { get; set; }
   
    public string? Title { get; set; }
    public string? Subtitle { get; set; }

    public string? Description { get; set; }

    public string? ButtonText { get; set; }
    public string? ButtonLink { get; set; }
    public string? Picture { get; set; }
    public byte Active { get; set; }
    public Int16 Priority { get; set; }
    public byte Deleted { get; set; }
    public DateTime? DeletedDate { get; set; }

    public decimal? DeletedBy { get; set; }
    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }
    public string? CreatedByName { get; set; }

    public DateTime? ModificationDate { get; set; }
    public DateTime? LastModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }
    public string? ModifiedByName { get; set; }

    
}
