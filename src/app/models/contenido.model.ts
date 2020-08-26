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

}

interface Ilicencia {
  fechainicio: any,
  fechafin?: any,
  documento?: string,
  formadeadquisicion?: FormaAdquisicion,
  modalidadesdeuso?: ModalidadesDeUso[],
  modalidadesdeusootro?: string,
  derechoslicenciados?: DerechosLicenciados[],
  derechoslicenciadosotro?: string,
  contacto?: string,
  soportes?: any[]

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

/*

id(pin): 6844
title(pin): "Audioteca De agua, viento y verdor"
tipo(pin): "app"
firebase(pin): false
tipo_de_contenido(pin): "app"
interprete_autor(pin): "ICBF Instituto Colombiano de Bienestar Familiar - Ministerio de Cultura - Ministerio de Educación - Fundación Plan"
descripcion(pin): "En esta audioteca interactiva van a encontrar las voces, canciones, arrullos, historias y ambientes sonoros propios de 21 comunidades indígenas de Colombia. El agua es sinónimo de vida de los ríos y lagunas, sitios sagrados de nuestros pueblos indígenas. El Viento recorre todos los espacios de la naturaleza y los paisajes desplegados en los cantos y relatos compartidos por las familias. El Verdor pinta de alegría y representa la fertilidad de la tierra, esa madre generosa honrada por todos los pueblos."
duracion(pin): "Indefinido"
url_interactivo(pin): "https://audiotecadigital.icbf.gov.co/"

    vigencia_indefinida(pin): "no"
    vigencia(pin): ""
    forma_de_adquisicion(pin): "Adquisición sin restricciones"
    licencia(pin): "Activa"
    documento(pin): ""
    guia_de_uso(pin): ""
    movil(pin): "si"
    observaciones(pin): ""
    estado_activo(pin): "si"
    enlace_externo(pin): "https://audiotecadigital.icbf.gov.co/"
    enlace_tienda_ios(pin): ""
    enlace_tienda_android(pin): ""

interprete_autor(pin): "ICBF Instituto Colombiano de Bienestar Familiar - Ministerio de Cultura - Ministerio de Educación - Fundación Plan"
*/

/*
Exhibición	Puesta a disposición	Lectura pública	Comunicación	Reproducción en DVD o cualquier otro formato físico	Reproducciones necesarias para subir las obras a la plataforma	Realizar el alquiler de copias digitales

*/


