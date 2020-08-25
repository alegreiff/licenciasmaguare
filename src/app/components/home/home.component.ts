import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { FireServiceService } from 'src/app/servicios/fire-service.service';
import { WordpressService } from 'src/app/servicios/wordpress.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
licencias: LicenciaContenido[];

  constructor(
    private ws: WordpressService,
    private fiser: FireServiceService
    ) { }

  ngOnInit(): void {
    this.ws.leerToken()
    //this.fiser.cargaLicencias()


  }
  /* traerLicenciasfs(){
    this.db.collection('licencias').snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map( doc => {
          return {
            id: doc.payload.doc.id,
            titulo: doc.payload.doc.data()['titulo'],
            wpid: doc.payload.doc.data()['wpid'],
            estado: doc.payload.doc.data()['estado'],
            formadeadquisicion: doc.payload.doc.data()['formadeadquisicion'],
            licencia: doc.payload.doc.data()['licencia'],
          }
        } )
      })
    ).subscribe((res: ContenidoModel[]) => console.log(res))
  } */

}
