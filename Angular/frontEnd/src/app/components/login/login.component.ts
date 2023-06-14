import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(private router:Router,public http:HttpClient,public user:UserService) {
  }

  toRegister(){
    this.router.navigate(['register']);
  }
  postData(username:any,password:any){
    var url="http://localhost:8080/user/login";//路径待修改
    this.http.post(url, {"username":username,"password":password})
    .subscribe((response:any)=>{
        window.alert(response.message);
        if(response.state){
          this.user.userInfo.username=username;
        this.user.userInfo.figure=response.figure;
        this.router.navigate(['']);
        this.user.userInfo.type = 1;
        }
        
        console.log(this.user.userInfo)
    })
  }
  check(){
    var username=document.getElementById("username") as HTMLInputElement | null;
    if (username?.value == ''){
      alert('用户名不得为空');
      return false;
    }
    var password=document.getElementById("password") as HTMLInputElement | null;
    if (password?.value == ''){
      alert('密码不得为空');
      return false;
    }
    console.log(username)
    this.postData(username?.value,password?.value);
    return true;
  }
}
