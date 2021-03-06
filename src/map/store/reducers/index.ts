import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromLayers from './layers.reducer';
import * as fromVisualizationObject from './visualization-object.reducers';
import * as fromGeofeatures from './geo-feature.reducers';
import * as fromLegendSets from './legend-set.reducers';

export interface MapState {
  leafletLayers: fromLayers.LayerState;
  visualizationObjects: fromVisualizationObject.VisualizationObjectState;
  legendSets: fromLegendSets.LegendSetState;
}

export const reducers: ActionReducerMap<MapState> = {
  leafletLayers: fromLayers.reducer,
  visualizationObjects: fromVisualizationObject.reducer,
  legendSets: fromLegendSets.reducer
};

export const getMapState = createFeatureSelector<MapState>('map');
