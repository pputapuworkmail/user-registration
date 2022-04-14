import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { LoginResponse } from './public/interfaces';
import { USER_DATA } from './app.module';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = 'http://localhost:3000';

  getProfile(): any {
   
    let data: any = localStorage.getItem(USER_DATA);
    
    let userData = JSON.parse(data);
    console.log("user data : ", userData);

    let currentUser = localStorage.getItem("CURRENT_USER");
    let userDetails = userData?.find((item: { email: string;}) => item.email === currentUser);
    console.log("user details: ", userDetails)
    if(userDetails){
      
      return of(userDetails).pipe();
    }
  
  }

}