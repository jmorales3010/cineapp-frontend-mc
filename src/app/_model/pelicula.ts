import { Genero } from './genero';

export class Pelicula {
    idPelicula: number;
    nombre: string;
    resena: string;
    duracion: number;
    fechaPublicacion: any;
    urlPortada: string;
    genero: Genero;
}