import {
  Component,
  OnInit
} from '@angular/core';
import {
  AuthService
} from 'src/app/services/auth-service/auth.service';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  EndpointService
} from 'src/app/services/endpoint-service/endpoint.service';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { DialogService } from 'primeng/dynamicdialog';

/**
 * Handles login to both servers
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService]
})
export class LoginComponent implements OnInit {

  /**
   * `loginForm` is the FormGroup with the inputs and validators.
   */
  loginForm: FormGroup;
  errorMessage: String;
  error: boolean;
  hide: boolean;

  /**
   * Message object with strings that appear when the input isn't of the correct form. 
   */
  validationMessages = {
    email: [{
      type: 'required',
      message: 'Email is required'
    }],
    password: [{
      type: 'required',
      message: 'Password is required'
    }, ]
  };

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private endpointService: EndpointService,
    private dialogService : DialogService) {
    this.hide = true;
  }

  msg  = [];

  toggleHide() {
    this.hide = !this.hide;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * First check if inputs are empty. If not, create two login requests - one for the dev and one 
   * for the prod server with the same credentials. One of those requests has to succeed, else
   * an error message will be displayed.
   */
  onClickLogin(): void {
    this.msg = [];
    if (this.loginForm.invalid) {
      this.msg.push({severity:'error', summary:'Login failed', detail:'Invalid Email Address', closable:false})
      return;
    }

    let spinner = this.dialogService.open(SpinnerComponent, {
      showHeader:false,
      closable:false,
      styleClass:"spinner"
    });

    this.hide = true;
    this.error = false;
    let responseReturned = false;
    const val = this.loginForm.value;


    let dev = false;
    let prod = false;

    this.authService.devLogin(val.email, val.password)
      .subscribe(
        data => {
          dev = true;
          
          if (responseReturned) {
            spinner.close();
            this.endpointService.setAllowed(dev, prod);
            this.router.navigate(['admin/dashboard']);
          }
          responseReturned = true;
        },
        error => {
          if (responseReturned) {
            spinner.close();
            if(!prod) {
              console.log("error");
              this.errorMessage = 'Login failed';

              this.msg.push({severity:'error', summary:'Login failed', detail:'Invalid Credentials or no Admin', closable:false});
              this.error = true;
            } else {
              this.endpointService.setAllowed(dev, prod);
              this.router.navigate(['admin/dashboard']);
            }
            dev = false;
          }

          responseReturned = true;
        }
      );

    this.authService.prodLogin(val.email, val.password)
      .subscribe(
        data => {
          prod = true;
          if (responseReturned) {
            spinner.close();
            this.endpointService.setAllowed(dev, prod);
            this.router.navigate(['admin/dashboard']);
          }
          responseReturned = true;
        },
        error => {
          prod = false;
          if (responseReturned) {
            spinner.close();
            if (!dev) {
              console.log("error");
              this.msg.push({severity:'error', summary:'Login failed', detail:'Invalid Credentials or no Admin', closable:false});
              this.error = true;
            } else {
              this.endpointService.setAllowed(dev, prod);
              this.router.navigate(['admin/dashboard']);
            }
          }
          responseReturned = true;
        }
      );
  }
}
