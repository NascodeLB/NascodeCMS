using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Timezone
{
    public decimal Id { get; set; }

    public string? Code { get; set; }

    public string? Title { get; set; }

    public string? Utcoffset { get; set; }
}
