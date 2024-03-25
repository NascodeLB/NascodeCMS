using System;

namespace NascodeCMS.Filter
{
    public class MobileInfo
    {
        public int ID { get; set; }
        public int Language { get; set; }
        public string SearchText { get; set; }
        public int PageSize { get; set; }
        public string UserDate { get; set; }
        public int After { get; set; }
        public string SortBy { get; set; }
        public string Filter { get; set; }
        public Boolean OnlyActive { get; set; }
        public Boolean NotDeleted { get; set; }
        public Boolean ShowOnRegistration { get; set; }
        public decimal Version { get; set; }
        public string NotIn { get; set; }

        public double? Lat { get; set; }
        public double? Lon { get; set; }
        public MobileInfo()
        { 
            this.ID = 0;
            this.Language = 1;
            this.SearchText = "";
            this.SortBy = "";
            this.Filter = "";
            this.After = 0;
            this.PageSize = 0;
            this.Version = 0;
            this.UserDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            this.OnlyActive = false;
            this.NotDeleted = false;
            this.ShowOnRegistration = false;
            this.NotIn = "";
            this.Lat = 0.0;
            this.Lon = 0.0;
        }
    }

    public class ClubFilter
    {
        public int Language { get; set; }
        public string SearchText { get; set; }
        public string ClubType { get; set; }
        public int BudgetFrom { get; set; }
        public int BudgetTo { get; set; }
        public string MusicType { get; set; }
        public decimal Version { get; set; }
        public string UserDate { get; set; }
        public string SortBy { get; set; }
        public int PageSize { get; set; }
        public int After { get; set; }
        public string NotIN { get; set; }

        public ClubFilter()
        {
            //  Thread.CurrentThread.CurrentCulture = new CultureInfo("en-US"); // Set to a culture that uses MM/dd/yyyy format
            this.Language = 1;
            this.BudgetFrom = 0;
            this.BudgetTo = 0;
            this.ClubType = "";
            this.MusicType = "";
            this.SearchText = "";
            this.SortBy = "Title"; // Number of users, Budget
            this.UserDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"); //DateTime.ParseExact(DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss"), "MM/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            this.Version = 0;
            this.After = 0;
            this.PageSize = 0;
            this.NotIN = "";
        }
    }

    public class TablesFilter
    {
        public int Language { get; set; }
        public string SearchText { get; set; }
        public string SortBy { get; set; }
        public int PageSize { get; set; }
        public int After { get; set; }
        public string NotIN { get; set; }
        public string UserDate { get; set; }
        public int MinimumRatingRequired { get; set; } //Filter
        public int MinimumAgeRequired { get; set; } //Filter
        public int isVIP { get; set; } //Filter
        public int isRegular { get; set; } //Filter
        public int isSixMembers { get; set; } //Filter
        public int isTwelveMembers { get; set; } //Filter
        public int allowGirlsFreeAccess { get; set; } //Filter

        public TablesFilter()
        {
            this.Language = 1;
            this.SearchText = "";
            this.MinimumRatingRequired = 0;
            this.SearchText = "";
            this.SortBy = "Title"; // a-z, creationDate
            this.UserDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            this.After = 0;
            this.PageSize = 0;
            this.NotIN = "";
            this.isVIP = 0;
            this.isRegular = 0;
            this.isSixMembers = 0;
            this.isTwelveMembers = 0;
            this.allowGirlsFreeAccess = 0;
        }
    }

    public class UserFilter
    {
        public string SearchText { get; set; }
        public string SortBy { get; set; }
        public int PageSize { get; set; }
        public int After { get; set; }
        public int Language { get; set; }
        public string NotIN { get; set; }
        public string UserDate { get; set; }
        public int MinimumRatingRequired { get; set; } //Filter by
        public int MinimumAgeRequired { get; set; } //Filter by
        public int isVIP { get; set; } //Filter by
        public int isRegular { get; set; } //Filter by
        public int isWalkin { get; set; } //Filter by
        public int isMatch { get; set; } //Filter by
        public int isNonmatch { get; set; } //Filter by

        public double? Lat { get; set; }
        public double? Lon { get; set; }
        public UserFilter()
        {
            this.SearchText = "";
            this.MinimumRatingRequired = 0;
            this.MinimumAgeRequired = 0;
            this.SearchText = "";
            this.SortBy = "Title"; // Number of users, Budget
            this.UserDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            this.After = 0;
            this.Language = 1;
            this.PageSize = 0;
            this.NotIN = "";
            this.isVIP = 0;
            this.isRegular = 0;
            this.isWalkin = 0;
            this.isMatch = 0;
            this.isNonmatch = 0;
            this.Lat = 0.0;
            this.Lon = 0.0;
        }
    }


    public class PlacesFilter
    {
        public int ID { get; set; }
        public int Language { get; set; }
        public string SearchText { get; set; }
        public int PageSize { get; set; }
        public string UserDate { get; set; }
        public int After { get; set; }
        public string SortBy { get; set; }
        public Boolean OnlyActive { get; set; }
        public Boolean NotDeleted { get; set; }
        public decimal Version { get; set; }
        public string NotIn { get; set; }
        public string MapLat { get; set; }
        public string MapLong { get; set; }
        public string GPSLat { get; set; }
        public string GPSLong { get; set; }

        public PlacesFilter()
        {
            this.ID = 0;
            this.Language = 1;
            this.SearchText = "";
            this.SortBy = "";
            this.After = 0;
            this.PageSize = 0;
            this.Version = 0;
            this.UserDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            this.OnlyActive = false;
            this.NotDeleted = false;
            this.NotIn = "";
            this.MapLat = "0";
            this.MapLong = "0";
            this.GPSLat = "0";
            this.GPSLong = "0";
        }
    }

}