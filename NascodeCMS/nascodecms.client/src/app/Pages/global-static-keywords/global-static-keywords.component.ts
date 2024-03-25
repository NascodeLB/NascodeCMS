import { Component, ViewChild } from '@angular/core';
import { CKEditorComponent } from 'ng2-ckeditor';
import { AuthService } from '../../auth.service';
import { MessageService } from 'primeng/api';
import { PopupService } from '../../Services/popup.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GlobalService } from '../../shared/Global.service';
import { GlobalStaticKeywordsApi } from '../../Services/GlobalStaticKeywordsApi.service';
import { GlobalStaticKeywordsDto } from '../../Models/GlobalStaticKeywordsDto .model';
import { NgForm } from '@angular/forms';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-global-static-keywords',
  templateUrl: './global-static-keywords.component.html',
  styleUrl: './global-static-keywords.component.css'
})
export class GlobalStaticKeywordsComponent {
  name = 'ng2-ckeditor';
  ckeConfig: CKEDITOR.config = {
    removePlugins: 'exportpdf'
  }

  @ViewChild("myckeditor") ckeditor!: CKEditorComponent;

  PageId: number = 1;
  PageTitle: string = "";
  Data: GlobalStaticKeywordsDto[] = [];
  Sections: string[] = [];
  DefaultLanguage: number = 1;
  ViewMode: string = "View";
  PagePermissions: UserGroupsFile = new UserGroupsFile;
  Disabled: boolean = true;
  isRTL: boolean = false;
  constructor(
    public GlobalStaticKeywordsApi: GlobalStaticKeywordsApi,
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
    this.setup();
   
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setup();

    });

  }

  setup() {
    this.clear();
    this.Auth.getPagePermissions("statickeywords").subscribe(result => {
      this.PagePermissions = result;
    });

    this.PageId = Number.parseInt(this.route.snapshot.paramMap.get('id') ?? "1");
    this.PageTitle = this.route.snapshot.paramMap.get('pagetitle') ?? "";
    this.getdata();
  }
  clear() {
    this.Sections = [];
    this.Data = [];
    this.DefaultLanguage = 1;
    this.ViewMode = "View";
    this.PagePermissions = new UserGroupsFile;
    this.Disabled = true;
    this.isRTL = false;
  }
  getdata() {

    this.GlobalStaticKeywordsApi.getPageById(this.PageId, this.DefaultLanguage).subscribe((result: GlobalStaticKeywordsDto[]) => {
      this.Data = result;
      this.Data.map(item => {
        if (!this.Sections.includes(item.sectionName)) {
          this.Sections.push(item.sectionName);
        }
      })
    }, (error: any) => {
      // Handle errors here
    });
  }

  getFieldsInSection(name: string): GlobalStaticKeywordsDto[] {
    return this.Data.filter(item => item.sectionName == name);
  }


  handletoggleSectionChange(sectionName: string) {

    const div = document.getElementById('section-' + sectionName);
    if (div?.classList.contains("CloseSection")) {
      div?.classList.remove("CloseSection");
    } else {
      div?.classList.add("CloseSection");
    }
  }

  hanldeTextboxInputChange(event: Event, code: string) {
    const input = event.target as HTMLInputElement;
    this.Data.map(item => {
      if (item.code == code) {
        item.value = input.value;
      }
    });
  }

  save(): void {
    var errors = false;
    this.Data.map(item => {
      if (item.type == 'longdesc' && (item.value?.length ?? 0) > item.maxLength) {
        item.fielderror = true;
        errors = true;
      }
    })
    if (errors) {
      this.popupService.showMessage({
        title: 'Error!',
        desc: 'Some field have errors',
        buttonTitle: 'OK',
        type: 'Error',
      });



    } else {
      this.GlobalStaticKeywordsApi.submitStaticKeywords(this.PageId, this.DefaultLanguage, this.Data).subscribe({
        next: (response) => {

          this.popupService.showMessage({
            title: 'Success!',
            desc: 'Data has been successfully edited',
            buttonTitle: 'OK',
            type: 'Success',
          });
          this.Data.map(item => {
            item.fielderror = false;
          })
        },
        error: (error) => {
          this.popupService.showMessage({
            title: 'Error!',
            desc: 'Somthing went wrong please try again later',
            buttonTitle: 'OK',
            type: 'Error',
          });
        },
      });
    }
  }

  handlelanguageChange(languageId: number) {
    this.DefaultLanguage = languageId;
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
    this.getdata();
  }

  onEditCLick() {
    this.ViewMode = "Edit";
    this.Disabled = false;
  }
  onCancel() {
    this.ViewMode = "View";
    this.Disabled = true;
  }
  handleonFilesChange(files: string[], code: string) {
    this.Data.map(item => {
      if (item.code == code) {
        item.value = files[0];
      }
    });
   
  }
  getlocaldate(date: Date) {
    return this.ClsGlobal.formatWithUtcOffsetString(date, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
  }
}
