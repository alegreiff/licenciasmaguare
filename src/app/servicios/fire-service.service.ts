import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
//IMPORTO LAS ACCIONES
import * as licenciasActions from "../components/store/licencias.actions";
import * as contactosActions from "../components/store/contactos.actions";
import { Contacto } from '../models/contacto.model';
import { LicenciaContenido } from '../models/contenido.model';
@Injectable({
  providedIn: 'root'
})
export class FireServiceService {

  constructor(
    private db: AngularFirestore,
    private store: Store<AppState>
  ) { }
  cargaLicencias(){
    return this.db.collection('licencias').snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map( (doc: any) => {
          let sale = (doc.payload.doc.data()['licencia']).sort((a, b) => b.fechafin - a.fechafin)

          if(doc.payload.doc.data()['licencia']){

            //console.log(doc.payload.doc.data()['licencia'])
            //console.log(sale)
          }

          return {
            id: doc.payload.doc.id,
            titulo: doc.payload.doc.data()['titulo'],
            wpid: doc.payload.doc.data()['wpid'],
            estado: doc.payload.doc.data()['estado'],
            formadeadquisicion: doc.payload.doc.data()['formadeadquisicion'],
            /* licencia: doc.payload.doc.data()['licencia'], */
            licencia: sale
            //contacto: doc.payload.doc.data()['contacto'],


          }
        } )
      })
    )
    .subscribe((res: LicenciaContenido[]) => {

      this.store.dispatch( licenciasActions.setLicencias({licencias: res}) )
      console.log('LICENCIAS CARGADAS', res)

    })


  }
  cargaLI(){
    this.db.collection('licencias').get().subscribe(
      e => console.log("vvvx",e)
    )

  }
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
      console.log('Les CONTACTOS', res)
      this.store.dispatch( contactosActions.setContactos({contactos: res}) )

    })
  }
}
/*
export interface Contacto{
  id?: string,
  nombres?: string,
  apellidos?: string,
  tipodocumento?: string,
  documento?: string,
  telefono?: string[],
  correo?: string,
  direccion?: string
}

*/

/*

map(docArray => {
        return docArray.map( doc => {
          let licence = doc.payload.doc.data()['licencia'];
          let contacto

          doc.payload.doc.data()['licencia'].map(lic => {
            if(lic.contacto){
              lic.contacto.get().then(result => {
                doc.payload.doc.data()['licencia'] = ''
                console.log("KTK",result.data());
                contacto = result.data;
              });
              console.log("XK", contacto)
            }
            lic = 'VACIO'
              return lic
          })
          ;
          console.log(doc.payload.doc.data()['licencia'])
          return {
            id: doc.payload.doc.id,
            titulo: doc.payload.doc.data()['titulo'],
            wpid: doc.payload.doc.data()['wpid'],
            estado: doc.payload.doc.data()['estado'],
            formadeadquisicion: doc.payload.doc.data()['formadeadquisicion'],
            licencia: doc.payload.doc.data()['licencia']

          }
        } )
      })


 */
