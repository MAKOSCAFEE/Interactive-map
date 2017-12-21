import { Layer } from '../../models/layer.model';
import * as fromLayers from './../actions/layers.action'

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
      const layers = action.payload
      return{
        ...state,
        loading: false,
        loaded: true,
        layers
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

export const getLayerLoading = (state: LayerState) => state.loading;
export const getLayerLoaded = (state: LayerState) => state.loaded;
export const getCurrentLayer = (state: LayerState) => state.currentLayer;
export const getLayers = (state: LayerState) => state.layers;
