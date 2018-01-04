import { VisualizationObject } from '../../models/visualization-object.model';
import { Layer } from '../../models/layer.model';
import * as fromVisualizationObject from '../actions/visualization-object.action';

export interface VisualizationObjectState {
  entities: { [id: number]: VisualizationObject };
  currentLayer: string;
  currentMap: string;
  layers: Layer[];
  loading: boolean;
  loaded: boolean;
}

export const initialState: VisualizationObjectState = {
  entities: {},
  currentLayer: null,
  currentMap: null,
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
    case fromVisualizationObject.LOAD_VISUALIZATION_OBJECT_SUCCESS: {
      const vizObjs = action.payload;
      const entities = vizObjs.reduce(
        (
          entitie: { [id: string]: VisualizationObject },
          vizObj: VisualizationObject
        ) => {
          return {
            ...entitie,
            [vizObj.mapConfiguration.id]: vizObj
          };
        },
        {
          ...state.entities
        }
      );
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }
    case fromVisualizationObject.LOAD_VISUALIZATION_OBJECT_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case fromVisualizationObject.CREATE_VISUALIZATION_OBJECT_SUCCESS: {
      const visualizationObject = action.payload;
      const currentLayer = visualizationObject.layers[0];
      const currentMap = visualizationObject.mapConfiguration.id;
      const entities = {
        ...state.entities,
        [visualizationObject.mapConfiguration.id]: visualizationObject
      };
      console.log('success Reducers current Layer:::', currentLayer);
      return {
        ...state,
        currentLayer,
        currentMap,
        loaded: true,
        loading: false,
        entities
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
export const getCurrentMap = (state: VisualizationObjectState) => {
  return state.currentMap;
};
