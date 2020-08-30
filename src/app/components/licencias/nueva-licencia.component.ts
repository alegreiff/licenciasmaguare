import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from 'src/app/app.reducer';
import { Contacto } from 'src/app/models/contacto.model';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { ValidadoresService } from 'src/app/servicios/validadores.service';
import { WordpressService } from 'src/app/servicios/wordpress.service';

@Component({
  selector: 'app-nueva-licencia',
  templateUrl: './nueva-licencia.component.html',
  styles: [],
})
export class NuevaLicenciaComponent implements OnInit {
  @Input() licenciaId: string;
  @Input() licencias: Partial<LicenciaContenido>[];
  @Output() cierraEdicionLicencia = new EventEmitter<boolean>();


  formulario: FormGroup;
  licenciaNueva: Partial<LicenciaContenido>;
  formadeadquisicion: any[];
  contactoslist: any[];
  contactos: Contacto[];
  contacto: string;
  activecontacto: string;
  opened = false;
  public myFiles: Array<any>;
  restriccionesUpload: FileRestrictions = {
    allowedExtensions: ['jpg', 'pdf', 'png'],
  };
  lossoportes: any[] = [];
  modalidades: [];
  formaAdquisicion: [];
  derechos: [];
  usuarioactivo;

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private utils: UtilidadesService,
    private validajaime: ValidadoresService,
    private store: Store<AppState>,
    private ws: WordpressService
  ) {}

  ngOnInit(): void {
    this.ws.activo.subscribe((res) => {
      console.log('ACTIVO', res);

      this.usuarioactivo = this.ws.usuario;
    });
    this.store.select('opciones').subscribe(({ opciones }) => {
      this.modalidades = opciones['modalidadesdeuso'];
      this.formaAdquisicion = opciones['formasdeadquisicion'];
      this.derechos = opciones['derechoslicenciados'];
    });

    this.formadeadquisicion = this.utils.enumToSelect(
      this.formaAdquisicion,
      'Seleccione la forma de adquisición'
    );
    this.creaFormulario();
    this.store.select('contactos').subscribe(({ contactos }) => {
      this.contactos = contactos;
      this.contactoslist = this.utils.enumToSelectComplejo(
        contactos,
        'Seleccione el titular o cree uno nuevo'
      );
    });
  }
  creaFormulario() {
    this.formulario = this.fb.group({
      fechainicio: ['', [Validators.required]],
      fechafin: [null],
      formaadquisicion: [null, [this.validajaime.controlSeleccion]],
      obsformaadquisicion: [''],
      obsderechoslicenciados: [''],
      obsmodalidadesdeuso: [''],
      observaciones: [''],
      modalidadesuso: [''],
      derechoslicenciados: [''],
      contacto: [null],
      soportes: this.fb.array([]),
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
    console.log(this.formulario.value);
    if (this.formulario.value.contacto?.value) {
      this.contacto = this.formulario.value.contacto.value;
    } else {
      this.contacto = '';
    }

    if (this.formulario.value.soportes.length > 0) {
      this.guardaAnexos(this.formulario.value.soportes);
    } else {
      console.log('SIN ANEXOS');
      this.modificaDoc();
    }
  }
  guardaAnexos(soportes: any) {
    console.log('Los anexos son: ', soportes);
    const calls = [];
    let soportesdb = [];
    for (let soporte of soportes) {
      calls.push(
        this.ws.subeSoporte(soporte.archivos[0]).pipe(
          map((res: any) => {
            const describe = soporte.descripciones;
            soportesdb.push({ archivo: res.archivo, descripcion: describe });
            return { ...res, describe };
          })
        )
      );
    }
    forkJoin(calls).subscribe(() => {
      console.log('SII', soportesdb);
      this.lossoportes = soportesdb;
      this.modificaDoc();
    });
  }
  modificaDoc() {
    let updatedlicencia = [
      ...this.licencias,
      {
        fechafin: this.formulario.value.fechafin,
        fechainicio: this.formulario.value.fechainicio,
        formadeadquisicion: this.formulario.value.formaadquisicion.value,
        obsformaadquisicion: this.formulario.value.obsformaadquisicion,
        obsderechoslicenciados: this.formulario.value.obsderechoslicenciados,
        obsmodalidadesdeuso: this.formulario.value.obsmodalidadesdeuso,
        observaciones: this.formulario.value.observaciones,
        modalidadesdeuso: this.formulario.value.modalidadesuso,
        contacto: this.contacto,
        soportes: this.lossoportes,
        derechoslicenciados: this.formulario.value.derechoslicenciados,
        creador: this.usuarioactivo,

      },
    ];
    console.log(updatedlicencia);

    this.db.collection('licencias').doc(this.licenciaId).update({
      licencia: updatedlicencia,
    });
  }
  contactoCambia(e: any) {
    console.log('CAMBIO CONTACTO', e);
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
}
