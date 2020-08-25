import { createReducer, on } from '@ngrx/store';
import { Contacto } from 'src/app/models/contacto.model';
import { LicenciaContenido } from 'src/app/models/contenido.model';
import { setContactos } from './contactos.actions';

export interface State {
    contactos: Contacto[];
}

export const initialState: State = {
  contactos: [],
}

const _contactosReducer = createReducer(initialState,

    on(setContactos, (state, { contactos }) => ({ ...state, contactos: [ ...contactos]})),

);

export function contactosReducer(state, action) {
    return _contactosReducer(state, action);
}
