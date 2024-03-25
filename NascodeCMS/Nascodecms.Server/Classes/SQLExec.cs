 

namespace NascodeCMS.Classes
{
    using Microsoft.VisualBasic;
    using System;
    using System.Data;
    using System.Data.SqlClient;

    public enum Convert
    {
        ToString = 1,
        ToHTML = 2
    }

    public class SQLExec
    {
        public DataSet? Cursor(ref string[] SQL, ref SqlDataAdapter[] DA, ref SqlConnection CN, string CNString = "")
        {
            try
            {
                CN = new SqlConnection(CNString);
                CN.Open();
                DataSet objDataSet = new DataSet();
                DA = new SqlDataAdapter[Information.UBound(SQL) + 1];
                for (var i = 0; i <= Information.UBound(SQL); i++)
                {
                    DA[i] = new SqlDataAdapter(SQL[i], CN);
                    DA[i].Fill(objDataSet, "Cursor" + System.Convert.ToString(i));
                }
                objDataSet.AcceptChanges();

                return objDataSet;
            }
            catch (Exception)
            {
                //         Errorstring = "<b>* Error while updating original data</b>.<br />" + Objerror.Message + "<br />" + Objerror.Source;

                return null/* TODO Change to default(_) if this is not a reference type */;
            }
        }

        public DataSet? Cursor(string SQL, ref SqlDataAdapter DA, ref SqlConnection CN, string CNString = "")
        {
            // CN = new SqlConnection(IIf(CNString == "", ConfigurationManager.AppSettings("ConnectionString2"), CNString));
            try
            {
                CN = new SqlConnection(CNString);
                CN.Open();
                DA = new SqlDataAdapter(SQL, CN);
                DataSet objDataSet = new DataSet();

                DA.Fill(objDataSet, "Cursor");
                objDataSet.AcceptChanges();

                return objDataSet;
            }
            catch (Exception)
            {
                //    Errorstring = Objerror.Message + "<br />" + Objerror.Source;
                return null/* TODO Change to default(_) if this is not a reference type */;
            }
        }

        public string? commitChanges(ref SqlDataAdapter[] objDataAdapter, DataSet objDataSet, ref SqlConnection? cn)
        {
            SqlTransaction? objTransaction = null;
            byte i;
            try
            {
                for (i = 0; i <= Information.UBound(objDataAdapter); i++)
                {
                    SqlCommandBuilder objCommandBuilder = new SqlCommandBuilder(objDataAdapter[i]);
                    objDataAdapter[i].InsertCommand = objCommandBuilder.GetInsertCommand();
                    objDataAdapter[i].UpdateCommand = objCommandBuilder.GetUpdateCommand();
                    objDataAdapter[i].DeleteCommand = objCommandBuilder.GetDeleteCommand();
                }
                // start a transaction so that we can roll back the changes
                // must do this on an open Connection object
                objTransaction = cn.BeginTransaction();

                // attach the current transaction to all the Command objects
                // must be done after setting Connection property
                for (i = 0; i <= Information.UBound(objDataAdapter); i++)
                {
                    objDataAdapter[i].InsertCommand.Transaction = objTransaction;
                    objDataAdapter[i].UpdateCommand.Transaction = objTransaction;
                    objDataAdapter[i].DeleteCommand.Transaction = objTransaction;
                }
                // perform the update on the original data
                // For i = 0 To objDataSet.tables.Count - 1
                for (i = 0; i <= Information.UBound(objDataAdapter); i++)
                    objDataAdapter[i].Update(objDataSet, "Cursor" + System.Convert.ToString(i));
                objTransaction.Commit();
                cn.Close();
                cn.Dispose();
                cn = null;

                return null;
            }
            catch (Exception objError)
            {
                // rollback the transaction undoing any updates
                objTransaction.Rollback();
                // display error details
                return "<b>* Error while updating original data</b>.<br />"
                   + objError.Message + "<br />" + objError.Source;
            }
        }

        public DataSet? Cursor(string[] SQL, string CNString = "")
        {
            SqlDataAdapter[]? DA = null;
            SqlConnection? CN = null;
            CN = new SqlConnection(CNString);
            try
            {
                CN.Open();
                DataSet objDataSet = new DataSet();
                DA = new SqlDataAdapter[Information.UBound(SQL) + 1];
                for (var i = 0; i <= Information.UBound(SQL); i++)
                {
                    DA[i] = new SqlDataAdapter(SQL[i], CN);
                    DA[i].Fill(objDataSet, "Cursor" + System.Convert.ToString(i));
                }
                objDataSet.AcceptChanges();

                CN.Close();
                CN.Dispose();
                CN = null;

                return objDataSet;
            }
            catch (Exception)
            {
                //        Errorstring = "<b>* Error while updating original data</b>.<br />" + Objerror.Message + "<br />" + Objerror.Source;

                return null/* TODO Change to default(_) if this is not a reference type */;
            }
        }

        public DataSet? Cursor(string SQL, string CNString = "")
        {
            try
            {
                SqlConnection? CN = new SqlConnection(CNString);
                CN.Open();
                SqlDataAdapter da = new SqlDataAdapter(SQL, CN);
                DataSet objDataSet = new DataSet();

                da.Fill(objDataSet, "Cursor");
                objDataSet.AcceptChanges();

                CN.Close();
                CN.Dispose();
                CN = null;

                return objDataSet;
            }
            catch (Exception)
            {
                //    Errorstring = Objerror.Message + "<br />" + Objerror.Source;
                return null/* TODO Change to default(_) if this is not a reference type */;
            }
        }

        public string? Execute(string sql, string CNString = "")
        {
            SqlConnection? cn = new SqlConnection(CNString);
            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(sql, cn);
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
                cn.Close();
                cn.Dispose();
                cn = null;
                return null;
            }
            catch (Exception Objerror)
            {
                return "<b>* Error while updating original data</b>.<br />"
    + Objerror.Message + "<br />" + Objerror.Source;
            }
        }

        public string? commitChanges(ref SqlDataAdapter objDataAdapter, DataSet objDataSet, ref SqlConnection? cn)
        {
            SqlTransaction? objTransaction = null;
            try
            {
                SqlCommandBuilder objCommandBuilder = new SqlCommandBuilder(objDataAdapter);
                objDataAdapter.InsertCommand = objCommandBuilder.GetInsertCommand();
                objDataAdapter.UpdateCommand = objCommandBuilder.GetUpdateCommand();
                objDataAdapter.DeleteCommand = objCommandBuilder.GetDeleteCommand();

                // start a transaction so that we can roll back the changes
                // must do this on an open Connection object
                objTransaction = cn.BeginTransaction();

                // attach the current transaction to all the Command objects
                // must be done after setting Connection property
                objDataAdapter.InsertCommand.Transaction = objTransaction;
                objDataAdapter.UpdateCommand.Transaction = objTransaction;
                objDataAdapter.DeleteCommand.Transaction = objTransaction;

                // perform the update on the original data
                // For i = 0 To objDataSet.tables.Count - 1
                objDataAdapter.Update(objDataSet, "Cursor");
                // Next
                objTransaction.Commit();
                cn.Close();
                cn.Dispose();
                cn = null;
                return null;
            }
            catch (Exception objError)
            {
                // rollback the transaction undoing any updates
                objTransaction.Rollback();

                // display error details
                return "<b>* Error while updating original data</b>.<br />"
                   + objError.Message + "<br />" + objError.Source;
            }
        }

        public string StripHTML(string htmlString, bool ReplaceSpacewidthash)
        {
            string pattern = @"<(.|\n)*?>";
            string tmp;
            tmp = System.Text.RegularExpressions.Regex.Replace(htmlString, pattern, string.Empty);
            if (ReplaceSpacewidthash)
            {
                tmp = Strings.Replace(tmp, " ", "-"); // avoid -- in URL since it is a hack sequence
                tmp = Strings.Replace(tmp, "---", "-");
                tmp = Strings.Replace(tmp, "--", "-");
                tmp = Strings.Replace(tmp, "'", "");
            }
            return tmp;
        }
    }
}