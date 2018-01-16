import { LayersEffects } from './layers.effect';
import { VisualizationObjectEffects } from './visualizationObject.effect';
import { AnalyticsEffects } from './analytics.effect';
import { OrganizationUnitGroupSetEffects } from './orgUnitGroupSet.effect';

export const effects: any[] = [
  VisualizationObjectEffects,
  AnalyticsEffects,
  OrganizationUnitGroupSetEffects
];

export * from './layers.effect';
export * from './visualizationObject.effect';
export * from './analytics.effect';
export * from './orgUnitGroupSet.effect';
