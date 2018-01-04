import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import 'leaflet';
import 'leaflet.markercluster';
declare var L;
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import * as _ from 'lodash';

import { of } from 'rxjs/observable/of';
import { map, filter, tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public layers$: Observable<Layer[]>;
  public currentMapLayers$: Observable<Layer[]>;
  public isLoaded$: Observable<boolean>;
  public visualizationObjects$: Observable<VisualizationObject[]>;
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
  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.layers$ = this.store.select(fromStore.getAllLayers);
    this.isLoaded$ = this.store.select(fromStore.isVisualizationObjectsLoaded);
    this.visualizationObjects$ = this.store.select(
      fromStore.getAllVisualizationObjects
    );
    this.visualizationObject$ = this.store.select(fromStore.getCurrentMap);

    this.transhformVisualizationObject();
    setTimeout(() => {
      this.drawMap();
    }, 10);
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
    this.store.dispatch(new fromStore.CreateLayers(Layers));
  }

  drawMap() {
    let visualizationObject: any = {};

    this.visualizationObject$
      .pipe(
        flatMap(vizObj => {
          visualizationObject = {
            ...visualizationObject,
            mapConfiguration: vizObj.mapConfiguration,
            layers: vizObj.layers
          };
          return this.layers$;
        }),
        map(layers => {
          const currentLayers = layers.filter(
            layer => visualizationObject.layers.indexOf(layer.id) !== -1
          );
          return currentLayers;
        })
      )
      .subscribe(currentLayers => {
        this.loading = false;
        const mapObject = fromUtils.getInitialMapObject(
          visualizationObject.mapConfiguration
        );
        const layers = fromUtils.getMapLayers(
          L,
          visualizationObject.mapConfiguration.basemap,
          mapObject.id
        );
        console.log('Layers:::', layers);
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
