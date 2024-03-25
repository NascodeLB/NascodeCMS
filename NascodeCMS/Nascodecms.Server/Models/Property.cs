using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Property
{
    public string Code { get; set; } = null!;

    public string? Value { get; set; }

    public string? Description { get; set; }
}
