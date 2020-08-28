import { createReducer, on } from '@ngrx/store';
import { setOpciones } from './opciones.actions';

export interface State {
    opciones: {};
}

export const initialState: State = {
  opciones: {},
}

const _opcionesReducer = createReducer(initialState,

    on(setOpciones, (state, { opciones }) => ({ ...state, opciones:  {...opciones}})),

);

export function opcionesReducer(state, action) {
    return _opcionesReducer(state, action);
}
