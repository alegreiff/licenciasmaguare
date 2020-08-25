import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AngularFirestore} from 'angularfire2/firestore';
import { AppState } from 'src/app/app.reducer';
import { Contacto } from 'src/app/models/contacto.model';
import { DerechosLicenciados, FormaAdquisicion, LicenciaContenido, ModalidadesDeUso } from 'src/app/models/contenido.model';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { ValidadoresService } from 'src/app/servicios/validadores.service';


@Component({
  selector: 'app-nueva-licencia',
  templateUrl: './nueva-licencia.component.html',
  styles: [
  ]
})
export class NuevaLicenciaComponent implements OnInit {
@Input() licenciaId: string;
@Input() licencias: Partial<LicenciaContenido>[];

formaAdquisicion = Object.keys(FormaAdquisicion);
modalidades = Object.keys(ModalidadesDeUso);
derechos = Object.keys(DerechosLicenciados);
formulario: FormGroup;
licenciaNueva: Partial<LicenciaContenido>;
formadeadquisicion: any[];
contactoslist: any[]
contactos: Contacto[];
contacto: string;
activecontacto: string;
opened = false;
public myFiles: Array<any>;


  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private utils: UtilidadesService,
    private validajaime: ValidadoresService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.formadeadquisicion = this.utils.enumToSelect(Object.keys(FormaAdquisicion), 'Seleccione la forma de adquisición');
    this.creaFormulario()
    this.store.select('contactos').subscribe(({ contactos }) => {
      this.contactos = contactos
      this.contactoslist =  this.utils.enumToSelectComplejo((contactos), 'Seleccione el titular o cree uno nuevo');
    })

  }
  creaFormulario(){
    this.formulario = this.fb.group({
      fechainicio: ['', [Validators.required]],
      fechafin: [null],
      formaadquisicion: [null, [this.validajaime.controlSeleccion]],
      modalidadesuso: [''],
      derechoslicenciados: [''],
      contacto: [null],
      //files: [this.myFiles, [Validators.required]]
      files: [this.myFiles]

    })
  }

  guardaLicencia(){
    console.log(this.formulario.value)
    //this.contacto = this.db.doc('contactos/' + this.formulario.value.contacto.id).ref
    if(this.formulario.value.contacto?.value){
      this.contacto =this.formulario.value.contacto.value
    }else{
      this.contacto = ''
    }

    console.log("CONTACTO", this.contacto)
    this.modificaDoc()
  }
  modificaDoc() {
    let updatedlicencia = [
      ...this.licencias,
      {
        fechafin: this.formulario.value.fechafin,
        fechainicio: this.formulario.value.fechainicio,
        documento: 'doc-licencia-'+ this.licenciaId + '-.pdf',
        formadeadquisicion: FormaAdquisicion[this.formulario.value.formaadquisicion.value],
        modalidadesdeuso: this.formulario.value.modalidadesuso,
        contacto: this.contacto

      },
    ];
    console.log(updatedlicencia);


    this.db
      .collection('licencias')
      .doc(this.licenciaId)
      .update({
        licencia: updatedlicencia

      });
  }
  cambioSelect(e: string) {
    const valor = e;
    console.log(e);

    let formadeadquisicion = FormaAdquisicion[e];
    /* this.db.collection('licencias').doc(this.licencia.id).update({      formadeadquisicion,
    }); */
  }
  contactoCambia(e:any){
    console.log("CAMBIO CONTACTO", e)
    this.activecontacto = e.value
  }
  cerrar(e: any){
    this.opened = e;
  }
  open() {
    this.opened = true;
  }

}
