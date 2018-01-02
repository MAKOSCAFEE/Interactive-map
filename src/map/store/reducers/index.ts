import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';
import * as fromLayers from './layers.reducer';
import * as fromVisualizationObject from './visualization-object.reducers';

export interface MapState {
  layers: fromLayers.LayerState;
  visualizationObjects: fromVisualizationObject.VisualizationObjectState;
}

export const reducers: ActionReducerMap<MapState> = {
  layers: fromLayers.reducer,
  visualizationObjects: fromVisualizationObject.reducer
};

export const getMapState = createFeatureSelector<MapState>('map');
