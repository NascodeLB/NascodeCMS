import { Component } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { LogFrontendApi, PaginationFilter } from '../../Services/LogFrontendApi.service';

import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { AuthService } from '../../auth.service';
import { LogAudit } from '../../Models/LogAudit.model';
import { UsersApiService } from '../../Services/UsersApi.service';
import { UserDto } from '../../Models/UserDto.model';
import { forEach } from 'lodash';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})

export class AuditLogComponent {

  // for grid 
  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'UserID', Type: 'text', Code: 'userID' },
    { Title: 'RecType', Type: 'text', Code: 'recType' },
    { Title: 'RecID', Type: 'text', Code: 'recID' },
    { Title: 'OperationType', Type: 'text', Code: 'operationType' },
    { Title: 'IPaddress', Type: 'text', Code: 'ipaddress' },
    { Title: 'MachineName', Type: 'text', Code: 'machineName' },
    { Title: 'Info', Type: 'text', Code: 'info' },
    { Title: 'LogDate', Type: 'date', Code: 'logDate' },
  ];
  Data: LogAudit[] = [];


  // for grid pagination
  Pages: number[] = [];
  CheckedIds: number[] = [];
  FirstPage: number = 0;
  LastPage: number = 0;
  Currentpage: number = 1;
  Title: string = "";
  Sort: string = "";
  SearchText: string = "";
  PageSize: number = 10;
  TotalCount: number = 0;
  PaginationDetails: PaginationDto | null = null;


  // for view mode
  ViewMode: string = "Items";
  HeadMessage: string = '';

  // for page permissions
  PagePermissions: UserGroupsFile = new UserGroupsFile;

  //filters
  fromdate: string = ""
  todate: string = ""
  DefaultLanguage: number = 1;
  filters: PaginationFilter = {
    Sorting: 'id desc',
    SearchText: '',
    PageSize: 10,
    After: 0,
    fromdate: "",
    todate: "",
    operations: "",
    usersid: ""
  }
  ShowFilter: boolean = true;
  ShowFiltersPopup: boolean = false;
  ShowPrint: boolean = false;


  //for multi select data
  MultiSelectUsersItems: { value: string, title: string }[] = [];

  MultiSelectOperationsItems: { value: string, title: string }[] = [
    { value: 'AddOpr', title: 'AddOpr' },
    { value: 'ViewOpr', title: 'ViewOpr' },
    { value: 'EditOpr', title: 'EditOpr' },
    { value: 'DeleteOpr', title: 'DeleteOpr' },
    { value: 'PrintOpr', title: 'PrintOpr' },
    { value: 'ExportOpr', title: 'ExportOpr' },
  ];

  SelectedOperatationTypes: string = "";
  SelectedUsers: string = "";

  SelectedOperationsItems: { value: string, title: string }[] = [];
  SelectedUsersItems: { value: string, title: string }[] = [];
  constructor(
    public LogFrontendApi: LogFrontendApi,
    public Auth: AuthService,
    public UsersApi: UsersApiService
  ) {
  }
  
  ngOnInit(): void {
    this.Auth.getPagePermissions("auditlogs").subscribe(result => {
      this.PagePermissions = result;
    });
    this.getdata();
    this.filldropdowns();
  }

  getdata() {
    this.LogFrontendApi.getAuditLogs(this.filters).subscribe((result: { logs: LogAudit[], pagination: PaginationDto }) => {
      this.Data = result.logs;
      this.PaginationDetails = result.pagination;
      
      // Assign pages or default to an empty array
      this.Pages = this.PaginationDetails.pages || [];
      this.FirstPage = this.PaginationDetails.firstPage as number;
      this.TotalCount = this.PaginationDetails.totalCount as number;
      this.LastPage = this.PaginationDetails.lastPage as number;
      this.HeadMessage = this.TotalCount + " Records";
    }, (error: any) => {
      // Handle errors here
    });
  }
  filldropdowns() {
    var usersfilter: PaginationFilter = {};
    this.UsersApi.getUsers(usersfilter).subscribe((result: { users: UserDto[], pagination: PaginationDto }) => {
    this.MultiSelectUsersItems = result.users.map(obj => ({
        value: obj.id?.toString() || "",
        title: obj.userID || ""
      }));
    });
  }


  handleCheckboxChange(event: { id: number, checked: boolean }) {

    const { id, checked } = event;
    let item = this.Data.find(item => item.id === id);
    if (item) {
      // Directly modify the 'checked' property of the found item
      item.checked = checked ? 1 : 0;
    }
    const hasCheckedItem = this.Data.some(item => item.checked === 1);
    this.CheckedIds = this.Data.filter(item => item.checked === 1 && item.id !== null).map(item => item.id as number);
    this.HeadMessage = this.getSelectedItemCount() + " selected";
    this.ShowPrint = true;
    if (!hasCheckedItem) {
      this.ShowPrint = false;
      this.HeadMessage = this.TotalCount + " Records";
    }

  }



  handleSortClick(event: { Title: string, Sort: string }) {
    const { Title, Sort } = event;
    this.Title = Title;
    this.Sort = Sort;
    this.filters = {
      Sorting: Title + ' ' + Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      After: 0,
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();
  }

  handlePageSizeChange(newPageSize: string) {
    this.PageSize = parseInt(newPageSize);
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      After: 0,
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();
  }


  handleSelectAll(checked: boolean) {
    if (checked) {

      this.Data.forEach(item => {
        item.checked = 1
      });
      this.CheckedIds = this.Data.filter(item => item.checked === 1 && item.id !== null).map(item => item.id as number);
      this.HeadMessage = this.getSelectedItemCount() + " selected";
      this.ShowPrint = true;
    } else {
      this.ShowPrint = false;
      this.Data.forEach(item => item.checked = 0);
      this.CheckedIds = this.Data.filter(item => item.checked === 1 && item.id !== null).map(item => item.id as number);
      this.HeadMessage = this.TotalCount + " Records";
    }

  }
  getSelectedItemCount() {
    var count: number = 0;
    this.Data.map(item => {
      if (item.checked == 1) {
        count++;
      }
    });
    return count;
  }
  handlepageChange(page: number) {
    this.Currentpage = page;
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: page,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();

  }

  onSearch(searchText: string) {
    this.SearchText = searchText;
    this.Currentpage = 1;
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: 1,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();
  }
  handlefromdatechange(date: string) {
    this.fromdate = date;
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: 1,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();
  }
  handletodatechange(date: string) {
    this.todate = date;
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: 1,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();
  }

  clearfilters() {

    this.fromdate = "";
    this.todate = "";
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: 1,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      language: this.DefaultLanguage,
      fromdate: "",
      todate: "",
      operations: "",
      usersid: ""
    }
    this.SelectedOperationsItems = [];
    this.SelectedUsersItems = [];
    this.getdata();
  }
  handleOnMultiSelectedUsersChange(selectedItems: any) {
    this.SelectedUsersItems = selectedItems;
    this.SelectedUsers = "";
    selectedItems.map((item: { value: string; }) => {
      this.SelectedUsers += item.value + ",";
    });
    this.SelectedUsers = this.SelectedUsers.slice(0, -1); 
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: 1,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();
  }

  handleOnMultiSelectOperationTypesChange(selectedItems: any) {
    this.SelectedOperationsItems = selectedItems;
    this.SelectedOperatationTypes = "";
    selectedItems.map((item: { value: string; }) => {
      this.SelectedOperatationTypes += "'"+item.value + "',";
    });
    this.SelectedOperatationTypes = this.SelectedOperatationTypes.slice(0, -1);
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: 1,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
      operations: this.SelectedOperatationTypes,
      usersid: this.SelectedUsers
    }
    this.getdata();
  }
}
