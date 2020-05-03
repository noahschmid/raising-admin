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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    private endpointService: EndpointService) {
    this.hide = true;
  }

  toggleHide() {
    this.hide = !this.hide;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onClickLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.hide = true;
    this.error = false;
    this.hide = false;
    let responseReturned = false;
    const val = this.loginForm.value;


    let dev = false;
    let prod = false;

    this.authService.devLogin(val.email, val.password)
      .subscribe(
        data => {
          dev = true;
          if (responseReturned) {
            this.endpointService.setAllowed(dev, prod);
            this.router.navigate(['admin/dashboard']);
          }
          responseReturned = true;
        },
        error => {
          if (responseReturned) {
            if(!prod) {
              console.log("error");
              this.errorMessage = 'Login failed';
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
            this.endpointService.setAllowed(dev, prod);
            this.router.navigate(['admin/dashboard']);
          }
          responseReturned = true;
        },
        error => {
          prod = false;
          if (responseReturned) {
            if (!dev) {
              console.log("error");
              this.errorMessage = 'Login failed';
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
