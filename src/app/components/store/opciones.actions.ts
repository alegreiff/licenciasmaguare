import { createAction, props } from '@ngrx/store';
//import { Contacto } from 'src/app/models/contacto.model';

export const setOpciones = createAction(
  '[Opciones] Set Opciones',
  props<{ opciones: {}}>()

  );
