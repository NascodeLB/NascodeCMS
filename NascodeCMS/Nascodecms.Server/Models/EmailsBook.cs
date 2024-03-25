using System;
using System.Collections.Generic;
using System.Net.Mail;

namespace NascodeCMS.Server.Models;

public partial class EmailsBook
{
    public decimal ID { get; set; }
    public decimal Language { get; set; }
    public string? Code { get; set; }
    public string? FromEmail { get; set; }
    public string? Subject { get; set; }
    public string? Body { get; set; }
    public decimal? ModifiedBy { get; set; }
    public string? ModifiedByName { get; set; }
    public decimal? CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime? CreationDate { get; set; }
    public DateTime? ModificationDate { get; set; }
    public DateTime? LastModificationDate { get; set; }
    public string? LastModifiedBy { get; set; }
}
