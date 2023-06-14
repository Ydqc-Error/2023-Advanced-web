import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { RoomComponent } from './components/room/room.component';
import { BookComponent } from './components/book/book.component';
import { PersonComponent } from './components/person/person.component';



const routes: Routes = [
  {
    path:"",
    component:IndexComponent
  },

  {
    path:"register",
    component:RegisterComponent
  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"room",
    component:RoomComponent
  },
  {
    path:"book",
    component:BookComponent
  },
  {
    path:"person",
    component:PersonComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
