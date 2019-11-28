import { PeliculaService } from './../../_service/pelicula.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Pelicula } from './../../_model/pelicula';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-pelicula',
  templateUrl: './pelicula.component.html',
  styleUrls: ['./pelicula.component.css']
})
export class PeliculaComponent implements OnInit {

  dataSource: MatTableDataSource<Pelicula>;
  displayedColumns: string[] = ['idPelicula', 'nombre', 'genero', 'acciones'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private peliculaService : PeliculaService, private snack : MatSnackBar) { }

  ngOnInit() {
    //CARGA O REFRESCA LA LISTA CADA VEZ QUE SE REALIZA UNA ACCION (GUARDAR, MODIFICAR, ELIMINAR)
    this.peliculaService.peliculaCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.peliculaService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    //CARGA SOLO 1 VEZ CUANDO CARGA LA PAGINA
    this.peliculaService.listar().subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(idPelicula: number) {
    this.peliculaService.eliminar(idPelicula).pipe(switchMap(() => {
      return this.peliculaService.listar();
    })).subscribe(data => {
      this.peliculaService.peliculaCambio.next(data);
      this.peliculaService.mensajeCambio.next('Se eliminó');
    });
  }

}
