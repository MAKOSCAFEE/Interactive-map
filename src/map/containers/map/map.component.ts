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
import * as _ from 'lodash';
import * as fromLib from '../../lib';
import { getTileLayer } from '../../constants/tile-layer.constant';

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
    this.isLoading$ = this.store.select(
      fromStore.isVisualizationObjectsLoading
    );
    this.visualizationObject$ = this.store.select(fromStore.getCurrentMap);

    this._data$.subscribe(data => {
      this.visualizationObject = data;
      this.transhformVisualizationObject(data);
    });
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

    this.store.dispatch(
      new fromStore.CreateVisualizationObject(this.visObject)
    );
  }

  drawMap() {
    this.visualizationObject$.subscribe(visualizationObject => {
      let optionLayers = [];
      if (visualizationObject) {
        const {
          mapConfiguration,
          layers,
          geofeatures,
          analytics
        } = visualizationObject;
        const mapHeight = fromUtils.refineHeight(this.itemHeight);
        const container = fromUtils.prepareMapContainer(
          this.componentId,
          mapHeight,
          this.mapWidth,
          this.isFullScreen
        );
        const tileLayer = getTileLayer(mapConfiguration.basemap);
        optionLayers = [...optionLayers, tileLayer];
        layers.map(layer => {
          let newLayer = {};
          if (geofeatures) {
            const features = geofeatures[layer.id];
            newLayer = {
              ...newLayer,
              ...layer,
              visible: true,
              features
            };
          }
          if (analytics) {
            const data = analytics[layer.id];
            newLayer = {
              ...newLayer,
              data
            };
          }
          optionLayers = [...optionLayers, newLayer];
        });

        const optionsD2 = {
          layers: optionLayers,
          minZoom: 0,
          maxZoom: 20,
          center: [
            this._convertLatitudeLongitude(mapConfiguration.latitude),
            this._convertLatitudeLongitude(mapConfiguration.longitude)
          ],
          zoom: mapConfiguration.zoom
        };
        this.map = fromLib.map(container, optionsD2);
        console.log(this.map);
      }
    });
  }

  private _convertLatitudeLongitude(coordinate) {
    if (Math.abs(parseInt(coordinate, 10)) > 100000) {
      return parseFloat(coordinate) / 100000;
    }
    return parseFloat(coordinate);
  }
}
