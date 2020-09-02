import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ilicencia } from 'src/app/models/contenido.model';


@Component({
  selector: 'single-licencia',
  templateUrl: './licencia.component.html',
  styles: []
})
export class LicenciaComponent implements OnInit {
@Input()
licencia: Ilicencia;
@Input()
indice: number;
@Input()
contenidoId: string

@Output() editacontenido = new EventEmitter<[string, number]>();

  constructor() { }

  ngOnInit(): void {
  }

  edita(a: string, b: number){
    console.log(a + ' ------- ' + b)
    this.editacontenido.emit([a, b])
  }
}
