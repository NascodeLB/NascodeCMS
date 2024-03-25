
using FcmSharp;
using FcmSharp.Requests;
using FcmSharp.Settings;
using Newtonsoft.Json;


/*
' <rules>
'notificationData: Val(dressID)
'notificationData: Val(memberID)
'notificationData: Val(versionCode) only android devices with version < notificationData will receive the msg

'notificationType: "notification"
'notificationType: "chat"
'notificationType: "order"

'android
'notificationTopic: "global"
'notificationTopic: "android"
'notificationTopic: "THD"
'notificationTopic: "Supplier"

'ios
'notificationTopic: "global"
'notificationTopic: "IOS"
'notificationTopic: "testios"
'notificationTopic: "THDIOS"
'notificationTopic: "SupplierIOS"
' </rules>
*/

namespace NascodeCMS.Classes
{
    public class Notifications
    {
        private readonly PropertyHelper _propertyHelper;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

      
        public Notifications(IConfiguration configuration, PropertyHelper propertyHelper, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _propertyHelper = propertyHelper;
            _environment = environment;
        }

        //public Boolean SendEmail(string emailbookcode, System.Data.DataRow dataRow, int language, string EmailTo = "m.sherri@nascode.com") //info@clubr.com
        //{
        //    string sqlDataSource = _configuration.GetConnectionString("ClubrAppCon");
        //    var sql = " select  EB.*, STUFF((select EBT.Body from EmailsBook_Text EBT where EBT.EmailBookID = EB.ID ";
        //    sql += " And EBT.Language = EB.Language order by EBT.ID  FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 0, '') ";
        //    sql += " Body from EmailsBook EB where EB.code = '" + emailbookcode + "' and EB.language = " + language + " order by EB.ID ";

        //    var ds = DAL.GetDataSet(sqlDataSource, sql);

        //    Boolean resultsuccess = false;
        //    if (ds.Tables[0].Rows.Count > 0)
        //    {
        //        var fromEmail = _propertyHelper.GetProperty("AdminEmail") ?? "info@clubr.com";
        //        MySmtp Message = new MySmtp();
        //        resultsuccess = Message.Send(dataRow, fromEmail, EmailTo, "", "", ds.Tables[0].Rows[0]["Subject"].ToString(), ds.Tables[0].Rows[0]["Body"].ToString());
        //    }

        //    return resultsuccess;
        //}

        //public Boolean SendMobileNotification(MembersNotification notification)
        //{
        //    //RollDice Match Success, Table Ownership Request, Invitation to Club, Invitation to Table, Request to Join Table, Request to Join a Club, on approval accepted user will be automatic redirected to the waiting list

        //    string sqlDataSource = _configuration.GetConnectionString("ClubrAppCon");
        //    SQLExec tb = new SQLExec();
        //    string[] sql = new string[1];
        //    DataSet ds;
        //    DataRow dr;
        //    SqlConnection CN = null;
        //    SqlDataAdapter[] da = null;
        //    sql[0] = " select top 1 * from Members_Notifications where FromMemberID = " + notification.FromMemberID + " order by id desc ";
        //    ds = tb.Cursor(ref sql, ref da, ref CN, sqlDataSource);

        //    Decimal newID = 1;
        //    if (ds.Tables[0].Rows.Count > 0)
        //    {
        //        newID = (Decimal)ds.Tables[0].Rows[0]["ID"] + 1;
        //    }

        //    dr = ds.Tables[0].NewRow();
        //    dr["ID"] = newID;
        //    dr["FromMemberID"] = notification.FromMemberID;
        //    dr["ToMemberID"] = notification.ToMemberID;
        //    if (notification.Category != null) dr["Category"] = notification.Category;
        //    if (notification.RecType != null) dr["RecType"] = notification.RecType;
        //    if (notification.RecID != null) dr["RecID"] = notification.RecID;
        //    if (notification.AccessCodeID != null) dr["AccessCodeID"] = notification.AccessCodeID;
        //    dr["Seen"] = 0;
        //    if (notification.Accepted != null) dr["Accepted"] = notification.Accepted;
        //    if (notification.Rejected != null) dr["Rejected"] = notification.Rejected;
        //    dr["Date"] = DateTime.Now;
        //    dr["Deleted"] = 0; 
        //    ds.Tables[0].Rows.Add(dr);

        //    var tmp = tb.commitChanges(ref da, ds, ref CN);
        //    if (tmp == null)
        //    {
        //        return true;
        //    }
        //    return false;
        //}
 
 
        public string SendAndroid(string notificationTitle, string notificationBody, string notificationTopic, string notificationType, object notificationData)
        {
            if (Converters.toInt(_propertyHelper.GetProperty("EnablePushNotification")) == 1)
            {
                var physicalAttachmentLocation = _propertyHelper.GetProperty("physicalattachmentlocationapi");
                var settings = FileBasedFcmClientSettings.CreateFromFile(physicalAttachmentLocation + @"DynamicFiles\Settings\clubr-metaverse-firebase-adminsdk-w3ec9-d7d872e7f2.json");

                using (var client = new FcmClient(settings))
                {
                    var notification = new Notification();
                    notification.Title = notificationTitle;
                    notification.Body = notificationBody;

                    var data = new Dictionary<string, string>()
            {
                { "NotificationType", notificationType },
                { "NotificationBody", notificationBody },
                { "NotificationTitle", notificationTitle },
                { "NotificationData", JsonConvert.SerializeObject(notificationData) }
            };

                    var message = new FcmMessage()
                    {
                        ValidateOnly = false,
                        Message = new Message()
                        {
                            Topic = notificationTopic,
                            Data = data
                        }
                    };

                    var returnedString = "";
                    var cts = new CancellationTokenSource();
                    try
                    {
                        var result = client.SendAsync(message, cts.Token).GetAwaiter().GetResult();
                        returnedString = "success"; // = result.Name
                    }
                    catch (Exception)
                    {
                        returnedString = "failed";
                    }

                    return returnedString;
                }
            }
            else
            {
                return "success";
            }
        }
    
        public string SendIOSNotification<T>(string notificationTitle, string notificationBody, string notificationTopic, string notificationType, T notificationData)
        {
            if (Converters.toInt(_propertyHelper.GetProperty("EnablePushNotification")) == 1)
            {
                //if (_environment.IsDevelopment())
                //{
                //    notificationTopic = "Clubr_Debug1_IOS";
                //}
                var physicalAttachmentLocation = _propertyHelper.GetProperty("physicalattachmentlocationapi");
                // IOS NEW PUSH
                var settings = FileBasedFcmClientSettings.CreateFromFile(physicalAttachmentLocation + @"DynamicFiles\Settings\clubr-metaverse-firebase-adminsdk-w3ec9-d7d872e7f2.json");

                using (var client = new FcmClient(settings))
                {
                    var notification = new Notification();
                    notification.Title = notificationTitle;
                    notification.Body = notificationBody;

                    var customData = new Dictionary<string, string>();
                    customData.Add("NotificationData", JsonConvert.SerializeObject(notificationData));
                    customData.Add("NotificationType", notificationType);

                    var pushMessage = new FcmMessage()
                    {
                        ValidateOnly = false,
                        Message = new Message()
                        {
                            Topic = notificationTopic,
                            Data = customData,
                            ApnsConfig = new ApnsConfig()
                            {
                                Headers = new Dictionary<string, string>()
                        {
                            {
                                "apns-priority",
                                "10"
                            }
                        },
                                Payload = new ApnsConfigPayload()
                                {
                                    Aps = new Aps()
                                    {
                                        Alert = new ApsAlert()
                                        {
                                            Title = notificationTitle,
                                            Body = notificationBody
                                        },
                                        Sound = "default",
                                        Badge = 1,
                                        MutableContent = true,
                                        ContentAvailable = true
                                    }
                                }
                            }
                        }
                    };

                    var returnedString = "";
                    var cts = new CancellationTokenSource();
                    try
                    {
                        var result = client.SendAsync(pushMessage, cts.Token).GetAwaiter().GetResult();
                        returnedString = "success"; // = result.Name
                    }
                    catch (Exception)
                    {
                        returnedString = "failed";
                    }

                    return returnedString;
                }
            }
            else
            {
                return "success";
            }
        }
    }
}