import { switchMap } from 'rxjs/operators';
import { GeneroService } from './../../../_service/genero.service';
import { PeliculaService } from './../../../_service/pelicula.service';
import { Genero } from './../../../_model/genero';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Pelicula } from 'src/app/_model/pelicula';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-pelicula-edicion',
  templateUrl: './pelicula-edicion.component.html',
  styleUrls: ['./pelicula-edicion.component.css']
})
export class PeliculaEdicionComponent implements OnInit {

  pelicula: Pelicula;
  id: number;
  edicion: boolean;
  form: FormGroup;
  generos: Genero[];
  idGeneroSeleccionado: number;//el combo se puede listar por esta variable o por la variable 'genero'
  urlImagen: string;

  constructor(private route : ActivatedRoute, 
    private peliculaService : PeliculaService,
    private generoService : GeneroService,
    private router : Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      'idPelicula': new FormControl(0),
      'nombre': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'resena': new FormControl('', Validators.required),
      'duracion': new FormControl(0, Validators.minLength(2)),
      'fechaPublicacion': new FormControl(new Date()),
      'urlPortada': new FormControl('', Validators.required),
      'genero': new FormControl('', Validators.required)
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

    this.pelicula = new Pelicula();
    this.listarGeneros();
  }

  get f() { return this.form.controls; }

  initForm() {

    if (this.edicion) {
      //cargar la data del servicio hacia el form 
      this.peliculaService.listarPorId(this.id).subscribe(data => {

        this.form = new FormGroup({
          'idPelicula': new FormControl(data.idPelicula),
          'nombre': new FormControl(data.nombre),
          'resena': new FormControl(data.resena),
          'duracion': new FormControl(data.duracion),
          // 'fechaPublicacion': new FormControl(new Date(data.fechaPublicacion)),
          'fechaPublicacion': new FormControl(moment(data.fechaPublicacion).utc().toDate()),
          'urlPortada': new FormControl(data.urlPortada),
          'genero': new FormControl(data.genero.idGenero)
        });

        this.urlImagen = this.form.value['urlPortada'];
        this.idGeneroSeleccionado = data.genero.idGenero;

      });
    }
  }

  listarGeneros(){
    this.generoService.listar().subscribe(data => {
      this.generos = data;
    })
  }

  operar() {    
    let pelicula = new Pelicula();
    pelicula.idPelicula = this.form.value['idPelicula'];
    pelicula.urlPortada = this.form.value['urlPortada'];
    pelicula.resena = this.form.value['resena'];
    pelicula.nombre = this.form.value['nombre'];
    pelicula.duracion = this.form.value['duracion'];
    let genero = new Genero();
    genero.idGenero = this.idGeneroSeleccionado;
    pelicula.genero = genero;
    /*var tzoffset = (this.form.value['fechaPublicacion']).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString()*/
    // pelicula.fechaPublicacion = moment(this.form.value['fechaPublicacion']).format('YYYY-MM-DDTHH:mm:ss');//localISOTime;
    pelicula.fechaPublicacion = moment(this.form.value['fechaPublicacion']).utc().toDate();

    if (pelicula.idPelicula > 0) {
      //BUENA PRACTICA
      this.peliculaService.registrar(pelicula).pipe(switchMap( ()=> {
        return this.peliculaService.listar();
      })).subscribe( data => {
        this.peliculaService.peliculaCambio.next(data);
        this.peliculaService.mensajeCambio.next('SE MODIFICO');
      });

      /*
      ESTO YA NO SE USA
      this.peliculaService.registrar(pelicula).subscribe( ()=> {
        this.peliculaService.listar().subscribe(data => {
          this.peliculaService.peliculaCambio.next(data);
        });
      });*/
      
    } else {
      this.peliculaService.registrar(pelicula).subscribe( ()=> {
        this.peliculaService.listar().subscribe(data => {
          this.peliculaService.peliculaCambio.next(data);
        });
      });
    }

    this.router.navigate(['pelicula']);
  }

}
