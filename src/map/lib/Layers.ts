import L from 'leaflet';
// List of fuctions to create diferent Layers
import { boundary } from './BoundaryLayer';
import { tileLayer } from './TileLayer';
import { event } from './EventLayer';
import { thematic } from './ThematicLayer';
import { facility } from './FacilityLayer';
import { external } from './ExternalLayer';
import { Layer } from '../models/layer.model';

export const LayerType = {
  boundary,
  tileLayer,
  event,
  thematic,
  facility,
  external
};

export const Layers = (layers, geofeatures, analytics, organizationGroupSet, legendSets) => {
  const optionLayers = layers.map(layer => {
    let newLayer: Layer;

    if (geofeatures) {
      const geofeature = geofeatures[layer.id];
      const pane = layer.id;
      newLayer = {
        ...newLayer,
        ...layer,
        pane,
        geofeature
      };
    }
    if (analytics) {
      const analyticsData = analytics[layer.id];
      newLayer = {
        ...newLayer,
        analyticsData
      };
    }
    if (organizationGroupSet) {
      const orgUnitGroupSet = organizationGroupSet[layer.id];
      newLayer = {
        ...newLayer,
        orgUnitGroupSet
      };
    }
    if (legendSets) {
      const legendSet = legendSets[layer.id];
      newLayer = {
        ...newLayer,
        legendSet
      };
    }
    return LayerType[newLayer.type](newLayer);
  });
  return optionLayers;
};

export const createLayer = (map, optionsLayer, index) => {
  const { displaySettings, id, geoJsonLayer, visible } = optionsLayer;
  createPane(map, displaySettings.labels, id, index);
  setLayerVisibility(visible, map, geoJsonLayer);
};

export const createPane = (map, labels, id, index) => {
  const zIndex = 600 - index * 10;
  const pane = map.createPane(id);
  pane.style.zIndex = zIndex;

  if (labels) {
    const labelPane = map.createPane(`${id}-labels`);
    labelPane.style.zIndex = zIndex + 1;
  }
};

export const onLayerAdd = (map, index, optionsLayer) => {};

export const setLayerVisibility = (isVisible, map, layer) => {
  if (isVisible && map.hasLayer(layer) === false) {
    map.addLayer(layer);
    // map.fitBounds(layer.getBounds());
  } else if (!isVisible && map.hasLayer(layer) === true) {
    map.removeLayer(layer);
  }
};

export const layerFitBound = (map, bounds) => {
  map.fitBounds(bounds);
};
