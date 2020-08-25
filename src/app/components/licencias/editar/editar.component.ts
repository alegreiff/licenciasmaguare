import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { WindowState } from '@progress/kendo-angular-dialog';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppState } from 'src/app/app.reducer';
import {
  FormaAdquisicion,
  LicenciaContenido,
} from 'src/app/models/contenido.model';
import { EntradaWP } from 'src/app/models/entrada.model';
import { WordpressService } from 'src/app/servicios/wordpress.service';
import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
})
export class EditarComponent implements OnInit {
  licencia: LicenciaContenido;

  entradaActiva: EntradaWP;
  public windowState: WindowState = 'maximized';


  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private db: AngularFirestore,
    private wser: WordpressService
  ) {}

  ngOnInit(): void {
    //console.log("momento",moment().format('MMMM d, y'))
    this.entradaActiva = this.wser.entradaactiva;
    this.route.params.subscribe((e: any) => {
      //console.log('FULLL', e);
      //console.log('ESTA LICENCIA ES ===>', e.licenciaId);
      this.store.select('licencias').subscribe(({ licencias }) => {
        this.licencia = licencias.find(
          (licencia) => licencia.id === e.licenciaId
        );
      });
    });
  }
  modificaDoc() {
    this.db
      .collection('licencias')
      .doc(this.licencia.id)
      .update({
        licencia: [
          ...this.licencia.licencia,
          {
            fechafin: '01/04/2021',
            fechainicio: '01/06/2023',
            documento: 'doc-licencia-'+ this.licencia.id + '-.pdf',
          },
        ],
      });
  }
  cambioSelect(e: string) {
    const valor = e;
    //console.log(e);

    let formadeadquisicion = FormaAdquisicion[e];
    this.db.collection('licencias').doc(this.licencia.id).update({
      formadeadquisicion,
    });
  }

  public opened = false;
    public dataSaved = false;

    public close() {
      this.opened = false;
    }

    public open() {
      this.opened = true;
    }

    public submit() {
        this.dataSaved = true;
        this.modificaDoc()
        this.close();
    }
}
//this.db.collection('licencias')
