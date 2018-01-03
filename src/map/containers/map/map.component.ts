import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public layers$: Observable<Layer[]>;
  public visualizationObjects$: Observable<VisualizationObject>;
  private mapConfiguration: MapConfiguration;
  private Layers: Layer[] = [];
  private visObject: VisualizationObject;

  @Input() visualizationObject: any;
  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.layers$ = this.store.select(fromStore.getAllLayers);
    this.store.dispatch(new fromStore.LoadLayers());
    this.transhformVisualizationObject();
  }

  transhformVisualizationObject() {
    const { visObject, Layers } = fromUtils.transformVisualizationObject(
      this.visualizationObject
    );
    this.visObject = {
      ...this.visObject,
      mapConfiguration: visObject['mapConfiguration'],
      layers: visObject['layers']
    };

    this.store.dispatch(
      new fromStore.CreateVisualizationObject(this.visObject)
    );
    console.log('VisualizationObject:::', this.visObject);
    console.log('Layers:::', Layers);
  }
}
