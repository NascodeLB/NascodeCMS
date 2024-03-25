import { Component } from '@angular/core';
import { PaginationDto } from '../../Models/PaginationDto.model';
import { LogFrontendApi, PaginationFilter } from '../../Services/LogFrontendApi.service';
import { LogFrontendDto } from '../../Models/LogFrontend.model';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-log-frontend',
  templateUrl: './log-frontend.component.html',
  styleUrl: './log-frontend.component.css'
})

export class LogFrontendComponent {
  // for grid 
  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Message', Type: 'text', Code: 'message' },
    { Title: 'Url', Type: 'text', Code: 'url' },
    { Title: 'Date', Type: 'date', Code: 'date' },
  ];
  Data: LogFrontendDto[] = [];

  
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
    todate: ""
  }
  ShowFilter: boolean = true;
  ShowFiltersPopup: boolean = false;


  constructor(
    public LogFrontendApi: LogFrontendApi,
    public Auth: AuthService
  ) {
  }
 


  ngOnInit(): void {
    this.Auth.getPagePermissions("errorslog").subscribe(result => {
      this.PagePermissions = result;
    });
      this.getdata();
  }

  getdata() {
    this.LogFrontendApi.getLogs(this.filters).subscribe((result: { logs: LogFrontendDto[], pagination: PaginationDto }) => {
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
      fromdate: this.fromdate,
      todate: this.todate,
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
