using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using NascodeCMS.Server.Controllers;
using System;
using System.Data;
using System.Linq;

namespace NascodeCMS.Classes
{
    public class clsGlobals
    {
         
 
        public static void Log(string message, string url = "", string sql = "")
         {
        //    System.Data.SqlClient.SqlConnection cn = null/* TODO Change to default(_) if this is not a reference type */;
        //    System.Data.SqlClient.SqlDataAdapter da = null/* TODO Change to default(_) if this is not a reference type */;
        //    SQLExec tb = new SQLExec();
        //    var Newid = 1;
        //    DataSet ds = tb.Cursor("Select top 1 * from LogFrontend  order by id desc", ref da, ref cn);
        //    DataRow dr = ds.Tables[0].NewRow();
        //    if (ds.Tables[0].Rows.Count > 0)
        //        Newid = System.Convert.ToInt32(ds.Tables[0].Rows[0]["ID"]) + 1;
        //    dr["ID"] = Newid;
        //    dr["date"] = DateTime.Now;
        //    dr["Message"] = message + " " + sql;
        //    dr["URL"] = url;
        //    ds.Tables[0].Rows.Add(dr);
        //    tb.commitChanges(ref da, ds, ref cn);

            // Try
            // If (ConfigurationManager.AppSettings.[Get]("DevelopmentEnvironement") + String.Empty).Equals("false", StringComparison.OrdinalIgnoreCase) Then SendLogErrorToAdmin(message, url)
            // Catch exc As Exception
            // Dim MyString As String = exc.Message
            // End Try
            //  return null;
        }

        public static string GetUserAgent(HttpContext context)
        {
            if (context.Request.Headers.TryGetValue(HeaderNames.UserAgent, out var userAgent))
            {
                return userAgent.ToString();
            }
            return "Not found";
        }

        public static bool IsDate(string tempDate)
        {
            DateTime fromDateValue;
            var formats = new[] { "yyyy/MM/dd", "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss.SSS", "yyyy/MM/dd HH:mm:ss.SSS" };
            if (DateTime.TryParseExact(tempDate, formats, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out fromDateValue))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static int[] CalculatePagination(int totalItems, int pageSize, int currentPage)
        {
            // Calculate the total number of pages
            int totalPages = (totalItems + pageSize - 1) / pageSize;

            // Determine the start and end page for the pagination
            int startPage, endPage;

            if (totalPages <= 5)
            {
                // If there are 5 or less pages, show all pages
                startPage = 1;
                endPage = totalPages;
            }
            else if (currentPage <= 3)
            {
                // If current page is among the first three pages
                startPage = 1;
                endPage = 5;
            }
            else if (currentPage + 2 >= totalPages)
            {
                // If current page is among the last three pages
                startPage = totalPages - 4;
                endPage = totalPages;
            }
            else
            {
                // Otherwise, show two pages before and two pages after the current page
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }

            // Generate the list of page numbers
            List<int> pageNumbers = new List<int>();
            for (int page = startPage; page <= endPage; page++)
            {
                pageNumbers.Add(page);
            }

            return pageNumbers.ToArray();
        }
        public static int CalculateLastPageNumber(int totalItemCount, int pageSize)
        {
            if (pageSize <= 0)
            {
                throw new ArgumentException("Page size must be greater than zero.");
            }

            // Calculate the total number of pages
            return (totalItemCount + pageSize - 1) / pageSize;
        }

        //public static Boolean SendEmail(string emailbookcode, System.Data.DataRow dataRow, string EmailTo , string connection)  
        //{
        //    //string sqlDataSource = connection;
        //    //var sql = " select Subject, Body ";
        //    //sql += "  from EmailsBook EB where EB.code = '" + emailbookcode + "' order by ID ";

        //    //var ds = DAL.GetDataSet(sqlDataSource, sql);

        //    //Boolean resultsuccess = false;
        //    //if (ds.Tables[0].Rows.Count > 0)
        //    //{
        //    //    var fromEmail =  "info@nascode.com";
        //    //    MySmtp Message = new MySmtp();
        //    //    resultsuccess = Message.Send(dataRow, fromEmail, EmailTo, "", "", ds.Tables[0].Rows[0]["Subject"].ToString() ?? "", ds.Tables[0].Rows[0]["Body"].ToString() ?? "");
        //    //}

        //    //return resultsuccess;
        //}

    }
}