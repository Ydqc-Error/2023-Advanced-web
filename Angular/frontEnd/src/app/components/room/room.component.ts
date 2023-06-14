import { Component, OnInit } from '@angular/core';
declare function chat(): any;
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit{
  ngOnInit() {
    chat();
  }
}
