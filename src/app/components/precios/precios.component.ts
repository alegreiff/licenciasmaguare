import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { WPrest } from 'src/app/models/wp.model';
import { WordpressService } from 'src/app/servicios/wordpress.service';
//import * as ingresoEgresoActions from "../../components/store/datos.actions";

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styles: [],
})
export class PreciosComponent implements OnInit {
  contenidos: LicenciaContenido[];

  constructor(
    private store: Store<AppState>,
    private ws: WordpressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.select('licencias').subscribe(({ licencias }) => {
      this.contenidos = licencias;
    });
  }

  editarlicencia(id: string) {
    this.router.navigate(['/licencia', id]);
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
