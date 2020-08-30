import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
//IMPORTO LAS ACCIONES
import * as ingresoEgresoActions from '../components/store/datos.actions';
import { map } from 'rxjs/operators';
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
  entradaactiva: EntradaWP;
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
        map((resp) => {
          this.fires.cargaOpcionesGenerales();
          this.guardarToken(resp);
          this.cargaEntradas(resp['token']);
          this.setEstado(true);
          this.testbackend()
          return resp;
        })
      );
  }

testbackend(){
  this.http.get('https://us-central1-licenciasmaguare.cloudfunctions.net/api/contactos/').subscribe(
    res => { console.log("BACKEND", res) }
  )
}

  logout() {
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
      .pipe(map((res: any) => res.data.status == 200));
  }
  private guardarToken(respuesta) {
    console.log('PERFIL', respuesta.perfil);
    const token = respuesta.token;
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
    this.cargaEntradas(this.userToken);
  }

  cargaEntradas(token: string) {
    this.store
      .select('licencias')
      .subscribe(({ licencias }) => (this.licencias = licencias));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .get(`${this.urlbase}apimagu/v2/test`, { headers: headers })
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
        console.log('WORDPRESS ENTRADAS C A R G A D A S');
      });
  }

  cargarPost(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.userToken,
    });
    console.log('HEADRES IN CARDGRA POTS', headers);
    return this.http.get(`${this.urlbase}apimagu/v2/contenido/${id}`, {
      headers: headers,
    });
  }


  existeEnFirebase(items: WPrest[]) {
    for (let lic of this.licencias) {
      if (items.find((entrada) => entrada.id === lic.wpid)) {
        this.store.dispatch(
          ingresoEgresoActions.firebaseActivo({
            id: lic.wpid,
            firebase: true,
          })
        );
      }
    }
  }
  subeSoporte(file: File) {
    const fd = new FormData();
    fd.append('soporte', file, file.name);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.userToken,
    });
    return this.http.post(`${this.urlbase}apimagu/v2/upload`, fd, {
      headers: headers,
    });
  }
}
