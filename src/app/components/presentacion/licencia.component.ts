import { Component, Input, OnInit } from '@angular/core';
import { Ilicencia } from 'src/app/models/contenido.model';


@Component({
  selector: 'single-licencia',
  templateUrl: './licencia.component.html',
  styles: []
})
export class LicenciaComponent implements OnInit {
@Input()
licencia: Ilicencia;
  constructor() { }

  ngOnInit(): void {
  }

}
