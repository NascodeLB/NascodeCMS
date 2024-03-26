import { Component } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { ContactDto } from '../../Models/ContactDto.model';
import { ContactApiService, PaginationFilter } from '../../Services/ContactApi.service';


@Component({
  selector: 'app-contact-submissions',
  templateUrl: './contact-submissions.component.html',
  styleUrl: './contact-submissions.component.css',
})

export class ContactSubmissionsComponent {
    Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Prefered Language', Type: 'text', Code: 'languageName' },
    { Title: 'FullName', Type: 'text', Code: 'fullName' },
    { Title: 'Email', Type: 'text', Code: 'email' },
    { Title: 'Mobile', Type: 'text', Code: 'mobile' },
    { Title: 'Company Name', Type: 'text', Code: 'companyName' },
    { Title: 'Date', Type: 'date', Code: 'date' },
  ];
  //form: FormGroup;
  Data: ContactDto[] = [];
  contactDetails!: ContactDto;
  ViewMode: string = "Items";
  RecordID: string = "";
  CreationDate: string = "";


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
  
  ShowItems: boolean = false;
  ShowPrint: boolean = false;
  ShowExport: boolean = false;
  ShowSearch: boolean = false;
  ShowLanguage: boolean = false;
  ShowFilter: boolean = false;
  ShowFiltersPopup: boolean = false;

  HeadMessage: string = '';
  PaginationDetails: PaginationDto | null = null;

  
  
  CheckAll: boolean = false;
  url = "dashboard/reports/contactsubmissions";

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
    language: this.DefaultLanguage,
    fromdate: "",
    todate: ""
  }

  constructor(
    public ContactApi: ContactApiService,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public Auth: AuthService
  ) {
  }




  ngOnInit(): void {
    this.Auth.getPagePermissions("contactsubmissions").subscribe(result => {
      this.PagePermissions = result;
    });

   
    this.RecordID = this.route.snapshot.paramMap.get('id') ?? "";
    this.DefaultLanguage = Number.parseInt(this.route.snapshot.paramMap.get('language') ?? "1");

    this.contactDetails = new ContactDto();

    if (this.RecordID != '') {
      this.ViewMode = "Details";
  
      this.DisplayInfo(this.RecordID);
    }
    else {
      this.getdata();
      this.ViewMode = "Items";
      this.ShowExport = true;
      this.ShowSearch = true;
      this.ShowLanguage = true;
      this.ShowFilter = true;
    }
  }

  getdata() {
   

    this.ContactApi.getContacts(this.filters).subscribe((result: { contacts: ContactDto[], pagination: PaginationDto }) => {
      this.Data = result.contacts;
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
    if (!hasCheckedItem) {
     
      this.HeadMessage = this.TotalCount + " Records";
    }

  }

 
  handleRowCLick(id: number) {
    this.router.navigateByUrl(this.url + '/' + id );
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
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
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
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
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
    } else {
     
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
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
    }
    this.getdata();

  }

  goback() {
    this.messageService.clear();
    if (this.RecordID != '') {

      this.router.navigateByUrl(this.url);
    } else {
      this.ViewMode = "Items";
      
    }
  }

  DisplayInfo(recID: string) {

    this.ContactApi.getContactById(recID).subscribe((data: ContactDto) => {

      this.contactDetails = data;
  
      if (this.contactDetails.date) {
        const utcOffsetString = localStorage.getItem('utcOffset')?.toString() ?? '+03';
        this.CreationDate = this.ClsGlobal.formatWithUtcOffsetString(this.contactDetails.date, 'dd/MM/yyyy HH:mm:ss',  new DatePipe('en-US'));
      } 
      
    }, (error: any) => {
    });
  }



  Clear() {
   
    this.contactDetails = new ContactDto();
    this.CreationDate = '';
   
    this.HeadMessage = this.TotalCount + " records";
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
      language: this.DefaultLanguage,
      fromdate: this.fromdate,
      todate: this.todate,
    }
    this.getdata();
  }

  handlelanguageChange(languageId: number) {
    this.DefaultLanguage = languageId;

    if (this.ViewMode == "Items") {
      this.filters = {
        Sorting: 'id desc',
        SearchText: this.SearchText,
        PageSize: this.PageSize,
        After: 0,
        language: this.DefaultLanguage,
        fromdate: this.fromdate,
        todate: this.todate,
      }
      this.getdata();
    } 

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
    }
    this.getdata();
  }
}

