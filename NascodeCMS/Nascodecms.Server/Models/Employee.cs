using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Employee
{
    public decimal ID { get; set; }

    public decimal? CandidateID { get; set; }

    public decimal? OfficeID { get; set; }

    public decimal? DepartmentID { get; set; }

    public string? FullName { get; set; }

    public string? ArabicFullName { get; set; }

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

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public string? ProfessionalEmail { get; set; }

    /// <summary>
    /// Default Lebanon
    /// </summary>
    public decimal? CountryID { get; set; }

    public string? Address { get; set; }

    public string? ArabicAddress { get; set; }

    public decimal? EmployeePositionId { get; set; }

    public decimal? ProbationSalary { get; set; }

    public byte? ShouldFillTasks { get; set; }

    public DateTime? DateOfEmployment { get; set; }

    public DateTime? ContractStartDate { get; set; }

    public DateTime? ContractEndDate { get; set; }

    public string? Ssn { get; set; }

    public string? InsuranceNumber { get; set; }

    public byte? OwnAcar { get; set; }

    /// <summary>
    /// Part Time, Full Time, Hybrid, Remote
    /// </summary>
    public string? EmploymentType { get; set; }

    public decimal? ManagerID { get; set; }

    public decimal? AlternativeManagerID { get; set; }

    public string? ModeOfPayment { get; set; }

    public decimal? BankID { get; set; }

    public short? NumberOfChildren { get; set; }

    public decimal? NationalityID { get; set; }
}
