import { Contacto } from './contacto.model';

export interface LicenciaContenido {
  wpid: number,
  titulo: string,
  estado: EstadoContenido,
  fechaocultar?: string,
  tipo?: string,
  interprete_autor?: string,
  licencia?: Array<Ilicencia>,
  estadolicencia?: string,
  id?: string,
  descripcion?: string,
  totallicencias?: number

}

export interface Ilicencia {
  fechainicio: any,
  fechafin?: any,
  formadeadquisicion?: FormaAdquisicion,
  obsformaadquisicion?: string,
  obsderechoslicenciados?: string,
  obsmodalidadesdeuso?: string,
  observaciones?: string,
  modalidadesdeuso?: ModalidadesDeUso[],
  //modalidadesdeusootro?: string,
  derechoslicenciados?: DerechosLicenciados[],
  //derechoslicenciadosotro?: string,
  contacto?: string,
  soportes?: any[],
  creador?: string
  total?: number,
  valor?: number

}
export enum DerechosLicenciados {
'Comunicación pública' = 'Comunicación pública',
'Distribución' = 'Distribución',
'Reproducción' = 'Reproducción',
'Transformación' = 'Transformación'

}
export enum EstadoContenido {

  publish = 'publish',
  private = 'private',
  draft = 'draft',
}

export enum FormaAdquisicion {
  'Becas'= 'Becas',
  'Cesión gratuita' = 'Cesión gratuita',
  'Cesión gratuita sin restricciones' = 'Cesión gratuita sin restricciones',
  'Compra' = 'Compra',
  'Convenios' = 'Convenios',
  'Convenios interadministrativos' = 'Convenios interadministrativos',
  'Convocatoria' = 'Convocatoria',
  'Producción por encargo' = 'Producción por encargo',
  'Sin restricciones' = 'Sin restricciones'
}

export enum ModalidadesDeUso {
  'Comunicación' = 'Comunicación',
  'Exhibición'= 'Exhibición',
  'Lectura pública'	= 'Lectura pública',
  'Puesta a disposición' = 'Puesta a disposición',
  'Realizar el alquiler de copias digitales' = 'Realizar el alquiler de copias digitales',
  'Reproducción en DVD o cualquier otro formato físico' = 'Reproducción en DVD o cualquier otro formato físico',
  'Reproducciones necesarias para subir las obras a la plataforma' = 'Reproducciones necesarias para subir las obras a la plataforma'
}


