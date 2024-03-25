using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Contact
{
    public decimal ID { get; set; }

    public decimal PreferedLanguage { get; set; }

    public string? LanguageName { get; set; }

    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? Mobile { get; set; }

    public string? CompanyName { get; set; }

    public string? Message { get; set; }

    public DateTime? Date { get; set; }

}
