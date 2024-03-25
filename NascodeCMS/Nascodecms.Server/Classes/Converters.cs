namespace NascodeCMS.Classes
{
    public static class Converters
    {
        public static int toInt(string value)
        {
            int result = 0;
            int.TryParse(value, out result);
            return result;
        }
    }
}