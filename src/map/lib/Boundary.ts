// Boundary layer
import L from 'leaflet';
import uniqBy from 'lodash/fp/uniqBy';
import { GeoJson } from 'leaflet';

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

  return {
    ...options,
    features
  };
}
