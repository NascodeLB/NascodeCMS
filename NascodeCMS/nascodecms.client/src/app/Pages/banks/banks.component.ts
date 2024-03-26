import { Component, OnInit } from '@angular/core';
import { BanksApiService, PaginationFilter } from '../../Services/BanksApi.service';
import { CurrenciesApiService } from '../../Services/CurrenciesApi.service';
import { BankDto } from '../../Models/BankDto.model';
import { CurrencyDto } from '../../Models/CurrencyDto.model';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { ActivatedRoute, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { PopupService } from '../../Services/popup.service';
import { create } from 'lodash';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.css'
})

export class BanksComponent {
  banks: BankDto[] = [];
  currencies: CurrencyDto[] = [];
  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Bank Name', Type: 'text', Code: 'bankName' },
    { Title: 'Account Number', Type: 'text', Code: 'accountNumber' },
    { Title: 'IBAN', Type: 'text', Code: 'iban' },
    { Title: 'BIC/Swift Code', Type: 'text', Code: 'bicSwiftCode' },
    { Title: 'CURRENCY', Type: 'view', Code: 'currency' },
    { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
    { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
  ];
  //form: FormGroup;
  Data: BankDto[] = [];
  bankDetails!: BankDto;
  Pages: number[] = [];
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
  SearchText: string = "";
  selectedValue: string = "";
  PageSize: number = 10;
  TotalCount: number = 0;
  requiredBankName: boolean = false;
  requiredAccountNumber: boolean = false;
  requiredIBAN: boolean = false;
  requiredBICSWIFTCode: boolean = false;
  requiredCurrency: boolean = false;
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
  error: string = '';
  Message: string = '';
  HeadMessage: string = '';
  PaginationDetails: PaginationDto | null = null;
  DefaultLanguage: number = 1;
  filters: PaginationFilter = {
    Sorting: 'id desc',
    SearchText: '',
    PageSize: 10,
    After: 0,
    language: this.DefaultLanguage
  }
  TypesDropdownData: { Value: string, Title: string }[] = [];
  ShowPopup: boolean = false;
  GridEditMode: boolean = false;

  GridEditShowCancelSave: boolean = false;
  CheckAll: boolean = false;
  url = "dashboard/definitions/banks";
  GridEditErrors: any[] = [];
  PagePermissions: UserGroupsFile = new UserGroupsFile;


  constructor(
    public BankApi: BanksApiService,
    public CurrencyApi: CurrenciesApiService,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService,
    private messageService: MessageService,
    public Auth: AuthService
  ) {
  }
  FillDropDown() {
    this.CurrencyApi.getCurrencies(this.filters).subscribe((result: { currencies: CurrencyDto[], pagination: PaginationDto }) => {
      this.currencies = result.currencies;
      this.TypesDropdownData = this.currencies.map(obj => ({
        Value: obj.id?.toString() || "",
        Title: obj.code || ""
      }));

      // Insert a new item at index 0
      this.TypesDropdownData.unshift({
        Value: "0",
        Title: "Select currency"
      });
    });
  }

  getdata() {
    // Convert the filters object into a JSON string
    const filtersStr = JSON.stringify(this.filters);

    // Save the string to local storage
    localStorage.setItem('myFilters', filtersStr);

    this.BankApi.getBanks(this.filters).subscribe((result: { banks: BankDto[], pagination: PaginationDto }) => {
      this.Data = result.banks;
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

  ngOnInit(): void {
    this.Auth.getPagePermissions("banks").subscribe(result => {
      this.PagePermissions = result;
    });
   
    this.FillDropDown()
    this.RecordID = this.route.snapshot.paramMap.get('id') ?? "";
    this.DefaultLanguage = Number.parseInt(this.route.snapshot.paramMap.get('language') ?? "1");

    this.bankDetails = new BankDto();
    /*    const filtersStr = localStorage.getItem('myFilters');*/
    /* this.filters = JSON.parse(filtersStr!);*/
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


  onAddNewClick() {
    this.ShowAllItems('AddOpr');
    this.Clear()
    this.ViewMode = "Details";
  }

  handleOnSelectChange(value: string) {
    this.bankDetails.currency = value;
    this.bankDetails.currencyID = Number(value);
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

  handleactiveToggleChange(event: { id: number, checked: boolean }) {
    const { id, checked } = event;
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
    this.messageService.clear();
    if (this.RecordID != '') {

      this.router.navigateByUrl(this.url);
    } else {
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
    }
  }

  DisplayInfo(recID: string) {

    this.BankApi.getBankById(recID, this.DefaultLanguage).subscribe((data: BankDto) => {

      this.bankDetails = data;
      this.CreatedBy = this.bankDetails.createdByName ?? 'Not Set';
      this.ModifiedBy = this.bankDetails.modifiedByName ?? 'Not Set';
      if (this.bankDetails.modificationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.ModificationDate = this.ClsGlobal.formatWithUtcOffsetString(this.bankDetails.modificationDate, 'dd/MM/yyyy HH:mm:ss',  new DatePipe('en-US'));
      } else {
        this.ModificationDate = 'Not Set';
      }
      if (this.bankDetails.creationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.bankDetails.creationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.CreationDate = 'Not Set';
      }

      this.selectedValue = this.bankDetails.currencyID?.toString() ?? "";
      
      this.ShowAllItems("ViewOpr");

    }, (error: any) => {

      this.ShowAllItems("AddOpr");
    });
  }

  onCancel() {
    if (this.bankDetails.id != null) {
      this.ShowAllItems('CancelOpr');
    }
    else {
      this.Clear();
      this.ShowAllItems('AddOpr')
    }
  }

  Clear() {
    this.requiredBankName = false;
    this.requiredAccountNumber = false;
    this.requiredBICSWIFTCode = false;
    this.requiredCurrency = false;
    this.requiredIBAN = false;
    this.bankDetails = new BankDto();
    this.FillDropDown();
    this.ModificationDate = '';
    this.CreatedBy = '';
    this.CreationDate = '';
    this.ModifiedBy = '';
    this.Message = '';
    this.GridEditMode = false;
    this.GridEditShowCancelSave = false;
    this.HeadMessage = this.TotalCount + " records";
  }

  onEditCLick() {
    if (this.ViewMode == 'Items') {
      this.GridEditMode = true;
      this.ShowAllItems('GridEditOpr');
      this.HeadMessage = "Editing " + this.getSelectedItemCount() + " records";
    } else {
      this.ShowAllItems('ViewOpr');
    }
  }

  onDeleteCLick() {
    if (this.bankDetails != null) {
      if (this.ViewMode != 'Items') {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this record?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.BankApi.deleteBank(parseInt(String(this.bankDetails.id)), this.DefaultLanguage).subscribe({
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
            this.deleteSelectedBanks(this.CheckedIds);
          }
        });
      }
    }

  }
  onCloneCLick() {
    if (this.bankDetails && this.bankDetails.id) {
      // Create a new BankDto object by copying the current bankDetails
      const clonedBank: BankDto = {
        ...this.bankDetails,
        id: null, // Reset the ID for the clone to ensure it's treated as a new entity
        creationDate: null,
        createdBy: null,
        modificationDate: null,
        modifiedBy: null,
        modifiedByName: null,
      };
      this.bankDetails = clonedBank;
      this.ShowAllItems('Clone');
    } else {
      this.popupService.showMessage({
        title: 'Error!',
        desc: 'No bank record selected to clone.',
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  save(createForm: NgForm): void {
    var validdrop = true;
    //if (this.bankDetails.currency == null || this.bankDetails.currency == '0') {
    //  validdrop = false
    //}
    if (createForm.valid && validdrop) {
      this.requiredBankName = false;
      this.requiredAccountNumber = false;
      this.requiredBICSWIFTCode = false;
      this.requiredIBAN = false;
      this.requiredCurrency = false;
      if (this.bankDetails.id == null) {
        this.bankDetails.id = 0;
        this.error = 'Record  adedd successfully';
      }
      else { this.error = 'Record updated successfully'; }
      this.bankDetails.languageID = this.DefaultLanguage
      this.BankApi.submitBank(this.bankDetails).subscribe({
        next: (response) => {
          this.ShowAllItems('ViewOpr');
          if (this.RecordID != '') {
            this.DisplayInfo(response);
            this.popupService.showMessage({
              title: 'Success!',
              desc: 'The bank has been successfully edited',
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
    else {

      this.requiredBankName = false;
      this.requiredAccountNumber = false;
      this.requiredBICSWIFTCode = false;
      this.requiredCurrency = false;
      this.requiredIBAN = false;
      this.Message = '';
      if (this.ClsGlobal.isFieldEmpty(this.bankDetails, 'bankName')) {
        this.requiredBankName = true;
        this.Message = '- Bank Name is Required\n'
      }
      if (this.ClsGlobal.isFieldEmpty(this.bankDetails, 'accountNumber')) {
        this.requiredAccountNumber = true;
        this.Message += '- Account Number is Required\n'
      }

      if (this.ClsGlobal.isFieldEmpty(this.bankDetails, 'iban')) {
        this.requiredIBAN = true;
        this.Message += '- IBAN is Required\n'
      }
      if (this.ClsGlobal.isFieldEmpty(this.bankDetails, 'bicSwiftCode')) {
        this.requiredBICSWIFTCode = true;
        this.Message += '- Bic/SwiftCode is Required\n'
      }

      if (this.bankDetails.currency == '0' || this.bankDetails.currency == null) {
        this.requiredCurrency = true;
        this.Message += '- Currency is Required\n'
      }

      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  deleteSelectedBanks(bankIdsToDelete: number[]) {
    this.BankApi.deleteBanks(bankIdsToDelete, this.DefaultLanguage).subscribe({
      next: (response) => {
        let detailMessage = '';
        // When all banks are deleted
        if (response.deletedCount > 0 && response.undeletedCount === 0) {
          detailMessage = `All banks deleted successfully. Total deleted: ${response.deletedCount}.`;
        }
        // When no banks are deleted
        else if (response.deletedCount === 0 && response.undeletedCount > 0) {
          detailMessage = `No bank deleted. Total not deleted: ${response.undeletedCount}.`;
        }
        // When some banks are deleted and some are not
        else if (response.deletedCount > 0 && response.undeletedCount > 0) {

          detailMessage = `${response.undeletedCount} bank(s) not deleted,\n ${response.deletedCount} bank(s) deleted.\n`;

          if (response.undeletedTitles && response.undeletedTitles.length > 0) {
            detailMessage += ` Banks Not Deleted: ${response.undeletedTitles.join(', ')}.`;
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
  canelGridEdit() {

    this.GridEditErrors = [];
    this.Clear();
    this.ShowAllItems("GridOpr");
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
      this.selectedValue = this.bankDetails.currencyID!.toString() ?? '';
      this.ShowSearch = false;
      this.ShowLanguage = true;
      this.ShowAddNew = false;
    } else if (Mode == 'GridSelectOpr') {
      this.ShowDelete = true;
      this.ShowPrint = true;
      this.ShowClone = false;
      this.ShowExport = false;
      this.ShowEdit = true;
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
    } else if (Mode == 'GridEditOpr') {
      this.ShowCancelSave = true;
      this.ShowDelete = false;
      this.ShowClone = false;
      this.ShowPrint = false;
      this.ShowExport = false;
      this.ShowItems = false;
      this.ShowEdit = false;
      this.hideCreationBanner = false;
      this.ShowSearch = false;
      this.ShowLanguage = false;
      this.ShowAddNew = false;
      this.GridEditShowCancelSave = true;
    }
  }

  SaveGridEdit() {
    const errors: any = [];
    this.Data.map((item: any) => {
      if (item.checked) {
        if (this.ClsGlobal.isFieldEmpty(item, 'bankName') || (item.bankName ?? '').length > 50) {
          errors.push({ id: item.id, field: "bankName" });
        }
        if (this.ClsGlobal.isFieldEmpty(item, 'accountNumber') || (item.accountNumber ?? '').length > 12) {
          errors.push({ id: item.id, field: "accountNumber" });
        }
        if (this.ClsGlobal.isFieldEmpty(item, 'iban') || (item.iban ?? '').length > 30) {
          errors.push({ id: item.id, field: "iban" });
        }
        if (this.ClsGlobal.isFieldEmpty(item, 'bicSwiftCode') || (item.bicSwiftCode ?? '').length > 30) {
          errors.push({ id: item.id, field: "bicSwiftCode" });
        }
      }
    });
    if (errors.length > 0) {
      this.GridEditErrors = errors;
    } else {
      this.Data.map((item: any) => {
        if (item.checked) {
          console.log(item);
          this.BankApi.submitBank(item).subscribe({
            next: (response) => {

            },
            error: (error) => {

            },
          });
        }
      });


      this.popupService.showMessage({
        title: 'success!',
        desc: 'Banks has been successfully edited',
        buttonTitle: 'ok',
        type: 'success',
        onConfirm: () => {
          this.GridEditErrors = [];
          this.Clear();
          this.ShowAllItems("GridOpr");
          this.getdata();
        }
      });

    }
  }

  handleGridEditInputChange(event: { value: string, id: number, field: string }) {
    const { value, id, field } = event;
    this.Data.map((item: any) => {
      if (item.id == id) {
        if (field == "bankName") {
          item.bankName = value;
        } else if (field == "accountNumber") {
          item.accountNumber = value;
        } else if (field == "iban") {
          item.iban = value;
        } if (field == "bicSwiftCode") {
          item.bicSwiftCode = value;
        }
      }
    });
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
      this.DisplayInfo(this.RecordID);
    }

  }
}


