import { MapConfiguration } from './map-configuration.model';
import { GeoFeature } from './geo-feature.model';
import { Layer } from './layer.model';

export interface VisualizationObject {
  mapConfiguration: MapConfiguration;
  layers?: Layer[];
  geofeatures?: { [id: number]: GeoFeature[] };
  analytics?: any;
}
