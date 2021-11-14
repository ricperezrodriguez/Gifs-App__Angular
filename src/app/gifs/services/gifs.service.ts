import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResopnse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'MUF5bVlS2l13PkkTg0ti5SRCX7HcrH0n';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];  //con ... separo el array y con [] retorno un nuevo array
  }                               //entonces lo que hago con esto es que no modifique el array de origen
  
  constructor( private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    /*if( localStorage.getItem('historial') ){
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }*/
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  
  buscarGifs(query: string = '') {

    query = query.trim().toLowerCase();

    if( !this._historial.includes(query) ) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResopnse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( ( resp ) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
    
  }

  
  
}
