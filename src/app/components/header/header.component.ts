import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router:Router,public http:HttpClient) {
  }

  toIndex(){
    this.router.navigate(['']);
  }
  
  
  toLogin(){
    this.router.navigate(['login']);
  }
  toRegister(){
    this.router.navigate(['register']);
  }

}

