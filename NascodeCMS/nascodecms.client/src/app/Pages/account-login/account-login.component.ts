import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrl: './account-login.component.css'
})
export class AccountLoginComponent {
  MyBg!: string;
  lastemail!: string;
  LoginSentence!: string;
  ErrorMsg!: string;
  ColorMe!: string;
  isEmailFocused: boolean = false;
  isPasswordFocused: boolean = false;
  shouldShowResetDiv: boolean = false;
  shouldChangeColor = false;
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;



  changeColor() {
    this.shouldChangeColor = !this.shouldChangeColor;
  }
  toggleDivVisibility() {
    this.shouldShowResetDiv = !this.shouldShowResetDiv;
    this.form.reset();
    this.form2.reset();
    this.form3.reset();
  }

  shouldDisplayVerifyContent(): boolean {

    return (window.location.href.toLowerCase().indexOf("code-verify") !== -1);

  }
  shouldDisplayNewContent(): boolean {

    return (window.location.href.toLowerCase().indexOf("forgetpassword") !== -1);

  }

  constructor(
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService
  ) {
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.form2 = fb.group({
      ResetCode: ['', Validators.required],
      email: ['']
    });
    this.form3 = fb.group({
      ResetCode: [''],
      email: [''],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    });
    this.form4 = fb.group({
      email: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.MyBg = './assets/images/login_bg.png';

    if (this.shouldShowResetDiv) {
      this.ErrorMsg = "Enter your email and choose a new password";
      this.LoginSentence = "Reset password"
    } else {
      this.ErrorMsg = 'Enter your details below to access your account.';
      this.LoginSentence = "Login"
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.ErrorMsg = 'Please fill in all required fields';
      this.shouldChangeColor = true;
      return;
    }

    try {
      const success = await this.auth.loginCufex(this.form.value).toPromise();

      if (success) { 
        this.form.reset(); 
        this.auth.GetUserTimeZone().subscribe({
          next: (response) => {
            localStorage.setItem('utcOffset', response.utcOffest);
          },
          error: (error) => {
          }
        });
        this.router.navigateByUrl('/dashboard')
      } else { 
        this.ErrorMsg = 'Incorrect username or password, try again.';
        this.shouldChangeColor = true;
        this.form.reset();
      }
    } catch (error) {
      this.ErrorMsg = 'An error occurred during login. Please try again later.';
      // Log the error or handle it as needed
    }
  }
  onVerifySubmitRequest() {
    this.auth.SendResetPasswordEmail(this.form4.value).subscribe(

      success => {
        if (success) {
          localStorage.setItem('memberemail', this.form4.get('email')?.value);
          localStorage.setItem('verifykey', this.form2.get('code')?.value);
          this.router.navigateByUrl('/code-verify')
        }
      },
      error => {
        // Handle error case, if necessary
      }
    );
  }

  onVerifyCode() {

    this.form2.patchValue({
      email: localStorage.getItem('memberemail'),
    }); 
    this.auth.CheckVerificationCode(this.form2.value).subscribe(

      success => {
        if (success) {
          this.form3.reset();
          this.router.navigateByUrl('/forgetpassword')
        }
      },
      error => {
        // Handle error case, if necessary
      }
    );
  }



  onNewPasswordSubmit() { 
    this.form3.patchValue({
      email: localStorage.getItem('memberemail'),
      ResetCode: localStorage.getItem('verifykey'),
    });
    this.auth.ResetPassword(this.form3.value).subscribe(
      success => {
        if (success) {
          this.router.navigateByUrl('/')
        } else {
        }
      },
      error => {
        // Handle error case, if necessary
      }
    );
  }
}

