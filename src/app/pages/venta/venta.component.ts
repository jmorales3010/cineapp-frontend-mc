import { environment } from 'src/environments/environment';
import { ConfigService } from './../../_service/config.service';
import { VentaDTO } from './../../_model/ventaDTO';
import { DetalleVenta } from './../../_model/detalleVenta';
import { PeliculaService } from './../../_service/pelicula.service';
import { ClienteService } from './../../_service/cliente.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { ComidaService } from './../../_service/comida.service';
import { Comida } from './../../_model/comida';
import { Cliente } from './../../_model/cliente';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Pelicula } from 'src/app/_model/pelicula';
import { VentaService } from 'src/app/_service/venta.service';
import * as moment from 'moment';
import { Venta } from 'src/app/_model/venta';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  tercerFormGroup: FormGroup;
  peliculas: Pelicula[];
  clientes: Cliente[];
  comidas: Comida[];
  asientos: number[] = [];
  peliculaSeleccionada: Pelicula;
  asientosSeleccionados: number[] = [];
  comidasSeleccionadas: Comida[] = [];
  precioEntrada: number;
  precioTotal: number;
  hidden: number;

  clienteSeleccionado: Cliente;
  fechaSeleccionado: Date;

  constructor(private _formBuilder: FormBuilder, 
    private peliculaService: PeliculaService, private snackBar: MatSnackBar,
    private ventaService: VentaService,
    private comidaService: ComidaService, private clienteService: ClienteService, 
    private sanitization: DomSanitizer,
    private configService: ConfigService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      "clienteSeleccionado": new FormControl()
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.tercerFormGroup = this._formBuilder.group({
      tercerCtrl: ['']
    });

    this.listarClientes();
    this.listarPeliculas();
    this.listarComidas();

    this.asientosSeleccionados = [];
    for (let i = 1; i <= 100; i++) {
      this.asientos.push(i);
    }

    /*let array = [];
    
    let obs1 = this.peliculaService.listar();
    let obs2 = this.clienteService.listar();

    array.push(obs1);
    array.push(obs2);

    forkJoin(array).subscribe(data => {
      console.log(data);
    });*/

    this.configService.leerParametro(environment.PRECIO_ENTRADA).subscribe( data => {
      this.precioEntrada = +data.valor;
    }); 

  }

  listarPeliculas() {
    this.peliculaService.listar().subscribe(data => {
      this.peliculas = data;
    });
  }

  listarClientes() {
    this.clienteService.listar().subscribe(data => {
      this.clientes = data;
    });
  }

  seleccionarPelicula(pelicula: Pelicula){
    this.peliculaSeleccionada = pelicula;
  }

  seleccionarAsiento(asiento: number) {
    if (this.asientosSeleccionados.includes(asiento)) {
      //eliminando el asiento si ya esta seleccionado
      this.asientosSeleccionados.splice(this.asientosSeleccionados.indexOf(asiento), 1);
      //siempre guardo el tamaño de la lista de asientos seleccionados en un hidden
      this.hidden = this.asientosSeleccionados.length;
    } else {
      this.asientosSeleccionados.push(asiento);
      //siempre guardo el tamaño de la lista de asientos seleccionados en un hidden
      this.hidden = this.asientosSeleccionados.length;
    }
    this.precioTotal = this.precioEntrada * this.asientosSeleccionados.length;
  }

  listarComidas() {
    this.comidaService.listar().subscribe(data => {
      this.comidas = data;
      for (let c of this.comidas) {
        this.comidaService.listarPorId(c.idComida).subscribe(data => {

          let reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onloadend = () => {
            let base64 = reader.result;
            c._foto = this.setear(base64);
            c._isFoto = true;
          }
        });
      }
    });
  }

  setear(x: any) {
    return this.sanitization.bypassSecurityTrustResourceUrl(x);
  }

  seleccionarComida(e: any, c: Comida) {
    if (e.checked) {
      this.comidasSeleccionadas.push(c);
      this.precioTotal = this.precioTotal + c.precio;
    } else {
      this.precioTotal = this.precioTotal - c.precio;
    }
  }

  registrar() {
    let venta = new Venta();
    venta.cliente = this.clienteSeleccionado;
    venta.fecha = moment().format('YYYY-MM-DDTHH:mm:ss');    
    /*var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    console.log(localISOTime);*/
    venta.cantidad = this.asientosSeleccionados.length;
    venta.pelicula = this.peliculaSeleccionada;
    venta.total = this.precioTotal;

    let detalles: DetalleVenta[] = [];
    for (let a of this.asientosSeleccionados) {
      let detalle = new DetalleVenta();
      detalle.asiento = a;
      detalles.push(detalle);
    }
    venta.detalle = detalles;

    let ventaDTO = new VentaDTO();
    ventaDTO.venta = venta;
    ventaDTO.lstComidas = this.comidasSeleccionadas;
    this.ventaService.registrar(ventaDTO).subscribe(data => {      
        this.generarReporte(ventaDTO);          
    });
  }

  generarReporte(ventaDTO: VentaDTO) {
    this.ventaService.generarReporte(ventaDTO).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;')
      a.href = url;
      a.download = 'venta.pdf';
      a.click();
    });
  }

}