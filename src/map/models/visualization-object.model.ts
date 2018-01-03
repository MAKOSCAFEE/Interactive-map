import { MapConfiguration } from './map-configuration.model';

export interface VisualizationObject {
  mapConfiguration: MapConfiguration;
  layers: string[];
}
