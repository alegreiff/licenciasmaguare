import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppState } from 'src/app/app.reducer';
import { Contacto, TipoDocumento } from 'src/app/models/contacto.model';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { ContactosComponent } from './contactos.component';

@Component({
  selector: 'app-nuevoeditarcontacto',
  templateUrl: './nuevoeditarcontacto.component.html',
  styles: [ ],
})
export class NuevoeditarcontactoComponent implements OnInit {
@Input() contactoId: string ='no';
@Input() origenModal?: boolean;
@Output() cierraModal = new EventEmitter<boolean>();


  formacontacto: FormGroup;
  contacto: Contacto;
  tipodocumento: any[]
  textoSeleccionTipo = 'Seleccione el tipo de documento'






  constructor(
    public store: Store<AppState>,
    private fb: FormBuilder,
    private utils: UtilidadesService,
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    if(this.contactoId!=''){
      this.store.select('contactos').subscribe(({ contactos }) => {
        this.contacto = contactos.find(contacto => contacto.id === this.contactoId)
      })
    }

    this.tipodocumento = this.utils.enumToSelect(Object.keys(TipoDocumento), this.textoSeleccionTipo);
    this.creaformulario()
  }
  creaformulario(){
    this.formacontacto = this.fb.group({
      id: [this.contacto ? this.contacto.id : '' ],
      nombres: [this.contacto ? this.contacto.nombres : '' ],
      apellidos: [this.contacto ? this.contacto.apellidos : '' ],
      correo: [this.contacto ? this.contacto.correo : '' , Validators.email],
      tipodocumento: [this.contacto?.tipodocumento ? {text: this.contacto.tipodocumento, value: this.contacto.tipodocumento} : {text: this.textoSeleccionTipo, value: null} ],
      documento: [this.contacto?.documento ? this.contacto.documento : '' ],
      telefono: this.fb.array([this.fb.group({tel: []})]),
      direccion: [this.contacto?.direccion ? this.contacto.direccion : '' ],
      empresa: [this.contacto?.empresa ? this.contacto.empresa : '' ],
    })
    if(this.contacto?.telefono){
      this.telefonosIniciales(this.contacto.telefono);
      //console.log("INIPHONNE", this.contacto.telefono)
    }
  }
  get getTelefono(){
    return this.formacontacto.get('telefono') as FormArray;
  }
  muestratelefonos(telefonos) : any {
    var range = [];
    for (var i=1; i<telefonos.length; i++) {
      range.push({tel:i});
    }

  console.log(range);
  return range
  }
  salvarcontacto(){
    let telefonos = this.arreglosimpletelefonos(this.formacontacto.value.telefono);
    //this.contacto.telefono = telefonos;
    console.log("PHOM", telefonos.length)
    console.log(this.formacontacto.value)
    if(this.contacto?.id){
      this.db.collection('contactos')
      .doc(this.contacto.id)
      .update({
        telefono: telefonos,
        apellidos: this.formacontacto.value.apellidos,
        nombres: this.formacontacto.value.nombres,
        correo: this.formacontacto.value.correo,
        direccion: this.formacontacto.value.direccion,
        tipodocumento: this.formacontacto.value.tipodocumento.value,
        documento: this.formacontacto.value.documento,
        empresa: this.formacontacto.value.empresa,
      })
    }else{
      this.db.collection('contactos').add({
        telefono: telefonos,
        apellidos: this.formacontacto.value.apellidos,
        nombres: this.formacontacto.value.nombres,
        correo: this.formacontacto.value.correo,
        direccion: this.formacontacto.value.direccion,
        tipodocumento: this.formacontacto.value.tipodocumento.value,
        documento: this.formacontacto.value.documento,
        empresa: this.formacontacto.value.empresa,
      })
    }
    this.cierraModal.emit(false)




  }
  arreglosimpletelefonos(telefonos){
    let sale = []
    for (let item of telefonos){
      if(item.tel){
        sale.push(item.tel)
      }

    }
    return sale
  }
  addTelefono(){
    const control = <FormArray>this.formacontacto.controls['telefono'];
    control.push(this.fb.group({tel: []}))

  }
  removeTelefono(index: number){
    const control = <FormArray>this.formacontacto.controls['telefono'];
    control.removeAt(index);
  }
  telefonosIniciales(datos){
    const control = <FormArray>this.formacontacto.controls['telefono'];
    control.removeAt(0);
    for (let item of datos){
      control.push(this.fb.group({tel: item}))
    }


  }


}
