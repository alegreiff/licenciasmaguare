import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
//IMPORTO LAS ACCIONES
import * as ingresoEgresoActions from "../components/store/datos.actions";
import { map  } from "rxjs/operators";
import { FireServiceService } from './fire-service.service';
import { LicenciaContenido } from '../models/contenido.model';
import { WPrest } from '../models/wp.model';
import { EntradaWP } from '../models/entrada.model';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  userToken: string;
  urlbase: string = 'https://maguare.gov.co/wp-json/';
  licencias: LicenciaContenido[];
  entradaactiva: EntradaWP;
  //https://maguare.gov.co/wp-json/

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private fires: FireServiceService
    ) {
      this.leerToken()
    }
  login(username: string, password: string){
    return this.http.post(`${this.urlbase}jwt-auth/v1/token`, {username, password})
    .pipe(
      map( resp => {
        this.guardarToken(resp['token'])
        this.fires.cargaLicencias();
        this.fires.cargaContactos();
        this.cargaEntradas(resp['token'])
        return resp
      })
    )
    /* .subscribe(
      (res: any) => {
        this.guardarToken(res.token)
        this.cargaEntradas(res.token)
      }
    ) */
  }
expresslogin(){
  this.fires.cargaLicencias();
  this.fires.cargaContactos();
  this.cargaEntradas(this.userToken)
}

  cargaEntradas(token: string){
    this.store.select('licencias').subscribe(({licencias}) => this.licencias = licencias )
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    })
    return this.http.get(`${this.urlbase}apimagu/v2/test`, {headers: headers})
    .pipe(
      map((res: any) => {

          return res.contenidos.map( contenido => {
            return {
              id: contenido.id,
              title: contenido.title,
              tipo: contenido.tipo,
              firebase: false,
              interprete_autor: contenido.interprete_autor,
              descripcion: contenido.descripcion
            }
          })

      })
    )
    .subscribe(
      (res: WPrest[]) => {
        //console.log("RZQ",res)
        this.store.dispatch( ingresoEgresoActions.setItems({items: res}) )
        console.log("WORDPRESS ENTRADAS C A R G A D A S")

      }
    )
  }
  validaUsuario(){
    const token = this.leerToken();
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    })
    return this.http.post(`${this.urlbase}jwt-auth/v1/token/validate`, null , {headers: headers}).pipe(
      map( (res: any) =>  res.data.status==200)
    )


  }
  cargarPost(id: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.userToken
    })
    // /wp/v2/posts/
    //return this.http.get(`${this.urlbase}wp/v2/posts/${id}`,{headers: headers})
    console.log("HEADRES IN CARDGRA POTS", headers)
    return this.http.get(`${this.urlbase}apimagu/v2/contenido/${id}`,{headers: headers})

  }
  subeSoporte(file: File){

    const fd = new FormData();
    fd.append('soporte', file, file.name)
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userToken
    })
    return this.http.post(`${this.urlbase}apimagu/v2/upload`, fd, {headers: headers})
  }

//new Date().getTime()


  private guardarToken( idToken: string){
    //console.log("LEKONET", idToken)
    this.userToken = idToken;
    localStorage.setItem('token', idToken)
  }
  leerToken(){
    if( localStorage.getItem('token') ){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }
    //console.log("LEER TOKEN", this.userToken)
    return this.userToken;
  }

  guardarStorage( user){
    localStorage.setItem('usuario', JSON.stringify(user));
  }
  existeEnFirebase(items: WPrest[]){

      /* for(let wp of items){
        console.log("DURAZ: ", wp.id )

        if(this.licencias.find( licencia => licencia.wpid === wp.id)){
          this.store.dispatch(ingresoEgresoActions.firebaseActivo({
            id: wp.id,
            firebase: true
          }))
        }


      } */
      for ( let lic of this.licencias ){
        if( items.find( entrada => entrada.id === lic.wpid ) ){
          this.store.dispatch(ingresoEgresoActions.firebaseActivo({
            id: lic.wpid,
            firebase: true
          }))
        }
      }



  }
}
