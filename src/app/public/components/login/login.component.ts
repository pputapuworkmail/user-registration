import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }
    const authObservable = this.authService.login(this.loginForm.value)
    authObservable.subscribe(item => 
      {
        console.log("item :",item)
        if(item.status === 200){
          authObservable.pipe(
            // route to protected/dashboard, if login was successful
            tap(() => this.router.navigate(['../../protected/dashboard']))
          ).subscribe();
        } else {
          authObservable.pipe().subscribe(); 
        }
      }
    );
  }

}
