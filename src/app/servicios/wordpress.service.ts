import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
//IMPORTO LAS ACCIONES
import * as ingresoEgresoActions from '../components/store/datos.actions';
import { map, tap } from 'rxjs/operators';
import { FireServiceService } from './fire-service.service';
import { LicenciaContenido } from '../models/contenido.model';
import { WPrest } from '../models/wp.model';
import { EntradaWP } from '../models/entrada.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  userToken: string;
  urlbase: string = 'https://maguare.gov.co/wp-json/';
  urlBaseEnlaces: string = 'https://staging.maguare.gov.co/documentos/';
  licencias: LicenciaContenido[];
  entradaactiva: EntradaWP = null;
  private cambioEstado = new BehaviorSubject<boolean>(false);
  activo = this.cambioEstado.asObservable();
  usuario;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private fires: FireServiceService,
    private router: Router
  ) {
    this.leerToken();
  }

  setEstado(estado: boolean) {
    this.cambioEstado.next(estado);

  }

  login(username: string, password: string) {
    return this.http
      .post(`${this.urlbase}jwt-auth/v1/token`, { username, password })
      .pipe(
        map((resp:any) => {
          this.fires.cargaOpcionesGenerales();
          this.guardarToken(resp);
          this.cargaEntradas();
          this.setEstado(true);
          //this.testbackend()
          return resp;
        })
      );
  }

/* testbackend(){
  this.http.get('https://us-central1-licenciasmaguare.cloudfunctions.net/api/contactos/').subscribe(
    res => { console.log("BACKEND", res) }
  )
} */

  logout() {
    this.entradaactiva = null;
    this.usuario = null;
    this.userToken = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('correo');
    this.router.navigate(['/ingreso']);
    this.setEstado(false);

  }
  validaUsuario() {
    const token = this.leerToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .post(`${this.urlbase}jwt-auth/v1/token/validate`, null, {
        headers: headers,
      })
      .pipe(
        tap((res: any) => {
          this.store.select('licencias').subscribe(
            ({licencias}) => {
              if(licencias.length === 0) {
                this.cargaEntradas()
                this.fires.cargaOpcionesGenerales()
              }
            },
          ),

          this.setEstado(res.success)
        }),
        map((res: any) => res.success)
        );
  }
  private guardarToken(respuesta) {
    //console.log('PERFIL', respuesta.perfil);
    const token = respuesta.data.token;
    const user = respuesta.perfil.nombre + ' ' + respuesta.perfil.apellido;
    const correo = respuesta.perfil.correo;
    //resp['token']
    //console.log("LEKONET", idToken)
    this.userToken = token;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', user);
    localStorage.setItem('correo', correo);
    this.usuario = user;
  }
  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
      this.usuario =  localStorage.getItem('usuario');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  guardarStorage(user) {
    localStorage.setItem('usuario', JSON.stringify(user));
  }
  expresslogin() {
    this.fires.cargaOpcionesGenerales();
    this.cargaEntradas();
  }

  cargaEntradas() {
    let token = this.userToken;
    this.store
      .select('licencias')
      .subscribe(({ licencias }) => (this.licencias = licencias));
    const headers = new HttpHeaders({
      /* 'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0', */
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    return this.http
      .get(`${this.urlbase}apimagu/v2/test?_cache_buster=${new Date().getTime()}`, { headers: headers })
      .pipe(
        map((res: any) => {
          return res.contenidos.map((contenido) => {
            return {
              id: contenido.id,
              title: contenido.title,
              tipo: contenido.tipo,
              firebase: false,
              interprete_autor: contenido.interprete_autor,
              descripcion: contenido.descripcion,
            };
          });
        })
      )
      .subscribe((res: WPrest[]) => {
        //console.log("RZQ",res)
        this.store.dispatch(ingresoEgresoActions.setItems({ items: res }));
      });
  }

  cargarPost(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userToken,
    });
    //console.log('HEADRES IN CARDGRA POTS', headers);
    return this.http.get(`${this.urlbase}apimagu/v2/contenido/${id}`, {
      headers: headers,
    });
  }

  borraAnexo(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userToken,
    });
    return this.http.get(`${this.urlbase}apimagu/v2/borraanexo/${id}`, {
      headers: headers,
    });
  }

  existeEnFirebase(items: WPrest[]) {
    for (let lic of this.licencias) {
      if (items.find((entrada) => entrada.id === lic.wpid)) {
        console.info("Existe en firebase TRUE")
        this.store.dispatch(
          ingresoEgresoActions.firebaseActivo({
            id: lic.wpid,
            firebase: true,
          })
        );
      }else{
        console.info("Existe en firebase FALSE")
      }
    }
  }
  subeSoporte(file: File, wordpressId: number) {

    const fd = new FormData();
    fd.append('soporte', file, file.name);

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.userToken,
    });
    return this.http.post(`${this.urlbase}apimagu/v2/upload/${wordpressId}`, fd, {
      headers: headers,
    });
  }
}


