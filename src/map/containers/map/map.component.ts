import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { getTileLayer } from '../../constants/tile-layer.constant';
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import { GeoFeature } from '../../models/geo-feature.model';
import * as fromLib from '../../lib';
import { Map, LatLngExpression, control, LatLngBoundsExpression } from 'leaflet';

import { of } from 'rxjs/observable/of';
import { map, filter, tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
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
  }

  ngAfterViewInit() {
    this.initializeMapContainer();
    this.initializeMapBaseLayer(this.visObject.mapConfiguration);
    this.drawMap();
    // Add scale control
    this.mapAddControl({
      type: 'scale',
      imperial: false
    });
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

  initializeMapContainer() {
    const mapHeight = fromUtils.refineHeight(this.itemHeight);
    const container = fromUtils.prepareMapContainer(
      this.componentId,
      mapHeight,
      this.mapWidth,
      this.isFullScreen
    );
    const otherOptions = {
      zoomControl: false,
      scrollWheelZoom: false,
      worldCopyJump: true
    };
    this.map = new Map(container, otherOptions);
  }

  initializeMapBaseLayer(mapConfiguration: MapConfiguration) {
    const center: LatLngExpression = [
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.latitude)),
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.longitude))
    ];
    const zoom = mapConfiguration.zoom;

    const mapTileLayer = getTileLayer(mapConfiguration.basemap);
    const baseMapLayer = fromLib.LayerType[mapTileLayer.type](mapTileLayer);

    this.map.setView(center, zoom);
    // Add baseMap Layer;
    this.map.addLayer(baseMapLayer);
  }

  drawMap() {
    this.visualizationObject$.subscribe(visualizationObject => {
      if (visualizationObject) {
        const overlayLayers = fromLib.GetOverLayLayers(visualizationObject);
        this.map.eachLayer(layer => this.map.removeLayer(layer));
        this.initializeMapBaseLayer(visualizationObject.mapConfiguration);
        const layersBounds = [];
        overlayLayers.map((layer, index) => {
          const { bounds } = layer;
          if (bounds) {
            layersBounds.push(bounds);
          }
          this.createLayer(layer, index);
        });

        if (layersBounds.length) {
          this.layerFitBound(layersBounds);
        }
      }
    });
  }

  mapAddControl(mapControl) {
    let newControl = mapControl;

    if (mapControl.type && control[mapControl.type]) {
      newControl = control[mapControl.type](mapControl);
    }
    this.map.addControl(newControl);
  }

  createLayer(optionsLayer, index) {
    const { displaySettings, id, geoJsonLayer, visible } = optionsLayer;
    this.createPane(displaySettings.labels, id, index);
    this.setLayerVisibility(visible, geoJsonLayer);
  }

  createPane(labels, id, index) {
    const zIndex = 600 - index * 10;
    this.map.createPane(id);
    this.map.getPane(id).style.zIndex = zIndex.toString();

    if (labels) {
      const paneLabelId = `${id}-labels`;
      const labelPane = this.map.createPane(paneLabelId);
      this.map.getPane(paneLabelId).style.zIndex = (zIndex + 1).toString();
    }
  }

  onLayerAdd(index, optionsLayer) {}

  setLayerVisibility(isVisible, layer) {
    if (isVisible && this.map.hasLayer(layer) === false) {
      this.map.addLayer(layer);
    } else if (!isVisible && this.map.hasLayer(layer) === true) {
      this.map.removeLayer(layer);
    }
  }

  layerFitBound(bounds: LatLngBoundsExpression) {
    this.map.fitBounds(bounds);
  }

  zoomIn(event) {
    this.map.zoomIn();
  }

  zoomOut(event) {
    this.map.zoomOut();
  }

  recenterMap(event) {
    this.map.eachLayer(layer => console.log(layer.getBounds()));
  }

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
