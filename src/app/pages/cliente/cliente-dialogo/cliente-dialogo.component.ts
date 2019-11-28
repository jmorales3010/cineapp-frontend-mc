import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cliente } from 'src/app/_model/cliente';
import { ClienteService } from 'src/app/_service/cliente.service';
import { DomSanitizer } from '@angular/platform-browser';
import { debug } from 'util';
import * as moment from 'moment';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { PasswordValidation } from '../../login/nuevo/match';

@Component({
  selector: 'app-cliente-dialogo',
  templateUrl: './cliente-dialogo.component.html',
  styleUrls: ['./cliente-dialogo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteDialogoComponent implements OnInit {

  form: FormGroup;

  cliente: Cliente;
  usuario: Usuario;
  imagenData: any;
  imagenEstado: boolean = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  labelFile: string;
  nuevo: boolean;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit() {
    this.cliente = new Cliente();
    this.usuario = new Usuario();
    
    if (this.data.idCliente > 0) {
      this.nuevo = false;
      this.usuarioService.listarPorId(this.data.idCliente).subscribe(x => {
        // console.log(x);
        this.cliente.idCliente = x['cliente'].idCliente;
        this.cliente.apellidos = x['cliente'].apellidos;
        this.cliente.nombres = x['cliente'].nombres;
        // this.cliente.fechaNac =  new FormControl(this.data.fechaNac);
        this.cliente.fechaNac = moment(x['cliente'].fechaNac).utc().toDate();
        this.cliente.dni = x['cliente'].dni;
        this.usuario.nombre = x['nombre'];
      });

      this.clienteService.fotoPorId(this.data.idCliente).subscribe(y => {
        if (y.size > 0) {
          this.convertir(y);
        }
      });
    } else {
      this.nuevo = true;
    }

    this.form = this.fb.group({
      password: [''],
      confirmPassword: ['']
    }, {
      validator: PasswordValidation.MatchPassword
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

  operar() {
    if (this.cliente.nombres.length > 0 && this.cliente.apellidos.length > 0 && this.usuario.nombre.length > 0) {
      if (this.selectedFiles != null) {
        this.currentFileUpload = this.selectedFiles.item(0);
      } else {
        this.currentFileUpload = new File([""], "blanco");
      }

      this.usuario.clave = this.form.value['password'];
      this.usuario.estado = true;
      this.cliente.usuario = this.usuario;

      if (this.cliente != null && this.data.idCliente > 0) {
        this.clienteService.modificar(this.cliente, this.currentFileUpload).subscribe(data => {
          this.clienteService.listar().subscribe(clientes => {
            this.clienteService.clienteCambio.next(clientes);
            this.clienteService.mensajeCambio.next("Se modifico");
          });
        });
      } else {
        this.clienteService.registrar(this.cliente, this.currentFileUpload).subscribe(data => {
          this.clienteService.listar().subscribe(clientes => {
            this.clienteService.clienteCambio.next(clientes);
            this.clienteService.mensajeCambio.next("Se registro");
          });
        });
      }
      this.dialogRef.close();
    } else {
      this.clienteService.mensajeCambio.next("Debe ingresar los Nombres, Apellidos y Usuario");
    }
  }

  selectFile(e: any) {
    console.log(e);
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
  }

  cancelar() {
    this.dialogRef.close();
  }

}
