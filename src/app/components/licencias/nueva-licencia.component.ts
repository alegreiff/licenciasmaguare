import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';

import { FileRestrictions } from '@progress/kendo-angular-upload';
import { AngularFirestore } from 'angularfire2/firestore';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from 'src/app/app.reducer';
import { Contacto } from 'src/app/models/contacto.model';
import { Ilicencia, LicenciaContenido } from 'src/app/models/contenido.model';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { ValidadoresService } from 'src/app/servicios/validadores.service';
import { WordpressService } from 'src/app/servicios/wordpress.service';

@Component({
  selector: 'app-nueva-licencia',
  templateUrl: './nueva-licencia.component.html',
  styles: [],
})
export class NuevaLicenciaComponent implements OnInit, OnDestroy {
  @Input() licenciaId: string;
  @Input() licencias: Partial<LicenciaContenido>[];
  @Input() nombreContenido: string;
  @Input() wordpressId: number;

  @Output() cierraEdicionLicencia = new EventEmitter<boolean>();

  private fbSubs: Subscription[] = [];


  formulario: FormGroup;
  licenciaNueva: Partial<LicenciaContenido>;
  licenciaEditada: Partial<Ilicencia>;
  temporalSoportes: any[] = [];
  formadeadquisicion: any[];
  contactoslist: any[];
  contactos: Contacto[];
  contacto: string;
  activecontacto: string;
  opened = false;
  confirmaBorrarAnexo = false;
  anexoborrable: number
  public myFiles: Array<any>;
  restriccionesUpload: FileRestrictions = {
    allowedExtensions: ['jpg', 'pdf', 'png'],
  };
  lossoportes: any[] = [];
  modalidades: [];
  formaAdquisicion: [];
  derechos: [];
  usuarioactivo;
  formatOptions: any = {
    style: 'currency',
    currency: 'COP',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
};
  editlicscence: any;
  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private utils: UtilidadesService,
    private validajaime: ValidadoresService,
    private store: Store<AppState>,
    private ws: WordpressService,

  ) {}

  ngOnInit(): void {
    //console.log("LLAMA AL SERVICIO ", this.utils.getLicenciaEditada)
    this.editlicscence = this.utils.getLicenciaEditada;
    if(!this.utils.getLicenciaEditada[0] && !this.utils.getLicenciaEditada[1]){
      //console.log("E una nuova licenza")

    }else{
      //console.log("Edita vechia licenza")
      const licenciaId = this.utils.getLicenciaEditada[0]
      const licenciaIndice = this.utils.getLicenciaEditada[1]
      this.fbSubs.push(this.store.select('licencias').subscribe(({licencias}) => {
        const licencia = licencias.find(lic => lic.id === licenciaId)
        //console.log("LLLLK", licencia)
        //console.log("LLLLK", licencia.licencia[licenciaIndice])
        this.licenciaEditada = licencia.licencia[licenciaIndice]
        this.temporalSoportes = [ ...this.licenciaEditada.soportes ];
      }))
    }

    this.fbSubs.push(this.ws.activo.subscribe((res) => {
      //console.log('ACTIVO', res);

      this.usuarioactivo = this.ws.usuario;
    }));

    this.fbSubs.push(this.store.select('opciones').subscribe(({ opciones }) => {
      this.modalidades = opciones['modalidadesdeuso'];
      this.formaAdquisicion = opciones['formasdeadquisicion'];
      this.derechos = opciones['derechoslicenciados'];
    }))


    this.formadeadquisicion = this.utils.enumToSelect(
      this.formaAdquisicion,
      'Seleccione la forma de adquisición'
    );

    this.fbSubs.push(this.store.select('contactos').subscribe(({ contactos }) => {
      this.contactos = contactos;
      this.contactoslist = this.utils.enumToSelectComplejo(
        contactos,
        'Seleccione el titular o cree uno nuevo'
      );
      //console.log("CONTAKK", this.contactoslist)
    }));
    this.creaFormulario();
  }
  editaFormadeadquisicion(valor){
    //console.log("SELECTED", this.formadeadquisicion)
    //console.log("SELECTED", valor)
    const indice = (this.formadeadquisicion[1]).findIndex( forma => forma.text === valor )
    //console.log(this.formadeadquisicion[1][indice])
    return this.formadeadquisicion[1][indice]
  }
  editaContacto(valor){
    /* if(this.contactoslist){
      console.log('aiiii')
    }else{
      console.log('njnjnjn')
    } */
    //console.log("CONTTT", this.contactoslist)
    //console.log("CONTTT", valor)
    const indice = (this.contactoslist[1]).findIndex( contacto => contacto.value === valor )
    //console.log(this.contactoslist[1][indice])
    return this.contactoslist[1][indice]
    //return null
  }
  creaFormulario() {
    this.formulario = this.fb.group({
      fechainicio: [this.licenciaEditada?.fechainicio ? this.licenciaEditada?.fechainicio.toDate() : '', [Validators.required]],
      fechafin: [this.licenciaEditada?.fechafin ? this.licenciaEditada?.fechafin.toDate() : null],
      formaadquisicion: [this.licenciaEditada?.formadeadquisicion ? this.editaFormadeadquisicion(this.licenciaEditada?.formadeadquisicion) : null, [this.validajaime.controlSeleccion]],
      obsformaadquisicion: [this.licenciaEditada?.obsformaadquisicion ? this.licenciaEditada?.obsformaadquisicion : ''],
      obsderechoslicenciados: [this.licenciaEditada?.obsderechoslicenciados ? this.licenciaEditada?.obsderechoslicenciados : ''],
      obsmodalidadesdeuso: [this.licenciaEditada?.obsmodalidadesdeuso ? this.licenciaEditada?.obsmodalidadesdeuso : ''],
      observaciones: [ this.licenciaEditada?.observaciones ? this.licenciaEditada?.observaciones : '' ],
      modalidadesdeuso: [this.licenciaEditada?.modalidadesdeuso ? this.licenciaEditada?.modalidadesdeuso : ''],
      derechoslicenciados: [this.licenciaEditada?.derechoslicenciados ? this.licenciaEditada?.derechoslicenciados : ''],
      contacto: [this.licenciaEditada?.contacto ? this.editaContacto(this.licenciaEditada?.contacto) : null],
      soportes: this.fb.array([]),
      valor: [this.licenciaEditada?.valor ? this.licenciaEditada?.valor : 0]
    });
  }
  get getSopps() {
    return this.formulario.get('soportes') as FormArray;
  }
  agregaSoportes() {
    const group = this.fb.group({
      archivos: this.fb.control(null, [Validators.required]),
      descripciones: this.fb.control(null, [Validators.required]),
    });
    (<FormArray>this.formulario.get('soportes')).push(group);
  }

  quitaSoporte(index: number) {
    const control = <FormArray>this.formulario.controls['soportes'];
    control.removeAt(index);
  }

  guardaLicencia() {
    //console.log(this.formulario.value);
    if (this.formulario.value.contacto?.value) {
      this.contacto = this.formulario.value.contacto.value;
    } else {
      this.contacto = '';
    }

    if (this.formulario.value.soportes.length > 0) {
      this.guardaAnexos(this.formulario.value.soportes);
    } else {
      //console.log('SIN ANEXOS');
      this.modificaDoc(); //NO GUARDA
    }
  }
  guardaAnexos(soportes: any) {
    //console.log('Los anexos son: ', soportes);
    const calls = [];
    let soportesdb = [];
    for (let soporte of soportes) {
      calls.push(
        this.ws.subeSoporte(soporte.archivos[0], this.wordpressId).pipe(
          map((res: any) => {
            const describe = soporte.descripciones;
            soportesdb.push({ archivo: res.archivo, descripcion: describe });
            return { ...res, describe };
          })
        )
      );
    }
    this.fbSubs.push(forkJoin(calls).subscribe(() => {
      //console.log('SII', soportesdb);
      this.lossoportes = soportesdb;
      this.revisaSoportes(soportesdb);
      this.modificaDoc();
    }));
  }
  modificaDoc() {
    let salvado = [ ...this.licencias ]

    //console.log("ANTES DE ", salvado.length)
    //console.log("REFERENCIA", this.utils.getLicenciaEditada[1])

    //console.log("NEUTRO", this.utils.getLicenciaEditada)
    //console.log("POPOPOPOPOPOPOPOPOPOPOPPOP", this.utils.getLicenciaEditada[1])

    if(Number.isInteger(this.utils.getLicenciaEditada[1])){
      salvado.splice(this.utils.getLicenciaEditada[1], 1)
      //console.log("SOLO CUANDO ES EDICIÓN DESPUÉS DE ", salvado.length)
    }

    let updatedlicencia = [
      ...salvado,
      {
        fechafin: this.formulario.value.fechafin,
        fechainicio: this.formulario.value.fechainicio,
        formadeadquisicion: this.formulario.value.formaadquisicion.value,
        obsformaadquisicion: this.formulario.value.obsformaadquisicion,
        obsderechoslicenciados: this.formulario.value.obsderechoslicenciados,
        obsmodalidadesdeuso: this.formulario.value.obsmodalidadesdeuso,
        observaciones: this.formulario.value.observaciones,
        modalidadesdeuso: this.formulario.value.modalidadesdeuso,
        contacto: this.contacto,
        soportes: this.revisaSoportes(this.lossoportes),
        derechoslicenciados: this.formulario.value.derechoslicenciados,
        creador: this.usuarioactivo,
        valor: this.formulario.value.valor

      },
    ];
    //console.log(updatedlicencia);

    this.db.collection('licencias').doc(this.licenciaId).update({
      licencia: updatedlicencia,
    });
    this.cancelaEdicion();
  }
  contactoCambia(e: any) {
   //console.log('CAMBIO CONTACTO', e);
    this.activecontacto = e.value;
  }
  cerrar(e: any) {
    this.opened = e;
  }
  open() {
    this.opened = true;
  }
  cancelaEdicion(){
    this.cierraEdicionLicencia.emit(false)
  }
  revisaSoportes(soportes){
    let salida = [];
    if(this.utils.getLicenciaEditada[1]>=0){
      if(this.temporalSoportes.length > 0){
        salida = soportes.concat(this.temporalSoportes)
      }else{
        salida = soportes;
      }
    }
    //console.log("lessoportèes", soportes)
    //console.log("lesNouvellesSoportèes", salida)
    return salida;
  }
  removerSoporteEditado(id: number){
    this.anexoborrable = id;
    this.confirmaBorrarAnexo = true;
  }
  public actionsLayout: string = 'normal';

    public onDialogClose() {
        this.confirmaBorrarAnexo = false
        this.anexoborrable = null;
    }

    public onDeleteData() {
        this.borraSoporteEditado()
    }
  borraSoporteEditado(){
    const id = this.anexoborrable
    this.fbSubs.push(this.ws.borraAnexo(this.temporalSoportes[id]['archivo']).subscribe((e) => {
      if(e['exito'] === true){
        this.temporalSoportes.splice(id, 1)
        this.confirmaBorrarAnexo = false
        this.anexoborrable = null;
      }else{
        console.info("La hemos cagado Jimmy")
      }
    }))
  }

  ngOnDestroy(){
    this.cancelSubscriptions()
  }
  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe())
    console.log("FUERA", this.fbSubs.length + ' <<<')
}
}
