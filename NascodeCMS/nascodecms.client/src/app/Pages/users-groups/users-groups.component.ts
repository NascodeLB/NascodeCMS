import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { UserGroup } from '../../Models/UserGroup.model';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { PaginationFilter, UsersGroupsApi, GroupDetails, GroupDetailsSubmission } from '../../Services/UsersGroupsApi.service';
import { MessageService } from 'primeng/api';
import { PopupService } from '../../Services/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-users-groups',
  templateUrl: './users-groups.component.html',
  styleUrl: './users-groups.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UsersGroupsComponent {
  PagesList: { checked: boolean, title: string }[] = [
    { checked: false, title: "contactsubmissions" },
    { checked: false, title: "usersgroups" },
    { checked: false, title: "statickeywords" },
    { checked: false, title: "dynamiccontent" },
    { checked: false, title: "generalsettings" },
    { checked: false, title: "emailsbooks" },
    { checked: false, title: "users" },
    { checked: false, title: "profile" },
    { checked: false, title: "errorslog" },
    { checked: false, title: "auditlogs" },
    { checked: false, title: "timezones" },
    { checked: false, title: "countries" },
  ];
  
  ChangePermissionView: boolean = false;
  ChangePermissionAdd: boolean = false;
  ChangePermissionDelete: boolean = false;
  ChangePermissionClone: boolean = false;
  ChangePermissionPrint: boolean = false;
  ChangePermissionExport: boolean = false;
  ChangePermissionCheckAll: boolean = false;
  ChangePermissionEdit: boolean = false;

  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Name', Type: 'text', Code: 'name' },
    { Title: 'is Super Admin', Type: 'text', Code: 'isSuperAdmin' },
    { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
    { Title: 'Modified by', Type: 'text', Code: 'modifiedByName' },
  ];

  Data: UserGroup[] = [];
  Pages: number[] = [];
  showChangePermissions: boolean = false;
  CheckedIds: number[] = [];
  FirstPage: number = 0;
  LastPage: number = 0;
  Currentpage: number = 1;
  Title: string = "";
  Sort: string = "";
  ViewMode: string = "Items";
  RecordID: string = "";
  CreatedBy: string = "";
  CreationDate: string = "";
  ModifiedBy: string = "";
  ModificationDate: string = "";
  PageSize: number = 10;
  TotalCount: number = 0;
  SearchText: string = "";
  PaginationDetails: PaginationDto | null = null;
  filters: PaginationFilter = {
    Sorting: 'id desc',
    SearchText: '',
    PageSize: 10,
    After: 0
  }
  GroupDetails: UserGroup = new UserGroup();

  ShowItems: boolean = false;
  ShowEdit: boolean = false;
  ShowDelete: boolean = false;
  ShowClone: boolean = false;
  ShowPrint: boolean = false;
  ShowExport: boolean = false;
  ShowCancelSave: boolean = false;
  hideCreationBanner: boolean = false;
  ShowSearch: boolean = false;
  ShowAddNew: boolean = false;


  requiredGroupName: boolean = false;
  url: string = "dashboard/settings/usersgroups";
  Permissions: UserGroupsFile[] = [];
  error: string = '';
  Message: string = '';

  PagePermissions: UserGroupsFile = new UserGroupsFile;


  constructor(
    public Auth: AuthService,
    public UserGroupsApi: UsersGroupsApi,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getdata();

    this.RecordID = this.route.snapshot.paramMap.get('id') ?? "";
    this.GroupDetails = new UserGroup();
    if (this.RecordID != '') {
      this.ViewMode = "Details";
      this.ShowAllItems('ViewOpr');
      this.DisplayInfo(this.RecordID);
    } else {
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
    }
  }

  getdata() {
    this.Auth.getPagePermissions("usersgroups").subscribe(result => {
      this.PagePermissions = result;
    });

    this.UserGroupsApi.getGroups(this.filters).subscribe((result: { groups: UserGroup[], pagination: PaginationDto }) => {
      this.Data = result.groups;
      this.PaginationDetails = result.pagination;

      // Assign pages or default to an empty array
      this.Pages = this.PaginationDetails.pages || [];
      this.FirstPage = this.PaginationDetails.firstPage as number;
      this.TotalCount = this.PaginationDetails.totalCount as number;
      this.LastPage = this.PaginationDetails.lastPage as number;
    }, (error: any) => {
      console.log(error);
      // Handle errors here
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

    if (hasCheckedItem) {
      this.ShowAllItems('GridSelectOpr');
    } else {
      this.ShowAllItems('GridOpr');
    }
    this.CheckedIds = this.Data.filter(item => item.checked === 1 && item.id !== null).map(item => item.id as number);
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
  handleSelectAll(checked: boolean) {

    if (checked) {
      this.ShowAllItems('GridSelectOpr');
      this.Data.forEach(item => item.checked = 1);
    } else {
      this.ShowAllItems('GridOpr');
      this.Data.forEach(item => item.checked = 1);
    }
    this.CheckedIds = this.Data.filter(item => item.checked === 1 && item.id !== null).map(item => item.id as number);
  }

  updatePagesCheck(title: string) {
    this.PagesList.map(item => {
      if (item.title == title) {
        item.checked = !item.checked;
      }
    });
  }
  updateAllPagesCheck(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.ChangePermissionCheckAll = checkbox.checked;
    this.PagesList.map(item => {
      item.checked = checkbox.checked;
    });
  }

  handleRowCLick(id: number) {
    this.router.navigateByUrl(this.url + '/' + id);
  }

  goback() {
    this.messageService.clear();
    if (this.RecordID != '') {
      this.router.navigateByUrl(this.url);
    } else {
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
    }
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
  onAddNewClick() {
    this.ShowAllItems('AddOpr');
    this.Clear()
    this.ViewMode = "Details";
  }
  Clear() {
    this.requiredGroupName = false;
    this.GroupDetails = new UserGroup();
    this.Permissions = [];
    this.ModificationDate = '';
    this.CreatedBy = '';
    this.CreationDate = '';
    this.ModifiedBy = '';
    this.Message = '';

  }
  onCancel() {
    if (this.GroupDetails.id != null) {
      this.DisplayInfo(String(this.GroupDetails.id));
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

  onDeleteCLick() {
    if (this.GroupDetails != null) {
      if (this.ViewMode != 'Items') {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this record?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.UserGroupsApi.deleteGroup(parseInt(String(this.GroupDetails.id))).subscribe({
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
            this.deleteSelectedGroups(this.CheckedIds);
          }
        });
      }
    }

  }

  deleteSelectedGroups(GroupsIdsToDelete: number[]) {
    this.UserGroupsApi.deleteGroups(GroupsIdsToDelete).subscribe({
      next: (response) => {
        
        let detailMessage = '';
        // When all groups are deleted
        if (response.deletedCount > 0 && response.undeletedCount === 0) {
          detailMessage = `All groups deleted successfully. Total deleted: ${response.deletedCount}.`;
        }
        // When no groups are deleted
        else if (response.deletedCount === 0 && response.undeletedCount > 0) {
          detailMessage = `No groups deleted. Total not deleted: ${response.undeletedCount}.`;
        }
        // When some groups are deleted and some are not
        else if (response.deletedCount > 0 && response.undeletedCount > 0) {

          detailMessage = `${response.undeletedCount} group(s) not deleted,\n ${response.deletedCount} group(s) deleted.\n`;

          if (response.undeletedTitles && response.undeletedTitles.length > 0) {
            detailMessage += ` Groups Not Deleted: ${response.undeletedTitles.join(', ')}.`;
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


  onCloneCLick() {
    if (this.GroupDetails && this.GroupDetails.id) {
      // Create a new BankDto object by copying the current bankDetails
      const clonedGroup: UserGroup = {
        ...this.GroupDetails,
        id: null, // Reset the ID for the clone to ensure it's treated as a new entity
        creationDate: null,
        createdBy: null,
        modificationDate: null,
        modifiedBy: null,
        modifiedByName: null,
      };
      this.GroupDetails = clonedGroup;
      this.ShowAllItems('Clone');
    } else {
      this.popupService.showMessage({
        title: 'Error!',
        desc: 'No group record selected to clone.',
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }


  DisplayInfo(recID: string) {

    this.UserGroupsApi.getGroupById(recID).subscribe((data: GroupDetails) => {
      this.GroupDetails = data.group;
      this.Permissions = data.permission;
      
      this.CreatedBy = this.GroupDetails.createdByName ?? 'Not Set';
      this.ModifiedBy = this.GroupDetails.modifiedByName ?? 'Not Set';
      if (this.GroupDetails.modificationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.ModificationDate = this.ClsGlobal.formatWithUtcOffsetString(this.GroupDetails.modificationDate, 'dd/MM/yyyy HH:mm:ss',  new DatePipe('en-US'));
      } else {
        this.ModificationDate = 'Not Set';
      }
      if (this.GroupDetails.creationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.GroupDetails.creationDate, 'dd/MM/yyyy HH:mm:ss',  new DatePipe('en-US'));
      } else {
        this.CreationDate = 'Not Set';
      }

    }, (error: any) => {
    });
  }
  //ShowAllItems(Mode: string) {
  //  if (Mode == 'AddOpr') {
  //    this.ShowCancelSave = true;
  //    this.ShowDelete = false;
  //    this.ShowClone = false;
  //    this.ShowPrint = false;
  //    this.ShowExport = false;
  //    this.ShowItems = false;
  //    this.ShowEdit = false;
  //    this.hideCreationBanner = true;
  //    this.ShowSearch = false;
  //    this.ShowAddNew = false;
  //  } else if (Mode == 'ViewOpr') {
  //    this.ShowCancelSave = true;
  //    this.ShowDelete = true;
  //    this.ShowClone = false;
  //    this.ShowPrint = false;
  //    this.ShowExport = false;
  //    this.ShowItems = false;
  //    this.ShowEdit = false;
  //    this.hideCreationBanner = false;
  //    this.ShowSearch = false;
  //    this.ShowAddNew = false;
  //  } else if (Mode == 'GridOpr') {
  //    this.ShowDelete = false;
  //    this.ShowPrint = false;
  //    this.ShowClone = false;
  //    this.ShowExport = false;
  //    this.ShowEdit = false;
  //    this.ShowSearch = true;
  //    this.ShowAddNew = true;

  //  } else if (Mode == 'CancelOpr') {
  //    this.ShowCancelSave = false;
  //    this.ShowDelete = true;
  //    this.ShowClone = true;
  //    this.ShowPrint = false;
  //    this.ShowExport = false;
  //    this.ShowItems = true;
  //    this.ShowEdit = true;
  //    this.hideCreationBanner = false;
  //    this.ShowSearch = false;
  //    this.ShowAddNew = false;

  //  } else if (Mode == 'GridSelectOpr') {
  //    this.ShowDelete = true;
  //    this.ShowPrint = true;
  //    this.ShowClone = false;
  //    this.ShowExport = false;
  //    this.ShowEdit = false;
  //    this.ShowSearch = false;
  //    this.ShowAddNew = false;
     
  //  }
  //  else if (Mode == 'Clone') {
  //    this.ShowCancelSave = true;
  //    this.ShowDelete = false;
  //    this.ShowClone = false;
  //    this.ShowPrint = false;
  //    this.ShowExport = false;
  //    this.ShowItems = false;
  //    this.ShowEdit = false;
  //    this.hideCreationBanner = true;
  //    this.ShowSearch = false;
  //    this.ShowAddNew = false;
  //  }
  //}
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

  AddpagePermissions() {
    this.PagesList.map(item => {
      if (item.checked) {
        var newId: number = 1;
        if (this.Permissions.length > 0) {
          newId = (this.Permissions[this.Permissions.length - 1].id) + 1;
        }
        
        const newPermision = new UserGroupsFile({
          id: newId,
          groupID: this.GroupDetails.id,
          fileName: item.title,
          name: item.title,
          addOpr: +this.ChangePermissionAdd,
          editOpr: +this.ChangePermissionEdit,
          deleteOpr: +this.ChangePermissionDelete,
          viewOpr: +this.ChangePermissionView,
          printOpr: +this.ChangePermissionPrint,
          cloneOpr: +this.ChangePermissionClone,
          exportOpr: +this.ChangePermissionExport
        });
        this.Permissions = this.Permissions.filter(value => value.name !== item.title);
        this.Permissions.push(newPermision);
        item.checked = false;
      }
    });
    this.ChangePermissionCheckAll = false;
    this.showChangePermissions = false;
    this.ChangePermissionAdd = false;
    this.ChangePermissionEdit = false;
    this.ChangePermissionDelete = false;
    this.ChangePermissionView = false;
    this.ChangePermissionPrint = false;
    this.ChangePermissionClone = false;
    this.ChangePermissionExport = false;
  }

  deletePermission(id: number) {
    this.Permissions = this.Permissions.filter(item => item.id !== id);
  }

  save(createForm: NgForm): void {
    if (createForm.valid) {
      this.requiredGroupName = false;
      

      if (this.GroupDetails.id == null) {
        this.GroupDetails.id = 0;
        this.error = 'Record  adedd successfully';
      }
      else { this.error = 'Record updated successfully'; }
      this.GroupDetails.isSuperAdmin = +this.GroupDetails.isSuperAdmin;
      this.UserGroupsApi.submitGroup({ cufexUsersGroup: this.GroupDetails, cufexGroupPermissionAllowed: this.Permissions }).subscribe({
        next: (response) => {
          this.ShowAllItems('ViewOpr');
          if (this.RecordID != '') {
            this.DisplayInfo(response);
            this.popupService.showMessage({
              title: 'Success!',
              desc: 'The group has been successfully edited',
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
            this.router.navigateByUrl(this.url + "/" + response);
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
    else {
      this.requiredGroupName = false;
  
      const Message = '';
      if (this.ClsGlobal.isFieldEmpty(this.GroupDetails, 'name')) {
        this.requiredGroupName = true;
        this.Message = '- Group Name is Required\n'
      }
     
      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  changepermissionstatus(event: Event, Opr: string, id: number) {
    const checkbox = event.target as HTMLInputElement;
    const checked: number = checkbox.checked ? 1 : 0;
    this.Permissions.map(item => {
      if (item.id == id) {
        if (Opr == "addOpr") {
          item.addOpr = checked;
        } else if (Opr == "editOpr") {
          item.editOpr = checked;
        } else if (Opr == "deleteOpr") {
          item.deleteOpr = checked;
        } else if (Opr == "viewOpr") {
          item.viewOpr = checked;
        } else if (Opr == "cloneOpr") {
          item.cloneOpr = checked;
        } else if (Opr == "exportOpr") {
          item.exportOpr = checked;
        } else if (Opr == "printOpr") {
          item.printOpr = checked;
        }
      }
    });

  }
}
