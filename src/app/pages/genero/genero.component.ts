import { GeneroDialogoComponent } from './genero-dialogo/genero-dialogo.component';
import { GeneroService } from './../../_service/genero.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Genero } from 'src/app/_model/genero';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.css']
})
export class GeneroComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Genero>;
  displayedColumns: string[] = ['idGenero', 'nombre', 'acciones'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private generoService : GeneroService, 
    private dialog : MatDialog, 
    private snack : MatSnackBar
  ) { }

  ngOnInit() {
    this.generoService.generoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.generoService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO',{
        duration: 2000
      });
    });

    this.generoService.listar().subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      //console.log(data)
    });

    /*this.generoService.listar().subscribe( x => {
      console.log(x);
    })*/

    this.generoService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(genero : Genero){
    this.generoService.eliminar(genero.idGenero).pipe(switchMap( () => {
      return this.generoService.listar();
    })).subscribe(data => {
      this.generoService.generoCambio.next(data);
      this.generoService.mensajeCambio.next('SE ELIMINO');
    });
    /*this.generoService.eliminar(genero.idGenero).subscribe( () => {
      this.generoService.listar().subscribe(data => {
        this.generoService.generoCambio.next(data);
      });
    });*/
  }

  openDialog(genero?: Genero){
    //console.log(genero);
    let gen = genero != null ? genero : new Genero();
    this.dialog.open(GeneroDialogoComponent,{
      width: '250px',
      data: gen
    });
  }

  filter(x : string){
    //this.dataSource.filter = x.trim().toLocaleLowerCase();
    this.dataSource.filter = x.trim().toLowerCase();
  }

  mostrarMas(e : any){
    this.generoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }

}
