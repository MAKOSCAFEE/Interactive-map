import { OrgUnitService } from './org-unit.service';
import { GeoFeatureService } from './geo-feature.service'
import { RelativePeriodService } from './relative-period.service';

export const services: any[] = [OrgUnitService, GeoFeatureService, RelativePeriodService];

export * from './org-unit.service';
export * from './geo-feature.service';
export * from './relative-period.service';
