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
      id: 'zEY4M5njBxV',
      name: 'Boundary-Boundaries: Facilities'
    },
    {
      id: 'bjaqzAFrDOS',
      name: 'Boundary-Boundaries: Districts and Chiefdoms'
    },
    {
      id: 'inePJWH75JW',
      name: 'themantic-Delivery: LLITN after delivery OSM Light basemap'
    },
    {
      id: 'jvdDvScWuhv',
      name:
        'themantic-Inpatient: BMI female under 5 at chiefdom level this year'
    },
    {
      id: 'DE644qFc32L',
      name: 'themantic-Delivery: Maternal death rate at districts 2013'
    },
    {
      id: 'GObHCbOfXtP',
      name:
        'themantic-Delivery: Maternal death rate / PHU delivery rate ANC 1 last quarter'
    },
    {
      id: 'ZBjCfSaLSqD',
      name: 'themantic-ANC LLITN coverage'
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
