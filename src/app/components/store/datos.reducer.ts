import { createReducer, on } from '@ngrx/store';
import { WPrest } from 'src/app/models/wp.model';
import { setItems, unSetItems, firebaseActivo } from './datos.actions';


export interface State {
    items: WPrest[];
}

export const initialState: State = {
   items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

  on(firebaseActivo, (state, { id, firebase }) => {
    return {
      ...state,
      items: state.items.map( entrada => {
        if( entrada.id === id ){
          return {
            ...entrada,
            firebase: firebase,
          }

        }else{
          return entrada
        }
      } )
    }
    /* return state.items.map( entrada => {
      if( entrada.id === id ){
        return {
          ...entrada,
          firebase: firebase
        }

      }else{
        return entrada
      }
    } ) */
  }),
  on(setItems, (state, { items }  ) => ({ ...state, items: items })),
  on(unSetItems, state => ({ ...state, items: [] })),


);

export function ingresoEgresoReducer(state, action) {
    return _ingresoEgresoReducer(state, action);
}
