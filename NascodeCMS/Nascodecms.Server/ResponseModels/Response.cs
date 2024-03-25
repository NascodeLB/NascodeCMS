namespace NascodeCMS.ResponseModels
{
    public class Response
    {
        public Response(string msg, decimal? RecID = null)
        {
            Message = msg;
            this.RecID = RecID;
        }

        public string Message { get; set; }
        public decimal? RecID { get; set; }
    }

    public class ResponseTracking
    {
        public ResponseTracking(string msg, decimal? CountryID, decimal? CityID = null)
        {
            Message = msg;
            this.CountryID = CountryID;
            this.CityID = CityID;
        }

        public string Message { get; set; }
        public decimal? CountryID { get; set; }
        public decimal? CityID { get; set; }
    }
}