import { VentaService } from './../../_service/venta.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  chart: any;
  tipo: string;

  constructor(private ventaService : VentaService) { }

  ngOnInit() {
    this.tipo = 'line';
    this.dibujar();
  }

  cambiar(tipo: string) {
    this.tipo = tipo;
    if(this.chart){
      this.chart.destroy();
    }
    this.dibujar();
  }

  dibujar() {
    this.ventaService.listarResumen().subscribe(data => {
      let fechas = data.map( el => el.fecha);
      let cantidades = data.map( el => el.cantidad);

      console.log(fechas);
      console.log(cantidades);

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Cantidad',
              data: cantidades,
              borderColor: "#3cba9f",
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ]
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
      
    });
  }

}