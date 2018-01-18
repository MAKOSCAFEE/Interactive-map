import {
  Map,
  MapOptions,
  LatLng,
  tileLayer,
  LatLngExpression,
  LatLngLiteral,
  Icon,
  control,
  Layer
} from 'leaflet';

import { getTileLayer } from '../constants/tile-layer.constant';
import { MapConfiguration } from '../models/map-configuration.model';
import { VisualizationObject } from '../models/visualization-object.model';
import { LayerType, Layers, createLayer, layerFitBound } from './Layers';

export const DrawMap = (map: Map, visualizationObject: VisualizationObject) => {
  const {
    mapConfiguration,
    layers,
    geofeatures,
    analytics,
    orgUnitGroupSet,
    legendSets
  } = visualizationObject;
  const mapTileLayer = getTileLayer(mapConfiguration.basemap);
  const baseMapLayer = LayerType[mapTileLayer.type](mapTileLayer);

  // Initialize map with centre and zooming level;
  initializeMap(map, mapConfiguration, baseMapLayer);

  // Work with Layers separately;
  const overLayLayers = Layers(layers, geofeatures, analytics, orgUnitGroupSet, legendSets);
  const layersBounds = [];
  overLayLayers.map((layer, index) => {
    const { bounds } = layer;
    if (bounds) {
      layersBounds.push(bounds);
    }
    createLayer(map, layer, index);
  });
  layerFitBound(map, layersBounds);
};

export const initializeMap = (map: Map, mapConfiguration: MapConfiguration, baseMapLayer) => {
  const center = [
    _convertLatitudeLongitude(mapConfiguration.latitude),
    _convertLatitudeLongitude(mapConfiguration.longitude)
  ];
  const zoom = mapConfiguration.zoom;

  map.setView(center, zoom);
  // add zoom control;
  mapAddControl(map, {
    type: 'zoom',
    position: 'topright'
  });

  // Add scale control
  mapAddControl(map, {
    type: 'scale',
    imperial: false
  });
  // Add baseMap Layer;
  const baseMap = map.addLayer(baseMapLayer);
};

// This is to add Map controls like scale and zoom
// TODO: Add map control for Legends and Bound.
export const mapAddControl = (map: Map, mapControl) => {
  let newControl = mapControl;

  if (mapControl.type && control[mapControl.type]) {
    newControl = control[mapControl.type](mapControl);
  }
  map.addControl(newControl);
};

// This is the hack which wont matter since we are using Bounds to fit the map afterwards.
export const _convertLatitudeLongitude = coordinate => {
  if (Math.abs(parseInt(coordinate, 10)) > 100000) {
    return (parseFloat(coordinate) / 100000).toFixed(6);
  }
  return parseFloat(coordinate).toFixed(6);
};
