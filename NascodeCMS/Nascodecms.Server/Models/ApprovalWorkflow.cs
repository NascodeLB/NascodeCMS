using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class ApprovalWorkflow
{
    public decimal ID { get; set; }

    public string? Section { get; set; }

    public string? TableName { get; set; }

    public string? OperationType { get; set; }

    public decimal? RecID { get; set; }

    public decimal? Level1ID { get; set; }

    public decimal? Level2ID { get; set; }

    public decimal? Level3ID { get; set; }

    public decimal? Level4ID { get; set; }

    public decimal? Level5ID { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? DeletionDate { get; set; }

    public DateTime? ModificationDate { get; set; }

    public byte? Deleted { get; set; }

    public decimal? DeletedBy { get; set; }

    public decimal? ModifiedBy { get; set; }
}
