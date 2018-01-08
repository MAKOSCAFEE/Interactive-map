import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as fromServices from '../services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public visualObject: any;
  public isLoaded = false;
  public availableMaps = [
    {
      id: 'inePJWH75JW',
      name: 'Delivery: LLITN after delivery OSM Light basemap'
    },
    {
      id: 'jvdDvScWuhv',
      name: 'Delivery: LLITN after delivery OSM Light basemap'
    }
  ];

  constructor(
    private favoriteService: fromServices.FavouriteService,
    private mapService: fromServices.MapsService
  ) {}

  ngOnInit() {
    this.mapService.getMapFromFav('inePJWH75JW').subscribe(data => {
      this.visualObject = data;
      this.isLoaded = true;
    });
  }
}
