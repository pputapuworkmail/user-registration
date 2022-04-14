import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/app.module';
import { AppService } from 'src/app/app.service';
import { Iuserdata } from '../interfaces';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userData: Iuserdata = {
    firstname: '',
    lastname: '',
    email: '',
    bio: ''
  };
  constructor(
    private router: Router,
    private appService: AppService,
  ) {}
  

  ngOnInit(): void {
    this.getProfileDetails()
  }
  getProfileDetails() {
    const profileObservable = this.appService.getProfile();
    profileObservable.subscribe((item: any) => {
      console.log("item : ", item)
      this.userData = item
    });
  };

  logout() {
    // Removes the jwt token from the local storage, 
    // so the user gets logged out & then navigate back to the "public" routes
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    this.router.navigate(['../../']);
  }

}
