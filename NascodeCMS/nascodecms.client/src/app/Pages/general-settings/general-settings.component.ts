import { Component } from '@angular/core';
import { UserGroupsFile } from '../../Models/UserGroupsFile.model';
import { PropertyDto } from '../../Models/PropertyDto.model';
import { PropertiesApi } from '../../Services/PropertiesApi.service';
import { GlobalService } from '../../shared/Global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { MessageService } from 'primeng/api/messageservice';
import { PopupService } from '../../Services/popup.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.css'
})
export class GeneralSettingsComponent {
  Data: PropertyDto[] = [];

  PagePermissions: UserGroupsFile = new UserGroupsFile;
  Disabled: boolean = true;
  ViewMode: string = "View";
  constructor(
    public propertiesApi: PropertiesApi,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService,

    public Auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.Auth.getPagePermissions("generalsettings").subscribe(result => {
      this.PagePermissions = result;
    });
    this.getdata();
  }
  getdata() {

    this.propertiesApi.getProperties().subscribe((result: PropertyDto[]) => {
      this.Data = result;
      
    }, (error: any) => {
      // Handle errors here
    });
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

      this.propertiesApi.submitProperties(this.Data).subscribe({
        next: (response) => {

          this.popupService.showMessage({
            title: 'Success!',
            desc: 'Data has been successfully edited',
            buttonTitle: 'OK',
            type: 'Success',
          });
         
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



    onEditCLick() {
      this.ViewMode = "Edit";
      this.Disabled = false;
    }
    onCancel() {
      this.ViewMode = "View";
      this.Disabled = true;
    }

  }
