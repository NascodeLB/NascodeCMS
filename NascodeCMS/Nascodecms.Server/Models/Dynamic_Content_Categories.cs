using System;
using System.Collections.Generic;

namespace NascodeCMS.Server.Models;

public partial class Dynamic_Content_Categories
{
    public decimal ID { get; set; }

   

    public string Title { get; set; }

    public string ProgramingCode { get; set; }
    public Byte Active { get; set; }


    public DateTime? CreationDate { get; set; }

    public decimal? CreatedBy { get; set; }
   

    public DateTime? ModificationDate { get; set; }
 

    public decimal? ModifiedBy { get; set; }
  

 
}
