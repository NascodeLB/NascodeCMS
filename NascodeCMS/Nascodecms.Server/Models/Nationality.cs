﻿using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Nationality
{
    public decimal Id { get; set; }

    public string? Title { get; set; }

    public byte? Active { get; set; }

    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }

    public DateTime? ModificationDate { get; set; }

    public decimal? ModifiedBy { get; set; }

    public byte? Deleted { get; set; }

    public decimal? DeletedBy { get; set; }

    public DateTime? DeletionDate { get; set; }
}
