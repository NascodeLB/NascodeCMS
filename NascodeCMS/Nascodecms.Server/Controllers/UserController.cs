using Microsoft.AspNetCore.Mvc;
using NascodeCMS.Classes;
using System.Data;
using System.Data.SqlClient;
using NascodeCMS.Server.Models;
using System.Security.Cryptography;
using System.Text;
using NascodeCMS.Auth;
using System.Text.RegularExpressions;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NuGet.Common;
using Microsoft.AspNetCore.Identity;
using NascodeCMS.Filter;
using NascodeCMS.ResponseModels;
using NascodeCMS.Server.Services;
using NascodeERP.Server.Models;
namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        //private readonly ILogger _logger;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;
        
        public UserController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, ILogger<UserController> logger, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            //_logger = logger;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] UserCredentials userCredentials)
        {
            IActionResult response = Unauthorized();
            Security Sec = new Security();
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            DataRow dr;

            // Use a parameterized query
            sql[0] = @"SELECT * FROM Cufex_Users WHERE isNull(Deleted, 0) = 0 AND UserId = '" + userCredentials.username + "'";

            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;

            if (ds.Tables[0].Rows.Count > 0)
            {
                var storedHash = ds.Tables[0].Rows[0]["password"].ToString();

                dr = ds.Tables[0].Rows[0];
                var MemberDetails = DAL.CreateItemFromRow<CufexUser>(dr);
                if (ComputeSha256Hash(userCredentials.Password ?? "") == storedHash)
                {
                    string jwtKey = _configuration["Jwt:Key"] ?? "";
                    string jwtRefKey = _configuration["Jwt:RefreshKey"] ?? "";
                    string jwtIssuer = _configuration["Jwt:Issuer"] ?? "";
                    var accessToken = "";
                    var refreshToken = "";
                    if (jwtKey != null && jwtIssuer != null)
                    {
                        accessToken = _tokenService.BuildToken(jwtKey, jwtIssuer, MemberDetails);
                        refreshToken = _tokenService.BuildRefreshToken(jwtRefKey, jwtIssuer, MemberDetails);

                        dr["RefreshToken"] = refreshToken;
                        dr["RefreshTokenExpiryTime"] = DateTime.UtcNow.AddDays(100);
                        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                        {

                            Expires = DateTime.UtcNow.AddDays(100),
                        });
                    }

                    var tmp = tb.commitChanges(ref da, ds, ref CN);
                    if (accessToken != null && tmp == null)
                    {
                        var Token = new TokenModel(accessToken, refreshToken);
                        var Member = new LoginMember(MemberDetails, Token);
                        
                        _auditLogger.Add(MemberDetails.ID.ToString(), "Users", MemberDetails.ID.ToString(), "Login [Successful]", "Login successfully to the Cufex for username ["+ MemberDetails.UserID.ToString() + "]");
                        return new JsonResult(Member);
                    }
                    else
                    {
                        return BadRequest("Could not generate a new token");
                    }
                }
            }
            return BadRequest("Invalid Username or Password!");
        }

        [HttpPost("ResetCode")]
        public IActionResult ResetCode([FromBody] UserResetPassword userResetPassword)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;


            // Use a parameterized query
            sql[0] = @"SELECT * FROM Cufex_Users WHERE isNull(Deleted, 0) = 0 AND Email = '" + userResetPassword.Email + "'";


            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;

            if (ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr;
                dr = ds.Tables[0].Rows[0];
                RandomKeyGenerator st2 = new RandomKeyGenerator();
                string str1 = st2.Generate("", "1234567890", 6);
                dr["ResetCode"] = str1;
                dr["ResetCodeExpiryDate"] = DateTime.UtcNow.AddMinutes(7);
                userResetPassword.ResetCode = str1;
                var tmp = tb.commitChanges(ref da, ds, ref CN);
                if (tmp == null)
                {

                    MySmtp mySmtp = new MySmtp(_connectionString);
                    Boolean x = mySmtp.sendResetPasswordEmail(dr, 1);

                    return new JsonResult(x);
                }
                else
                {
                    return BadRequest("Could not generate a new Code");
                }

            }
            return BadRequest("Invalid Username or Email!");
        }

        [HttpPost("ResetPassword")]
        public Task<IActionResult> ResetPassword(UserResetPassword userResetPassword)
        {

            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            Regex Passregex = new Regex(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$");
            Match match = regex.Match(userResetPassword.Email ?? "");
            Match PassMatch = Passregex.Match(userResetPassword.Password ?? "");
            sql[0] = @"SELECT * FROM Cufex_Users WHERE isNull(Deleted, 0) = 0 AND Email = '" + userResetPassword.Email + "'";

            DataRow dr;
            if (!PassMatch.Success)
            {
                return Task.FromResult<IActionResult>(BadRequest("Password must contain the following: numbers, lowercase, uppercase and special characters."));
            }
            if (!match.Success)
            {
                return Task.FromResult<IActionResult>(BadRequest("InValid Email"));

            }
            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var user = DAL.CreateItemFromRow<CufexUser>(ds.Tables[0].Rows[0]);
            if (user.Equals != null)
            {
                if (user.ResetCodeExpiryDate < DateTime.UtcNow)
                {
                    return Task.FromResult<IActionResult>(BadRequest("Verification Key Expired."));
                }
                else
                {
                    if (userResetPassword.Password != "" && userResetPassword.Password != null)
                    {
                        dr = ds.Tables[0].Rows[0];
                        dr["Password"] = ComputeSha256Hash(userResetPassword.Password);
                        var tmp = tb.commitChanges(ref da, ds, ref CN);
                        if (tmp == null)
                        {
                            _auditLogger.Add(user.UserID.ToString(), "Users", user.ID.ToString(), "Reset Password [Successful]", "Reset Password to the Cufex for username [" + user.UserID.ToString() + "]");

                            return Task.FromResult<IActionResult>(Ok(user));
                        }
                        else
                        {
                            return Task.FromResult<IActionResult>(BadRequest("Somthing went wrong please try again later"));
                        }
                    }
                    else { return Task.FromResult<IActionResult>(BadRequest("The verification key is incorrect.")); }
                }

            }
            else
            {
                return Task.FromResult<IActionResult>(NotFound("User does not Exist"));
            }
        }

        [HttpGet("ResendVerifyKey")]
        public IActionResult ResendVerifyKey([FromBody] UserResetPassword userResetPassword)
        {

            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            DataRow dr;
            Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            Match match = regex.Match(userResetPassword.Email ?? "");
            sql[0] = @"SELECT * FROM Cufex_Users WHERE isNull(Deleted, 0) = 0 AND Email = '" + userResetPassword.Email + "'";


            if (!match.Success)
            {
                return BadRequest("Invalid Email");
            }
            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var user = DAL.CreateItemFromRow<CufexUser>(ds.Tables[0].Rows[0]);

            if (user == null)
            {
                return BadRequest("User not found.");
            }
            else
            {
                RandomKeyGenerator st2 = new RandomKeyGenerator();
                string str1 = st2.Generate("", "1234567890", 6);
                dr = ds.Tables[0].Rows[0];
                dr["ResetCode"] = str1;
                dr["ResetCodeExpiryDate"] = DateTime.UtcNow.AddMinutes(7);
                var tmp = tb.commitChanges(ref da, ds, ref CN);
                if (tmp == null)
                {
                    return Ok(userResetPassword);
                }
                else
                {
                    return BadRequest("Error,please try again.");
                }
            }
        }

        [HttpPost("CheckVerificationCode")]
        public IActionResult CheckVerificationCode([FromBody] UserResetPassword userResetPassword)
        {

            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            DataRow dr;
            Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            Match match = regex.Match(userResetPassword.Email ?? "");
            sql[0] = @"SELECT * FROM Cufex_Users WHERE isNull(Deleted, 0) = 0 AND Email = '" + userResetPassword.Email + "'";


            //if (!match.Success)
            //{
            //    return BadRequest("Invalid Email");
            //}
            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var user = DAL.CreateItemFromRow<CufexUser>(ds.Tables[0].Rows[0]);

            if (user == null)
            {
                return BadRequest("User not found.");
            }
            else
            {
                if (DateTime.UtcNow > user.ResetCodeExpiryDate)
                {
                    return BadRequest("Varification code expired.");
                }
                if (user.ResetCode != userResetPassword.ResetCode)
                {
                    return BadRequest("The verification key is incorrect.");
                }
                else
                {
                    return Ok();
                }
            }
        }

        [HttpPost("Refresh-Token")]
        public IActionResult RefreshToken()
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            string accessToken = "";
            string refreshToken = "";
            string RequestRefreshToken = "";
            string jwtKey = _configuration["Jwt:Key"] ?? "";
            string jwtRefKey = _configuration["Jwt:RefreshKey"] ?? "";
            string jwtIssuer = _configuration["Jwt:Issuer"] ?? "";
            if (HttpContext.Request.Cookies.TryGetValue("refreshToken", out RequestRefreshToken))
            {
                refreshToken = RequestRefreshToken;
                string memberIdHeader = _tokenService.GetMemberIdFromRefreshToken(RequestRefreshToken, jwtRefKey);
                sql[0] = " select top 1 * from cufex_users where ID = '" + memberIdHeader + "' "; // and Password = '" + Sec.EncryptPassword((decryptedPass)) + "'";
                ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
                if (ds == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
                }

                var user = DAL.CreateItemFromRow<CufexUser>(ds.Tables[0].Rows[0]);

                if (user == null)
                {
                    return new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
                }

                if ((string)ds.Tables[0].Rows[0]["RefreshToken"] != refreshToken)
                {
                    return new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
                }



                if ((DateTime)ds.Tables[0].Rows[0]["RefreshTokenExpiryTime"] <= DateTime.UtcNow)
                {

                    return new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
                }

                accessToken = _tokenService.BuildToken(jwtKey, jwtIssuer,
                  user);

                refreshToken = _tokenService.BuildRefreshToken(jwtRefKey, jwtIssuer, user);

                ds.Tables[0].Rows[0]["RefreshToken"] = refreshToken;
                ds.Tables[0].Rows[0]["RefreshTokenExpiryTime"] = DateTime.UtcNow.AddDays(100);
                var tmp = tb.commitChanges(ref da, ds, ref CN);

                if (accessToken != null && tmp == null)
                {
                    Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                    {
                        Expires = DateTime.UtcNow.AddDays(100),
                        SameSite = SameSiteMode.None,
                        Secure = true
                    });
                    var Token = new TokenModel(accessToken, refreshToken);
                    return new JsonResult(Token);
                }
                return BadRequest("Invalid access token or refresh token");
            }
            else
            {
                return BadRequest("Invalid access token or refresh token");
            }


        }

        [HttpGet("GetUserTimeZone")]
        public IActionResult GetUserTimeZone()
        {

            string sql = "";
            DataSet ds;
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            sql = @"select UTCOffset from Timezones where ID in (select TimezoneID from Cufex_Users where ID = " + memberIdHeader + ")";

            ds = tb.Cursor(sql, sqlDataSource)!;
            if (ds.Tables[0].Rows.Count == 0)
            {
                return BadRequest("Error,please try again.");
            }
            else
            {
                return new JsonResult(new
                {
                    UTCOffest = ds.Tables[0].Rows[0]["UTCOffset"]
                });
            }

        }

        public static string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256 instance
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }



        [HttpPost("SubmitUser")]
        public IActionResult SubmitUser(CufexUser user)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;

            if (user.ID > 0)
            {
                sql[0] = "Select * from Cufex_Users where id = " + user.ID;

            }
            else
            {
                sql[0] = "Select top 1 * from Cufex_Users order by id desc ";
            }


            ds = tb.Cursor(ref sql, ref da!, ref CN!, sqlDataSource)!;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            Decimal NewID = 1;
            string OperationType = "";
            if (user.ID > 0)
            {
                NewID = user.ID;

                if (ds.Tables[0].Rows.Count > 0)
                {
                    dr = ds.Tables[0].Rows[0];
                    OperationType = "edit";
                }
                else
                {
                    dr = ds.Tables[0].NewRow();
                    OperationType = "new";
                }

            }
            else
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    NewID = (decimal)ds.Tables[0].Rows[0]["ID"] + 1;
                }

                dr = ds.Tables[0].NewRow();
                OperationType = "new";
            }


            dr["ID"] = NewID;
            dr["GroupId"] = user.GroupID;
            dr["Fullname"] = user.FullName;
            dr["UserId"] = user.UserID;
            dr["active"] = user.Active;
            dr["mobile"] = user.Mobile;
            dr["email"] = user.Email;
            //dr["TimezoneID"] = user.TimezoneID;
            dr["Deleted"] = 0;

            if (user.Password != "")
            {
                dr["Password"] = ComputeSha256Hash(user.Password ?? "");
            }
            if (OperationType == "edit")
            {
                dr["ModifiedBy"] = memberIdHeader;
                dr["ModificationDate"] = DateTime.UtcNow;
                _auditLogger.Add(memberIdHeader, "Users", NewID.ToString(), "EditOpr", "Edit record");

            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                ds.Tables[0].Rows.Add(dr);
                _auditLogger.Add(memberIdHeader, "Users", NewID.ToString(), "AddOpr", "Create new record");

            }

            var tmp = tb.commitChanges(ref da, ds, ref CN);
            decimal ID;
            if (tmp == null)
            {
                return new JsonResult(ID = NewID);
            }
            else
            {
                return BadRequest("Could not create user");
            }
        }


        [HttpPost("Deleteuser/{id}")]

        public IActionResult DeleteBank(int id)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string[] sql = new string[1];

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (id > 0)
            {

                var tmp = tb.Execute("update Cufex_Users set  Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + " where ID = " + id, sqlDataSource);

                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Users", id.ToString(), "DeleteOpr", "Delete record");
                    return new JsonResult(new Response("success"));
                }
                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("user Not Found");
            }
        }

        [HttpPost("DeleteManyUsers")]
        public IActionResult DeleteManyUsers([FromBody] int[] UsersIds)
        {
            string sqlDataSource = _connectionString;
            string sql;
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec();
            DataSet? ds;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int userid in UsersIds)
            {
                var tmp = tb.Execute("update Cufex_Users set Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + "  where ID = " + userid, sqlDataSource);
                if (tmp == null)
                {
                    _auditLogger.Add(memberIdHeader, "Users", userid.ToString(), "DeleteOpr", "Delete record");
                    deletedCount++;
                }
            }

            return new JsonResult(new
            {
                DeletedCount = deletedCount,
                UndeletedCount = undeletedTitles.Count,
                UndeletedTitles = undeletedTitles
            });
        }

        [HttpGet("GetUser/{id}")]

        public IActionResult GetUserByID(int id)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (id > 0)
            {
                sql = "select U.* ";
                sql += " ,(select FullName from Cufex_Users where id = U.ModifiedBy) ModifiedByName ";
                sql += " ,(select FullName from Cufex_Users where id = U.CreatedBy) CreatedByName ";
                sql += " from Cufex_Users U where isnull(Deleted,0) = 0 and  U.id = " + id;

            }
            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
                _auditLogger.Add(memberIdHeader, "Users", id.ToString(), "ViewOpr", "View record");

                var user = DAL.CreateItemFromRow<CufexUser>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(user));
            }
            else
            { return NotFound("User does not Exist"); }


        }

        [HttpGet("GetLoggedUser")]

        public IActionResult GetLoggedUser()
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            sql = "select U.* ";
            sql += ", (select name from Cufex_UsersGroups where Id = u.groupid) groupName ";
            sql += " ,(select FullName from Cufex_Users where id = U.ModifiedBy) ModifiedByName ";
            sql += " ,(select FullName from Cufex_Users where id = U.CreatedBy) CreatedByName ";
            sql += " from Cufex_Users U where isnull(Deleted,0) = 0 and  U.id = " + memberIdHeader;


            ds = DAL.GetDataSet(sqlDataSource, sql);

            if (ds.Tables[0].Rows.Count > 0)
            {
                var user = DAL.CreateItemFromRow<CufexUser>(ds.Tables[0].Rows[0]);
                return new JsonResult(Ok(user));
            }
            else
            { return NotFound("User does not Exist"); }


        }

        [HttpGet("AllUsers")]
        public IActionResult GetAllUsers([FromQuery] PaginationFilter input)
        {
            var MySortBy = "";
            var WhereCondidtion = "";


            if (input.Sorting != "")
            {
                MySortBy = " order by " + input.Sorting.ToLower();
            }
            else
            {
                MySortBy = " order by id desc";
            }
            WhereCondidtion += " from Cufex_Users CU where isNull(Deleted , 0) = 0 ";
            WhereCondidtion += "  and ((Fullname like N'%" + (input.SearchText ?? "") + "%') or (UserId like N'%" + (input.SearchText ?? "") + "%') ";
            WhereCondidtion += " ) ";

            string sqlDataSource = _connectionString;

            var sql = " set dateformat dmy ";
            sql += "select CU.*, ";
            sql += "(select name from Cufex_UsersGroups where Id = cu.groupid) groupName, ";
            sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(CU.ModifiedBy,CU.CreatedBy)) ModifiedByName, ";
            sql += "isnull(CU.ModificationDate,CU.CreationDate) LastModificationDate ";
            sql += WhereCondidtion;
            sql += MySortBy.Trim(); ;
            sql += input.PageSize > 0 ? (" OFFSET " + input.After + " ROWS FETCH NEXT " + input.PageSize + " ROWS ONLY ") : "";

            sql += "select count (*)  as TotalCount " + WhereCondidtion;
            var ds = DAL.GetDataSet(sqlDataSource, sql);
            var TotalCount = System.Convert.ToInt32(ds.Tables[1].Rows[0]["TotalCount"].ToString());
            int[] pageNumbers = clsGlobals.CalculatePagination(TotalCount, input.PageSize, input.PageNumber);
            int lastPage = clsGlobals.CalculateLastPageNumber(TotalCount, input.PageSize);

            Pagination pagination = new Pagination
            {
                CurrentPage = input.PageNumber,
                FirstPage = 1,
                LastPage = lastPage,
                TotalCount = TotalCount,
                Pages = pageNumbers.ToList()
            };
            var Users = DAL.CreateListFromTable<CufexUser>(ds.Tables[0]);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "Users", "0", "ViewOpr", "View records on grid");
            return new JsonResult(Ok(new
            {
                Users,
                Pagination = pagination
            })
            );
        }

        [HttpPost("UpdateUserStatus/{Id}/{Status}")]

        public IActionResult UpdateUserStatus(int Id, int Status)
        {
            string sqlDataSource = _connectionString;
            SQLExec tb = new SQLExec();

            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (Id > 0)
            {

                var tmp = tb.Execute("update Cufex_Users set active = " + Status + " , ModificationDate = '" + DateTime.UtcNow + "' , ModifiedBy = " + memberIdHeader + " where ID = " + Id, sqlDataSource);

                if (tmp == null)
                {
                    return new JsonResult(new Response("success"));
                }
                return new JsonResult(new Response("failed"));


            }
            else
            {
                return NotFound("User Not Found");
            }
        }

    }
}
