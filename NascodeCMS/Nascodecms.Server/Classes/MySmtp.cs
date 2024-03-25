namespace NascodeCMS.Classes
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.VisualBasic;
    using NascodeCMS.Server.Models;
    using System;
    using System.Data;
    using System.Net;
    using System.Net.Mail;
    using System.Data.SqlClient;
    using Microsoft.CodeAnalysis;

    public class MySmtp
    {
        string sqlDataSource = "";

        public MySmtp(string sqlDataSource)
        {
            this.sqlDataSource = sqlDataSource;
        }
        public bool Send( string FromAdr, string ToAdr, string CCAdr, string BCCAdr, string Subject, string Body, System.Net.Mail.Attachment attachment = null)
        {
            MailMessage MyMsg = new MailMessage();
            MyMsg.From = new MailAddress(FromAdr);
            MyMsg.To.Add(ToAdr.Replace(";", ","));
            if (CCAdr != "") MyMsg.CC.Add(CCAdr.Replace(";", ","));
            if (BCCAdr != "") MyMsg.Bcc.Add(BCCAdr.Replace(";", ","));
            MyMsg.Subject = Subject;
            MyMsg.Body = Body;
            MyMsg.IsBodyHtml = true;
            if (attachment != null) MyMsg.Attachments.Add(attachment);


            String Mailserver = "smtp.office365.com";
            String MailUserName = "info@livetest.today";
            String MailPassword = "WebNascode@1012";
            String MailName = "Nascode CMS";


            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                                      | SecurityProtocolType.Tls11
                                      | SecurityProtocolType.Tls12;
            SmtpClient smtp = new SmtpClient(Mailserver, 587);
            smtp.EnableSsl = true;
            smtp.Credentials = new System.Net.NetworkCredential(MailUserName, MailPassword);
            smtp.Timeout = 20000;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                                      | SecurityProtocolType.Tls11
                                      | SecurityProtocolType.Tls12;

            MyMsg.From = new MailAddress(MailUserName, MailName);

            try
            {
                smtp.Send(MyMsg);
            }
            catch (Exception ex)
            {
                clsGlobals.Log(ex.Message);
                return false;
            }
            finally
            {
                MyMsg.Dispose();
                smtp = null;
            }

            return true;
        }

        public string CreateBody(System.Data.DataRow MyDataRow, string Body)
        {
            string tmp = Body;
            string FieldValue;

            for (var i = 0; i <= MyDataRow.Table.Columns.Count - 1; i++)
            {
                if (Strings.InStr(Strings.UCase(tmp), "~" + Strings.UCase(MyDataRow.Table.Columns[i].Caption) + "~") > 0)
                {
                    if (MyDataRow[i] == DBNull.Value)
                        FieldValue = "";
                    else
                        FieldValue = MyDataRow[i].ToString();

                    tmp = Strings.Replace(tmp, Strings.Mid(tmp, Strings.InStr(Strings.UCase(tmp), "~" + Strings.UCase(MyDataRow.Table.Columns[i].Caption) + "~"), Strings.Len(Strings.UCase(MyDataRow.Table.Columns[i].Caption)) + 2), FieldValue);
                }
            }

            tmp = Strings.Replace(tmp, Strings.Chr(160).ToString(), Strings.Chr(32).ToString());
            return tmp;
        }


        public Boolean sendResetPasswordEmail(DataRow data, int languageId)
        {

            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;


            // Use a parameterized query
            sql[0] = @"Select H.*, D.Body DBody from EmailsBook H left outer join EmailsBook_Text D on H.ID = D.EmailBookID And D.language = H.language where  H.code = 'PasswordReset' and H.language = " + languageId + " order by H.ID ";
           
            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;

            if (ds.Tables[0].Rows.Count > 0)
            {

                string emailbody = CreateBody(data, ds.Tables[0].Rows[0]["DBody"].ToString());
                return Send("info@nascode.com", data.Table.Rows[0]["Email"].ToString(), "","", ds.Tables[0].Rows[0]["Subject"].ToString(), emailbody);
            }

            return false;


        }
    }
}