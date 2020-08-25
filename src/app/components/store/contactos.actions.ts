import { createAction, props } from '@ngrx/store';
import { Contacto } from 'src/app/models/contacto.model';

export const setContactos = createAction(
  '[Contactos] Set Contactos',
  props<{ contactos: Contacto[]}>()

  );
