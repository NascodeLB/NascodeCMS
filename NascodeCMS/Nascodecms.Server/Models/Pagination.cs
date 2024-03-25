 

namespace NascodeCMS.Server.Models;

public partial class Pagination
{
    public decimal CurrentPage { get; set; }
    public decimal FirstPage { get; set; }
    public decimal LastPage { get; set; }
    public decimal TotalCount { get; set; }
    public List<int>? Pages { get; set; }

}
