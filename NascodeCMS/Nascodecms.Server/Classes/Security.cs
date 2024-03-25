namespace NascodeCMS.Classes
{
    using Microsoft.VisualBasic;
    using Microsoft.VisualBasic.CompilerServices;
    using System;
    using System.IO;
    using System.Security.Cryptography;
    using System.Text;

    public enum TPOperations
    {
        Add = 1,
        Edit = 2,
        Delete = 3,
        View = 4,
        Print = 5,
        Authorize = 6,
        Attach = 7
    }

    public class Security
    {
        public string EncryptPassword(string Password)
        {
            // Encrypt the Password
            string sEncryptedPassword = "";
            string sEncryptKey = "N@SC0DEWhites"; // Should be minimum 8 characters

            try
            {
                sEncryptedPassword = EncryptDecryptClass.EncryptPasswordMD5(Password, sEncryptKey);
            }
            catch (Exception ex)
            {
                clsGlobals.Log(ex.Message);
                return sEncryptedPassword;
            }

            return sEncryptedPassword;
        }

        public string HashPassword(string StrPassword)
        {
            string StrHash = "";
            var hash = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] arr, arrHashed;
            arr = Encoding.UTF8.GetBytes(StrPassword);
            arrHashed = hash.ComputeHash(arr);
            foreach (var b in arrHashed)
                StrHash += b.ToString("x2");
            return StrHash;
        }

        public string DecryptPassword(string Password)
        {
            // Encrypt the Password
            string sDecryptedPassword = "";
            string sEncryptKey = "N@SC0DEWhites"; // Should be minimum 8 characters

            try
            {
                sDecryptedPassword = EncryptDecryptClass.DecryptPasswordMD5(Password, sEncryptKey);
            }
            catch (Exception ex)
            {
                clsGlobals.Log(ex.Message);
                return sDecryptedPassword;
            }
            return sDecryptedPassword;
        }

        //AES256 CBC-------------------------------------------------
        public string DecryptAESCBC256(string encrypted, string mykey = "", string myiv = "")
        {
            var key = mykey;
            var iv = myiv;
            if (mykey == "")
            {
                key = "MVAB&2HB7UJM(HK<5TNB&YOZ6UTM(IW<";
            }
            if (myiv == "")
            {
                iv = "!QARTWSJ#ED5JRMZ";
            }

            try
            {
                byte[] cipherText = System.Convert.FromBase64String(encrypted.Replace(" ", "+")); // + become space when converting to Base64
                if (cipherText is null || cipherText.Length <= 0)
                {
                    throw new ArgumentNullException("cipherText");
                }

                if (key is null || key.Length <= 0)
                {
                    throw new ArgumentNullException("key");
                }
                string plaintext;
                using (var rijAlg = new RijndaelManaged())
                {
                    rijAlg.BlockSize = 128;
                    rijAlg.KeySize = 256;
                    rijAlg.Key = Encoding.UTF8.GetBytes(key);
                    rijAlg.Mode = CipherMode.CBC;
                    rijAlg.Padding = PaddingMode.PKCS7;
                    rijAlg.IV = Encoding.UTF8.GetBytes(iv);
                    ICryptoTransform decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);
                    using (var msDecrypt = new MemoryStream(cipherText))
                    {
                        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (var srDecrypt = new StreamReader(csDecrypt))
                            {
                                plaintext = srDecrypt.ReadToEnd();
                            }
                        }
                    }
                }
                return plaintext.Replace(Constants.vbNullChar, string.Empty);
            }
            catch (Exception ex)
            {
                return encrypted;
            }
        }
      
            public string EncryptAESCBC256(string pass, string mykey = "", string myiv = "")
        {
            var key = mykey;
            var iv = myiv;
            if (mykey == "")
            {
                key = "MVAB&2HB7UJM(HK<5TNB&YOZ6UTM(IW<";
            }
            if (myiv == "")
            {
                iv = "!QARTWSJ#ED5JRMZ";
            }

            var AES = new System.Security.Cryptography.RijndaelManaged();
            var SHA256 = System.Security.Cryptography.SHA256.Create();
            string ciphertext = "";
            try
            {
                AES.BlockSize = 128;
                AES.KeySize = 256;
                AES.Key = Encoding.UTF8.GetBytes(key);
                AES.Mode = (System.Security.Cryptography.CipherMode)Conversions.ToInteger(CipherMode.CBC);
                AES.Padding = (System.Security.Cryptography.PaddingMode)Conversions.ToInteger(PaddingMode.PKCS7);
                AES.IV = Encoding.UTF8.GetBytes(iv);
                var DESEncrypter = AES.CreateEncryptor();
                byte[] Buffer = Encoding.ASCII.GetBytes(pass);
                ciphertext = System.Convert.ToBase64String(DESEncrypter.TransformFinalBlock(Buffer, 0, Buffer.Length));

                // Dim enc = System.Convert.ToBase64String(AES.IV) & System.Convert.ToBase64String(DESEncrypter.TransformFinalBlock(Buffer, 0, Buffer.Length))
                string enc = System.Convert.ToBase64String(DESEncrypter.TransformFinalBlock(Buffer, 0, Buffer.Length));
                return enc;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        //--------------------------------------------
    }
}