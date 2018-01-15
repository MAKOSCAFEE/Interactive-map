import L from 'leaflet';
import uniqBy from 'lodash/fp/uniqBy';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';

export function event(options) {
  const { features, layerOptions, displaySettings, opacity, id } = options;
  console.log(options);
}
