import { Layer } from '../../models/layer.model';
import * as fromLayers from './../actions/layer.action'

export interface LayerState {
  layers: Layer[],
  currentLayer: any,
  loading: boolean,
  loaded: boolean
}


export const initialState: LayerState = {
  layers: [],
  currentLayer: {},
  loaded: false,
  loading: false,
}

export function reducer(
  state = initialState,
  action: fromLayers.LayersAction
): LayerState {

  switch(action.type){
    case fromLayers.LOAD_LAYERS: {
      return{
        ...state,loading: true
      }
    }
    case fromLayers.LOAD_LAYERS_SUCCESS: {
      return{
        ...state,loading: false, loaded: true
      }
    }

    case fromLayers.LOAD_LAYERS_FAIL: {
      return{
        ...state,loading: false, loaded: false
      }
    }
  }
  return state;
}
