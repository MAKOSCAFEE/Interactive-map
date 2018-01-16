import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as fromServices from '../services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public visualObject: any = {
    id: 'UjHKZ2lZJ3T',
    latitude: '8.353502376213736',
    longitude: '-13.069095611572266',
    name: 'initialMap',
    basemap: 'osmLight',
    zoom: 6,
    mapViews: []
  };
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
      id: 'kNYqHu3e7o3',
      name: 'events-Malaria: Cases 2015-2016 Western Area events'
    },
    {
      id: 'UjHKZ2lZJ3T',
      name: 'events-Malaria: Malaria: Cases 2015-2016 Western Area clustered'
    },
    {
      id: 'inePJWH75JW',
      name: 'themantic-Delivery: LLITN after delivery OSM Light basemap'
    },
    {
      id: 'jvdDvScWuhv',
      name: 'themantic-Inpatient: BMI female under 5 at chiefdom level this year'
    },
    {
      id: 'DE644qFc32L',
      name: 'themantic-Delivery: Maternal death rate at districts 2013'
    },
    {
      id: 'GObHCbOfXtP',
      name: 'themantic-Delivery: Maternal death rate / PHU delivery rate ANC 1 last quarter'
    },
    {
      id: 'ZBjCfSaLSqD',
      name: 'themantic-ANC LLITN coverage'
    },
    {
      id: 'GmIDubfPzCU',
      name: 'Facility: Health Facilities by Type with Boundaries'
    }
  ];
  public selectedMapId = 'GmIDubfPzCU';

  constructor(
    private favoriteService: fromServices.FavouriteService,
    private mapService: fromServices.MapsService
  ) {}

  ngOnInit() {
    this.getMapFav(this.selectedMapId);
  }

  onChangeMap(newObj) {
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
