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
      name: 'Inpatient: BMI female under 5 at chiefdom level this year'
    }
  ];
  public selectedMapId = this.availableMaps[0].id;

  constructor(
    private favoriteService: fromServices.FavouriteService,
    private mapService: fromServices.MapsService
  ) {}

  ngOnInit() {
    this.getMapFav(this.selectedMapId);
  }

  onChangeMap(newObj) {
    console.log(newObj);
    this.selectedMapId = newObj;
    this.getMapFav(newObj);
    // ... do other stuff here ...
  }

  getMapFav(mapId) {
    this.mapService.getMapFromFav(mapId).subscribe(data => {
      this.visualObject = data;
      this.isLoaded = true;
    });
  }
}
