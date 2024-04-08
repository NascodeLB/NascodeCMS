import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { ActivatedRoute, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { PopupService } from '../../Services/popup.service';
import { AuthService } from '../../auth.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { CountryDto } from '../../Models/CountryDto.model';
import { CountriesApi, PaginationFilter } from '../../Services/CountriesApi.service';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})

export class CountriesComponent {
  // for grid 
  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Title', Type: 'text', Code: 'title' },
    { Title: 'Code', Type: 'text', Code: 'countryCode' },
    { Title: 'Status', Type: 'toggle', Code: 'active' },
    { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
    { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
  ];
  Data: CountryDto[] = [];

  // for record info
  CountryDetails!: CountryDto;

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
  DefaultLanguage: number = 1;
  filters: PaginationFilter = {
    Sorting: 'id desc',
    SearchText: '',
    PageSize: 10,
    After: 0,
    language: this.DefaultLanguage
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
  requiredcode: boolean = false;
  requiredtitle: boolean = false

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
  ShowLanguage: boolean = false;
  ShowAddNew: boolean = false;

  // for popup display
  error: string = '';
  Message: string = '';
  HeadMessage: string = '';
  ShowPopup: boolean = false;
  CheckAll: boolean = false;

  // page url
  url = "dashboard/definitions/countries";

  // for page permissions
  PagePermissions: UserGroupsFile = new UserGroupsFile;

  // for language input direction
  isRTL: boolean = false;



  constructor(
    public CountriesApi: CountriesApi,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService,
    public Auth: AuthService
  ) {
  }
  FillDropDown() {

  }


  ngOnInit(): void {
    this.Auth.getPagePermissions("countries").subscribe(result => {
      this.PagePermissions = result;
    });


    this.RecordID = this.route.snapshot.paramMap.get('id') ?? "";
    this.DefaultLanguage = Number.parseInt(this.route.snapshot.paramMap.get('language') ?? "1");

    this.CountryDetails = new CountryDto();

    if (this.RecordID != '') {
      this.ViewMode = "Details";
      this.ShowAllItems('ViewOpr');
      this.DisplayInfo(this.RecordID);
      if (this.DefaultLanguage == 3) {
        this.isRTL = true;
      }
    }
    else {
      this.getdata();
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
    }
  }

  getdata() {
    this.CountriesApi.getCountries(this.filters).subscribe((result: { countries: CountryDto[], pagination: PaginationDto }) => {
      this.Data = result.countries;
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
    this.router.navigateByUrl(this.url + '/' + id + '/' + this.DefaultLanguage);
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
      language: this.DefaultLanguage
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
      language: this.DefaultLanguage
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
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      language: this.DefaultLanguage
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

    this.CountriesApi.getCountryById(recID, this.DefaultLanguage).subscribe((data: CountryDto) => {

      this.CountryDetails = data;
      console.log(data);
      this.CreatedBy = this.CountryDetails.createdByName ?? 'Not Set';
      this.ModifiedBy = this.CountryDetails.modifiedByName ?? 'Not Set';
      if (this.CountryDetails.modificationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.ModificationDate = this.ClsGlobal.formatWithUtcOffsetString(this.CountryDetails.modificationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.ModificationDate = 'Not Set';
      }
      if (this.CountryDetails.creationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.CountryDetails.creationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.CreationDate = 'Not Set';
      }


      this.ShowAllItems("ViewOpr");

    }, (error: any) => {

      this.ShowAllItems("AddOpr");
    });
  }

  onCancel() {
    if (this.CountryDetails.id != null) {
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
    this.requiredcode = false;
    this.requiredtitle = false;
    this.CountryDetails = new CountryDto();
    this.ModificationDate = '';
    this.CreatedBy = '';
    this.CreationDate = '';
    this.ModifiedBy = '';
    this.Message = '';
    this.HeadMessage = this.TotalCount + " records";
  }



  onDeleteCLick() {
    if (this.CountryDetails != null) {
      if (this.ViewMode != 'Items') {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this record?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.CountriesApi.deleteCountry(parseInt(String(this.CountryDetails.id)), this.DefaultLanguage).subscribe({
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
            this.deleteSelectedCountries(this.CheckedIds);
          }
        });
      }
    }

  }
  onCloneCLick() {
    if (this.CountryDetails && this.CountryDetails.id) {

      const clonedEmailbook: CountryDto = {
        ...this.CountryDetails,
        id: null, // Reset the ID for the clone to ensure it's treated as a new entity
        creationDate: null,
        createdBy: null,
        modificationDate: null,
        modifiedBy: null,
        modifiedByName: null,
      };
      this.CountryDetails = clonedEmailbook;
      this.ShowAllItems('Clone');
    } else {
      this.popupService.showMessage({
        title: 'Error!',
        desc: 'No Email book record selected to clone.',
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  save(createForm: NgForm): void {

    this.requiredcode = false;
    this.requiredtitle = false;
    this.Message = '';
    var validdrop = true;
    this.Message = '';
    if (this.ClsGlobal.isFieldEmpty(this.CountryDetails, 'title')) {
      this.requiredtitle = true;
      this.Message += '- Title is Required\n'
    }
    if (this.ClsGlobal.isFieldEmpty(this.CountryDetails, 'countryCode')) {
      this.requiredcode = true;
      this.Message += '- Code is Required\n'
    }

    if (this.Message != '') {
      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    } else {
      if (this.CountryDetails.id == null) {
        this.CountryDetails.id = 0;
        this.error = 'Record  adedd successfully';
      }
      else { this.error = 'Record updated successfully'; }
      this.CountryDetails.language = this.DefaultLanguage

      this.CountriesApi.submitCountry(this.CountryDetails).subscribe({
        next: (response) => {
          this.ShowAllItems('ViewOpr');
          if (this.RecordID != '') {
            this.DisplayInfo(response);
            this.popupService.showMessage({
              title: 'Success!',
              desc: 'The Country has been successfully edited',
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
            this.router.navigateByUrl(this.url + '/' + response + '/' + this.DefaultLanguage);
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

  deleteSelectedCountries(IdsToDelete: number[]) {
    this.CountriesApi.deleteCountries(IdsToDelete, this.DefaultLanguage).subscribe({
      next: (response) => {
        let detailMessage = '';
        // When all Emailsbooks are deleted
        if (response.deletedCount > 0 && response.undeletedCount === 0) {
          detailMessage = `All Countries deleted successfully. Total deleted: ${response.deletedCount}.`;
        }
        // When no Emailsbooks are deleted
        else if (response.deletedCount === 0 && response.undeletedCount > 0) {
          detailMessage = `No Countries deleted. Total not deleted: ${response.undeletedCount}.`;
        }
        // When some Emailsbooks are deleted and some are not
        else if (response.deletedCount > 0 && response.undeletedCount > 0) {

          detailMessage = `${response.undeletedCount} Country(s) not deleted,\n ${response.deletedCount} bank(s) deleted.\n`;

          if (response.undeletedTitles && response.undeletedTitles.length > 0) {
            detailMessage += ` Countries Not Deleted: ${response.undeletedTitles.join(', ')}.`;
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
          After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
          language: this.DefaultLanguage
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
      After: this.Currentpage == 1 ? 0 : 10 * (this.Currentpage - 1),
      language: this.DefaultLanguage
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
      this.ShowLanguage = true;
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
      this.ShowLanguage = true;
      this.ShowAddNew = false;
      this.hideCreationBanner = false;
    } else if (Mode == 'GridOpr') {
      this.ShowDelete = false;
      this.ShowPrint = false;
      this.ShowClone = false;
      this.ShowExport = true;
      this.ShowEdit = false;
      this.ShowSearch = true;
      this.ShowLanguage = true;
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
      this.ShowLanguage = true;
      this.ShowAddNew = false;
    } else if (Mode == 'GridSelectOpr') {
      this.ShowDelete = true;
      this.ShowPrint = true;
      this.ShowClone = false;
      this.ShowExport = false;
      this.ShowEdit = false;
      this.ShowSearch = false;
      this.ShowLanguage = false;
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
      this.ShowLanguage = true;
      this.ShowAddNew = false;
    }
  }


  handlelanguageChange(languageId: number) {
    this.DefaultLanguage = languageId;
    if (this.ViewMode == "Items") {
      this.filters = {
        Sorting: 'id desc',
        SearchText: this.SearchText,
        PageSize: this.PageSize,
        After: 0,
        language: this.DefaultLanguage
      }
      this.getdata();
    } else if (this.ViewMode == "Details") {
      this.isRTL = false;
      if (languageId == 3) {
        this.isRTL = true;
      }
      this.DisplayInfo(this.RecordID);
    }

  }

  onActiveToggleChangeInDetails(event: any) {
    this.CountryDetails.active = event.checked ? 1 : 0;
  }

  handleactiveToggleChange(event: { id: number, checked: boolean }) {
    const { id, checked } = event;
    const status = checked ? 1 : 0;
    if (this.CountryDetails != null) {
      this.CountriesApi.UpdateCountryStatus(id, status, this.DefaultLanguage).subscribe();
    }
  }


}
