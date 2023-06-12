import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { IndexComponent } from './components/index/index.component';

import { UserService } from './services/user.service';
import { RoomComponent } from './components/room/room.component';
import { BookComponent } from './components/book/book.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    RoomComponent,
    BookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
