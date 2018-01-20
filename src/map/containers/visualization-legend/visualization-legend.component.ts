import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TILE_LAYERS } from '../../constants/tile-layer.constant';
import * as fromStore from '../../store';
import { LegendSet } from '../../models/legend-set.model';

@Component({
  selector: 'app-visualization-legend',
  templateUrl: './visualization-legend.component.html',
  styleUrls: ['./visualization-legend.component.css']
})
export class VisualizationLegendComponent implements OnInit {
  @Input() mapVsualizationObject: any;
  public LegendsTileLayer: any;
  public showButtonIncons: boolean = false;
  public activeLayer: number;
  public visualizationLegends: any = [];
  public legendSetEntities: { [id: string]: LegendSet };
  openTileLegend: boolean = false;
  sticky: boolean = false;
  isRemovable: boolean = false;
  toggleBoundary: boolean = true;
  boundaryLegend: Array<any> = [];
  showDownload: boolean = false;
  showUpload: boolean = false;
  layerSelectionForm: boolean = false;
  showTransparent: boolean = false;
  displayNone: boolean = false;

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.store.select(fromStore.getAllLegendSetObjectsEntities).subscribe(lg => {
      this.legendSetEntities = lg;
    });
    console.log(this.visualizationLegends);
    const layers = this.mapVsualizationObject.layers;
    if (layers.length) {
      this.visualizationLegends = layers.reduce((vizLg = [], currentLayer, index) => {
        const { displayName, type, id, name } = currentLayer;
        if (this.legendSetEntities[id]) {
          const legendObject = {
            ...this.legendSetEntities[id],
            displayName,
            name,
            type
          };
          return [...vizLg, legendObject];
        }
      }, []);
    }
  }

  showButtonIcons() {
    this.showButtonIncons = true;
  }

  hideButtonIcons() {
    this.showButtonIncons = false;
  }

  setActiveItem(index, e) {
    console.log(index);
    e.stopPropagation();
    if (index === -1) {
      this.LegendsTileLayer = Object.keys(TILE_LAYERS).map(layerKey => TILE_LAYERS[layerKey]);
    }

    if (this.activeLayer === index) {
      this.activeLayer = -2;
    } else {
      this.activeLayer = index;
    }
  }

  stickLegendContainer(e) {
    e.stopPropagation();
    if (!this.sticky) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
}
