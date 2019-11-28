import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DomSanitizer } from '@angular/platform-browser';
// import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { ClienteService } from 'src/app/_service/cliente.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  perfil: string;
  imagenData: any;
  imagenEstado: boolean = false;
  
  constructor(
    private clienteService: ClienteService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit() {
    const helper = new JwtHelperService();

    const TOKEN = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
    const decodedToken = helper.decodeToken(TOKEN.access_token);
    this.usuario = decodedToken.user_name;
    this.perfil = decodedToken.authorities.join('-');

    // this.usuarioService.listarPorId(decodedToken.id_usuario).subscribe(data => {
    //   if (data.size > 0) {
    //     this.convertir(data);
    //   }
    // });

    this.clienteService.fotoPorId(decodedToken.id_usuario).subscribe(data => {
      if (data.size > 0) {
        this.convertir(data);
      }
    });

  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;      
      //this.imagenData = base64;      
      this.setear(base64);
    }
  }

  setear(x: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(x);
    this.imagenEstado = true;
  }

}
