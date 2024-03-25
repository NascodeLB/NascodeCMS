using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;

namespace NascodeCMS.Classes
{
    public static class DAL
    {
        // function that creates a list of an object from the given data table
        public static List<T> CreateListFromTable<T>(DataTable tbl) where T : new()
        {

            // define return list
            List<T> lst = new List<T>();
            try
            { 
                // go through each row
                foreach (DataRow r in tbl.Rows)
                {
                    // add to the list
                    lst.Add(CreateItemFromRow<T>(r));
                }
            }
            catch (Exception ex)
            {
                var a = ex;
            }
            // return the list
            return lst;
        }

        // function that creates an object from the given data row
        public static T CreateItemFromRow<T>(DataRow row) where T : new()
        {
            // create a new object
            T item = new T();

            // set the item
            SetItemFromRow(item, row);

            // return
            return item;
        }

        public static void SetItemFromRow<T>(T item, DataRow row) where T : new()
        {
            // go through each column
            foreach (DataColumn c in row.Table.Columns)
            {
                // find the property for the column
                PropertyInfo p = item.GetType().GetProperty(c.ColumnName);

                // if exists, set the value
                if (p != null && row[c] != DBNull.Value)
                {
                    p.SetValue(item, row[c], null);
                }
            }
        }

        public static DataSet GetDataSet(string connectionStr, string sql)
        {
            DataSet ds = new DataSet();
            SQLExec tb = new SQLExec();
            ds = tb.Cursor(sql, connectionStr);
            return ds;
        }

        /*
          DataSet ds = DAL.GetDataSet("ProcedureName");
         List<YourViewModel> model = new List<YourViewModel>();
        if (ds != null)
         {
        //Pass datatable from dataset to our DAL Method.
         model = DAL.CreateListFromTable<YourViewModel>(ds.Tables[0]);
        }
       */

        //reverse
        public static DataRow UpdateDataRow(object from, DataRow dr)
        {
            foreach (PropertyInfo property in from.GetType().GetProperties())
            {
                dr[property.Name] = property.GetValue(from);
            }
            return dr;
        }

        public static DataRow UpdateDataRow(object from, DataRow dr, string[] columnsToUpdate)
        {
            foreach (PropertyInfo property in from.GetType().GetProperties())
            {
                if (columnsToUpdate.Contains(property.Name))
                {
                    if (property.GetValue(from) != null)
                    {
                        dr[property.Name] = property.GetValue(from);
                    }
                }
            }
            return dr;
        }

        public static DataRow ToDataRow(object from, DataTable dt)
        {
            DataRow dr = dt.NewRow();

            foreach (PropertyInfo property in from.GetType().GetProperties())
            {
                dr[property.Name] = property.GetValue(from);
            }

            return dr;
        }
    }
}