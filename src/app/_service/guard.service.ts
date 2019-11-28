import { Menu } from './../_model/menu';
import { MenuService } from './menu.service';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private loginService: LoginService, private menuService : MenuService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //SI ESTAS LOGEADO
    let rpta = this.loginService.estaLogeado();

    if (!rpta) {
      sessionStorage.clear();
      this.router.navigate(['login']);
      return false;
    } else {
      //SI TOKEN ESTA VIGENTE
      let token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));

      const helper = new JwtHelperService();

      if (!helper.isTokenExpired(token.access_token)) {
        //SI TIENES EL ROL NECESARIO  
        const decodedToken = helper.decodeToken(token.access_token);

        let url = state.url; // /pelicula

        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
          this.menuService.menuCambio.next(data);

          let cont = 0;
          for (let menuBD of data) {
            if (url.startsWith(menuBD.url)) {
              cont++;
              break;
            }
          }

          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['not-403']);
            return false;
          }
        }));          
      } else {
        sessionStorage.clear();
        this.router.navigate(['login']);
        return false;
      }
    }
  }
}