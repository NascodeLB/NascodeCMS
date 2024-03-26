import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { ActivatedRoute, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { PopupService } from '../../Services/popup.service';
import { AuthService } from '../../auth.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { EmailsbookDto } from '../../Models/EmailsbookDto.model';
import { EmailsbookApi, PaginationFilter } from '../../Services/EmailsbookApi.service';
import { CKEditorComponent } from 'ng2-ckeditor';

@Component({
  selector: 'app-emails-book-management',
  templateUrl: './emails-book-management.component.html',
  styleUrl: './emails-book-management.component.css'
})
export class EmailsBookManagementComponent {
  // for grid 
  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Code', Type: 'text', Code: 'code' },
    { Title: 'Subject', Type: 'text', Code: 'subject' },
    { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
    { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
  ];
  Data: EmailsbookDto[] = [];

  // for record info
  EmailbookDetails!: EmailsbookDto;

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
  requiredsubject: boolean = false;


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
  url = "dashboard/settings/emailsbooks";

  // for page permissions
  PagePermissions: UserGroupsFile = new UserGroupsFile;

  // for description
  name = 'ng2-ckeditor';
  ckeConfig: CKEDITOR.config = {
    removePlugins: 'exportpdf'
  };
  mycontent: string = "";
  @ViewChild("myckeditor") ckeditor!: CKEditorComponent;





  constructor(
    public EmailsbookApi: EmailsbookApi,
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
    this.Auth.getPagePermissions("emailsbooks").subscribe(result => {
      this.PagePermissions = result;
    });

    this.FillDropDown()
    this.RecordID = this.route.snapshot.paramMap.get('id') ?? "";
    this.DefaultLanguage = Number.parseInt(this.route.snapshot.paramMap.get('language') ?? "1");

    this.EmailbookDetails = new EmailsbookDto();
   
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
    this.EmailsbookApi.getEmailsbooks(this.filters).subscribe((result: { emailsbooks: EmailsbookDto[], pagination: PaginationDto }) => {
      this.Data = result.emailsbooks;
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

    this.EmailsbookApi.getEmailbookById(recID, this.DefaultLanguage).subscribe((data: EmailsbookDto) => {

      this.EmailbookDetails = data;
      if (data.body) this.mycontent = data.body;
      this.CreatedBy = this.EmailbookDetails.createdByName ?? 'Not Set';
      this.ModifiedBy = this.EmailbookDetails.modifiedByName ?? 'Not Set';
      if (this.EmailbookDetails.modificationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.ModificationDate = this.ClsGlobal.formatWithUtcOffsetString(this.EmailbookDetails.modificationDate, 'dd/MM/yyyy HH:mm:ss',  new DatePipe('en-US'));
      } else {
        this.ModificationDate = 'Not Set';
      }
      if (this.EmailbookDetails.creationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.EmailbookDetails.creationDate, 'dd/MM/yyyy HH:mm:ss',  new DatePipe('en-US'));
      } else {
        this.CreationDate = 'Not Set';
      }

     
      this.ShowAllItems("ViewOpr");

    }, (error: any) => {

      this.ShowAllItems("AddOpr");
    });
  }

  onCancel() {
    if (this.EmailbookDetails.id != null) {
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
    this.requiredsubject = false;
    this.EmailbookDetails = new EmailsbookDto();
    this.FillDropDown();
    this.ModificationDate = '';
    this.CreatedBy = '';
    this.CreationDate = '';
    this.ModifiedBy = '';
    this.Message = '';
    this.HeadMessage = this.TotalCount + " records";
  }

 

  onDeleteCLick() {
    if (this.EmailbookDetails != null) {
      if (this.ViewMode != 'Items') {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this record?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.EmailsbookApi.deleteEmailbook(parseInt(String(this.EmailbookDetails.id)), this.DefaultLanguage).subscribe({
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
            this.deleteSelectedEmailsbooks(this.CheckedIds);
          }
        });
      }
    }

  }
  onCloneCLick() {
    if (this.EmailbookDetails && this.EmailbookDetails.id) {
      
      const clonedEmailbook: EmailsbookDto = {
        ...this.EmailbookDetails,
        id: null, // Reset the ID for the clone to ensure it's treated as a new entity
        creationDate: null,
        createdBy: null,
        modificationDate: null,
        modifiedBy: null,
        modifiedByName: null,
      };
      this.EmailbookDetails = clonedEmailbook;
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
    if (this.EmailbookDetails.body == "") {
      this.EmailbookDetails.body = this.mycontent;
    }

    var validdrop = true;
   
    if (createForm.valid && validdrop) {
      this.requiredcode = false;
      this.requiredsubject = false;
     
      if (this.EmailbookDetails.id == null) {
        this.EmailbookDetails.id = 0;
        this.error = 'Record  adedd successfully';
      }
      else { this.error = 'Record updated successfully'; }
      this.EmailbookDetails.language = this.DefaultLanguage
      console.log("save");
      console.log(this.EmailbookDetails)
      this.EmailsbookApi.submitEmailbook(this.EmailbookDetails).subscribe({
        next: (response) => {
          this.ShowAllItems('ViewOpr');
          if (this.RecordID != '') {
            this.DisplayInfo(response);
            this.popupService.showMessage({
              title: 'Success!',
              desc: 'The Emailbook has been successfully edited',
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

      this.requiredcode = false;
      this.requiredsubject = false;

      this.Message = '';
      if (this.ClsGlobal.isFieldEmpty(this.EmailbookDetails, 'code')) {
        this.requiredcode = true;
        this.Message = '- Code Name is Required\n'
      }
      if (this.ClsGlobal.isFieldEmpty(this.EmailbookDetails, 'subject')) {
        this.requiredsubject = true;
        this.Message += '- Subject Number is Required\n'
      }



      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  deleteSelectedEmailsbooks(EmailsbooksIdsToDelete: number[]) {
    this.EmailsbookApi.deleteManybanks(EmailsbooksIdsToDelete, this.DefaultLanguage).subscribe({
      next: (response) => {
        let detailMessage = '';
        // When all Emailsbooks are deleted
        if (response.deletedCount > 0 && response.undeletedCount === 0) {
          detailMessage = `All Emailsbooks deleted successfully. Total deleted: ${response.deletedCount}.`;
        }
        // When no Emailsbooks are deleted
        else if (response.deletedCount === 0 && response.undeletedCount > 0) {
          detailMessage = `No Emailsbooks deleted. Total not deleted: ${response.undeletedCount}.`;
        }
        // When some Emailsbooks are deleted and some are not
        else if (response.deletedCount > 0 && response.undeletedCount > 0) {

          detailMessage = `${response.undeletedCount} Emailsbooks(s) not deleted,\n ${response.deletedCount} bank(s) deleted.\n`;

          if (response.undeletedTitles && response.undeletedTitles.length > 0) {
            detailMessage += ` Emailsbooks Not Deleted: ${response.undeletedTitles.join(', ')}.`;
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
      this.DisplayInfo(this.RecordID);
    }

  }
}
