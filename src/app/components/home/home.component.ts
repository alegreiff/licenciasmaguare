import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
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
private cambioEstado = new BehaviorSubject<string>('');
activo = this.cambioEstado.asObservable();
statttus: Observable<string>
public checked: boolean = false;

  constructor(
    private ws: WordpressService,
    private fiser: FireServiceService
    ) { }

  ngOnInit(): void {
    console.log("EXISTE ENTRADA ACTIVA", this.ws.entradaactiva)
    this.ws.leerToken()
    this.statttus = this.activo;
    /* this.activo.subscribe((res) => {
      console.log("detecta cambio", res)
    }) */


  }

  setEstado(estado: string) {
    this.cambioEstado.next(estado);
  }

}
