import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { WPrest } from 'src/app/models/wp.model';
import { WordpressService } from 'src/app/servicios/wordpress.service';
import * as ingresoEgresoActions from "../../components/store/datos.actions";

@Component({
  selector: 'app-contenidos',
  templateUrl: './contenidos.component.html',
  styles: [
  ]
})
export class ContenidosComponent implements OnInit {

  contenidos: WPrest[];
  licencias: LicenciaContenido[];
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private wps: WordpressService

  ) { }

  ngOnInit(): void {
    this.cargaContenidos();




  }
  cargaContenidos(){
    this.store.select('licencias').subscribe(
      ({licencias}) => this.licencias = licencias,


      ),


    this.store.select('ingresosEgresos')
    .subscribe(({items}) => {this.contenidos = items})

    if(this.contenidos){
      this.wps.existeEnFirebase(this.contenidos)
    }

  }
  edit(id: string){
    //console.log(id)
    this.router.navigate(['/contenido', id])
  }
  /*cambiaFire( id: number ){
    this.store.dispatch(ingresoEgresoActions.firebaseActivo({
      id: id,
      firebase: true
    }))
  }*/


}
