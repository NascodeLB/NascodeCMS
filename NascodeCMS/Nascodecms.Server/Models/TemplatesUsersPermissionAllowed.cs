using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class TemplatesUsersPermissionAllowed
{
    public decimal TemplateId { get; set; }

    public decimal UserId { get; set; }
}
