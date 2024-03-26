import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLoginComponent } from './Pages/account-login/account-login.component'; 
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UsersGroupsComponent } from './Pages/users-groups/users-groups.component';
import { AccessDeniedComponent } from './Pages/access-denied/access-denied.component';
import { GlobalStaticKeywordsComponent } from './Pages/global-static-keywords/global-static-keywords.component';
import { DynamicContentComponent } from './Pages/dynamic-content/dynamic-content.component';
import { GeneralSettingsComponent } from './Pages/general-settings/general-settings.component';
import { EmailsBookManagementComponent } from './Pages/emails-book-management/emails-book-management.component';
import { UsersComponent } from './Pages/users/users.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { LogFrontendComponent } from './Pages/log-frontend/log-frontend.component';
import { AuditLogComponent } from './Pages/audit-log/audit-log.component';
import { ContactSubmissionsComponent } from './Pages/contact-submissions/contact-submissions.component';

const routes: Routes = [
  {
   
    path: 'dashboard', component: DashboardComponent, children: [
      // for definitions
   
      // for global static keywords
      { path: 'pages/:pagetitle/:id', component: GlobalStaticKeywordsComponent },

      // for dynamic content
      { path: 'dynamiccontent/:pagetitle/:id', component: DynamicContentComponent },
      { path: 'dynamiccontent/:pagetitle/:id/:contentId/:language', component: DynamicContentComponent },

      // for reports
      { path: 'reports/contactsubmissions', component: ContactSubmissionsComponent },
      { path: 'reports/contactsubmissions/:id', component: ContactSubmissionsComponent },
      { path: 'reports/errorslog', component: LogFrontendComponent },
      { path: 'reports/auditlogs', component: AuditLogComponent },

      // for settings
      { path: 'settings/generalsettings', component: GeneralSettingsComponent },
      { path: 'settings/profile', component: ProfileComponent },
      { path: 'settings/users', component: UsersComponent },
      { path: 'settings/users/:id', component: UsersComponent },
      { path: 'settings/usersgroups', component: UsersGroupsComponent },
      { path: 'settings/usersgroups/:id', component: UsersGroupsComponent },
      { path: 'settings/emailsbooks', component: EmailsBookManagementComponent },
      { path: 'settings/emailsbooks/:id/:language', component: EmailsBookManagementComponent },

    ] },
   
  { path: '', component: AccountLoginComponent },
  // for password reset
  { path: 'forgetpassword', component: AccountLoginComponent },
  { path: 'code-verify', component: AccountLoginComponent },
  { path: 'access-denied', component: AccessDeniedComponent },

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
