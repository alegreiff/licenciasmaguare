import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Contacto } from 'src/app/models/contacto.model';

@Component({
  selector: 'contactomaguare',
  templateUrl: './fichacontacto.component.html',
  styles: [
    `kendo-card{ margin-top: 0.5em;}`
  ]
})
export class FichacontactoComponent implements OnInit {
@Input() idContacto: string;
  contacto: Contacto

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select('contactos').subscribe(({contactos}) => {
    this.contacto = contactos.find(contacto => contacto.id === this.idContacto);
    })
  }

}
