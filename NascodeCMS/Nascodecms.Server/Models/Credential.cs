using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Credential
{
    public decimal ID { get; set; }

    public string? Description { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? Email { get; set; }

    public string? Mobile { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? DeletionDate { get; set; }

    public DateTime? ModificationDate { get; set; }

    public byte? Deleted { get; set; }

    public decimal? DeletedBy { get; set; }

    public decimal? ModifiedBy { get; set; }
}
