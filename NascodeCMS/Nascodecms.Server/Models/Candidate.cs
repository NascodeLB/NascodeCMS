using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Candidate
{
    public decimal ID { get; set; }

    public string? FullName { get; set; }

    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Male, Female, Others
    /// </summary>
    public string? Gender { get; set; }

    /// <summary>
    /// Single, Married, Divorced, Separated, Widowed
    /// </summary>
    public string? MaritalStatus { get; set; }

    public string? Mobile { get; set; }

    public string? Email { get; set; }

    /// <summary>
    /// Default Lebanon
    /// </summary>
    public decimal? CountryID { get; set; }

    public string? Address { get; set; }

    public decimal? PositionID { get; set; }

    public decimal? OfficeId { get; set; }

    public decimal? ExpectedProbationSalary { get; set; }

    public decimal? ExpectedSalary { get; set; }

    public decimal? AcceptedProbationSalary { get; set; }

    public decimal? AcceptedSalary { get; set; }

    /// <summary>
    /// Facebook, Instagram, TikTok, LinkedIn, Website, Others
    /// </summary>
    public string? Source { get; set; }

    public short? NumberOfChildren { get; set; }

    public decimal? NationalityID { get; set; }
}
