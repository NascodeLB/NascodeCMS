import { Component, ViewChild } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { MessageService, Message as MessageInterface } from 'primeng/api';
import { PopupService } from '../../Services/popup.service';
import { create } from 'lodash';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { DynamicContentDto } from '../../Models/DynamicContentDto.model';
import { DynamicContentApiService, PaginationFilter } from '../../Services/DynamicContentApi.service';
import { CKEditorComponent } from 'ng2-ckeditor';


@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrl: './dynamic-content.component.css'
})
export class DynamicContentComponent {
  Headers: { Title: string; Type: string, Code: string }[] = [];
  
  //form: FormGroup;
  contentDetails!: DynamicContentDto;
  RecordID: string = "";
  CreatedBy: string = "";
  CreationDate: string = "";
  ModifiedBy: string = "";
  ModificationDate: string = "";
  // form validators
  requiredTitle: boolean = false;
  requiredSubtitle: boolean = false;
  requiredPriority: boolean = false;
  requiredButtonText: boolean = false;
  requiredButtonLink: boolean = false;
  requiredDescription: boolean = false;
  requiredPicture: boolean = false;

  // for grid data
  Data: DynamicContentDto[] = [];
  Pages: number[] = [];
  CheckedIds: number[] = [];
  FirstPage: number = 0;
  LastPage: number = 0;
  Currentpage: number = 1;
  Title: string = "";
  Sort: string = "";
  ViewMode: string = "Items";

  SearchText: string = "";
  selectedValue: string = "";
  PageSize: number = 10;
  TotalCount: number = 0;


  // Hide/show buttons
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

  // for popup message
  error: string = '';
  Message: string = '';
  HeadMessage: string = '';

  // for gird pagination
  PaginationDetails: PaginationDto | null = null;
  // for default language id
  DefaultLanguage: number = 1;
 
  // for grid filters
  filters: PaginationFilter = {
    Sorting: 'id desc',
    SearchText: '',
    PageSize: 10,
    After: 0,
    language: this.DefaultLanguage
  }

  // for gird multi edit
  GridEditMode: boolean = false;
  GridEditShowCancelSave: boolean = false;
  CheckAll: boolean = false;
  GridEditErrors: any[] = [];

  // for page permissions
  PagePermissions: UserGroupsFile = new UserGroupsFile;
  // page url 
  url = "";

  // for dynamic content
  categoryId: number = 1;
  categoryTitle: string = "";


  // for description
  name = 'ng2-ckeditor';
  ckeConfig: CKEDITOR.config = {
    removePlugins: 'exportpdf'
  };;
  mycontent: string = "";
  @ViewChild("myckeditor") ckeditor!: CKEditorComponent;



  // to hide/show fields
  showTitle: boolean = true;
  showSubtitle: boolean = true;
  showPriority: boolean = true;
  showButtonTitle: boolean = true;
  showButtonLink: boolean = true;
  showDescription: boolean = true;
  showPicture: boolean = true;

  // for picture
  PictureInfo: string[] = [];
  PicturePath: string = "dynamicimages/pagesimages"
  Sectionname: string = "DynamicContent"

  isRTL: boolean = false;

  routeChangeEvent: boolean = false;

  constructor(
    public DynamicContentApi: DynamicContentApiService,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService,
    private messageService: MessageService,
    public Auth: AuthService
  ) {
  }


  ngOnInit(): void {

    this.Auth.getPagePermissions("dynamiccontent").subscribe(result => {
      this.PagePermissions = result;
    });
    this.setup();
   
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      
      this.setup();
      
    });

  }
  setup() {
   
    this.categoryId = Number.parseInt(this.route.snapshot.paramMap.get('id') ?? "");
    this.categoryTitle = this.route.snapshot.paramMap.get('pagetitle') ?? "";
    this.url = 'dashboard/dynamiccontent/' + this.categoryTitle + '/' + this.categoryId ;
    this.RecordID = this.route.snapshot.paramMap.get('contentId') ?? "";
    this.DefaultLanguage = Number.parseInt(this.route.snapshot.paramMap.get('language') ?? "1");
   
  
    this.Sectionname = "DynamicContent" + this.categoryTitle;
  
    this.contentDetails = new DynamicContentDto();

    this.showFields();

    if (this.RecordID != '') {
      this.ViewMode = "Details";
      this.ShowAllItems('ViewOpr');

      this.DisplayInfo(this.RecordID);
      if (this.DefaultLanguage == 3) {
        this.isRTL = true;
      }
    }
    else {
      this.DefaultLanguage = 1;
      this.filters = {
        Sorting: 'id desc',
        SearchText: '',
        PageSize: 10,
        After: 0,
        language: 1
      }
     
      this.getdata();
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
      
    }

  }
  showFields() {
    if (this.categoryId == 1) {
      this.showPicture = true;
      this.showDescription = false;
      this.showButtonLink = false;
      this.showButtonTitle = false;
      this.showSubtitle = false;
      this.Headers = [
        { Title: 'Title', Type: 'text', Code: 'title' },
        { Title: 'Picture', Type: 'picture', Code: 'picture' },
        { Title: 'Priority', Type: 'text', Code: 'priority' },
        { Title: 'Status', Type: 'toggle', Code: 'active' },
        { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
        { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
      ];
    } else if (this.categoryId == 2) {
      this.showPicture = false;
      this.Headers = [
        { Title: 'Title', Type: 'text', Code: 'title' },
        { Title: 'Sub title', Type: 'text', Code: 'subtitle' },
        { Title: 'Priority', Type: 'text', Code: 'priority' },
        { Title: 'Status', Type: 'toggle', Code: 'active' },
        { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
        { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
      ];
    } else if (this.categoryId == 4) {
      this.showPicture = true;
      this.showDescription = false;
      this.showTitle = false;
      this.showSubtitle = false;
      this.Headers = [
        { Title: 'Button Text', Type: 'text', Code: 'buttonText' },
        { Title: 'Button Link', Type: 'text', Code: 'buttonLink' },
        { Title: 'Picture', Type: 'picture', Code: 'picture' },
        { Title: 'Priority', Type: 'text', Code: 'priority' },
        { Title: 'Status', Type: 'toggle', Code: 'active' },
        { Title: 'LAST MODIFIED', Type: 'date', Code: 'lastModificationDate' },
        { Title: 'Modified by', Type: 'view', Code: 'modifiedByName' },
      ];
    }
  }

  getdata() {
   
    this.DynamicContentApi.getcontent(this.filters, this.categoryId).subscribe((result: { content: DynamicContentDto[], pagination: PaginationDto }) => {
      this.Data = result.content;
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

  handleactiveToggleChange(event: { id: number, checked: boolean }) {
    const { id, checked } = event;
    const status = checked ? 1 : 0;
    if (this.contentDetails != null) {
      this.DynamicContentApi.UpdateContentStatus(id, this.DefaultLanguage, this.categoryId, status).subscribe({
        next: (response) => {


        },
        error: (error) => {

        },
      });
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
    this.messageService.clear();
    if (this.RecordID != '') {

      this.router.navigateByUrl(this.url);
    } else {
      this.ViewMode = "Items";
      this.ShowAllItems('GridOpr');
    }
  }

  DisplayInfo(recID: string) {

    this.DynamicContentApi.getContentById(recID, this.DefaultLanguage, this.categoryId).subscribe((data: DynamicContentDto) => {

      this.contentDetails = data;
      if (data.picture) this.PictureInfo = [data.picture];
      if (data.description) this.mycontent = data.description;

      this.CreatedBy = this.contentDetails.createdByName ?? 'Not Set';
      this.ModifiedBy = this.contentDetails.modifiedByName ?? 'Not Set';
      if (this.contentDetails.modificationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.ModificationDate = this.ClsGlobal.formatWithUtcOffsetString(this.contentDetails.modificationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.ModificationDate = 'Not Set';
      }
      if (this.contentDetails.creationDate) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.contentDetails.creationDate, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
      } else {
        this.CreationDate = 'Not Set';
      }


      this.ShowAllItems("ViewOpr");

    }, (error: any) => {

      this.ShowAllItems("AddOpr");
    });
  }

  onCancel() {
    if (this.contentDetails.id != null) {
      this.ShowAllItems('CancelOpr');
    }
    else {
      this.Clear();
      this.ShowAllItems('AddOpr')
    }
  }

  Clear() {
    this.requiredTitle = false;
    this.requiredSubtitle = false;
    this.requiredButtonText = false;
    this.requiredButtonLink = false;
    this.requiredPriority = false;
    this.requiredPicture = false;
    this.contentDetails = new DynamicContentDto();
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
      //this.GridEditMode = true;
      //this.ShowAllItems('GridEditOpr');
      //this.HeadMessage = "Editing " + this.getSelectedItemCount() + " records";
    } else {
      this.ShowAllItems('ViewOpr');
    }
  }

  onDeleteCLick() {
    if (this.contentDetails != null) {
      if (this.ViewMode != 'Items') {
        this.popupService.showMessage({
          title: 'Confirm Action',
          desc: 'Are you sure you want to remove this record?',
          buttonTitle: 'OK',
          type: '',
          onConfirm: () => {
            this.DynamicContentApi.deleteContent(parseInt(String(this.contentDetails.id)), this.DefaultLanguage, this.categoryId).subscribe({
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
            this.deleteSelectedContents(this.CheckedIds);
          }
        });
      }
    }

  }
  onCloneCLick() {
    if (this.contentDetails && this.contentDetails.id) {
      // Create a new BankDto object by copying the current bankDetails
      const clonedContent: DynamicContentDto = {
        ...this.contentDetails,
        id: null, // Reset the ID for the clone to ensure it's treated as a new entity
        creationDate: null,
        createdBy: null,
        modificationDate: null,
        modifiedBy: null,
        modifiedByName: null,
      };
      this.contentDetails = clonedContent;
      this.ShowAllItems('Clone');
    } else {
      this.popupService.showMessage({
        title: 'Error!',
        desc: 'No record selected to clone.',
        buttonTitle: 'OK',
        type: 'Error',
      });
    }
  }

  save(createForm: NgForm): void {
    if (this.contentDetails.description == "") {
      this.contentDetails.description = this.mycontent;
    }
   
  //  console.log(this.contentDetails.description);
    this.requiredTitle = false;
    this.requiredSubtitle = false;
    this.requiredButtonText = false;
    this.requiredPriority = false;
    this.requiredButtonLink = false;
    this.requiredDescription = false;
    this.requiredPicture = false;
    var validdrop = true;

    this.Message = '';
    if (this.ClsGlobal.isFieldEmpty(this.contentDetails, 'title') && (this.categoryId == 1 || this.categoryId == 2)) {
      this.requiredTitle = true;
      this.Message += '-  Title is Required\n'
    }

    if (this.ClsGlobal.isFieldEmpty(this.contentDetails, 'subtitle') && (this.categoryId == 2)) {
      this.requiredSubtitle = true;
      this.Message += '- Subtitle is Required\n'
    }
    if (this.ClsGlobal.isFieldEmpty(this.contentDetails, 'priority') ) {
      this.requiredPriority = true;
      this.Message += '- Priority is Required\n'
    }

    if (this.ClsGlobal.isFieldEmpty(this.contentDetails, 'buttonLink') && (this.categoryId == 2 || this.categoryId == 4)) {
      this.requiredButtonLink = true;
      this.Message += '- Button link Required\n'
    }

    if (this.ClsGlobal.isFieldEmpty(this.contentDetails, 'buttonText') && (this.categoryId == 2 || this.categoryId == 4)) {
      this.requiredButtonText = true;
      this.Message += '- Button text is Required\n'
    }

    if (this.ClsGlobal.isFieldEmpty(this.contentDetails, 'description') && (this.categoryId == 2)) {
      this.requiredDescription = true;
      this.Message += '- Description text is Required\n'
    }
    if (this.ClsGlobal.isFieldEmpty(this.contentDetails, 'picture') && (this.categoryId == 1 || this.categoryId == 4)) {
      this.requiredPicture = true;
      this.Message += '- Picture is Required\n'
    }
  

    if (this.Message != '') {
      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    } else {

      if (this.contentDetails.id == null) {
        this.contentDetails.id = 0;
        this.error = 'Record  adedd successfully';
      }
      else { this.error = 'Record updated successfully'; }
      this.contentDetails.language = this.DefaultLanguage
      this.contentDetails.categoryID = this.categoryId;
      this.DynamicContentApi.submitcontent(this.contentDetails, this.categoryId, this.DefaultLanguage).subscribe({
        next: (response) => {
          this.ShowAllItems('ViewOpr');
          if (this.RecordID != '') {
            this.DisplayInfo(response);
            this.popupService.showMessage({
              title: 'Success!',
              desc: 'The content has been successfully edited',
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
         // console.log(error);
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

  deleteSelectedContents(contentIdsToDelete: number[]) {
    this.DynamicContentApi.deleteContents(contentIdsToDelete, this.DefaultLanguage, this.categoryId).subscribe({
      next: (response) => {
        let detailMessage = '';
        // When all banks are deleted
        if (response.deletedCount > 0 && response.undeletedCount === 0) {
          detailMessage = `All content deleted successfully. Total deleted: ${response.deletedCount}.`;
        }
        // When no banks are deleted
        else if (response.deletedCount === 0 && response.undeletedCount > 0) {
          detailMessage = `No content deleted. Total not deleted: ${response.undeletedCount}.`;
        }
        // When some banks are deleted and some are not
        else if (response.deletedCount > 0 && response.undeletedCount > 0) {

          detailMessage = `${response.undeletedCount} content(s) not deleted,\n ${response.deletedCount} content(s) deleted.\n`;

          if (response.undeletedTitles && response.undeletedTitles.length > 0) {
            detailMessage += ` Contents Not Deleted: ${response.undeletedTitles.join(', ')}.`;
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

  //SaveGridEdit() {
  //  const errors: any = [];
  //  this.Data.map((item: any) => {
  //    if (item.checked) {
  //      if (this.ClsGlobal.isFieldEmpty(item, 'bankName') || (item.bankName ?? '').length > 50) {
  //        errors.push({ id: item.id, field: "bankName" });
  //      }
  //      if (this.ClsGlobal.isFieldEmpty(item, 'accountNumber') || (item.accountNumber ?? '').length > 12) {
  //        errors.push({ id: item.id, field: "accountNumber" });
  //      }
  //      if (this.ClsGlobal.isFieldEmpty(item, 'iban') || (item.iban ?? '').length > 30) {
  //        errors.push({ id: item.id, field: "iban" });
  //      }
  //      if (this.ClsGlobal.isFieldEmpty(item, 'bicSwiftCode') || (item.bicSwiftCode ?? '').length > 30) {
  //        errors.push({ id: item.id, field: "bicSwiftCode" });
  //      }
  //    }
  //  });
  //  if (errors.length > 0) {
  //    this.GridEditErrors = errors;
  //  } else {
  //    this.Data.map((item: any) => {
  //      if (item.checked) {
  //        console.log(item);
  //        this.BankApi.submitBank(item).subscribe({
  //          next: (response) => {

  //          },
  //          error: (error) => {

  //          },
  //        });
  //      }
  //    });


  //    this.popupService.showMessage({
  //      title: 'success!',
  //      desc: 'Banks has been successfully edited',
  //      buttonTitle: 'ok',
  //      type: 'success',
  //      onConfirm: () => {
  //        this.GridEditErrors = [];
  //        this.Clear();
  //        this.ShowAllItems("GridOpr");
  //        this.getdata();
  //      }
  //    });

  //  }
  //}

  //handleGridEditInputChange(event: { value: string, id: number, field: string }) {
  //  const { value, id, field } = event;
  //  this.Data.map((item: any) => {
  //    if (item.id == id) {
  //      if (field == "bankName") {
  //        item.bankName = value;
  //      } else if (field == "accountNumber") {
  //        item.accountNumber = value;
  //      } else if (field == "iban") {
  //        item.iban = value;
  //      } if (field == "bicSwiftCode") {
  //        item.bicSwiftCode = value;
  //      }
  //    }
  //  });
  //}

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
      if (languageId == 3) {
        this.isRTL = true;
        this.ckeConfig = {
          contentsLangDirection: 'rtl',
          removePlugins: 'exportpdf'
        }

      } else {
        this.isRTL = false;
        this.ckeConfig = {
          contentsLangDirection: 'ltr',
          removePlugins: 'exportpdf'
        }

      }
      this.DisplayInfo(this.RecordID);
    }

  }

  onActiveToggleChangeInDetails(event: any) {
    this.contentDetails.active = event.checked ? 1 : 0;
  }

  handleonFilesChange(files: string[]) {
    this.contentDetails.picture = files[0];
  }


}
