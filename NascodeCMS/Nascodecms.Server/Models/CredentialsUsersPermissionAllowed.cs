using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class CredentialsUsersPermissionAllowed
{
    public decimal CredentialID { get; set; }

    public decimal DepartmentID { get; set; }

    public decimal UserID { get; set; }
}
