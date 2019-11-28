import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Cliente } from 'src/app/_model/cliente';
import { ClienteService } from 'src/app/_service/cliente.service';
import { switchMap } from 'rxjs/operators';
import { ClienteDialogoComponent } from './cliente-dialogo/cliente-dialogo.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  dataSource: MatTableDataSource<Cliente>;
  displayedColumns: string[] = ['idCliente','apellidos','nombres','fchNac','dni','acciones'];
  @ViewChild(MatSort, { static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private clienteService : ClienteService,
    private dialog : MatDialog,
    private snack : MatSnackBar
  ) { }

  ngOnInit() {
    this.clienteService.clienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.clienteService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO',{
        duration: 2000
      });
    });

    this.clienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(cliente : Cliente){
    this.clienteService.eliminar(cliente.idCliente).pipe(switchMap( () => {
      return this.clienteService.listar();
    })).subscribe(data => {
      this.clienteService.clienteCambio.next(data);
      this.clienteService.mensajeCambio.next('SE ELIMINO');
    });
  }

  openDialog(cliente?: Cliente){
    let gen = cliente != null ? cliente : new Cliente();
    this.dialog.open(ClienteDialogoComponent,{
      width: '700px',
      data: gen
    });
  }

  filter(x : string){
    this.dataSource.filter = x.trim().toLocaleLowerCase();
  }

}
