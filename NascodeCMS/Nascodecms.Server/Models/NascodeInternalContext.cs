using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NascodeCMS.Server.Models;

public partial class NascodeInternalContext : DbContext
{
    public NascodeInternalContext()
    {
    }

    public NascodeInternalContext(DbContextOptions<NascodeInternalContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ApprovalWorkflow> ApprovalWorkflows { get; set; }

    public virtual DbSet<Bank> Banks { get; set; }

    public virtual DbSet<Candidate> Candidates { get; set; }

    public virtual DbSet<CandidatesAttachment> CandidatesAttachments { get; set; }

    public virtual DbSet<CandidatesHistory> CandidatesHistories { get; set; }

    public virtual DbSet<CandidatesPosition> CandidatesPositions { get; set; }

    public virtual DbSet<CandidatesPositionsAnswer> CandidatesPositionsAnswers { get; set; }

    public virtual DbSet<CandidatesPositionsCriteriaText> CandidatesPositionsCriteriaTexts { get; set; }

    public virtual DbSet<CandidatesPositionsQuestion> CandidatesPositionsQuestions { get; set; }

    public virtual DbSet<CandidatesPositionsText> CandidatesPositionsTexts { get; set; }

    public virtual DbSet<CandidatesRating> CandidatesRatings { get; set; }

    public virtual DbSet<CandidatesText> CandidatesTexts { get; set; }

    public virtual DbSet<CommunicationsHistory> CommunicationsHistories { get; set; }

    public virtual DbSet<CommunicationsHistoryAttachment> CommunicationsHistoryAttachments { get; set; }

    public virtual DbSet<CommunicationsHistoryText> CommunicationsHistoryTexts { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<Credential> Credentials { get; set; }

    public virtual DbSet<CredentialsUsersPermissionAllowed> CredentialsUsersPermissionAlloweds { get; set; }

    public virtual DbSet<CufexGroupPermissionAllowed> CufexGroupPermissionAlloweds { get; set; }

    public virtual DbSet<CufexLanguage> CufexLanguages { get; set; }

    public virtual DbSet<CufexStaticKeyword> CufexStaticKeywords { get; set; }

    public virtual DbSet<CufexUser> CufexUsers { get; set; }

    public virtual DbSet<CufexUsersGroup> CufexUsersGroups { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<EmployeesAttachment> EmployeesAttachments { get; set; }

    public virtual DbSet<EmployeesAttendance> EmployeesAttendances { get; set; }

    public virtual DbSet<EmployeesDepartment> EmployeesDepartments { get; set; }

    public virtual DbSet<EmployeesEmergencyContact> EmployeesEmergencyContacts { get; set; }

    public virtual DbSet<EmployeesHistory> EmployeesHistories { get; set; }

    public virtual DbSet<EmployeesHoliday> EmployeesHolidays { get; set; }

    public virtual DbSet<EmployeesHolidaysDay> EmployeesHolidaysDays { get; set; }

    public virtual DbSet<EmployeesHolidaysHistory> EmployeesHolidaysHistories { get; set; }

    public virtual DbSet<EmployeesPosition> EmployeesPositions { get; set; }

    public virtual DbSet<EmployeesText> EmployeesTexts { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<LogFile> LogFiles { get; set; }

    public virtual DbSet<LogFrontend> LogFrontends { get; set; }

    public virtual DbSet<Nationality> Nationalities { get; set; }

    public virtual DbSet<Office> Offices { get; set; }

    public virtual DbSet<PicDimension> PicDimensions { get; set; }

    public virtual DbSet<Property> Properties { get; set; }

    public virtual DbSet<PublicHoliday> PublicHolidays { get; set; }

    public virtual DbSet<Template> Templates { get; set; }

    public virtual DbSet<TemplatesAttachment> TemplatesAttachments { get; set; }

    public virtual DbSet<TemplatesChangesHistory> TemplatesChangesHistories { get; set; }

    public virtual DbSet<TemplatesText> TemplatesTexts { get; set; }

    public virtual DbSet<TemplatesUsersPermissionAllowed> TemplatesUsersPermissionAlloweds { get; set; }

    public virtual DbSet<Timezone> Timezones { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\;Database=NascodeInternal;User ID=sa;Password=NS4321;MultipleActiveResultSets=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApprovalWorkflow>(entity =>
        {
            entity.ToTable("Approval_Workflows");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.Level1ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Level1ID");
            entity.Property(e => e.Level2ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Level2ID");
            entity.Property(e => e.Level3ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Level3ID");
            entity.Property(e => e.Level4ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Level4ID");
            entity.Property(e => e.Level5ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Level5ID");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.OperationType).HasMaxLength(50);
            entity.Property(e => e.RecID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("RecID");
            entity.Property(e => e.Section).HasMaxLength(50);
            entity.Property(e => e.TableName).HasMaxLength(50);
        });

        modelBuilder.Entity<Bank>(entity =>
        {
            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.AccountNumber).HasMaxLength(12);
            entity.Property(e => e.BankName).HasMaxLength(50);
            entity.Property(e => e.BICSwiftCode)
                .HasMaxLength(11)
                .HasColumnName("BICSwiftCode");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.Currency)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Currency");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.IBAN)
                .HasMaxLength(30)
                .HasColumnName("IBAN");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
        });

        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.AcceptedProbationSalary).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.AcceptedSalary).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Address).HasMaxLength(1000);
            entity.Property(e => e.CountryID)
                .HasComment("Default Lebanon")
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CountryID");
            entity.Property(e => e.DateOfBirth).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.ExpectedProbationSalary).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.ExpectedSalary).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.FullName).HasMaxLength(500);
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasComment("Male, Female, Others");
            entity.Property(e => e.MaritalStatus)
                .HasMaxLength(50)
                .HasComment("Single, Married, Divorced, Separated, Widowed");
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.NationalityID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("NationalityID");
            entity.Property(e => e.OfficeId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("OfficeID");
            entity.Property(e => e.PositionID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("PositionID");
            entity.Property(e => e.Source)
                .HasMaxLength(100)
                .HasComment("Facebook, Instagram, TikTok, LinkedIn, Website, Others");
        });

        modelBuilder.Entity<CandidatesAttachment>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.CandidateID }).HasName("PK_Candidates_Uploads");

            entity.ToTable("Candidates_Attachments");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CandidateID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CandidateID");
            entity.Property(e => e.FileLink).HasMaxLength(150);
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FileType)
                .HasMaxLength(150)
                .HasComment("Photo, Resume, Portfolio, Test Submission, Certificate, Award, Others");
        });

        modelBuilder.Entity<CandidatesHistory>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.CandidateID });

            entity.ToTable("Candidates_History");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CandidateID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CandidateID");
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("Created, Modified, Deleted, Ignored, First Interview Scheduled, First Interview Done, Test Requested, Test Submitted, Second Interview Scheduled, Second Interview done, Offer Sent, Offer Rejected, Employed, Short listed, Rated, Not Selected");
            entity.Property(e => e.StatusBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.StatusDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<CandidatesPosition>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_Positions");

            entity.ToTable("Candidates_Positions");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.RefNum).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(150);
        });

        modelBuilder.Entity<CandidatesPositionsAnswer>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.CandidateID, e.PositionID, e.QuestionID });

            entity.ToTable("Candidates_Positions_Answers");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CandidateID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CandidateID");
            entity.Property(e => e.PositionID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("PositionID");
            entity.Property(e => e.QuestionID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("QuestionID");
            entity.Property(e => e.Answer).HasMaxLength(2000);
        });

        modelBuilder.Entity<CandidatesPositionsCriteriaText>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.PositionID }).HasName("PK_Positions_Criteria_Text");

            entity.ToTable("Candidates_Positions_Criteria_Text");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.PositionID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("PositionID");
            entity.Property(e => e.Description).HasMaxLength(3000);
        });

        modelBuilder.Entity<CandidatesPositionsQuestion>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.PositionID }).HasName("PK_Positions_Questions");

            entity.ToTable("Candidates_Positions_Questions");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.PositionID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("PositionID");
            entity.Property(e => e.AnswerType)
                .HasMaxLength(50)
                .HasComment("Yes/No, Text");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Question)
                .HasMaxLength(500)
                .HasComment("Likes Lebanon, Share negative energy, Vision, Motivated, MS Office");
        });

        modelBuilder.Entity<CandidatesPositionsText>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.PositionID }).HasName("PK_Positions_JobDescription_Text");

            entity.ToTable("Candidates_Positions_Text");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.PositionID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("PositionID");
            entity.Property(e => e.Description).HasMaxLength(3000);
        });

        modelBuilder.Entity<CandidatesRating>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.CandidateID });

            entity.ToTable("Candidates_Ratings");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CandidateID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CandidateID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.RatingDescription).HasMaxLength(500);
        });

        modelBuilder.Entity<CandidatesText>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.CandidateID }).HasName("PK_Candidates_History_Text");

            entity.ToTable("Candidates_Text");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CandidateID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CandidateID");
            entity.Property(e => e.Notes).HasMaxLength(3000);
        });

        modelBuilder.Entity<CommunicationsHistory>(entity =>
        {
            entity.ToTable("Communications_History");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CommunicationType).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.RecID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("RecID");
            entity.Property(e => e.RecType).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasComment("Submitted, Approved, Rejected");
            entity.Property(e => e.StatusBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.StatusDate).HasColumnType("datetime");
            entity.Property(e => e.StatusReason).HasMaxLength(1000);
            entity.Property(e => e.Subject).HasMaxLength(150);
            entity.Property(e => e.TemplateID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TemplateID");
            entity.Property(e => e.UsersCcEmails).HasMaxLength(3000);
            entity.Property(e => e.UsersToEmails).HasMaxLength(3000);
            entity.Property(e => e.WaitingApprovalFrom).HasColumnType("numeric(18, 0)");
        });

        modelBuilder.Entity<CommunicationsHistoryAttachment>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.CommunicationHistoryID });

            entity.ToTable("Communications_History_Attachments");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CommunicationHistoryID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CommunicationHistoryID");
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FileTitle).HasMaxLength(50);
        });

        modelBuilder.Entity<CommunicationsHistoryText>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.CommunicationHistoryId });

            entity.ToTable("Communications_History_Text");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CommunicationHistoryId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CommunicationHistoryID");
            entity.Property(e => e.Body).HasMaxLength(3000);
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.Property(e => e.ID)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CountryCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Title).HasMaxLength(250);
        });

        modelBuilder.Entity<Credential>(entity =>
        {
            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Password).HasMaxLength(150);
            entity.Property(e => e.Username).HasMaxLength(150);
        });

        modelBuilder.Entity<CredentialsUsersPermissionAllowed>(entity =>
        {
            entity.HasKey(e => new { e.CredentialID, e.DepartmentID, e.UserID });

            entity.ToTable("Credentials_UsersPermissionAllowed");

            entity.Property(e => e.CredentialID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CredentialID");
            entity.Property(e => e.DepartmentID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("DepartmentID");
            entity.Property(e => e.UserID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("UserID");
        });

        modelBuilder.Entity<CufexGroupPermissionAllowed>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.GroupID });

            entity.ToTable("Cufex_GroupPermissionAllowed");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.GroupID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("GroupID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.FileName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CufexLanguage>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_Cufex_Language");

            entity.ToTable("Cufex_Languages");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.Direction)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.LangAbbreviation)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Priority).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Resfilename)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CufexStaticKeyword>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.LanguageID }).HasName("PK_Portal_Static_Keywords");

            entity.ToTable("Cufex_Static_Keywords");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.LanguageID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("LanguageID");
            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Value).HasMaxLength(3000);
        });

        modelBuilder.Entity<CufexUser>(entity =>
        {
            entity.ToTable("Cufex_Users");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.BackendThumbnail).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.GroupID).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Password).HasMaxLength(150);
            entity.Property(e => e.RecID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("RecID");
            entity.Property(e => e.RecType).HasMaxLength(50);
            entity.Property(e => e.TimezoneID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TimezoneID");
            entity.Property(e => e.UserID).HasMaxLength(50);
        });

        modelBuilder.Entity<CufexUsersGroup>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_Cufex_UsersGroups_1");

            entity.ToTable("Cufex_UsersGroups");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Currency>(entity =>
        {
            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.Code).HasMaxLength(6);
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Symbol).HasMaxLength(2);
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.Property(e => e.ID)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.Address).HasMaxLength(1000);
            entity.Property(e => e.AlternativeManagerID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("AlternativeManagerID");
            entity.Property(e => e.ArabicAddress).HasMaxLength(1000);
            entity.Property(e => e.ArabicFullName).HasMaxLength(500);
            entity.Property(e => e.BankID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("BankID");
            entity.Property(e => e.CandidateID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CandidateID");
            entity.Property(e => e.ContractEndDate).HasColumnType("datetime");
            entity.Property(e => e.ContractStartDate).HasColumnType("datetime");
            entity.Property(e => e.CountryID)
                .HasComment("Default Lebanon")
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("CountryID");
            entity.Property(e => e.DateOfBirth).HasColumnType("datetime");
            entity.Property(e => e.DateOfEmployment).HasColumnType("datetime");
            entity.Property(e => e.DepartmentID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("DepartmentID");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.EmployeePositionId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("EmployeePositionID");
            entity.Property(e => e.EmploymentType)
                .HasMaxLength(50)
                .HasComment("Part Time, Full Time, Hybrid, Remote");
            entity.Property(e => e.FullName).HasMaxLength(500);
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasComment("Male, Female, Others");
            entity.Property(e => e.InsuranceNumber).HasMaxLength(50);
            entity.Property(e => e.ManagerID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ManagerID");
            entity.Property(e => e.MaritalStatus)
                .HasMaxLength(50)
                .HasComment("Single, Married, Divorced, Separated, Widowed");
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.ModeOfPayment).HasMaxLength(50);
            entity.Property(e => e.NationalityID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("NationalityID");
            entity.Property(e => e.OfficeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("OfficeID");
            entity.Property(e => e.OwnAcar).HasColumnName("OwnACar");
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            entity.Property(e => e.ProbationSalary).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.ProfessionalEmail).HasMaxLength(150);
            entity.Property(e => e.Ssn)
                .HasMaxLength(20)
                .HasColumnName("SSN");
        });

        modelBuilder.Entity<EmployeesAttachment>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.EmployeeID }).HasName("PK_Employees_Uploads");

            entity.ToTable("Employees_Attachments");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.EmployeeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("EmployeeID");
            entity.Property(e => e.FileLink).HasMaxLength(150);
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FileType)
                .HasMaxLength(50)
                .HasComment("Photo, Resume, Portfolio, Test Submission, Certificate, Award, Others");
        });

        modelBuilder.Entity<EmployeesAttendance>(entity =>
        {
            entity.ToTable("Employees_Attendance");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DateIn)
                .HasColumnType("datetime")
                .HasColumnName("DateIN");
            entity.Property(e => e.DateOut)
                .HasColumnType("datetime")
                .HasColumnName("DateOUT");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.EmployeeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("EmployeeID");
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
        });

        modelBuilder.Entity<EmployeesDepartment>(entity =>
        {
            entity.ToTable("Employees_Departments");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.OfficeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("OfficeID");
            entity.Property(e => e.Title).HasMaxLength(150);
        });

        modelBuilder.Entity<EmployeesEmergencyContact>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.EmployeeID });

            entity.ToTable("Employees_Emergency_Contacts");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.EmployeeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("EmployeeID");
            entity.Property(e => e.FullName).HasMaxLength(500);
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.Relationship).HasMaxLength(50);
        });

        modelBuilder.Entity<EmployeesHistory>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.EmployeeID });

            entity.ToTable("Employees_History");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.EmployeeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("EmployeeID");
            entity.Property(e => e.Salary).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("Created, Modified, Deleted, Restricted, On Probation, Employed, NDA, Internship, Resigned, Laid Off, Dead");
            entity.Property(e => e.StatusBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.StatusDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<EmployeesHoliday>(entity =>
        {
            entity.ToTable("Employees_Holidays");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.DepartmentID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("DepartmentID");
            entity.Property(e => e.WaitingApprovalFrom).HasColumnType("numeric(18, 0)");
        });

        modelBuilder.Entity<EmployeesHolidaysDay>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.HolidayID }).HasName("PK_Employees_Holidays_Days_1");

            entity.ToTable("Employees_Holidays_Days");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.HolidayID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("HolidayID");
            entity.Property(e => e.EmployeeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("EmployeeID");
            entity.Property(e => e.PublicHolidayID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("PublicHolidayID");
        });

        modelBuilder.Entity<EmployeesHolidaysHistory>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.HolidayID });

            entity.ToTable("Employees_Holidays_History");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.HolidayID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("HolidayID");
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("Created, Modified, Deleted, Submitted, Approved, Rejected");
            entity.Property(e => e.StatusBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.StatusDate).HasColumnType("datetime");
            entity.Property(e => e.StatusReason).HasMaxLength(1000);
        });

        modelBuilder.Entity<EmployeesPosition>(entity =>
        {
            entity.ToTable("Employees_Positions");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.ArabicTitle).HasMaxLength(150);
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.DepartmentID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("DepartmentID");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Title).HasMaxLength(150);
        });

        modelBuilder.Entity<EmployeesText>(entity =>
        {
            entity.HasKey(e => new { e.ID, e.EmployeeID }).HasName("PK_Employees_History_Text");

            entity.ToTable("Employees_Text");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.EmployeeID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("EmployeeID");
            entity.Property(e => e.Notes).HasMaxLength(3000);
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.ToTable("Language");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.Direction)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.LangAbbreviation)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Priority).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Resfilename)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LogFile>(entity =>
        {
            entity.ToTable("LogFile");

            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.Info).HasMaxLength(1000);
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(100)
                .HasColumnName("IPAddress");
            entity.Property(e => e.LogDate).HasColumnType("datetime");
            entity.Property(e => e.MachineName).HasMaxLength(100);
            entity.Property(e => e.OperationType).HasMaxLength(50);
            entity.Property(e => e.RecID).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.RecType).HasMaxLength(50);
            entity.Property(e => e.UserID).HasMaxLength(50);
        });

        modelBuilder.Entity<LogFrontend>(entity =>
        {
            entity.ToTable("LogFrontend");

            entity.Property(e => e.ID)
                .ValueGeneratedOnAdd()
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Message)
                .HasMaxLength(8000)
                .IsUnicode(false);
            entity.Property(e => e.Url)
                .HasMaxLength(150)
                .HasColumnName("URL");
        });

        modelBuilder.Entity<Nationality>(entity =>
        {
            entity.Property(e => e.Id)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Title).HasMaxLength(250);
        });

        modelBuilder.Entity<Office>(entity =>
        {
            entity.Property(e => e.ID)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Title).HasMaxLength(150);
        });

        modelBuilder.Entity<PicDimension>(entity =>
        {
            entity.HasKey(e => new { e.Section, e.ImgTag });

            entity.ToTable("PicDimension");

            entity.Property(e => e.Section)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ImgTag)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.FolderPath)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaxSize).HasColumnType("numeric(9, 2)");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(e => e.Code);

            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Value)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PublicHoliday>(entity =>
        {
            entity.Property(e => e.Id)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DefaultDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.Type).HasMaxLength(50);
        });

        modelBuilder.Entity<Template>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_EmailsBook_1");

            entity.Property(e => e.Id)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.CreationDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedBy).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.DeletionDate).HasColumnType("datetime");
            entity.Property(e => e.Section).HasMaxLength(50);
            entity.Property(e => e.Subject).HasMaxLength(150);
            entity.Property(e => e.TableName).HasMaxLength(50);
            entity.Property(e => e.WaitingApprovalFrom).HasColumnType("numeric(18, 0)");
        });

        modelBuilder.Entity<TemplatesAttachment>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.TemplateId, e.TemplateHistoryId }).HasName("PK_Templates_Attachments_1");

            entity.ToTable("Templates_Attachments");

            entity.Property(e => e.Id)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.TemplateId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TemplateID");
            entity.Property(e => e.TemplateHistoryId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TemplateHistoryID");
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FileTitle).HasMaxLength(50);
        });

        modelBuilder.Entity<TemplatesChangesHistory>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.TemplateId });

            entity.ToTable("Templates_Changes_History");

            entity.Property(e => e.Id)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.TemplateId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TemplateID");
            entity.Property(e => e.ModificationDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasComment("Saved, Submitted, Approved, Rejected");
            entity.Property(e => e.StatusBy).HasColumnType("numeric(9, 0)");
            entity.Property(e => e.StatusDate).HasColumnType("datetime");
            entity.Property(e => e.StatusReason).HasMaxLength(1000);
        });

        modelBuilder.Entity<TemplatesText>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.TemplateId, e.TemplateHistoryId });

            entity.ToTable("Templates_Text");

            entity.Property(e => e.Id)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.TemplateId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TemplateID");
            entity.Property(e => e.TemplateHistoryId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TemplateHistoryID");
            entity.Property(e => e.Body).HasMaxLength(3000);
        });

        modelBuilder.Entity<TemplatesUsersPermissionAllowed>(entity =>
        {
            entity.HasKey(e => new { e.TemplateId, e.UserId });

            entity.ToTable("Templates_UsersPermissionAllowed");

            entity.Property(e => e.TemplateId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TemplateID");
            entity.Property(e => e.UserId)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("UserID");
        });

        modelBuilder.Entity<Timezone>(entity =>
        {
            entity.Property(e => e.Id)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("ID");
            entity.Property(e => e.Code).HasMaxLength(5);
            entity.Property(e => e.Title).HasMaxLength(150);
            entity.Property(e => e.Utcoffset)
                .HasMaxLength(10)
                .HasColumnName("UTCOffset");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
