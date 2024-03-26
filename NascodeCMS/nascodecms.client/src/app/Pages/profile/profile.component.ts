import { Component } from '@angular/core';
import { UserDto } from '../../Models/UserDto.model';
import { GlobalService } from '../../Shared/Global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '../../Services/UsersApi.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  Data: UserDto = new UserDto;

 
  Disabled: boolean = true;
  ViewMode: string = "View";
  constructor(
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
    }, (error: any) => {
      // Handle errors here
    });
  }
}
