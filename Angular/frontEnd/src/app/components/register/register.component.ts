import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private router:Router,public http:HttpClient,public user:UserService) {
  }
  postData(username:any,email:any,password:any){
    var url="http://localhost:8080/user/register";//路径待修改
    this.http.post(url, {"username":username,"password":password,"email":email,"figure":this.user.userInfo.figure})
    .subscribe((response:any)=>{
      alert(response.message)
      this.router.navigate(['login']);
    })
  }
  check(){
    var username=document.getElementById("username") as HTMLInputElement | null;
    if (username?.value == ''){
      alert('用户名不得为空');
      return false;
    }
    var email=document.getElementById("email") as HTMLInputElement | null;
    if (email?.value == ''){
      alert('邮箱不得为空');
      return false;
    }
    var password=document.getElementById("password") as HTMLInputElement | null;
    if (password?.value == ''){
      alert('密码不得为空');
      return false;
    }
    var repassword=document.getElementById("rePassword") as HTMLInputElement | null;
    if (repassword?.value != password?.value){
      alert('请确认两次输入密码相同');
      return false;
    }

    this.postData(username?.value,email?.value,password?.value)
    return true;
  }
  toLogin(){
    this.router.navigate(['login']);
  }

  but1(){
    this.user.userInfo.figure = 1;
  }
  but2(){
    this.user.userInfo.figure = 2;
  }
  but3(){
    this.user.userInfo.figure = 3;
  }
  but4(){
    this.user.userInfo.figure = 4;
  }

}

