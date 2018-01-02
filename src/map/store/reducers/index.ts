import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';
import * as fromLayers from './layers.reducer';

export interface MapState {
  layers: fromLayers.LayerState;
}

export const reducers: ActionReducerMap<MapState> = {
  layers: fromLayers.reducer
};

export const getMapState = createFeatureSelector<MapState>('map');

export const getLayerState = createSelector(
  getMapState,
  (state: MapState) => state.layers
);

export const getAllLayersEntities = createSelector(
  getLayerState,
  fromLayers.getLayersEntities
);
export const getAllLayers = createSelector(getAllLayersEntities, entities => {
  return Object.keys(entities).map(id => entities[id]);
});
export const getCurrentLayer = createSelector(
  getLayerState,
  fromLayers.getCurrentLayer
);
export const isLayersLoading = createSelector(
  getLayerState,
  fromLayers.getLayerLoading
);
export const isLayersLoaded = createSelector(
  getLayerState,
  fromLayers.getLayerLoaded
);
