 
using Microsoft.Extensions.Caching.Memory; 

namespace NascodeCMS.Classes
{
    public class PropertyHelper
    {
        private readonly IMemoryCache _cache;
        private string _connectionString; 

        public PropertyHelper(IConfiguration configuration, IMemoryCache memoryCache)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _cache = memoryCache;
        }
         

        public string GetProperty(string propertyName)
        { 

            string cacheKey = "PropertyValue_" + propertyName.Trim();
            string propertyValue = _cache.Get<string>(cacheKey); 
            if (propertyValue == null) //then get it from database
            { 
                var sql = "SELECT * FROM Settings WHERE Code = '" + propertyName.Trim() + "'";
                var ds = DAL.GetDataSet(_connectionString, sql);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    propertyValue = ds.Tables[0].Rows[0]["Value"].ToString();

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(30)); // Cache for 30 minutes

                    _cache.Set(cacheKey, propertyValue, cacheEntryOptions);
                }
            } 

            if (string.Equals(propertyName, "physicalattachmentlocationapi", StringComparison.OrdinalIgnoreCase))
            {
                propertyValue += (propertyValue != null && !propertyValue.EndsWith("\\")) ? "\\" : "";
            }

            return propertyValue;
        } 
    }
}