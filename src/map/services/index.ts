import { OrgUnitService } from './org-unit.service';
import { GeoFeatureService } from './geo-feature.service';
import { RelativePeriodService } from './relative-period.service';
import { LayerService } from './layer.service';
import { AnalyticsService } from './analytics.service';

export const services: any[] = [
  OrgUnitService,
  GeoFeatureService,
  RelativePeriodService,
  LayerService,
  AnalyticsService
];

export * from './org-unit.service';
export * from './geo-feature.service';
export * from './relative-period.service';
export * from './layer.service';
export * from './analytics.service';
