import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  public userInfo:any = {
    id:1,
    username:'',
    password:'',
    figure:'3',
    type:0
  }

  public arr:Array<String> = new Array<String>();
  Array = ['创建了角色，进入首页'];
 

  
}
