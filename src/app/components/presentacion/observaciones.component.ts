import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'observacioneslicencia',
  templateUrl: './observaciones.component.html',
  styles: []
})
export class ObservacionesComponent implements OnInit {
  @Input() titulo: string
  @Input() texto: string;
  constructor() { }

  ngOnInit(): void {
  }

}
