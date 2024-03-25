using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Bank
{
    public decimal ID { get; set; }

    public decimal LanguageID { get; set; }

    public string? LanguageName { get; set; }

    public string? BankName { get; set; }

    public string? AccountNumber { get; set; }

    public string? IBAN { get; set; }

    public string? BICSwiftCode { get; set; }

    public string? Currency { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }
    public string? CreatedByName { get; set; }

    public DateTime? ModificationDate { get; set; }
    public DateTime? LastModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }
    public string? ModifiedByName { get; set; }

    public byte? Deleted { get; set; }
    public decimal?  CurrencyID { get; set; }

    public decimal? DeletedBy { get; set; }

    public DateTime? DeletionDate { get; set; }
}
