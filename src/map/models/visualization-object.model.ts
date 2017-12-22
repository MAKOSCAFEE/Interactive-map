import { MapConfiguration } from './map-configuration.model';
import { Layer } from './layer.model';

export interface visualizationObject {
  mapConfiguration: MapConfiguration,
  layers: Layer[]
}
