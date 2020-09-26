import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WindowState } from '@progress/kendo-angular-dialog';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppState } from 'src/app/app.reducer';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import {
  FormaAdquisicion,
  LicenciaContenido,
} from 'src/app/models/contenido.model';
import { EntradaWP } from 'src/app/models/entrada.model';
import { WordpressService } from 'src/app/servicios/wordpress.service';
import * as moment from 'moment';
import 'moment/locale/es';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { FireServiceService } from 'src/app/servicios/fire-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
})
export class EditarComponent implements OnInit, OnDestroy {
  licencia: LicenciaContenido;
  private fbSubs: Subscription[] = [];
  entradaActiva: EntradaWP;
  public windowState: WindowState = 'maximized';


  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private db: AngularFirestore,
    private wser: WordpressService,
    private dialogService: DialogService,
    private utils: UtilidadesService,
    private router: Router,
    private fiser: FireServiceService
  ) {}

  ngOnInit(): void {
    console.log("Ingreso no se por qué a editar.component.ts")
    //this.router.navigate(['/contenido', id])
    //console.log("momento",moment().format('MMMM d, y'))

    this.entradaActiva = this.wser.entradaactiva;
    this.fbSubs.push(
      this.route.params.subscribe((e: any) => {
        //console.log('FULLL', e);
        //console.log('ESTA LICENCIA ES ===>', e.licenciaId);
        this.fbSubs.push(this.store.select('licencias').subscribe(({ licencias }) => {
          this.licencia = licencias.find(
            (licencia) => licencia.id === e.licenciaId
          );
        }));
        if(!this.entradaActiva){
          console.log("LICID", e.licenciaId)
          this.fbSubs.push(this.fiser.obtieneWordPressID(e.licenciaId).subscribe(
            res => {
              if(res){
                this.router.navigate(['/contenido', res])
              }
            }
          ));
        }
      })
    );
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
      this.utils.setLicenciaEditada=[null, null]
      this.opened = true;
    }

    public submit() {
        this.dataSaved = true;
        this.modificaDoc()
        this.close();
    }
    cierraModalLicencia(e: boolean){
      console.log("CIERRA LA EDICIÓN",e)
      this.opened = e;
      this.showConfirmation()
    }
    public result;

    public showConfirmation() {
        const dialog: DialogRef = this.dialogService.open({
            title: 'Licencia guardada correctamente',
            content: this.licencia.titulo + ' (' + this.entradaActiva.tipo + ')',
            actions: [
                { text: 'Cerrar' },
            ],
            width: 450,
            height: 200,
            minWidth: 250
        });

        dialog.result.subscribe((result) => {

        });
    }
    editarlicencia(e){
      console.log("Editando, maestro", e)
      const contenidoId= e[0]
      const indice = e[1]
      this.utils.setLicenciaEditada=[contenidoId, indice]
      this.opened = true;
    }

    ngOnDestroy(){
      this.cancelSubscriptions()
    }
    cancelSubscriptions() {
      this.fbSubs.forEach(sub => sub.unsubscribe())
      console.log("FUERA", this.fbSubs.length + ' <<<')
  }
}
//this.db.collection('licencias')
