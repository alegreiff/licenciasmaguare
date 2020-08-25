export interface Contacto{
  id?: string
  nombres?: string
  apellidos?: string
  tipodocumento?: TipoDocumento,
  documento?: string
  telefono?: string[]
  correo?: string
  direccion?: string
  nombremostrar?: string
}

export enum TipoDocumento {
  'CC' = 'CC',
  'CE' = 'CE',
  'PAS' = 'PAS'
  }
