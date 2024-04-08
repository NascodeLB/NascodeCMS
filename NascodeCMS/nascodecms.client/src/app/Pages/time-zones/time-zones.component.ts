import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { ActivatedRoute, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, NgModel, Validators } from '@angular/forms';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { PopupService } from '../../Services/popup.service';
import { AuthService } from '../../auth.service';
import { TimezonesDto } from '../../Models/TimezonesDto.model';
import { TimezonesApi, PaginationFilter } from '../../Services/TimezonesApi.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { UsersGroupsApi } from '../../Services/UsersGroupsApi.service';


@Component({
  selector: 'app-time-zones',
  templateUrl: './time-zones.component.html',
  styleUrl: './time-zones.component.css'
})
export class TimeZonesComponent {
  // for grid 
  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Title', Type: 'text', Code: 'title' },
    { Title: 'Code', Type: 'text', Code: 'code' },
    { Title: 'UTC Offset', Type: 'text', Code: 'utcOffset' },
    { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
    { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
  ];
  Data: TimezonesDto[] = [];

  // for record info
  TimeZoneDetails!: TimezonesDto;

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
  requiredtitle: boolean = false;
  requiredcode: boolean = false;
  requiredutcOffset: boolean = false;
 

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
  url = "dashboard/definitions/timezones";

  // for page permissions
  PagePermissions: UserGroupsFile = new UserGroupsFile;

  


  constructor(
    public TimezoneApiService: TimezonesApi,
    public UsersGroupsApiService: UsersGroupsApi,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService,
    public Auth: AuthService
  ) {
  }
  



  ngOnInit(): void {
    this.Auth.getPagePermissions("timezones").subscribe(result => {
      this.PagePermissions = result;
    });

    
    this.RecordID = this.route.snapshot.paramMap.get('id') ?? "";

    this.TimeZoneDetails = new TimezonesDto();

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
    this.TimezoneApiService.getTimezones(this.filters).subscribe((result: { timezones: TimezonesDto[], pagination: PaginationDto }) => {
      this.Data = result.timezones;
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
   
    this.TimezoneApiService.getTimeZoneById(recID).subscribe((data: TimezonesDto) => {
      this.TimeZoneDetails = data;
      this.CreatedBy = this.TimeZoneDetails.createdByName ?? 'Not Set';
      this.ModifiedBy = this.TimeZoneDetails.modifiedByName ?? 'Not Set';
      if (this.TimeZoneDetails.modificationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.ModificationDate = this.ClsGlobal.formatWithUtcOffsetString(this.TimeZoneDetails.modificationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.ModificationDate = 'Not Set';
      }
      if (this.TimeZoneDetails.creationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.TimeZoneDetails.creationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.CreationDate = 'Not Set';
      }
      this.ShowAllItems("ViewOpr");
    }, (error: any) => {
      this.ShowAllItems("AddOpr");
    });
  }

  onCancel() {
    if (this.TimeZoneDetails.id != null) {
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
    this.requiredutcOffset = false;
    this.requiredcode = false;
    this.requiredtitle = false;
   
    this.TimeZoneDetails = new TimezonesDto();
    
    this.ModificationDate = '';
    this.CreatedBy = '';
    this.CreationDate = '';
    this.ModifiedBy = '';
    this.Message = '';
    this.HeadMessage = this.TotalCount + " records";
  }



  onDeleteCLick() {
    if (this.TimeZoneDetails != null) {
      if (this.ViewMode != 'Items') {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this record?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.TimezoneApiService.deleteTimezone(parseInt(String(this.TimeZoneDetails.id))).subscribe({
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
            this.deleteSelectedTimezones(this.CheckedIds);
          }
        });
      }
    }

  }
  onCloneCLick() {
    if (this.TimeZoneDetails && this.TimeZoneDetails.id) {

      const clonedEmailbook: TimezonesDto = {
        ...this.TimeZoneDetails,
        id: null, // Reset the ID for the clone to ensure it's treated as a new entity
        creationDate: null,
        createdBy: null,
        modificationDate: null,
        modifiedBy: null,
        modifiedByName: null,
      };
      this.TimeZoneDetails = clonedEmailbook;
      this.ShowAllItems('Clone');
    } else {
      this.popupService.showMessage({
        title: 'Error!',
        desc: 'No timezone record selected to clone.',
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  save(createForm: NgForm): void {
    this.requiredcode = false;
    this.requiredtitle = false;
    this.requiredutcOffset = false;
   
    this.Message = '';
    if (this.ClsGlobal.isFieldEmpty(this.TimeZoneDetails, 'title')) {
      this.requiredtitle = true;
      this.Message += '- Title is Required\n'
    }
    if (this.ClsGlobal.isFieldEmpty(this.TimeZoneDetails, 'code')) {
      this.requiredcode = true;
      this.Message += '- Code is Required\n'
    }
   
    if (this.ClsGlobal.isFieldEmpty(this.TimeZoneDetails, 'utcOffset')) {
      this.requiredutcOffset = true;
      this.Message += '- UTC Offset is Required\n'
    }
   
    if (this.Message != '') {
      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    } else {
      if (this.TimeZoneDetails.id == null) {
        this.TimeZoneDetails.id = 0;
        this.error = 'Record  adedd successfully';
      }
      else { this.error = 'Record updated successfully'; }
      this.TimezoneApiService.submitTimeZone(this.TimeZoneDetails).subscribe({
        next: (response) => {
          this.ShowAllItems('ViewOpr');
          if (this.RecordID != '') {
            this.DisplayInfo(response);
            this.popupService.showMessage({
              title: 'Success!',
              desc: 'The Timezone has been successfully edited',
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

  deleteSelectedTimezones(EmailsbooksIdsToDelete: number[]) {
    this.TimezoneApiService.deleteManyTimezones(EmailsbooksIdsToDelete).subscribe({
      next: (response) => {
        let detailMessage = '';
        // When all Emailsbooks are deleted
        if (response.deletedCount > 0 && response.undeletedCount === 0) {
          detailMessage = `All Timezones deleted successfully. Total deleted: ${response.deletedCount}.`;
        }
        // When no Emailsbooks are deleted
        else if (response.deletedCount === 0 && response.undeletedCount > 0) {
          detailMessage = `No Timezones deleted. Total not deleted: ${response.undeletedCount}.`;
        }
        // When some Emailsbooks are deleted and some are not
        else if (response.deletedCount > 0 && response.undeletedCount > 0) {

          detailMessage = `${response.undeletedCount} Timezone(s) not deleted,\n ${response.deletedCount} bank(s) deleted.\n`;

          if (response.undeletedTitles && response.undeletedTitles.length > 0) {
            detailMessage += ` Timezones Not Deleted: ${response.undeletedTitles.join(', ')}.`;
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

 


}
