import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent {
  constructor(private router: Router, public user: UserService) {
    this.timer = setInterval(() => {
      this.today = new Date();
    }, 1000);
  }
  today: any = new Date();
  timer: any;
}

