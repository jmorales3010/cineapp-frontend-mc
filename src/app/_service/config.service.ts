import { HttpClient } from '@angular/common/http';
import { Config } from './../_model/config';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configCambio = new Subject<Config[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/configuraciones`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Config[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Config>(`${this.url}/${id}`);
  }

  leerParametro(param: string) {
    return this.http.get<Config>(`${this.url}/buscar/${param}`);
  }

  registrar(config: Config) {
    return this.http.post(this.url, config);
  }

  modificar(config: Config) {
    return this.http.put(this.url, config);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
} 