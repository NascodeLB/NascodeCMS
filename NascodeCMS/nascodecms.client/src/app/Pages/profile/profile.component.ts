import { Component } from '@angular/core';
import { UserDto } from '../../Models/UserDto.model';
import { GlobalService } from '../../Shared/Global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '../../Services/UsersApi.service';
import { PopupService } from '../../Services/popup.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  Data: UserDto = new UserDto;

 
  Disabled: boolean = true;
  ViewMode: string = "View";

  // for form validation
  requiredFullname: boolean = false;
  requiredMobile: boolean = false;

  // for popup display
  Message: string = '';

  constructor(
    public popupService: PopupService,
    public UserApi: UsersApiService,
    public ClsGlobal: GlobalService,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
   
    this.getdata();
  }
  getdata() {

    this.UserApi.getLoggedUserData().subscribe((result: UserDto) => {
      this.Data = result;
      this.Data.password = "";
    }, (error: any) => {
      // Handle errors here
    });
  }
  onEditCLick() {
    this.Disabled = false;
    this.ViewMode = "Edit";
  }
  save() {
    this.requiredFullname = false;
    this.requiredMobile = false;
    this.Message = '';

    if (this.ClsGlobal.isFieldEmpty(this.Data, 'fullName')) {
      this.requiredFullname = true;
      this.Message += '- Fullname is Required\n'
    }

    if (this.ClsGlobal.isFieldEmpty(this.Data, 'mobile') || this.ClsGlobal.isNumericField(this.Data, 'mobile') == false) {
      this.requiredMobile = true;
      this.Message += '- Mobile Number is Required\n'
    }

    if (this.Message != '') {
      this.popupService.showMessage({
        title: 'Error!',
        desc: this.Message,
        buttonTitle: 'OK',
        type: 'Error',
      });
    } else {
      console.log(this.Data);
      this.UserApi.submitUser(this.Data).subscribe({
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
            desc: 'Somthing went  rong please try again later',
            buttonTitle: 'OK',
            type: 'Error',
          });
        },
      });

    }


  }
  onCancel() {
    this.ViewMode = "View";
    this.Disabled = true;
  }
}
