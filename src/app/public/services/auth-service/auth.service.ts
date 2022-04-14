import { LOCALSTORAGE_TOKEN_KEY, USER_DATA } from '../../../app.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../interfaces';
import { Router } from '@angular/router';

export const fakeLoginResponse: LoginResponse = {
  // fakeAccessToken.....should all come from real backend
  status: 200,
  message: 'Login Successful',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  refreshToken: {
    id: 1,
    userId: 2,
    token: 'fakeRefreshToken...should all come from real backend',
    refreshCount: 2,
    expiryDate: new Date(),
  },
  tokenType: 'JWT'
}

export const fakeRegisterResponse: RegisterResponse = {
  status: 200,
  message: 'Registration successful.'
}
export const fakeRegisteredUserResponse: RegisterResponse = {
  status: 401,
  message: 'User already registered.'
}
export const fakeLoginUserResponse: LoginResponse = {
  status: 404,
  message: 'User not registered.',
  accessToken: '',
  refreshToken: '',
  tokenType: ''
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService,
    private router: Router
  ) { }

  /*
   Due to the '/api' the url will be rewritten by the proxy, e.g. to http://localhost:8080/api/auth/login
   this is specified in the src/proxy.conf.json
   the proxy.conf.json listens for /api and changes the target. You can also change this in the proxy.conf.json

   The `..of()..` can be removed if you have a real backend, at the moment, this is just a faked response
  */
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    let data: any = localStorage.getItem(USER_DATA);
    
    let userData = JSON.parse(data);
    console.log("user data : ", userData);

    let checkUser = userData?.some((item: { email: string; password: string;}) => item.email === loginRequest.email && item.password === loginRequest.password);
    console.log("check user : ", checkUser)

    if(checkUser) {
      return of(fakeLoginResponse).pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken);
          localStorage.setItem("CURRENT_USER", loginRequest.email);
        }),
        tap(() => this.snackbar.open('Login Successful', 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['green-snackbar']
        })),
      );
    } else {
      return of(fakeLoginUserResponse).pipe(
        tap(() => this.snackbar.open('User not registered or invalid credentials', 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
        }))
      );
    }
   
    // return this.http.post<LoginResponse>('/api/auth/login', loginRequest).pipe(
    // tap((res: LoginResponse) => localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken)),
    // tap(() => this.snackbar.open('Login Successful', 'Close', {
    //  duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
    // }))
    // );
  }

  /*
   The `..of()..` can be removed if you have a real backend, at the moment, this is just a faked response
  */
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    console.log("user registration : ", registerRequest);
    let data: any = localStorage.getItem(USER_DATA);
    
    let userData = JSON.parse(data);
    console.log("user data : ", userData);

    let checkUser = userData?.some((item: { email: string; }) => item.email === registerRequest.email);
    console.log("check user : ", checkUser)
    if(checkUser) {
      return of(fakeRegisteredUserResponse).pipe(
        tap((res: RegisterResponse) => this.snackbar.open(`User Already Registered with that email id.`, 'Close', {
          duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
        })),
      );
    } else {
      let allUser = userData || [];
      allUser = [...allUser, registerRequest];
      console.log("all user : ", allUser)
      localStorage.setItem(USER_DATA, JSON.stringify(allUser));
    }

    return of(fakeRegisterResponse).pipe(
      tap((res: RegisterResponse) => this.snackbar.open(`User created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
    );

  
    // return this.http.post<RegisterResponse>('/api/auth/register', registerRequest).pipe(
    // tap((res: RegisterResponse) => this.snackbar.open(`User created successfully`, 'Close', {
    //  duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
    // }))
    // )
  }

  /*
   Get the user from the token payload
   */
  getLoggedInUser() {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken.user;
  }
}
