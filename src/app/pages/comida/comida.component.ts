import { ComidaDialogoComponent } from './comida-dialogo/comida-dialogo.component';
import { switchMap } from 'rxjs/operators';
import { ComidaService } from './../../_service/comida.service';
import { Comida } from './../../_model/comida';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-comida',
  templateUrl: './comida.component.html',
  styleUrls: ['./comida.component.css']
})
export class ComidaComponent implements OnInit {

  dataSource: MatTableDataSource<Comida>;
  displayedColumns: string[] = ['idComida', 'nombre', 'acciones'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private comidaService : ComidaService,
    private dialog : MatDialog,
    private snack : MatSnackBar
  ) { }

  ngOnInit() {
    this.comidaService.comidaCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.comidaService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO',{
        duration: 2000
      });
    });

    this.comidaService.listar().subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      //console.log(data)
    });
  }

  eliminar(comida : Comida){
    this.comidaService.eliminar(comida.idComida).pipe(switchMap( () => {
      return this.comidaService.listar();
    })).subscribe(data => {
      this.comidaService.comidaCambio.next(data);
      this.comidaService.mensajeCambio.next('SE ELIMINO');
    });
    
  }

  openDialog(comida?: Comida){
    let gen = comida != null ? comida : new Comida();
    this.dialog.open(ComidaDialogoComponent,{
      width: '250px',
      data: gen
    });
  }

  filter(x : string){
    this.dataSource.filter = x.trim().toLocaleLowerCase();
  }

}
