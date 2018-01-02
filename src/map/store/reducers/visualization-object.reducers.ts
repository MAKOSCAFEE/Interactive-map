import { VisualizationObject } from '../../models/visualization-object.model';
import { Layer } from '../../models/layer.model';
import * as fromVisualizationObject from '../actions/visualization-object.action';

export interface VisualizationObjectState {
  entities: { [id: number]: VisualizationObject };
  currentLayer: string;
  layers: Layer[];
  loading: boolean;
  loaded: boolean;
}

export const initialState: VisualizationObjectState = {
  entities: {},
  currentLayer: null,
  layers: [],
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromVisualizationObject.VisualizationObjectAction
): VisualizationObjectState {
  switch (action.type) {
    case fromVisualizationObject.LOAD_VISUALIZATION_OBJECT: {
      return {
        ...state,
        loading: true
      };
    }
  }
  return state;
}

export const getVisualizationObjectsEntities = (
  state: VisualizationObjectState
) => state.entities;
export const getVisualizationObjectsLoading = (
  state: VisualizationObjectState
) => state.loading;
export const getCurentlayerLoading = (state: VisualizationObjectState) =>
  state.currentLayer;
export const getVisualizationObjectsLoaded = (
  state: VisualizationObjectState
) => state.loaded;
