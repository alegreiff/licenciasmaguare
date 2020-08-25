import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Contacto } from 'src/app/models/contacto.model';
import { LicenciaContenido } from 'src/app/models/contenido.model';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styles: [
  ]
})
export class ContactosComponent implements OnInit, AfterContentInit {
  contactos: Contacto[];
  licencias: LicenciaContenido[];
  contactoid: string='';
  contactoeditado: Contacto
  opened = false;
  sumatorialicencias: string[]


  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select('licencias').subscribe( ({licencias}) => {
      this.licencias = licencias
    } )

    this.store.select('contactos').subscribe(({ contactos }) => {
      this.contactos = contactos
    })
  }
  close() {
    this.opened = false;
  }
  open(id: string) {
    this.contactoeditado = this.contactos.find(contacto => contacto.id === id);
    this.contactoid=id
    this.opened = true;
  }

  ngAfterContentInit(){
    let sale = [];
    for(let licencia of this.licencias){
      if (licencia.licencia.length ){
        for(let lic of licencia.licencia){
          if(lic.contacto){
            sale.push(lic.contacto)
          }
        }
      }
    }
    this.sumatorialicencias = sale;
  }
  numeroLicenciasContacto(contacto: string){
    return this.sumatorialicencias.filter(function(item){ return item === contacto }).length
  }
}
