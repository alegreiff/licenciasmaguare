import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-minicontacto',
  templateUrl: './minicontacto.component.html',
  styles: [
  ]
})
export class MinicontactoComponent implements OnInit {
@Input() contactoid: string;
  constructor() { }

  ngOnInit(): void {
  }

}
