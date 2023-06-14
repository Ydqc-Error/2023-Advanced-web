import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { UserService } from 'src/app/services/user.service';




@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  constructor(private router:Router,public user:UserService) {}

  toRoom(){
     if(this.user.userInfo.type == 1){
      this.router.navigate(['room']);
     }
     else{
       alert("您还没有登录！")
       this.router.navigate(['login']);
     }
  
  }

}
