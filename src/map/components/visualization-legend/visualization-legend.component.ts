import { Component, OnInit, Input } from '@angular/core';
import { TILE_LAYERS } from '../../constants/tile-layer.constant';

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
  private baseHref = '../../../';
  constructor() {}

  ngOnInit() {}

  showButtonIcons() {
    this.showButtonIncons = true;
  }

  hideButtonIcons() {
    this.showButtonIncons = false;
  }

  setActiveItem(index, e) {
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
}
