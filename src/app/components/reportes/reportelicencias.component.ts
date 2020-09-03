import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Ilicencia, LicenciaContenido } from 'src/app/models/contenido.model';
import { WPrest } from 'src/app/models/wp.model';
import { FireServiceService } from 'src/app/servicios/fire-service.service';
import { WordpressService } from 'src/app/servicios/wordpress.service';
import { products } from './products';
import { aggregateBy, process } from '@progress/kendo-data-query';

//import * as ingresoEgresoActions from "../../components/store/datos.actions";

@Component({
  selector: 'reportelicencias',
  templateUrl: './reportelicencias.component.html',
  styles: [],
})
export class ReporteLicenciasComponent implements OnInit {
  contenidos: LicenciaContenido[];
  modalidades: []
  licenciasDisponibles: Ilicencia[];

  constructor(
    private store: Store<AppState>,
    private ws: WordpressService,
    private router: Router,
    private fs: FireServiceService
  ) {}

  ngOnInit(): void {

    this.store.select('opciones').subscribe(({opciones}) => {
      console.log(opciones)
      this.modalidades = opciones['derechoslicenciados']
    })

    this.store.select('licencias')
    .subscribe(({ licencias }) => {

      this.contenidos = licencias.filter(lic => lic.totallicencias>0 )
      let sale = []
      for( let lic of this.contenidos){
        for(let li of lic.licencia){

          sale.push({licencia: li, nombre: lic.titulo, tipo: lic.tipo, id: lic.id, numerolicencias: lic.totallicencias, estado: lic.estado, wpid: lic.wpid})
        }
      }
      console.log("SALE", sale)
      this.licenciasDisponibles = sale;
      this.data = process(sale, {group: this.group}).data;
      console.log("XLLSS",this.data)



    });
  }

  editarlicencia(id: string) {
    console.log("NTT")
    this.router.navigate(['/contenido', id]);
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
        this.close();
    }



    public data: any[]

    public group: any[] = [{
      field: 'licencia'
  }];



}
