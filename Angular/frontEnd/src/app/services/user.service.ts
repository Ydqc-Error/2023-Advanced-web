import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  public userInfo:any = {
    id:1,
    username:'admin',
    password:'666666',
    type:0
  }
}
