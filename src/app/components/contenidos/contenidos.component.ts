import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { WPrest } from 'src/app/models/wp.model';
import { WordpressService } from 'src/app/servicios/wordpress.service';
import * as ingresoEgresoActions from '../../components/store/datos.actions';

@Component({
  selector: 'app-contenidos',
  templateUrl: './contenidos.component.html',
  styles: [],
})
export class ContenidosComponent implements OnInit, OnDestroy {
  contenidos: WPrest[];
  licencias: LicenciaContenido[];
  private fbSubs: Subscription[] = [];
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private wps: WordpressService
  ) {}

  ngOnInit(): void {
    this.cargaContenidos();
  }
  cargaContenidos() {
    this.fbSubs.push(
      this.store
        .select('licencias')
        .subscribe(({ licencias }) => (this.licencias = licencias))
    );
    console.info("PREMIMINATED INGRESOS EGRESOS")
    this.fbSubs.push(

      this.store.select('ingresosEgresos').subscribe(({ items }) => {
        console.info("SELECCIONA INGRESOS EGRESOS")
        this.contenidos = items;
      })
    );



      this.wps.existeEnFirebase(this.contenidos);

  }
  edit(id: string) {
    //console.log(id)
    this.router.navigate(['/contenido', id]);
  }

  ngOnDestroy() {
    this.cancelSubscriptions();
  }
  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
    console.log('FUERA', this.fbSubs.length + ' <<<');
  }
}
