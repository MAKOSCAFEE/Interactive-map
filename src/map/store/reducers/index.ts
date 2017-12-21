import { ActionReducerMap } from '@ngrx/store';
import * as fromLayers from './layers.reducer';

export interface MapState {
  layers: fromLayers.LayerState
}

export const reducers: ActionReducerMap<MapState> = {
  layers: fromLayers.reducer
}
