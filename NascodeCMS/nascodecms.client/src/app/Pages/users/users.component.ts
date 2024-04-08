import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { ActivatedRoute, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, NgModel, Validators } from '@angular/forms';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { PopupService } from '../../Services/popup.service';
import { AuthService } from '../../auth.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { UserDto } from '../../Models/UserDto.model';
import { UsersApiService, PaginationFilter } from '../../Services/UsersApi.service';
import { CKEditorComponent } from 'ng2-ckeditor';
import { UsersGroupsApi } from '../../Services/UsersGroupsApi.service';
import { UserGroup } from '../../Models/UserGroup.model';
import { TimezonesApi } from '../../Services/TimezonesApi.service';
import { TimezonesDto } from '../../Models/TimezonesDto.model';
import { DropdownApi, DropdownFilter } from '../../Services/DropdownApi.service';
import { DropdownDto } from '../../Models/DropdownDto.model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent {
  // for grid 
  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Group', Type: 'text', Code: 'groupName' },
    { Title: 'Full Name', Type: 'text', Code: 'fullName' },
    { Title: 'User Id', Type: 'text', Code: 'userID' },
    { Title: 'Email', Type: 'text', Code: 'email' },
    { Title: 'Mobile Number', Type: 'text', Code: 'mobile' },
    { Title: 'Status', Type: 'toggle', Code: 'active' },
    { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
    { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
  ];
  Data: UserDto[] = [];

  // for record info
  UserDetails!: UserDto;

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
  filters: PaginationFilter = {
    Sorting: 'id desc',
    SearchText: '',
    PageSize: 10,
    After: 0
  }

  // for view mode
  ViewMode: string = "Items";

  // for record details
  RecordID: string = "";
  CreatedBy: string = "";
  CreationDate: string = "";
  ModifiedBy: string = "";
  ModificationDate: string = "";

  // for form validation
  requiredFullname: boolean = false;
  requiredMobile: boolean = false;
  requiredEmail: boolean = false;
  requiredGroup: boolean = false;
  requiredTimeZone: boolean = false;
  requiredUserID: boolean = false;
  requiredPassword: boolean = false;
  requiredConfirmPassword: boolean = false;

  // to hide/show items
  hideCreationBanner: boolean = false;
  ShowItems: boolean = false;
  ShowEdit: boolean = false;
  ShowDelete: boolean = false;
  ShowClone: boolean = false;
  ShowPrint: boolean = false;
  ShowExport: boolean = false;
  ShowCancelSave: boolean = false;
  ShowSearch: boolean = false;
  ShowAddNew: boolean = false;

  // for popup display
  error: string = '';
  Message: string = '';
  HeadMessage: string = '';
  ShowPopup: boolean = false;
  CheckAll: boolean = false;

  // page url
  url = "dashboard/settings/users";

  // for page permissions
  PagePermissions: UserGroupsFile = new UserGroupsFile;

  // for groups dropdown 
  GroupsList: { Value: string, Title: string }[] = [];
  GroupsListDropDownFilter: DropdownFilter = {
    tableName: 'Cufex_UsersGroups',
    valueField: 'id',
    titleField: 'name',
    whereConditions: {
      'isnull(deleted,0)': '= 0'
    }
  }

  // for groups dropdown 
  TimezoneList: { Value: string, Title: string }[] = [];
  TimeZonesDropDownFilter: DropdownFilter = {
    tableName: 'Timezones',
    valueField: 'id',
    titleField: 'title'
  }

  constructor(
    public DropdownAPI: DropdownApi,
    public UsersApiService: UsersApiService,
    public UsersGroupsApiService: UsersGroupsApi,
    public TimeZoneApiService: TimezonesApi,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService,
    public Auth: AuthService
  ) {
  }
  FillDropDown() {
    this.filters = {
      Sorting: 'id desc',
      SearchText: '',
      PageSize: 0,
      After: 0
    }

   

    this.DropdownAPI.getdata(this.GroupsListDropDownFilter).subscribe((result: { value: { dropdown: DropdownDto[] } }) => {


      result.value.dropdown.map(obj => (
        this.GroupsList.push({
          Value: obj.value?.toString() || "",
          Title: obj.title
        })
      ));
      // Insert a new item at index 0
      this.GroupsList.unshift({
        Value: "0",
        Title: "Select Group"
      });
    });



    this.DropdownAPI.getdata(this.TimeZonesDropDownFilter).subscribe((result: { value: { dropdown: DropdownDto[] } }) => {
      result.value.dropdown.map(obj => (
        this.TimezoneList.push({
          Value: obj.value?.toString() || "",
          Title: obj.title
        })
      ));
      // Insert a new item at index 0
      this.TimezoneList.unshift({
        Value: "0",
        Title: "Select Timezone"
      });
    });


  }



  ngOnInit(): void {
    this.Auth.getPagePermissions("users").subscribe(result => {
      this.PagePermissions = result;
    });

    this.FillDropDown()
    this.RecordID = this.route.snapshot.paramMap.get('id') ?? "";

    this.UserDetails = new UserDto();

    if (this.RecordID != '') {
      this.ViewMode = "Details";
      this.ShowAllItems('ViewOpr');
      this.DisplayInfo(this.RecordID);
    }
    else {
      this.getdata();
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
    }
  }

  getdata() {
    this.UsersApiService.getUsers(this.filters).subscribe((result: { users: UserDto[], pagination: PaginationDto }) => {
      this.Data = result.users;
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


  onAddNewClick() {
    this.ShowAllItems('AddOpr');
    this.Clear()
    this.ViewMode = "Details";
  }


  handleOnSelectChange(value: string) {
    this.UserDetails.groupID = Number(value);
  }

  handleOnSelectTimezoneChange(value: string) {
    this.UserDetails.timezoneID = Number(value);
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
    if (hasCheckedItem) {
      this.ShowAllItems('GridSelectOpr');
    } else {
      this.ShowAllItems('GridOpr');
      this.HeadMessage = this.TotalCount + " Records";
    }

  }

  handleRowCLick(id: number) {
    this.router.navigateByUrl(this.url + '/' + id);
  }

  handleSortClick(event: { Title: string, Sort: string }) {
    const { Title, Sort } = event;
    this.Title = Title;
    this.Sort = Sort;
    this.filters = {
      Sorting: Title + ' ' + Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      After: 0
    }
    this.getdata();
  }

  handlePageSizeChange(newPageSize: string) {
    this.PageSize = parseInt(newPageSize);
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      After: 0
    }
    this.getdata();
  }


  handleSelectAll(checked: boolean) {
    if (checked) {
      this.ShowAllItems('GridSelectOpr');
      this.Data.forEach(item => {
        item.checked = 1
      });
      this.CheckedIds = this.Data.filter(item => item.checked === 1 && item.id !== null).map(item => item.id as number);
      this.HeadMessage = this.getSelectedItemCount() + " selected";
    } else {
      this.ShowAllItems('GridOpr');
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
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1)
    }
    this.getdata();

  }

  goback() {

    if (this.RecordID != '') {

      this.router.navigateByUrl(this.url);
    } else {
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
    }
  }

  DisplayInfo(recID: string) {
    this.UsersApiService.getUser(recID).subscribe((data: UserDto) => {
      this.UserDetails = data;
      this.UserDetails.password = "";

      this.CreatedBy = this.UserDetails.createdByName ?? 'Not Set';
      this.ModifiedBy = this.UserDetails.modifiedByName ?? 'Not Set';
      if (this.UserDetails.modificationDate) {
        
        this.ModificationDate = this.ClsGlobal.formatWithUtcOffsetString(this.UserDetails.modificationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.ModificationDate = 'Not Set';
      }
      if (this.UserDetails.creationDate) {
       
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.UserDetails.creationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.CreationDate = 'Not Set';
      }
      this.ShowAllItems("ViewOpr");
    }, (error: any) => {
      this.ShowAllItems("AddOpr");
    });
  }

  onCancel() {
    if (this.UserDetails.id != null) {
      this.ShowAllItems('CancelOpr');
    }
    else {
      this.Clear();
      this.ShowAllItems('AddOpr')
    }
  }


  onEditCLick() {

    this.ShowAllItems('ViewOpr');

  }


  Clear() {
    this.requiredEmail = false;
    this.requiredGroup = false;
    this.requiredTimeZone = false;
    this.requiredUserID = false;
    this.requiredFullname = false;
    this.requiredMobile = false;
    this.UserDetails = new UserDto();
    this.FillDropDown();
    this.ModificationDate = '';
    this.CreatedBy = '';
    this.CreationDate = '';
    this.ModifiedBy = '';
    this.Message = '';
    this.HeadMessage = this.TotalCount + " records";
  }



  onDeleteCLick() {
    if (this.UserDetails != null) {
      if (this.ViewMode != 'Items') {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this record?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.UsersApiService.deleteUser(parseInt(String(this.UserDetails.id))).subscribe({
              next: (response) => {
                this.popupService.showMessage({
                  title: 'Success!',
                  desc: 'Record Deleted Successfully',
                  buttonTitle: 'OK',
                  type: 'Success',
                });
                this.router.navigateByUrl(this.url)
                this.ViewMode = 'Items';

              },
              error: (error) => {
                this.popupService.showMessage({
                  title: 'Error!',
                  desc: 'Current record cannot be deleted',
                  buttonTitle: 'OK',
                  type: 'Error',
                });
              },
            });
          }
        });
      }
      else {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this records?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.deleteSelectedUsers(this.CheckedIds);
          }
        });
      }
    }

  }
  onCloneCLick() {
    if (this.UserDetails && this.UserDetails.id) {

      const clonedEmailbook: UserDto = {
        ...this.UserDetails,
        id: null, // Reset the ID for the clone to ensure it's treated as a new entity
        creationDate: null,
        createdBy: null,
        modificationDate: null,
        modifiedBy: null,
        modifiedByName: null,
      };
      this.UserDetails = clonedEmailbook;
      this.ShowAllItems('Clone');
    } else {
      this.popupService.showMessage({
        title: 'Error!',
        desc: 'No User record selected to clone.',
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  save(createForm: NgForm): void {
    this.requiredConfirmPassword = false;
    this.requiredPassword = false;
    this.requiredEmail = false;
    this.requiredFullname = false;
    this.requiredMobile = false;
    this.requiredGroup = false;
    this.requiredTimeZone = false;

    this.requiredUserID = false;
    this.Message = '';
    if (this.ClsGlobal.isFieldEmpty(this.UserDetails, 'fullName')) {
      this.requiredFullname = true;
      this.Message = '- Fullname is Required\n'
    }
    if (this.ClsGlobal.isFieldEmpty(this.UserDetails, 'userID')) {
      this.requiredUserID = true;
      this.Message = '- User id is Required\n'
    }
    if (this.ClsGlobal.isFieldEmpty(this.UserDetails, 'mobile') || this.ClsGlobal.isNumericField(this.UserDetails, 'mobile') == false) {
      this.requiredMobile = true;
      this.Message += '- Mobile Number is Required\n'
    }

    if (this.ClsGlobal.isFieldEmpty(this.UserDetails, 'email') || this.ClsGlobal.isValidEmailField(this.UserDetails, 'email') == false) {
      this.requiredEmail = true;
      this.Message += '- Email is Required\n'
    }

    if (this.UserDetails.groupID == null || this.UserDetails.groupID == 0) {
      this.requiredGroup = true;
      this.Message += '- Group is Required\n'
    }

    if (this.UserDetails.timezoneID == null || this.UserDetails.timezoneID == 0) {
      this.requiredTimeZone = true;
      this.Message += '- Timezone is Required\n'
    }
    if (this.UserDetails.password != "") {
      if (this.UserDetails.password.length < 8) {
        this.requiredPassword = true;
        this.Message += '- Password should be of minimum 8 characters\n'
      }
      if (this.UserDetails.confirmpassword != this.UserDetails.password) {
        this.requiredConfirmPassword = true;
        this.Message += '- Please confirm password\n'
      }

    }


    if (this.Message != '') {
      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    } else {
      if (this.UserDetails.id == null) {
        this.UserDetails.id = 0;
        this.error = 'Record  adedd successfully';
      }
      else { this.error = 'Record updated successfully'; }
      this.UsersApiService.submitUser(this.UserDetails).subscribe({
        next: (response) => {
          this.ShowAllItems('ViewOpr');
          if (this.RecordID != '') {
            this.Auth.GetUserTimeZone().subscribe({
              next: (response) => {
                localStorage.setItem('utcOffset', response.utcOffest);
              },
              error: (error) => {
              }
            });
            this.DisplayInfo(response);
            this.popupService.showMessage({
              title: 'Success!',
              desc: 'The User has been successfully edited',
              buttonTitle: 'OK',
              type: 'Success',
            });
          }
          else {
            this.popupService.showMessage({
              title: 'Success!',
              desc: this.error,
              buttonTitle: 'OK',
              type: 'Success',
            });
            this.router.navigateByUrl(this.url + '/' + response);
          }

        },
        error: (error) => {
          this.popupService.showMessage({
            title: 'Error!',
            desc: 'Somthing went  rong please try again later',
            buttonTitle: 'OK',
            type: 'Error',
          });
        },
      });

    }

  }

  deleteSelectedUsers(EmailsbooksIdsToDelete: number[]) {
    this.UsersApiService.deleteUsers(EmailsbooksIdsToDelete).subscribe({
      next: (response) => {
        let detailMessage = '';
        // When all Emailsbooks are deleted
        if (response.deletedCount > 0 && response.undeletedCount === 0) {
          detailMessage = `All Users deleted successfully. Total deleted: ${response.deletedCount}.`;
        }
        // When no Emailsbooks are deleted
        else if (response.deletedCount === 0 && response.undeletedCount > 0) {
          detailMessage = `No Users deleted. Total not deleted: ${response.undeletedCount}.`;
        }
        // When some Emailsbooks are deleted and some are not
        else if (response.deletedCount > 0 && response.undeletedCount > 0) {

          detailMessage = `${response.undeletedCount} User(s) not deleted,\n ${response.deletedCount} bank(s) deleted.\n`;

          if (response.undeletedTitles && response.undeletedTitles.length > 0) {
            detailMessage += ` Users Not Deleted: ${response.undeletedTitles.join(', ')}.`;
          }
        } else if (response.deletedCount == 0 && response.undeletedCount == 0) {
          detailMessage += 'Somthing went Wrong try again later'
        }
        this.popupService.showMessage({
          title: 'Info',
          desc: detailMessage,
          buttonTitle: 'OK',
          type: '',
        });
        this.filters = {
          Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
          SearchText: '',
          PageSize: this.PageSize,
          After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1)
        }
        this.ShowAllItems("GridOpr");
        this.getdata();
      },
      error: (error) => {
        this.popupService.showMessage({
          title: 'Error!',
          desc: 'Something went wrong please try again later',
          buttonTitle: 'OK',
          type: 'Error',
        });
      }
    });
  }

  onSearch(searchText: string) {
    this.SearchText = searchText;
    this.Currentpage = 1;
    this.filters = {
      Sorting: (this.Title == '' || this.Sort == '') ? 'id desc' : this.Title + ' ' + this.Sort,
      SearchText: this.SearchText.trim(),
      PageSize: this.PageSize,
      PageNumber: 1,
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1)
    }
    this.getdata();
  }

  ShowAllItems(Mode: string) {
    if (Mode == 'AddOpr') {
      this.ShowCancelSave = true;
      this.ShowDelete = false;
      this.ShowClone = false;
      this.ShowPrint = false;
      this.ShowExport = false;
      this.ShowItems = false;
      this.ShowEdit = false;
      this.hideCreationBanner = true;
      this.ShowSearch = false;
      this.ShowAddNew = false;

    } else if (Mode == 'ViewOpr') {
      this.ShowCancelSave = true;
      this.ShowDelete = true;
      this.ShowClone = false;
      this.ShowPrint = false;
      this.ShowExport = false;
      this.ShowItems = false;
      this.ShowEdit = false;
      this.ShowSearch = false;
      this.ShowAddNew = false;
      this.hideCreationBanner = false;
    } else if (Mode == 'GridOpr') {
      this.ShowDelete = false;
      this.ShowPrint = false;
      this.ShowClone = false;
      this.ShowExport = true;
      this.ShowEdit = false;
      this.ShowSearch = true;
      this.ShowAddNew = true;
    } else if (Mode == 'CancelOpr') {
      this.ShowCancelSave = false;
      this.ShowDelete = true;
      this.ShowClone = true;
      this.ShowPrint = true;
      this.ShowExport = false;
      this.ShowItems = true;
      this.ShowEdit = true;
      this.hideCreationBanner = false;
      this.ShowSearch = false;
      this.ShowAddNew = false;
    } else if (Mode == 'GridSelectOpr') {
      this.ShowDelete = true;
      this.ShowPrint = true;
      this.ShowClone = false;
      this.ShowExport = false;
      this.ShowEdit = false;
      this.ShowSearch = false;
      this.ShowAddNew = false;
    } else if (Mode == 'Clone') {
      this.ShowCancelSave = true;
      this.ShowDelete = false;
      this.ShowClone = false;
      this.ShowPrint = false;
      this.ShowExport = false;
      this.ShowItems = false;
      this.ShowEdit = false;
      this.hideCreationBanner = true;
      this.ShowSearch = false;
      this.ShowAddNew = false;
    }
  }


  handlelanguageChange(languageId: number) {
    if (this.ViewMode == "Items") {
      this.filters = {
        Sorting: 'id desc',
        SearchText: this.SearchText,
        PageSize: this.PageSize,
        After: 0
      }
      this.getdata();
    } else if (this.ViewMode == "Details") {
      this.DisplayInfo(this.RecordID);
    }

  }

  onActiveToggleChangeInDetails(event: any) {
    this.UserDetails.active = event.checked ? 1 : 0;
  }

  handleactiveToggleChange(event: { id: number, checked: boolean }) {
    const { id, checked } = event;
    const status = checked ? 1 : 0;
    if (this.UserDetails != null) {
      this.UsersApiService.UpdateUserStatus(id, status).subscribe();
    }
  }


}
