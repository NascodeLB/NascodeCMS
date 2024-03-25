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
using NascodeCMS.Filter;
using NascodeCMS.ResponseModels;
using NascodeCMS.Server.Services;
namespace NascodeCMS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPermissionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ITokenService _tokenService;
        private readonly PropertyHelper _propertyHelper;
        private string _connectionString;
        private readonly AuditLog _auditLogger;
        public UserPermissionController(AuditLog auditlog, IConfiguration configuration, ITokenService tokenService, IWebHostEnvironment env, PropertyHelper propertyHelper)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _env = env;
            _propertyHelper = propertyHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _auditLogger = auditlog;
        }
        public class GroupPermissionRequest
        {
            public required CufexUsersGroup CufexUsersGroup { get; set; }
            public required CufexGroupPermissionAllowed[] CufexGroupPermissionAllowed { get; set; }

        }

        [HttpPost("SubmitGroup-Permission")]
        public IActionResult SubmitGroupPermission([FromBody] GroupPermissionRequest groupPermissionRequest)
        {

            SQLExec tb = new SQLExec();
            string[] sql = new string[3];
            DataSet ds;
            DataRow dr;
            SqlConnection? CN = null;
            SqlDataAdapter[]? da = null;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            // check if the operation is edit or add new
            if (groupPermissionRequest.CufexUsersGroup.ID > 0)
            {
                sql[0] = "Select * from Cufex_UsersGroups where id = " + groupPermissionRequest.CufexUsersGroup.ID;
                //sql[1] = "Select * from Cufex_GroupPermissionAllowed where GroupID = " + groupPermissionRequest.CufexUsersGroup.ID + " order by id desc ";
                //if ((groupPermissionRequest.CufexUsersGroup.Name ?? "").Trim() != "")
                //{
                //    sql[2] = "Select top 1 * from Cufex_UsersGroups where Name = '" + groupPermissionRequest.CufexUsersGroup.Name!.ToLower() + "' order by id desc ";
                //}
                //else
                //{
                //    return BadRequest("Group Name is required");
                //}
            }
            else
            { // check if the group name exist to disallow user
                sql[0] = "Select top 1 * from Cufex_UsersGroups order by id desc ";
              
            }
            sql[1] = "Select * from Cufex_GroupPermissionAllowed where GroupID = " + groupPermissionRequest.CufexUsersGroup.ID + " order by id desc ";
            if ((groupPermissionRequest.CufexUsersGroup.Name ?? "").Trim() != "")
            {
                sql[2] = "Select top 1 * from Cufex_UsersGroups where Name = '" + groupPermissionRequest.CufexUsersGroup.Name!.ToLower() + "' order by id desc ";
            }
            else
            {
                return BadRequest("Group Name is required");
            }
            ds = tb.Cursor(ref sql, ref da!, ref CN!, _connectionString)!; 
            Decimal NewID = 1;

            if (groupPermissionRequest.CufexUsersGroup.ID > 0)
            {
                NewID = (Decimal)ds.Tables[0].Rows[0]["ID"];
                dr = ds.Tables[0].Rows[0];
            }
            else
            {
                if ((groupPermissionRequest.CufexUsersGroup.Name ?? "").Trim() != "")
                {
                    if (ds.Tables[2].Rows.Count > 0)
                    {
                        return BadRequest("You can't add 2 groups with same name");
                    }
                }


                NewID = (decimal)ds.Tables[0].Rows[0]["ID"] + 1;
                dr = ds.Tables[0].NewRow();

            }

            for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
            {
                ds.Tables[1].Rows[i].Delete();
            }

            dr["ID"] = NewID;
            dr["Name"] = groupPermissionRequest.CufexUsersGroup.Name;
            dr["IsSuperAdmin"] = groupPermissionRequest.CufexUsersGroup.isSuperAdmin;
            if (groupPermissionRequest.CufexUsersGroup.ID > 0)
            {
                dr["ModifiedBy"] = memberIdHeader;
                dr["ModificationDate"] = DateTime.UtcNow;
              
                _auditLogger.Add(memberIdHeader, "UsersPermissionsGroups", NewID.ToString(), "EditOpr", "Edit record");
            }
            else
            {
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                dr["Deleted"] = 0;
                ds.Tables[0].Rows.Add(dr);
               
                _auditLogger.Add(memberIdHeader, "UsersPermissionsGroups", NewID.ToString(), "AddOpr", "Add new record");
            }
            for (int i = 0; i < groupPermissionRequest.CufexGroupPermissionAllowed.Length; i++)
            {
                dr = ds.Tables[1].NewRow();
                dr["ID"] = i + 1; //groupPermissionRequest.CufexGroupPermissionAllowed[i].ID;
                dr["GroupID"] = NewID;
                dr["Name"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].Name;
                dr["FileName"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].FileName;
                dr["AddOpr"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].AddOpr;
                dr["EDitOpr"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].EditOpr;
                dr["DeleteOpr"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].DeleteOpr;
                dr["ViewOpr"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].ViewOpr;
                dr["PrintOpr"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].PrintOpr;
                dr["CloneOpr"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].CloneOpr;
                dr["ExportOpr"] = groupPermissionRequest.CufexGroupPermissionAllowed[i].ExportOpr;
                dr["CreationDate"] = DateTime.UtcNow;
                dr["CreatedBy"] = memberIdHeader;
                ds.Tables[1].Rows.Add(dr);
            }
            var tmp = tb.commitChanges(ref da, ds, ref CN);
            decimal ID;
            if (tmp == null)
            {
                return new JsonResult(ID = NewID);
            }
            else
            {
                return BadRequest("Could not create Group");
            }

        }


        [HttpGet("GetPermissionsPerPage/{pageName}")]
        public IActionResult GetPermissionsPerPage(string pageName)
        {

            string sql = "";
            DataSet ds;
            SQLExec tb = new SQLExec();
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            sql = @"select * from Cufex_GroupPermissionAllowed where GroupID in (select GroupID from Cufex_Users where ID = " + memberIdHeader + ") and FileName = '" + pageName.ToLower() + "'";

            ds = tb.Cursor(sql, _connectionString)!;
            if (ds.Tables[0].Rows.Count == 0)
            {
                return BadRequest("Error,please try again.");
            }
            else
            {
                var Permissions = DAL.CreateListFromTable<CufexGroupPermissionAllowed>(ds.Tables[0]);
                return new JsonResult(Ok(new
                {
                    Permissions
                })
                );
            }

        }

        [HttpGet("GetPermissionsPerMember")]
        public IActionResult GetPermissionsPerMember()
        {
            DataSet ds;
            SQLExec tb = new SQLExec();
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            string sql = @"select * from Cufex_GroupPermissionAllowed where GroupID in (select GroupID from Cufex_Users where ID = " + memberIdHeader + ")";

            ds = tb.Cursor(sql, _connectionString)!;
            if (ds.Tables[0].Rows.Count == 0)
            {
                return BadRequest("Error,please try again.");
            }
            else
            {
                var Permissions = DAL.CreateListFromTable<CufexGroupPermissionAllowed>(ds.Tables[0]);
                return new JsonResult(Ok(new
                {
                    Permissions
                })
                );
            }

        }
        [HttpGet("GetGroup/{GroupID}")]
        public IActionResult GetGroup(int GroupID)
        {
            SQLExec tb = new SQLExec();
            string sql = "";
            DataSet ds;

            if (GroupID > 0)
            {
                sql = " select ID, Name, CreationDate, ModificationDate, isNull(isSuperAdmin,0)isSuperAdmin, ";
                sql += " (select userID from Cufex_Users where id = Cufex_UsersGroups.ModifiedBy) ModifiedByName ";
                sql += " , (select userID from Cufex_Users where id = Cufex_UsersGroups.CreatedBy) CreatedByName ";
                sql += " from Cufex_UsersGroups where isnull(Deleted,0) = 0 And id  = " + GroupID;
                sql += " Select  G.ID ,G.GroupID,G.FileName, G.Name, G.CreationDate, G.CreatedBy, isNull(G.AddOpr,0)AddOpr ,isNull(G.EditOpr,0)EditOpr, isNull(G.DeleteOpr ,0)DeleteOpr, ";
                sql += " isNull(G.ViewOpr ,0)ViewOpr, isNull(G.PrintOpr,0)PrintOpr,isNull(G.ExportOpr,0)ExportOpr, isNull(G.CloneOpr,0)CloneOpr ";
                sql += " from Cufex_GroupPermissionAllowed G where GroupID = " + GroupID + " order by ID ";

            }
            ds = DAL.GetDataSet(_connectionString, sql);
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "UsersPermissionsGroups", GroupID.ToString(), "ViewOpr", "View record");
            if (ds.Tables[0].Rows.Count > 0)
            {
                var group = DAL.CreateItemFromRow<CufexUsersGroup>(ds.Tables[0].Rows[0]);
                var permission = DAL.CreateListFromTable<CufexGroupPermissionAllowed>(ds.Tables[1]);
                return new JsonResult(Ok(new
                {
                    group,
                    Permission = permission
                })
          );
            }
            else
            { return NotFound("Group does not Exist"); }
        }

        [HttpGet("AllGroups")]
        public IActionResult GetGroups([FromQuery] PaginationFilter input)
        {
            var MySortBy = "";
            var WhereCondidtion = "";


            if (input.Sorting != "")
            {
                MySortBy = " order by dif desc," + input.Sorting.ToLower();
            }
            else
            {
                MySortBy = " order by dif desc, id desc";
            }
            WhereCondidtion += " from Cufex_UsersGroups where isNull(Deleted , 0) = 0 and  ";
            WhereCondidtion += "  ((Name like N'" + ((input.SearchText ?? "").Length > 2 ? "%" : "") + "" + (input.SearchText ?? "").Replace(" ", "%") + "%' ";
            WhereCondidtion += " )) ";


            var sql = " set dateformat dmy ";
            sql += "select ID,Name , isNull(isSuperAdmin, 0)isSuperAdmin ,CreationDate,ModificationDate, ";
            sql += "(select fullname from Cufex_Users where Cufex_Users.id = isnull(Cufex_UsersGroups.ModifiedBy,Cufex_UsersGroups.CreatedBy)) ModifiedByName, ";
            sql += "isnull(Cufex_UsersGroups.ModificationDate,Cufex_UsersGroups.CreationDate) LastModificationDate, ";
            sql += " case when(Name = N'" + (input.SearchText ?? "") + "')  then 7";
            sql += " when (Name like N'" + (input.SearchText ?? "") + "') then 6 ";
            sql += " when (Name like N'" + (input.SearchText ?? "") + "%') then 5 ";
            sql += " when (Name like N'%" + (input.SearchText ?? "") + "%') then 4 ";
            sql += " else difference('" + (input.SearchText ?? "") + "',Name) end Dif ";
            sql += WhereCondidtion;
            sql += MySortBy.Trim(); ;
            sql += input.PageSize > 0 ? (" OFFSET " + input.After + " ROWS FETCH NEXT " + input.PageSize + " ROWS ONLY ") : "";

            sql += "select count (*)  as TotalCount " + WhereCondidtion;
            var ds = DAL.GetDataSet(_connectionString, sql);
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
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            _auditLogger.Add(memberIdHeader, "UsersPermissionsGroups","0", "ViewOpr", "View records on grid");
            var Groups = DAL.CreateListFromTable<CufexUsersGroup>(ds.Tables[0]);
            return new JsonResult(Ok(new
            {
                Groups,
                Pagination = pagination
            })
            );
        }


        [HttpPost("DeleteGroup/{GroupID}")]
        public IActionResult DeleteGroup(int GroupID)
        {
            SQLExec tb = new SQLExec();
            DataSet? ds;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            if (GroupID > 0)
            {
                string sql = @" Select * from Cufex_Users where isnull(deleted,0) = 0 and GroupID = " + GroupID;
                ds = tb.Cursor(sql, _connectionString)!;
                if (ds.Tables[0].Rows.Count > 0)
                {
                    return BadRequest("Could not Delete Group");
                }
                else
                {
                    var tmp = tb.Execute("update Cufex_UsersGroups set  Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + " where ID = " + GroupID, _connectionString);

                    if (tmp == null)
                    {
                        _auditLogger.Add(memberIdHeader, "UsersPermissionsGroups", GroupID.ToString(), "DeleteOpr", "Delete record");
                        return new JsonResult(new Response("success"));
                    }
                    return new JsonResult(new Response("failed"));
                }

            }
            else
            {
                return NotFound("GroupID Not Found");
            }
        }

        [HttpPost("DeleteManyGroups")]
        public IActionResult DeleteManyGroups([FromBody] int[] groupIds)
        {
            string sql;
            List<string> undeletedTitles = new List<string>();
            int deletedCount = 0;
            SQLExec tb = new SQLExec();
            DataSet? ds;
            var memberIdHeader = HttpContext.Request.Headers["MemberID"].FirstOrDefault();
            foreach (int groupId in groupIds)
            {
                if (groupId > 0)
                {
                    sql = @"select Name from Cufex_UsersGroups where ID = " + groupId +
                          " and ID  in (Select ID from Cufex_Users where isnull(deleted,0) = 0 and GroupID = " + groupId + " )";
                    ds = tb.Cursor(sql, _connectionString)!;

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        undeletedTitles.Add(ds.Tables[0].Rows[0]["Name"].ToString()!);
                    }
                    else
                    {
                        var tmp = tb.Execute("update Cufex_UsersGroups set Deleted = 1 , DeletionDate = '" + DateTime.UtcNow + "' , DeletedBy = " + memberIdHeader + "  where ID = " + groupId, _connectionString);
                        if (tmp == null)
                        {
                            _auditLogger.Add(memberIdHeader, "UsersPermissionsGroups", groupId.ToString(), "DeleteOpr", "Delete record");

                            deletedCount++;
                        }
                    }
                }
            }

            return new JsonResult(new
            {
                DeletedCount = deletedCount,
                UndeletedCount = undeletedTitles.Count,
                UndeletedTitles = undeletedTitles
            });
        }
    }
}
