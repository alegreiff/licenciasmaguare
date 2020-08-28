import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { WPrest } from 'src/app/models/wp.model';
import { FireServiceService } from 'src/app/servicios/fire-service.service';
import { WordpressService } from 'src/app/servicios/wordpress.service';
//import * as ingresoEgresoActions from "../../components/store/datos.actions";

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styles: [],
})
export class PreciosComponent implements OnInit {
  contenidos: LicenciaContenido[];
  modalidades: []

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

    this.store.select('licencias').subscribe(({ licencias }) => {
      this.contenidos = licencias;
    });
  }

  editarlicencia(id: string) {
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
}
