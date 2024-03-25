using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NascodeCMS.Filter
{
    public class PaginationFilter
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string Sorting { get; set; }
        public string Filter { get; set; }
        public string SearchText { get; set; }
        public int After { get; set; }
        public int language { get; set; }

        public string Fromdate { get; set; }
        public string Todate { get; set; }
        public string operations { get; set; }
        public string usersid { get; set; }

        public PaginationFilter()
        {
            this.PageNumber = 1;
            this.PageSize = 10;
            this.Sorting = "ID";
            this.Filter = "";
            this.After = 0;
            this.SearchText = "";
            this.language = 0;
            this.Fromdate = "";
            this.Todate = "";
            this.operations = "";
            this.usersid = "";
        }
        public PaginationFilter(int pageNumber, int pageSize, string sorting, string filter , string searchtext , int after, string fromdate, string todate, string operations, string usersid)
        {
            this.PageNumber = pageNumber < 1 ? 1 : pageNumber;
            this.PageSize = pageSize < 1 ? 1 : pageSize;
            this.Sorting = sorting == "" ? "ID" : sorting;
            this.Filter = filter;
            this.After = after;
            this.SearchText = searchtext;
            this.language = language;
            this.Fromdate = fromdate;
            this.Todate =  todate;
            this.operations = operations;
            this.usersid = usersid;
        }
    }
}
