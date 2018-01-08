import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import 'leaflet';
import 'leaflet.markercluster';
declare var L;
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import { GeoFeature } from '../../models/geo-feature.model';
import * as _ from 'lodash';

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

  @Input() visualizationObject: any;
  private _data = new BehaviorSubject<any>({});

  @Input()
  set data(value) {
    // set the latest value for _data BehaviorSubject
    this._data.next(value);
  }

  get data() {
    // get the latest value from _data BehaviorSubject
    return this._data.getValue();
  }

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.isLoaded$ = this.store.select(fromStore.isVisualizationObjectsLoaded);
    this.isLoading$ = this.store.select(
      fromStore.isVisualizationObjectsLoading
    );
    this.visualizationObject$ = this.store.select(fromStore.getCurrentMap);

    this._data.subscribe(data => this.transhformVisualizationObject(data));
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
      if (visualizationObject) {
        const mapObject = fromUtils.getInitialMapObject(
          visualizationObject.mapConfiguration
        );
        const layers = fromUtils.getMapLayers(
          L,
          visualizationObject.mapConfiguration.basemap,
          mapObject.id,
          visualizationObject.layers,
          visualizationObject.geofeatures,
          visualizationObject.analytics
        );
        const mapHeight = fromUtils.refineHeight(this.itemHeight);
        const container = fromUtils.prepareMapContainer(
          mapObject.id,
          mapHeight,
          this.mapWidth,
          this.isFullScreen
        );
        mapObject.options.layers = layers[0];
        this.mapOptions = mapObject.options;
        this.map = L.map(container, mapObject.options);
      }
    });
  }

  recenterMap(maP, layer) {
    if (layer) {
      if (layer instanceof L.LayerGroup) {
        if (layer.getLayers().length === 2) {
          layer = layer.getLayers()[0];
        }
      }

      const bounds = Array.isArray(layer)
        ? new L.LatLngBounds(layer)
        : layer.getBounds();
      if (this._checkIfValidCoordinate(bounds)) {
        try {
          maP.fitBounds(bounds);
        } catch (e) {}
      } else {
        this.hasError = true;
        this.errorMessage = 'Invalid organisation unit boundaries found!';
      }
    } else {
      return;
    }
  }
  private _checkIfValidCoordinate(bounds) {
    const boundLength = Object.getOwnPropertyNames(bounds).length;
    if (boundLength > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Update map Zoom Level
   * */
  zoomIn(zoomType) {
    zoomType === 'in'
      ? this.map.zoomIn()
      : zoomType === 'out'
        ? this.map.zoomOut()
        : this.map.setZoom(this.mapOptions.zoom);
  }

  getCurrentMapLayers(layers: string[]) {
    console.log();
  }
}
