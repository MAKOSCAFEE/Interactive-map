import { toGeoJson } from './GeoJson';
import L from 'leaflet';
// List of fuctions to create diferent Layers
import { boundary } from './Boundary';
import { tileLayer } from './TileLayer';
import { Layer } from '../models/layer.model';

export const LayerType = {
  boundary,
  tileLayer
};

export const Layers = (layers, geofeatures, analytics) => {
  const optionLayers = layers.map(layer => {
    let newLayer: Layer;
    if (geofeatures) {
      const features = toGeoJson(geofeatures[layer.id]);
      const pane = layer.id;
      newLayer = {
        ...newLayer,
        ...layer,
        pane,
        features
      };
    }
    if (analytics) {
      const analyticsData = analytics[layer.id];
      newLayer = {
        ...newLayer,
        analyticsData
      };
    }
    return LayerType[newLayer.type](newLayer);
  });
  return optionLayers;
};

export const createLayer = (map, optionsLayer, index) => {
  const { displaySettings, id, geoJsonLayer } = optionsLayer;
  createPane(map, displaySettings.labels, id, index);
  const newLayer = map.addLayer(geoJsonLayer);
  map.fitBounds(newLayer.getBounds());
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
  } else if (!isVisible && map.hasLayer(layer) === true) {
    map.removeLayer(layer);
  }
};
