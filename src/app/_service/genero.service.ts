import { Subject } from 'rxjs';
import { Genero } from './../_model/genero';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {  

  url: string = `${environment.HOST}/generos`;  
  
  generoCambio = new Subject<Genero[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Genero[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Genero>(`${this.url}/${id}`);
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`); //&sort=nombre
  }

  registrar(genero: Genero) {
    return this.http.post(this.url, genero);
  }

  modificar(genero: Genero) {
    return this.http.put(this.url, genero);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
