using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Timezone
{
    public decimal ID { get; set; }

    public string? Code { get; set; }

    public string? Title { get; set; }

    public string? UTCOffset { get; set; }
    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime? ModificationDate { get; set; }
    public DateTime? LastModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }
    public string? ModifiedByName { get; set; }
}
