import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { filter, find, map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
//IMPORTO LAS ACCIONES
import * as licenciasActions from "../components/store/licencias.actions";
import * as contactosActions from "../components/store/contactos.actions";
import * as opcionesActions from "../components/store/opciones.actions";
import { Contacto } from '../models/contacto.model';
import { LicenciaContenido } from '../models/contenido.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FireServiceService {

  constructor(
    private db: AngularFirestore,
    private store: Store<AppState>
  ) { }

  obtieneWordPressID(id: string){
    return this.store.select('licencias')
    .pipe(

      map(({licencias}) => {
        const sale = licencias.find( licencia => licencia.id === id)
        if ( sale  ){
          return sale.wpid
        }

      })
    )

  }
  cargaOpcionesGenerales(){
    return this.db.collection('opciones').snapshotChanges().pipe(
      map(res => {
        return res.map( doc => {
          return {

            //id: doc.payload.doc.id,
            formasdeadquisicion: doc.payload.doc.data()['formasdeadquisicion'],
            modalidadesdeuso: doc.payload.doc.data()['modalidadesdeuso'],
            derechoslicenciados: doc.payload.doc.data()['derechoslicenciados'],
            nombre: doc.payload.doc.data()['nombreapp'],
            correonotificaciones: doc.payload.doc.data()['correonotificaciones'],


          }
        } )
      })
    ).subscribe((e: any[]) => {
      //console.log('Opciones cargadas', e);
      this.store.dispatch(opcionesActions.setOpciones({opciones: e[0]}))

      this.cargaLicencias()
      this.cargaContactos()
    })
  }
  cargaLicencias(){
    return this.db.collection('licencias').snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map( (doc: any) => {
          let sale = (doc.payload.doc.data()['licencia']).sort((a, b) => b.fechafin - a.fechafin)
          sale.total = (doc.payload.doc.data()['licencia']).length;
          let totallicencias= (doc.payload.doc.data()['licencia']).length;


          /* if(doc.payload.doc.data()['licencia']){
          } */
          return {
            id: doc.payload.doc.id,
            titulo: doc.payload.doc.data()['titulo'],
            wpid: doc.payload.doc.data()['wpid'],
            estado: doc.payload.doc.data()['estado'],
            formadeadquisicion: doc.payload.doc.data()['formadeadquisicion'],
            tipo: doc.payload.doc.data()['tipo'],
            licencia: sale,
            totallicencias: totallicencias
          }
        } )
      })
    )
    .subscribe((res: LicenciaContenido[]) => {
      this.store.dispatch( licenciasActions.setLicencias({licencias: res}) )

    })
  }
  /* cargaLI(){
    this.db.collection('licencias').get().subscribe(
      (e:any) => {

      }
    )
  } */
  cargaContactos(){
    return this.db.collection('contactos').snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map( doc => {
          return {
            id: doc.payload.doc.id,
            empresa: doc.payload.doc.data()['empresa'],
            nombres: doc.payload.doc.data()['nombres'],
            apellidos: doc.payload.doc.data()['apellidos'],
            tipodocumento: doc.payload.doc.data()['tipodocumento'],
            documento: doc.payload.doc.data()['documento'],
            telefono: doc.payload.doc.data()['telefono'],
            correo: doc.payload.doc.data()['correo'],
            direccion: doc.payload.doc.data()['direccion'],
            nombremostrar: doc.payload.doc.data()['nombres'] + ' ' + doc.payload.doc.data()['apellidos']
          }
        } )
      })
    ).subscribe((res: Contacto[]) => {
      //console.log('Les CONTACTOS', res)
      this.store.dispatch( contactosActions.setContactos({contactos: res}) )

    })
  }
}

