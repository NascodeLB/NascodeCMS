using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class UserCredentials
{ 
    public string? username { get; set; } 
    public string? Email { get; set; }
    public string? Password { get; set; } 
    public string? googleToken { get; set; }
}

public partial class UserResetPassword
{
    public string? username { get; set; }
    public string? Email { get; set; }  
    public string? ResetCode { get; set; }  
    public string? Password { get; set; }  
}
