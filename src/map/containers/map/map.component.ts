import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import { GeoFeature } from '../../models/geo-feature.model';
import * as fromLib from '../../lib';
import { Map } from 'leaflet';

import { of } from 'rxjs/observable/of';
import { map, filter, tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public currentMapLayers$: Observable<Layer[]>;
  public isLoaded$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  public visualizationObject$: Observable<VisualizationObject>;
  private mapConfiguration: MapConfiguration;
  private Layers: Layer[] = [];
  private visObject: VisualizationObject;
  public loading: boolean = true;
  public hasError: boolean = false;
  public errorMessage: string;
  public legendIsOpen: boolean = false;
  public mapWidth: any = '100%';
  public map: any = {};
  public centeringLayer: any;
  public mapLegend: any;
  public legendMarginRight = '25px';
  public legendMarginLeft = '200px';
  private cardHeight: string = '490px';
  private itemHeight: string = '90vh';
  public subtitle: string = '';
  public pinned: boolean = false;
  public operatingLayers: Array<any> = [];
  public isFullScreen: boolean = false;
  public hideTable: boolean = true;
  public showCenterButton: boolean = false;
  public mapOptions: any;
  public visualizationObject: any;
  public componentId = 'RBoGyrUJDOu';
  public mapHeight: string;
  private _data$ = new BehaviorSubject<any>({});

  @Input()
  set data(value) {
    // set the latest value for _data$ BehaviorSubject
    this._data$.next(value);
  }

  get data() {
    // get the latest value from _data$ BehaviorSubject
    return this._data$.getValue();
  }

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.isLoaded$ = this.store.select(fromStore.isVisualizationObjectsLoaded);
    this.isLoading$ = this.store.select(fromStore.isVisualizationObjectsLoading);
    this.visualizationObject$ = this.store.select(fromStore.getCurrentMap);

    this._data$.subscribe(data => {
      this.visualizationObject = data;
      this.transhformVisualizationObject(data);
    });
    this.store.dispatch(new fromStore.AddContectPath());

    setTimeout(() => {
      this.drawMap();
    }, 10);
  }

  transhformVisualizationObject(data) {
    const { visObject, Layers } = fromUtils.transformVisualizationObject(data);
    this.visObject = {
      ...this.visObject,
      mapConfiguration: visObject['mapConfiguration'],
      layers: Layers
    };
    if (Layers.length) {
      this.store.dispatch(new fromStore.CreateVisualizationObject(this.visObject));
    }
  }

  drawMap() {
    this.visualizationObject$.subscribe(visualizationObject => {
      if (visualizationObject) {
        this.mapHeight = fromUtils.refineHeight(this.itemHeight);
        const container = fromUtils.prepareMapContainer(
          this.componentId,
          this.mapHeight,
          this.mapWidth,
          this.isFullScreen
        );
        const otherOptions = {
          zoomControl: false,
          scrollWheelZoom: false
        };
        this.map = new Map(container, otherOptions);
        fromLib.DrawMap(this.map, visualizationObject);
      }
    });
  }

  zoomIn(event) {
    console.log(event);
    this.map.zoomIn();
  }

  zoomOut(event) {
    this.map.zoomOut();
  }

  recenterMap(event) {}

  toggleLegendContainerView() {
    if (this.legendIsOpen || !this.legendIsOpen) {
      this.legendIsOpen = true;
    }
  }

  closeMapLegend(flag) {
    if (flag === 'leave' && !this.pinned) {
      this.legendIsOpen = false;
    }

    if (!flag) {
      this.pinned = false;
      this.legendIsOpen = false;
    }
  }
}
