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

  constructor(
    private favoriteService: fromServices.FavouriteService,
    private mapService: fromServices.MapsService
  ) {}

  ngOnInit() {
    this.mapService.getMapFromFav().subscribe(data => {
      console.log('Data:::', data);
      this.visualObject = data;
      this.isLoaded = true;
    });
  }
}
