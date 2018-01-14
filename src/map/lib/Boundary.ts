// Boundary layer
import L from 'leaflet';
import uniqBy from 'lodash/fp/uniqBy';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';

const colors = ['black', 'blue', 'red', 'green', 'yellow'];
const weights = [2, 1, 0.75, 0.5, 0.5];

export function boundary(options) {
  const { features, layerOptions } = options;
  const radiusLow = layerOptions.radiusLow;
  if (!features.length) {
    return;
  }
  const levels = uniqBy(f => f.properties.level, features)
    .map(f => f.properties.level)
    .sort();
  const levelStyle = levels.reduce(
    (obj, level, index) => ({
      ...obj,
      [level]: {
        color: colors[index],
        weight: levels.length === 1 ? 1 : weights[index]
      }
    }),
    {}
  );

  features.forEach(feature => {
    feature.properties.style = levelStyle[feature.properties.level];
    feature.properties.labelStyle = {
      paddingTop:
        feature.geometry.type === 'Point' ? 5 + (radiusLow || 5) + 'px' : '0'
    };
  });

  const geoJSonOptions = boundaryOptions(options.id);
  const geoJsonLayer = L.geoJSON(features, geoJSonOptions);
  return {
    ...options,
    features,
    geoJsonLayer
  };
}

export const boundaryOptions = id => {
  const style = feature => {
    const pop = feature.properties;
    if (pop.style) {
      return pop.style;
    }
    return {
      opacity: 1,
      fillOpacity: 0,
      fill: false,
      pane: id,
      hoverLabel: '{name}'
    };
  };

  const onEachFeature = (feature, layer) => {
    const featureName = feature.properties.name;
    layer.bindPopup(featureName);
  };

  const pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      radius: 5,
      weight: 0.9,
      opacity: 0.8,
      fillOpacity: 0.8
    };
    return new L.CircleMarker(latlng, geojsonMarkerOptions);
  };

  return {
    style,
    onEachFeature,
    pointToLayer
  };
};
