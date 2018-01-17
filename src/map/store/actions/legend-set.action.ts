import { Action } from '@ngrx/store';

// add Context Path
export const ADD_LEGEND_SET = '[MAP] Add Legend Set';

export class AddLegendSet implements Action {
  readonly type = ADD_LEGEND_SET;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export type LegendSetAction = AddLegendSet;
