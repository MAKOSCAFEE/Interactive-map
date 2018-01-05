import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';
import * as fromLayers from './layers.reducer';
import * as fromVisualizationObject from './visualization-object.reducers';
import * as fromGeofeatures from './geo-feature.reducers';

export interface MapState {
  layers: fromLayers.LayerState;
  visualizationObjects: fromVisualizationObject.VisualizationObjectState;
  geoFeatures: fromGeofeatures.GeoFeatureState;
}

export const reducers: ActionReducerMap<MapState> = {
  layers: fromLayers.reducer,
  visualizationObjects: fromVisualizationObject.reducer,
  geoFeatures: fromGeofeatures.reducer
};

export const getMapState = createFeatureSelector<MapState>('map');
