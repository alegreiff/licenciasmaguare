import { createAction, props } from '@ngrx/store';
import { WPrest } from 'src/app/models/wp.model';


export const unSetItems = createAction('[IngresoEgreso] Set items');
export const setItems = createAction(
  '[IngresoEgreso] Unset items',
  props<{ items: WPrest[] }>()
  );

  export const firebaseActivo = createAction(
    '[IngresoEgreso] Cambia estado firebase',
    props<{ id: number, firebase: boolean }>()
    );
