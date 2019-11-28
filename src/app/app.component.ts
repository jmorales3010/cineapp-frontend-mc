import { LoginService } from './_service/login.service';
import { MenuService } from './_service/menu.service';
import { Menu } from './_model/menu';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  
  menus: Menu[] = [];

  constructor(
    private menuService : MenuService,
    public loginService : LoginService
  ){
  
  }

  ngOnInit(){
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
      //console.log(this.menus);
    });
  }
}
