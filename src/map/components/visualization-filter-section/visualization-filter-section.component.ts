import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';

@Component({
  selector: 'app-visualization-filter-section',
  templateUrl: './visualization-filter-section.component.html',
  styleUrls: ['./visualization-filter-section.component.css'],
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class VisualizationFilterSectionComponent implements OnInit, OnDestroy {
  @Input() selectedDimensions: any;
  @Input() visualizationType: string;
  @Input() loaded: boolean = true;
  @Input() mapVisualizationObject;
  @Output() onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLayoutUpdate: EventEmitter<any> = new EventEmitter<any>();
  showFilters: boolean;
  selectedFilter: string = 'ORG_UNIT';
  selectedDataItems: any = [];
  selectedPeriods: any = [];
  orgUnitModel: any = {
    selectionMode: 'orgUnit',
    selectedLevels: [],
    showUpdateButton: true,
    selectedGroups: [],
    orgUnitLevels: [],
    orgUnitGroups: [],
    selectedOrgUnits: [],
    userOrgUnits: [],
    type: 'report', // can be 'data_entry'
    selectedUserOrgUnits: []
  };

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.showFilters = true;
  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    this.store.dispatch(
      new fromStore.ToggleVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    this.selectedFilter = selectedFilter;
  }

  onFilterUpdateAction(filterValue: any, filterType: string) {
    this.selectedFilter = undefined;

    if (filterType === 'LAYOUT') {
      this.onLayoutUpdate.emit(filterValue);
    } else {
      this.onFilterUpdate.emit(filterValue);
    }
  }

  ngOnDestroy() {
    this.store.dispatch(
      new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }
}
