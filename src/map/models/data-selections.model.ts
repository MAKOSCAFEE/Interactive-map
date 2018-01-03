import {Dimension} from './dimension.model';

export interface DataSelections {
  config?: any;
  parentLevel?: number;
  completedOnly?: boolean;
  translations?: any[];
  interpretations?: any[];
  attributeValues?: any[];
  program?: {
    id: string
  };
  programName?: {
    id: string
  };
  columns: Dimension[];
  filters: Dimension[];
  rows: Dimension[];
  aggregationType: string;
}
