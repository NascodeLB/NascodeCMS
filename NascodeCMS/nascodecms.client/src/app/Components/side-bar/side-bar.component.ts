import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { GlobalStaticKeywordsCategoriesDto } from '../../Models/GlobalStaticKeywordsCategoriesDto.model';
import { GlobalStaticKeywordsApi } from '../../Services/GlobalStaticKeywordsApi.service';
import { DynamicContentCategoriesDto } from '../../Models/DynamicContentCategoriesDto.model';
import { DynamicContentApiService } from '../../Services/DynamicContentApi.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  SelectedList: string = ""
  SelectedSubList: string = ""
  CloseMenu: boolean = false;
  PagePermissions: UserGroupsFile[] = [];
  StaticKewordsPages: GlobalStaticKeywordsCategoriesDto[] = [];
  DynamicContentPages: DynamicContentCategoriesDto[] = [];

  constructor(
    public GlobalStaticKeywordsApi: GlobalStaticKeywordsApi,
    public DynamicContentApi: DynamicContentApiService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    

    this.authService.getSidebarPagesPermissions().subscribe(result => {
      this.PagePermissions = result;
    
    });

    this.GlobalStaticKeywordsApi.getPages().subscribe((result: GlobalStaticKeywordsCategoriesDto[]) => {
      this.StaticKewordsPages = result;
    }, (error: any) => {
      // Handle errors here
    });

    this.DynamicContentApi.getDynamicContentPages().subscribe((result: DynamicContentCategoriesDto[]) => {
      this.DynamicContentPages = result;
     
    }, (error: any) => {
      // Handle errors here
    });

    const path = window.location.pathname.split("/");
    this.SelectedList = path[1].toLowerCase();
    
    if (path.length > 2) {
      this.SelectedList = path[2].toLowerCase();
      this.SelectedSubList = path[3].toLowerCase();
   
    }
  }
 
  checkViewPermissions(pagename: string) {
    var haveRight = false;
    this.PagePermissions.map(item => {
      if (item.fileName == pagename && item.viewOpr == 1) {
        haveRight = true;
      }
    });
    return haveRight;
  }
  
  handleOnListSelected(Title: string) {
    this.SelectedList = Title;
  }

  selectlink(Title: string, ListTitle: string) {
    this.SelectedList = ListTitle;
    this.SelectedSubList = Title;
    /*this.router.navigateByUrl(link);*/
  }

  changeMenuSize() {
    this.CloseMenu = !this.CloseMenu;
  }
  changeSelectedList(event: Event, listName: string) {
    const list = document.getElementById("list-" + listName);
    if (!list) {
      this.SelectedSubList = "";
    } else {
      if (this.CloseMenu == true) {
        this.CloseMenu = false;
      }
    }
    if (list?.classList.contains('expanded')) {
      list?.classList.remove("expanded");
    } else {
      this.SelectedList = listName;
      list?.classList.add("expanded");
    }
    
  }
}
