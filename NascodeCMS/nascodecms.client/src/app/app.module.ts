import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountLoginComponent } from './Pages/account-login/account-login.component';
import { DataGridComponent } from './Components/data-grid/data-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IconButtonComponent } from './Components/icon-button/icon-button.component';
import { LanguageButtonComponent } from './Components/language-button/language-button.component';
import { IconTitleButtonComponent } from './Components/icon-title-button/icon-title-button.component';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { SearchBarComponent } from './Components/search-bar/search-bar.component';
import { PrintButtonComponent } from './Components/print-button/print-button.component';
import { ExportButtonComponent } from './Components/export-button/export-button.component';
import { GlobalService } from './Shared/Global.service';
import { DatePipe } from '@angular/common';
import { DropDownComponent } from './Components/drop-down/drop-down.component';
import { MultiSelectDropDownComponent } from './Components/multi-select-drop-down/multi-select-drop-down.component';
import { PopupMessageComponent } from './Components/popup-message/popup-message.component';
import { ImageEditorComponent } from './Components/image-editor/image-editor.component';
import { NgxPhotoEditorModule } from "ngx-photo-editor";
import { PicDimensionApiService } from './Services/picDimensionApi.service';
import { ImagePreviwerComponent } from './Components/image-previwer/image-previwer.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UsersGroupsComponent } from './Pages/users-groups/users-groups.component';
import { UsersGroupsApi } from './Services/UsersGroupsApi.service';
import { AccessDeniedComponent } from './Pages/access-denied/access-denied.component';
import { GlobalStaticKeywordsComponent } from './Pages/global-static-keywords/global-static-keywords.component';
import { GlobalStaticKeywordsApi } from './Services/GlobalStaticKeywordsApi.service';
import { DynamicContentComponent } from './Pages/dynamic-content/dynamic-content.component';
import { GeneralSettingsComponent } from './Pages/general-settings/general-settings.component';
import { EmailsBookManagementComponent } from './Pages/emails-book-management/emails-book-management.component';
import { UsersComponent } from './Pages/users/users.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { LogFrontendComponent } from './Pages/log-frontend/log-frontend.component';
import { AuditLogComponent } from './Pages/audit-log/audit-log.component';
import { ContactSubmissionsComponent } from './Pages/contact-submissions/contact-submissions.component';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { DatePickerComponent } from './Components/date-picker/date-picker.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TimeZonesComponent } from './Pages/time-zones/time-zones.component';
import { DropdownApi } from './Services/DropdownApi.service';
import { CountriesComponent } from './pages/countries/countries.component';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    DataGridComponent,
    AccountLoginComponent,
    IconButtonComponent,
    LanguageButtonComponent,
    IconTitleButtonComponent ,
    DataGridComponent,
    SearchBarComponent,
    PrintButtonComponent,
    ExportButtonComponent,
    DropDownComponent,
    MultiSelectDropDownComponent,
    PopupMessageComponent,
    ImageEditorComponent,
    ImagePreviwerComponent,
    SideBarComponent,
    DashboardComponent,
    UsersGroupsComponent,
    AccessDeniedComponent,
    GlobalStaticKeywordsComponent,
    DynamicContentComponent,
    GeneralSettingsComponent,
    EmailsBookManagementComponent,
    UsersComponent,
    ProfileComponent,
    LogFrontendComponent,
    AuditLogComponent,
    ContactSubmissionsComponent,
    DatePickerComponent,
    TimeZonesComponent,
    CountriesComponent,
   
  ],
  imports: [
    
    MatNativeDateModule,
    MatDatepickerModule,
    CKEditorModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    ConfirmDialogModule,
    ToastModule,
    NgxPhotoEditorModule
  ],
  providers: [ MessageService, AuthService, ConfirmationService, GlobalService, DatePipe, PicDimensionApiService , UsersGroupsApi, GlobalStaticKeywordsApi,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },], 
  bootstrap: [AppComponent]
})





export class AppModule { }
