using NascodeCMS.Auth;
using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models; 
public partial class CufexUser
{
    public decimal ID { get; set; }

    public decimal? GroupID { get; set; }
    public string? groupName { get; set; }
    public string? FullName { get; set; }

    public string? UserID { get; set; }

    public string? Password { get; set; }

    public byte? Active { get; set; }

    public string? Mobile { get; set; }

    public string? Email { get; set; }

    public string? BackendThumbnail { get; set; }
    public string? ResetCode { get; set; }
    public DateTime? ResetCodeExpiryDate { get; set; }

    public string? RecType { get; set; }

    public decimal? RecID { get; set; }

    public decimal? TimezoneID { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime? ModificationDate { get; set; }
    public DateTime? LastModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }
    public string? ModifiedByName { get; set; }
    public byte? Deleted { get; set; }

    public decimal? DeletedBy { get; set; }

    public DateTime? DeletionDate { get; set; }

}

public partial class LoginMember
{
    public LoginMember(CufexUser member, TokenModel token)
    {
        this.Member = member;
        Token = token; 
    }

    public CufexUser Member { get; set; }
    public TokenModel Token { get; set; } 
}
