import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public layers$: Observable<Layer[]>;
  private mapConfiguration: MapConfiguration;
  private Layers: Layer[];

  @Input() visualizationObject: any;
  constructor(private store: Store<fromStore.MapState>) { }

  ngOnInit() {
    this.layers$ = this.store.select(fromStore.getAllLayers);
    this.store.dispatch(new fromStore.LoadLayers());
    this.transhformVisualizationObject();
  }

  transhformVisualizationObject() {
    this.mapConfiguration = _.pick(this.visualizationObject, ['id', 'name', 'subtitle', 'latitude', 'longitude', 'basemap', 'zoom']);

    for (let key in this.visualizationObject.mapViews) {
      let mapview = this.visualizationObject.mapViews[key];
      let layer = _.pick(mapview, ['id', 'name', 'displayName', 'opacity', 'hidden', 'layer']);
      let layerOptions = _.pick(mapview, ['eventClustering', 'eventPointRadius', 'radiusHigh', 'radiusLow']);
      let legendProperties = _.pick(mapview, ['colorLow', 'colorHigh', 'colorScale', 'classes']);
      let displaySettings = _.pick(mapview, ['labelFontColor', 'labelFontSize', 'labelFontStyle', 'labelFontWeight', 'labels', 'hideTitle', 'hideSubtitle']);
      let dataSelections = _.pick(mapview, ['config', 'parentLevel', 'completedOnly', 'translations', 'interpretations', 'program', 'programName', 'columns', 'rows', 'filters', 'aggregationType']);
      console.log({
        ...layer,
        layerOptions,
        legendProperties,
        displaySettings,
        dataSelections
      });

    }
  }
}
